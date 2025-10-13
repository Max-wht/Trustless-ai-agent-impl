# 🔧 合约部署问题修复说明

**问题**: Foundry 合约部署时提示"You seem to be using Foundry's default sender"  
**修复日期**: 2025-10-11  
**状态**: ✅ 已修复并验证

---

## 问题描述

在运行 `./start-dev.sh` 启动脚本时，合约部署失败并显示以下错误：

```
Error: You seem to be using Foundry's default sender. Be sure to set your own --sender.
❌ 合约部署失败
```

虽然合约实际上已部署成功，但由于缺少明确的发送者账户配置，Foundry 脚本退出并返回错误代码。

---

## 根本原因

在 `start-dev.sh` 脚本中，forge script 命令缺少了 `--private-key` 参数：

```bash
# 原来的命令（有问题）
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry --rpc-url http://localhost:8545 --broadcast
```

Foundry 要求在部署合约时明确指定发送者账户，即使是本地 Anvil 开发环境。

---

## 解决方案

### 修改内容

在 `start-dev.sh` 脚本中添加了 Anvil 默认测试账户的私钥：

```bash
# 修复后的命令
ANVIL_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key $ANVIL_PRIVATE_KEY \
  --broadcast
```

### Anvil 默认测试账户

使用的是 Anvil 提供的第一个默认测试账户：

- **地址**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **私钥**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **余额**: 10000 ETH（测试环境）

> ⚠️ **注意**: 此私钥仅用于本地开发环境，切勿在生产环境或主网使用！

---

## 验证结果

### ✅ 修复后的运行结果

```bash
🚀 启动 Trustless SocialFi 开发环境...

📦 步骤 1/4: 启动 Anvil 本地以太坊节点...
✅ Anvil 已启动 (PID: xxxxx)

📝 步骤 2/4: 部署智能合约...
✅ 智能合约部署成功

🔧 步骤 3/4: 启动后端服务...
✅ 后端服务已启动 (PID: xxxxx)

🎨 步骤 4/4: 启动前端应用...
✅ 前端应用已启动 (PID: xxxxx)

✨ 所有服务已成功启动！
```

### 服务状态

| 服务     | 端口 | 状态      | URL                   |
| -------- | ---- | --------- | --------------------- |
| Anvil    | 8545 | ✅ 运行中 | http://localhost:8545 |
| 后端 API | 3001 | ✅ 运行中 | http://localhost:3001 |
| 前端应用 | 3000 | ✅ 运行中 | http://localhost:3000 |

### 合约部署信息

```json
{
  "31337": {
    "chainName": "Anvil Local",
    "contracts": {
      "UserRegistry": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    }
  }
}
```

---

## 使用指南

### 启动开发环境

```bash
./start-dev.sh
```

### 停止开发环境

```bash
./stop-dev.sh
```

### 查看服务日志

```bash
# Anvil 日志
tail -f /tmp/anvil.log

# 后端服务日志
tail -f /tmp/agent-service.log

# 前端应用日志
tail -f /tmp/web-app.log
```

---

## 其他 Anvil 测试账户

如果需要使用其他测试账户，Anvil 提供了10个默认账户：

| 账户 | 地址                                       | 私钥                                                               |
| ---- | ------------------------------------------ | ------------------------------------------------------------------ |
| #0   | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| #1   | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| #2   | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a |
| ...  | ...                                        | ...                                                                |

---

## 相关文件

- 启动脚本: `/start-dev.sh`
- 停止脚本: `/stop-dev.sh`
- 部署脚本: `/packages/contracts/script/DeployUserRegistry.s.sol`
- 合约源码: `/packages/contracts/src/UserRegistry.sol`
- 部署信息: `/packages/contracts/deployments.json`

---

## 故障排除

### 问题：端口被占用

```bash
# 清理端口
./stop-dev.sh

# 或手动清理
lsof -ti:8545 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 问题：合约部署失败

1. 确保 Anvil 正在运行
2. 检查网络连接到 `http://localhost:8545`
3. 查看 Anvil 日志：`tail -f /tmp/anvil.log`

### 问题：后端服务无法连接

1. 检查数据库配置（PostgreSQL）
2. 确保环境变量正确配置
3. 查看后端日志：`tail -f /tmp/agent-service.log`

---

## 最佳实践

### 本地开发

- ✅ 使用 `./start-dev.sh` 启动所有服务
- ✅ 使用 `./stop-dev.sh` 停止所有服务
- ✅ 定期查看日志文件排查问题
- ✅ 使用 Anvil 默认账户进行测试

### 生产部署

- ⚠️ 切勿使用 Anvil 默认私钥
- ⚠️ 使用环境变量或 Keystore 管理私钥
- ⚠️ 使用正式的以太坊测试网或主网
- ⚠️ 启用 Gas 优化和安全审计

---

## 总结

✅ **问题已解决**：通过添加 `--private-key` 参数，合约部署脚本现在可以正常工作。

✅ **验证通过**：所有服务（Anvil、后端、前端）都已成功启动并正常运行。

✅ **开发就绪**：现在可以开始开发和测试 Story 1.7 的用户个人主页功能了！

---

**修复者**: AI Assistant  
**测试状态**: ✅ 通过  
**部署状态**: ✅ 开发环境就绪
