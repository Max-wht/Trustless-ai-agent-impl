# 修复 500 错误快速指南

## 问题描述

调用 `http://localhost:3001/users/register` 时出现 500 错误：

```
HTTP request failed.
URL: http://localhost:8545
Details: fetch failed
```

## 根本原因

后端服务需要连接到本地以太坊节点（Foundry Anvil）来检查用户是否在链上注册，但 Anvil 节点没有运行。

## 解决方案

### 方案 1: 使用一键启动脚本（推荐）

1. **停止当前所有服务**

```bash
# 停止后端和前端（按 Ctrl+C 或使用这个命令）
./stop-dev.sh
```

2. **使用启动脚本**

```bash
# 在项目根目录运行
./start-dev.sh
```

这个脚本会自动：

- ✅ 启动 Anvil 本地以太坊节点
- ✅ 部署 UserRegistry 智能合约
- ✅ 启动后端 API 服务
- ✅ 启动前端应用

3. **访问应用**

- 前端: http://localhost:3000
- 后端: http://localhost:3001
- Anvil: http://localhost:8545

---

### 方案 2: 手动启动（用于调试）

如果需要分别查看每个服务的日志，可以在 **3 个不同的终端** 中手动启动：

#### 终端 1: 启动 Anvil

```bash
cd packages/contracts
anvil
```

保持此终端运行，你会看到：

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000.000000000000000000 ETH)
...
```

#### 终端 2: 部署合约并启动后端

```bash
# 1. 部署合约
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast

# 2. 返回根目录
cd ../..

# 3. 启动后端
pnpm --filter @trustless/agent-service dev
```

#### 终端 3: 启动前端

```bash
pnpm --filter @trustless/web-app dev
```

---

## 验证修复

### 1. 检查 Anvil 是否运行

```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

应该返回类似：

```json
{ "jsonrpc": "2.0", "id": 1, "result": "0x0" }
```

### 2. 检查后端健康状态

```bash
curl http://localhost:3001/health
```

应该返回：

```json
{ "status": "ok", "timestamp": "..." }
```

### 3. 测试用户注册

现在访问 http://localhost:3000，连接钱包后应该能够成功注册。

---

## 为什么需要 Anvil？

Trustless SocialFi 是一个区块链应用，用户注册需要：

1. **链上记录**: 在 UserRegistry 智能合约中注册用户
2. **数据库记录**: 在 PostgreSQL 中存储用户信息
3. **双重验证**: 确保链上和链下数据一致

后端服务会：

- 检查用户是否已在链上注册
- 如果未注册，代用户发起链上注册交易
- 将用户信息存储到数据库

---

## 常见问题

### Q: 每次重启都需要部署合约吗？

**A**: 是的，Anvil 是临时节点，重启后所有数据会清空。在生产环境中，合约会部署到持久化的测试网或主网。

### Q: 可以跳过链上注册吗？

**A**: 在开发阶段可以暂时修改代码跳过链上检查，但不推荐，因为：

- 失去了区块链验证的核心功能
- 无法测试完整的注册流程
- 可能导致后续集成问题

### Q: Anvil 日志在哪里？

**A**:

- 使用脚本启动: `/tmp/anvil.log`
- 手动启动: 在当前终端显示

### Q: 如何查看所有服务的日志？

**A**:

```bash
# 脚本启动的服务
tail -f /tmp/anvil.log
tail -f /tmp/agent-service.log
tail -f /tmp/web-app.log

# 或者使用 tmux/screen 同时查看多个日志
```

---

## 后续优化建议

### 1. 开发环境配置

考虑使用 Docker Compose 统一管理所有服务：

- Anvil 节点
- PostgreSQL 数据库
- 后端 API
- 前端应用

### 2. 测试网部署

将合约部署到 Arbitrum Sepolia 测试网，避免每次重启 Anvil：

```bash
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --broadcast \
  --verify
```

### 3. 环境变量管理

使用 `.env.example` 模板文件，方便团队成员快速配置。

---

## 参考文档

- [SETUP.md](../../SETUP.md) - 完整的环境设置指南
- [Story 1.7 测试指南](./story-1.7-testing-guide.md) - 功能测试说明
- [Foundry 文档](https://book.getfoundry.sh/) - Anvil 使用说明

---

**问题解决日期**: 2025-10-11  
**相关 Story**: Story 1.7 - 用户个人主页基础界面  
**影响范围**: 用户注册和个人主页访问
