# 开发脚本使用指南

## 🚀 快速启动

### 一键启动所有服务

```bash
./start-dev.sh
```

这个脚本会**自动完成以下步骤**：

1. ✅ 启动 Anvil 本地以太坊节点（端口 8545）
2. ✅ 部署 UserRegistry 智能合约
3. ✅ **自动提取并更新合约地址**到配置文件
4. ✅ 启动后端 API 服务（端口 3001）
5. ✅ 启动前端应用（端口 3000）

### 停止所有服务

```bash
./stop-dev.sh
```

这个脚本会：

1. ✅ 停止前端服务
2. ✅ 停止后端服务
3. ✅ 停止 Anvil 节点
4. ✅ 清理所有相关端口和进程

---

## 📝 脚本详细说明

### start-dev.sh 的改进功能

#### 🆕 新增功能

1. **自动提取合约地址**
   - 从部署输出中自动提取 UserRegistry 合约地址
   - 无需手动复制粘贴

2. **自动更新配置文件**
   - 自动更新 `packages/contracts/deployments.json`
   - 自动更新 `packages/agent-service/src/lib/web3.ts`
   - 确保后端始终使用最新的合约地址

3. **跨平台兼容**
   - 兼容 macOS 和 Linux 的 sed 命令
   - 自动检测操作系统

4. **完善的错误处理**
   - 如果部署失败，自动清理 Anvil 进程
   - 如果无法提取地址，提前退出

#### 📋 启动流程

```
🚀 启动开始
    ↓
📦 检查端口 8545
    ↓
🔄 启动 Anvil 节点
    ↓
📝 部署 UserRegistry 合约
    ↓
🔍 提取合约地址
    ↓
📄 更新 deployments.json
    ↓
📄 更新 web3.ts
    ↓
🔧 启动后端服务
    ↓
🎨 启动前端应用
    ↓
✨ 完成！
```

### stop-dev.sh 的改进功能

#### 🆕 新增功能

1. **更彻底的进程清理**
   - 清理所有 Next.js 进程
   - 清理所有 ts-node-dev 进程
   - 防止僵尸进程残留

2. **友好的提示信息**
   - 提示用户使用 start-dev.sh 重启
   - 说明重启会重新部署合约

---

## 🎯 使用场景

### 场景 1: 每天开始工作

```bash
# 1. 启动所有服务
./start-dev.sh

# 2. 等待启动完成（约15秒）
# 看到 "✨ 所有服务已成功启动！"

# 3. 在浏览器访问
open http://localhost:3000
```

### 场景 2: Anvil 意外重启

如果 Anvil 节点崩溃或被手动停止：

```bash
# 1. 停止所有服务
./stop-dev.sh

# 2. 重新启动（会重新部署合约）
./start-dev.sh
```

### 场景 3: 调试时需要查看日志

```bash
# 查看 Anvil 日志
tail -f /tmp/anvil.log

# 查看后端日志
tail -f /tmp/agent-service.log

# 查看前端日志
tail -f /tmp/web-app.log

# 同时查看所有日志
tail -f /tmp/*.log
```

### 场景 4: 只重启某个服务

**重启后端**:

```bash
# 找到后端 PID
cat /tmp/backend.pid

# 停止后端
kill $(cat /tmp/backend.pid)

# 手动重启
pnpm --filter @trustless/agent-service dev
```

**重启前端**:

```bash
# 停止前端
kill $(cat /tmp/frontend.pid)

# 手动重启
pnpm --filter @trustless/web-app dev
```

### 场景 5: 下班前清理

```bash
# 停止所有服务
./stop-dev.sh

# 清理日志文件（可选）
rm /tmp/anvil.log /tmp/agent-service.log /tmp/web-app.log
```

---

## 🔍 故障排查

### 问题 1: start-dev.sh 执行失败

**错误**: `permission denied: ./start-dev.sh`

**解决方案**:

```bash
chmod +x start-dev.sh stop-dev.sh
```

### 问题 2: 端口已被占用

**错误**: `端口 8545 已被占用`

脚本会自动清理，但如果仍然失败：

```bash
# 手动清理
lsof -ti:8545 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# 重新运行
./start-dev.sh
```

### 问题 3: 合约部署失败

**错误**: `❌ 合约部署失败`

**检查步骤**:

1. 确认 Foundry 已安装: `forge --version`
2. 确认合约代码无误: `cd packages/contracts && forge build`
3. 检查 Anvil 日志: `tail /tmp/anvil.log`

### 问题 4: 无法提取合约地址

**错误**: `❌ 无法提取合约地址`

**可能原因**:

- 部署脚本输出格式变化
- 部署过程中有错误但未被捕获

**解决方案**:

```bash
# 手动部署并查看输出
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast

# 手动更新地址（参考输出中的地址）
```

