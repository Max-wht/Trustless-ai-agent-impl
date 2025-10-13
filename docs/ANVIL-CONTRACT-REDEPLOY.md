# Anvil 合约重新部署指南

## 🚨 问题描述

**错误信息**:

```
The contract function "isRegistered" returned no data ("0x").
Contract Call: address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**错误原因**: **Anvil 节点重启后，之前部署的智能合约丢失了**

---

## 📚 背景知识

### 什么是 Anvil？

Anvil 是 Foundry 提供的**本地以太坊测试节点**，类似于 Ganache 或 Hardhat Network。

### 为什么合约会消失？

⚠️ **Anvil 的特性**:

- 🔄 每次重启都是**全新的区块链状态**
- 💾 **不持久化**任何数据（默认配置）
- 📦 所有已部署的合约都会消失
- 🔢 区块号重置为 0
- 💰 账户余额恢复到初始状态

**这是正常行为，用于测试环境！**

---

## ✅ 解决方案：重新部署合约

### 方法 1: 快速重新部署（推荐）

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent/packages/contracts

# 部署 UserRegistry 合约
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast
```

**期望输出**:

```
✅ UserRegistry deployed at: 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519
```

### 方法 2: 更新配置文件

#### 步骤 1: 更新 deployments.json

编辑 `/packages/contracts/deployments.json`:

```json
{
  "31337": {
    "chainName": "Anvil Local",
    "contracts": {
      "UserRegistry": "0x新的合约地址"
    }
  }
}
```

#### 步骤 2: 更新后端代码

编辑 `/packages/agent-service/src/lib/web3.ts`:

```typescript
export const USER_REGISTRY_ADDRESS = '0x新的合约地址' as const;
```

#### 步骤 3: 重启后端服务

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev
```

---

## 🔄 自动化解决方案

### 创建启动脚本

创建 `start-dev.sh` 在项目根目录：

```bash
#!/bin/bash
set -e

echo "🚀 启动 Trustless SocialFi 开发环境"

# 检查 Anvil 是否运行
if ! lsof -i :8545 > /dev/null 2>&1; then
  echo "❌ Anvil 未运行，请先启动: anvil"
  exit 1
fi

echo "✅ Anvil 正在运行"

# 部署合约
echo "📦 部署智能合约..."
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast

# 提取合约地址并更新配置
NEW_ADDRESS=$(forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  | grep "UserRegistry deployed at:" \
  | awk '{print $4}')

echo "✅ 合约部署成功: $NEW_ADDRESS"

# 更新 deployments.json
cat > deployments.json << EOF
{
  "31337": {
    "chainName": "Anvil Local",
    "contracts": {
      "UserRegistry": "$NEW_ADDRESS"
    }
  }
}
EOF

echo "✅ deployments.json 已更新"

# 返回根目录
cd ../..

echo "
🎉 开发环境准备就绪！

现在可以启动服务：
  终端 1: pnpm --filter @trustless/agent-service dev
  终端 2: pnpm --filter @trustless/web-app dev

访问: http://localhost:3000
"
```

### 使用脚本

```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 🛡️ 数据持久化（可选）

如果需要保持合约状态（不推荐开发环境）：

### 方法 1: 使用 Anvil 的持久化模式

```bash
# 启动 Anvil 并保存状态到文件
anvil --state /tmp/anvil-state.json

# 下次启动时加载状态
anvil --load-state /tmp/anvil-state.json
```

### 方法 2: 使用测试网

部署到真实的测试网（Sepolia, Arbitrum Sepolia 等）：

```bash
# 配置 .env
ETH_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key

# 部署到测试网
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url $ETH_RPC_URL \
  --broadcast \
  --verify
```

---

## 📋 预防措施

### 1. 使用专用终端

为 Anvil 创建专用终端窗口，标记为"🔥 Anvil - 不要关闭"

### 2. 检查清单

每次开发前检查：

```bash
# 检查 Anvil 是否运行
lsof -i :8545

# 验证合约是否存在
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x合约地址", "latest"],"id":1}'

# 如果返回 "0x" 表示合约不存在，需要重新部署
```

### 3. 文档化合约地址

在 `.env` 或 README 中记录当前的合约地址：

```bash
# packages/agent-service/.env
USER_REGISTRY_ADDRESS=0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519
```

---

## 🔍 故障排查

### 问题 1: 部署脚本失败

**错误**: `Error: Failed to get EIP-1559 fees`

**解决方案**:

1. 确认 Anvil 正在运行: `lsof -i :8545`
2. 测试 RPC 连接: `curl http://localhost:8545`
3. 重启 Anvil: `pkill anvil && anvil`

### 问题 2: 合约地址不匹配

**错误**: `The contract function returned no data`

**解决方案**:

1. 检查 `deployments.json` 中的地址
2. 检查 `web3.ts` 中的 `USER_REGISTRY_ADDRESS`
3. 确认两者一致

### 问题 3: 后端仍然使用旧地址

**解决方案**:

1. 更新 `web3.ts` 中的地址
2. 重启后端服务
3. 清除 TypeScript 缓存: `rm -rf dist/`

---

## 🧪 验证合约部署

### 方法 1: 使用 Cast

```bash
# 检查合约代码
cast code 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519 --rpc-url http://localhost:8545

# 调用合约函数
cast call 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519 \
  "totalUsers()(uint256)" \
  --rpc-url http://localhost:8545
```

### 方法 2: 使用 Curl

```bash
# 获取合约代码
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519", "latest"],
    "id":1
  }'
```

**期望输出**: 应该返回很长的十六进制代码（不是 "0x"）

---

## 📝 开发工作流程

### 推荐的启动顺序

```bash
# 终端 1: 启动 Anvil（保持运行）
anvil

# 终端 2: 部署合约
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 --broadcast

# 终端 3: 启动后端
cd ../..
pnpm --filter @trustless/agent-service dev

# 终端 4: 启动前端
pnpm --filter @trustless/web-app dev
```

### 日常开发

1. ✅ 早上启动电脑 → 重新部署合约
2. ✅ Anvil 意外重启 → 重新部署合约
3. ✅ 后端报合约错误 → 检查合约是否存在
4. ✅ 切换分支 → 可能需要重新部署

---

## 🎯 最佳实践

### 开发环境

- ✅ 使用 Anvil 的默认配置（不持久化）
- ✅ 准备快速重新部署脚本
- ✅ 在 README 中记录部署步骤

### 测试环境

- ✅ 使用真实测试网（Sepolia）
- ✅ 使用专用的测试账户
- ✅ 在 CI/CD 中自动部署

### 生产环境

- ✅ 使用主网或 Layer 2（Arbitrum）
- ✅ 多重签名部署
- ✅ 完整的审计和测试

---

## 📚 相关文档

- [Foundry Book - Anvil](https://book.getfoundry.sh/anvil/)
- [服务重启指南](./RESTART-SERVICES.md)
- [CORS 问题修复](./QUICK-FIX-CORS.md)

---

## 💡 提示

**记住**: Anvil 重启 = 合约消失 = 需要重新部署

这不是 bug，这是特性！用于确保每次测试都从干净的状态开始。

---

**最后更新**: 2025-10-11  
**当前合约地址**: 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519  
**状态**: ✅ 合约已重新部署
