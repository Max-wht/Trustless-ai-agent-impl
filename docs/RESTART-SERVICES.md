# 🔄 服务重启指南

## 发现的问题

✅ **已修复**:

1. ❌ 多个 Next.js 进程冲突（3个进程同时运行）
2. ❌ 缺少前端环境变量文件 `.env.local`
3. ✅ 端口 3000 已清理
4. ✅ 环境变量文件已创建

---

## 🚀 重新启动服务

### 步骤 1: 启动后端服务

打开**终端 1**：

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev
```

**等待看到**:

```
✔ Agent service listening on http://0.0.0.0:3001
```

### 步骤 2: 启动前端服务

打开**终端 2**（新终端窗口）：

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

**等待看到**:

```
✔ Ready in 2-5s
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

---

## ✅ 验证服务正常

### 测试后端

```bash
curl http://localhost:3001/health
```

**期望输出**:

```json
{"status":"ok","service":"agent-service","timestamp":...}
```

### 测试前端

在浏览器中打开: **http://localhost:3000**

**应该看到**:

- ✅ Trustless SocialFi 首页
- ✅ 右上角有 "Connect Wallet" 按钮
- ✅ 没有错误信息

---

## 🔍 如果遇到问题

### 问题 1: 端口被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:

```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程（替换 <PID> 为实际进程ID）
kill -9 <PID>

# 或一键清理
lsof -ti :3000 | xargs kill -9
```

### 问题 2: 多个服务在运行

**清理所有 Next.js 进程**:

```bash
ps aux | grep "next dev" | grep -v grep | awk '{print $2}' | xargs kill -9
```

**清理所有 Node 进程**（谨慎使用！）:

```bash
pkill -f "next dev"
```

### 问题 3: 环境变量未生效

**重新创建 .env.local**:

```bash
cd packages/web-app
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
```

**验证文件**:

```bash
cat packages/web-app/.env.local
```

### 问题 4: CORS 错误

如果仍有 CORS 错误：

1. 确认后端服务已重启（使用最新的 CORS 配置）
2. 清除浏览器缓存（Ctrl+Shift+R / Cmd+Shift+R）
3. 查看 [QUICK-FIX-CORS.md](./QUICK-FIX-CORS.md)

---

## 📋 快速检查清单

启动服务前检查：

- [ ] 所有旧进程已停止
- [ ] 端口 3000 和 3001 未被占用
- [ ] `.env.local` 文件存在且配置正确
- [ ] 在项目根目录执行命令

启动后验证：

- [ ] 后端健康检查返回 200 OK
- [ ] 前端页面能正常访问
- [ ] 浏览器控制台无错误
- [ ] 能连接钱包
- [ ] 注册功能正常

---

## 🎯 推荐的启动方式

### 方式 1: 使用两个终端窗口（推荐）

**优点**: 可以同时看到前后端日志

```bash
# 终端 1 - 后端
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev

# 终端 2 - 前端
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

### 方式 2: 使用 tmux 或 screen

```bash
# 使用 tmux
tmux new-session -d -s backend 'cd /Users/max/code/foundry-code/foundry-trustless-ai-agent && pnpm --filter @trustless/agent-service dev'
tmux new-session -d -s frontend 'cd /Users/max/code/foundry-code/foundry-trustless-ai-agent && pnpm --filter @trustless/web-app dev'

# 查看后端日志
tmux attach -t backend

# 查看前端日志
tmux attach -t frontend
```

### 方式 3: 使用后台运行（不推荐开发时使用）

```bash
# 后台运行后端
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev > backend.log 2>&1 &

# 后台运行前端
pnpm --filter @trustless/web-app dev > frontend.log 2>&1 &

# 查看日志
tail -f backend.log
tail -f frontend.log
```

---

## 🛑 停止服务

### 正常停止

在运行服务的终端中按 `Ctrl+C`

### 强制停止所有服务

```bash
# 停止所有 Node 服务（小心使用！）
pkill -f "pnpm"
pkill -f "next dev"

# 或清理特定端口
lsof -ti :3000 | xargs kill -9
lsof -ti :3001 | xargs kill -9
```

---

## 📊 服务状态检查

### 快速检查命令

```bash
# 创建状态检查脚本
cat > check-services.sh << 'EOF'
#!/bin/bash
echo "=== 检查服务状态 ==="
echo ""
echo "后端服务 (3001):"
curl -s http://localhost:3001/health | jq . || echo "❌ 后端未运行"
echo ""
echo "前端服务 (3000):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo "✅ 前端正常运行" || echo "❌ 前端未运行"
echo ""
echo "端口占用情况:"
lsof -i :3000 -i :3001 | grep LISTEN || echo "无服务运行"
EOF

chmod +x check-services.sh
./check-services.sh
```

---

## 🔧 开发技巧

### 自动重启

使用 `nodemon` 或 `ts-node-dev` 自动监听文件变化（后端已配置）

### 实时日志

```bash
# 同时查看前后端日志
tail -f backend.log frontend.log
```

### 性能监控

```bash
# 监控 Node 进程
top | grep node

# 查看详细信息
ps aux | grep "next dev"
```

---

## 📞 仍有问题？

如果按照以上步骤仍无法启动服务，请检查：

1. **Node.js 版本**: `node --version` (需要 >= 18.0.0)
2. **pnpm 版本**: `pnpm --version` (需要 >= 8.15.0)
3. **磁盘空间**: `df -h`
4. **依赖安装**: `pnpm install` (在项目根目录)
5. **构建错误**: `pnpm build --filter @trustless/web-app`

**提供以下信息以获取帮助**:

- 完整的错误信息
- `node --version` 和 `pnpm --version` 输出
- 服务启动时的完整日志
- `ps aux | grep node` 输出

---

**最后更新**: 2025-10-11  
**状态**: ✅ 服务已清理并准备重启