### 问题 5: 后端服务启动失败

**检查步骤**:

1. 查看后端日志: `tail /tmp/agent-service.log`
2. 检查数据库连接: `psql $DATABASE_URL`
3. 检查环境变量: `cat packages/agent-service/.env`

### 问题 6: 前端服务启动失败

**检查步骤**:

1. 查看前端日志: `tail /tmp/web-app.log`
2. 检查环境变量: `cat packages/web-app/.env.local`
3. 检查依赖: `cd packages/web-app && pnpm install`

---

## 📊 服务状态检查

### 快速检查脚本

创建 `check-services.sh`:

```bash
#!/bin/bash

echo "检查服务状态..."
echo ""

# 检查 Anvil
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
  echo "✅ Anvil (8545) - 运行中"
else
  echo "❌ Anvil (8545) - 未运行"
fi

# 检查后端
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
  echo "✅ 后端 (3001) - 运行中"
  curl -s http://localhost:3001/health | jq . || echo "   但健康检查失败"
else
  echo "❌ 后端 (3001) - 未运行"
fi

# 检查前端
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "✅ 前端 (3000) - 运行中"
else
  echo "❌ 前端 (3000) - 未运行"
fi

echo ""
echo "进程 ID:"
[ -f /tmp/anvil.pid ] && echo "  Anvil: $(cat /tmp/anvil.pid)" || echo "  Anvil: N/A"
[ -f /tmp/backend.pid ] && echo "  后端: $(cat /tmp/backend.pid)" || echo "  后端: N/A"
[ -f /tmp/frontend.pid ] && echo "  前端: $(cat /tmp/frontend.pid)" || echo "  前端: N/A"
```

使用:

```bash
chmod +x check-services.sh
./check-services.sh
```

---

## 🎨 进阶技巧

### 技巧 1: 使用别名

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# Trustless SocialFi 开发别名
alias ts-start='cd /path/to/foundry-trustless-ai-agent && ./start-dev.sh'
alias ts-stop='cd /path/to/foundry-trustless-ai-agent && ./stop-dev.sh'
alias ts-logs='tail -f /tmp/anvil.log /tmp/agent-service.log /tmp/web-app.log'
alias ts-check='cd /path/to/foundry-trustless-ai-agent && ./check-services.sh'
```

使用:

```bash
ts-start  # 启动所有服务
ts-logs   # 查看日志
ts-stop   # 停止所有服务
```

### 技巧 2: 使用 tmux

创建 `start-dev-tmux.sh`:

```bash
#!/bin/bash

# 创建 tmux session
tmux new-session -d -s trustless

# 窗口 1: Anvil
tmux rename-window -t trustless:0 'anvil'
tmux send-keys -t trustless:0 'cd packages/contracts && anvil' C-m

# 等待 Anvil 启动
sleep 3

# 窗口 2: 部署合约
tmux new-window -t trustless:1 -n 'deploy'
tmux send-keys -t trustless:1 'cd packages/contracts && forge script script/DeployUserRegistry.s.sol:DeployUserRegistry --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast' C-m

# 等待部署完成
sleep 5

# 窗口 3: 后端
tmux new-window -t trustless:2 -n 'backend'
tmux send-keys -t trustless:2 'pnpm --filter @trustless/agent-service dev' C-m

# 窗口 4: 前端
tmux new-window -t trustless:3 -n 'frontend'
tmux send-keys -t trustless:3 'pnpm --filter @trustless/web-app dev' C-m

# 附加到 session
tmux attach -t trustless
```

### 技巧 3: 开机自动启动（可选）

**macOS (LaunchAgent)**:

创建 `~/Library/LaunchAgents/com.trustless.dev.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.trustless.dev</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/foundry-trustless-ai-agent/start-dev.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/path/to/foundry-trustless-ai-agent</string>
</dict>
</plist>
```

---

## 📚 相关文档

- [Anvil 合约重新部署](./ANVIL-CONTRACT-REDEPLOY.md)
- [服务重启指南](./RESTART-SERVICES.md)
- [CORS 问题修复](./QUICK-FIX-CORS.md)
- [钱包连接问题](./WALLET-CONNECTION-500-ERROR-FIX.md)

---

## 💡 最佳实践

1. ✅ **每天开始工作时**: 运行 `./start-dev.sh`
2. ✅ **结束工作时**: 运行 `./stop-dev.sh`
3. ✅ **遇到问题时**: 先 stop，再 start
4. ✅ **查看日志**: 使用 `tail -f /tmp/*.log`
5. ✅ **定期更新依赖**: `pnpm install`
6. ✅ **Git 提交前**: 确保所有测试通过

---

**最后更新**: 2025-10-11  
**脚本版本**: v2.0 (自动配置更新)  
**状态**: ✅ 生产就绪
