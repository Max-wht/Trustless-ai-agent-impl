# MetaMask 连接 Anvil 本地网络指南

## 问题诊断 ✅

**诊断结果**: Anvil 本地节点运行正常

- ✅ Anvil 正在端口 8545 运行
- ✅ Chain ID: 31337 (0x7a69)
- ✅ RPC 端点响应正常

**问题原因**: MetaMask 默认不包含 Anvil 本地网络，需要手动添加。

---

## 解决方案：在 MetaMask 中添加 Anvil 网络

### 方法 1: 手动添加网络（推荐）

#### 步骤 1: 打开 MetaMask 网络设置

1. 点击 MetaMask 扩展图标
2. 点击顶部的网络下拉菜单（默认显示"以太坊主网"）
3. 点击 **"添加网络"** 或 **"Add network"**
4. 点击 **"手动添加网络"** 或 **"Add a network manually"**

#### 步骤 2: 填写网络信息

在表单中填写以下信息：

| 字段名称                   | 值                      |
| -------------------------- | ----------------------- |
| **网络名称**               | `Anvil Local`           |
| **新 RPC URL**             | `http://127.0.0.1:8545` |
| **链 ID**                  | `31337`                 |
| **货币符号**               | `ETH`                   |
| **区块浏览器 URL**（可选） | 留空                    |

#### 步骤 3: 保存并切换

1. 点击 **"保存"** 或 **"Save"**
2. MetaMask 会自动切换到 Anvil Local 网络
3. 你应该看到网络名称显示为 "Anvil Local"

---

### 方法 2: 使用 RainbowKit 自动切换（应用内）

如果你已经连接了钱包但网络不对：

1. 访问 http://localhost:3000
2. 点击右上角的 **"Connect Wallet"** 按钮
3. 在 RainbowKit 弹窗中，点击顶部的 **"Switch Network"**
4. 选择 **"Anvil"** 网络
5. MetaMask 会弹出确认窗口，点击 **"批准"** 或 **"Approve"**

**注意**: 这需要你已经在 MetaMask 中添加了 Anvil 网络（方法 1）。

---

## 导入 Anvil 测试账户（可选）

Anvil 默认提供了 10 个预充值的测试账户，每个账户有 10,000 ETH。

### 获取 Anvil 账户私钥

查看 Anvil 日志文件：

```bash
cat /tmp/anvil.log | head -50
```

你会看到类似这样的输出：

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000.000000000000000000 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000.000000000000000000 ETH)
...

Private Keys
==================
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
(1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

### 导入账户到 MetaMask

1. 打开 MetaMask
2. 点击右上角的账户图标
3. 选择 **"导入账户"** 或 **"Import Account"**
4. 选择 **"私钥"** 或 **"Private Key"**
5. 粘贴 Anvil 账户的私钥（例如账户 #0 的私钥）
6. 点击 **"导入"** 或 **"Import"**

**推荐导入账户 #0**:

```
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
余额: 10,000 ETH
```

⚠️ **安全提示**: 这些是公开的测试私钥，**仅用于本地开发**，绝不要在主网或测试网使用！

---

## 验证连接

### 1. 检查网络连接

在浏览器控制台（F12）运行：

```javascript
// 应该返回 "0x7a69" (31337 的十六进制)
await window.ethereum.request({ method: 'eth_chainId' });

// 应该返回连接的账户地址
await window.ethereum.request({ method: 'eth_requestAccounts' });
```

### 2. 测试应用连接

1. 访问 http://localhost:3000
2. 点击 **"Connect Wallet"**
3. 选择 **MetaMask**
4. 在 MetaMask 弹窗中点击 **"下一步"** 和 **"连接"**
5. 如果提示切换网络，点击 **"切换网络"** 按钮

成功连接后，你应该看到：

- ✅ 右上角显示你的钱包地址（缩写格式）
- ✅ 显示 "Anvil Local" 网络名称
- ✅ 显示你的 ETH 余额

### 3. 测试用户注册

连接钱包后，应用会自动尝试注册用户：

1. MetaMask 会弹出签名请求
2. 点击 **"签名"** 或 **"Sign"**
3. 注册成功后会自动跳转到你的个人主页

---

## 常见问题

### Q1: MetaMask 显示"无法连接到网络"

**A**: 检查 Anvil 是否运行：

```bash
# 检查 Anvil 进程
lsof -i :8545

# 如果没有输出，启动 Anvil
cd packages/contracts
anvil
```

### Q2: 添加网络时提示"链 ID 已存在"

**A**: 可能你之前已经添加过。解决方法：

1. 在 MetaMask 中找到已存在的 Anvil 网络
2. 点击 **"设置"** → **"网络"**
3. 找到 Chain ID 31337 的网络
4. 点击 **"编辑"** 或 **"删除"**
5. 重新添加

### Q3: 切换网络后余额不显示

**A**: 这是正常的，可能的原因：

- Anvil 刚启动，区块还未同步
- MetaMask 缓存问题

解决方法：

1. 在 MetaMask 中刷新（点击账户名旁边的刷新图标）
2. 或者切换到其他网络再切换回来

### Q4: 签名时 MetaMask 报错"无法估算 gas"

**A**: 可能的原因：

1. **智能合约未部署**:

   ```bash
   cd packages/contracts
   forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
     --rpc-url http://localhost:8545 \
     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
     --broadcast
   ```

2. **Anvil 重启导致合约地址变化**:
   - Anvil 每次重启都会清空所有数据
   - 需要重新部署合约
   - 推荐使用 `./start-dev.sh` 脚本自动处理

### Q5: RainbowKit 不显示 Anvil 网络选项

**A**: 检查前端配置：

1. 确认 `packages/web-app/src/lib/wagmi.ts` 包含 Anvil 定义
2. 重启前端开发服务器：
   ```bash
   pnpm --filter @trustless/web-app dev
   ```

---

## 完整的重启流程

如果遇到任何连接问题，可以完全重启所有服务：

### 步骤 1: 停止所有服务

```bash
# 在项目根目录
./stop-dev.sh

# 或手动停止
pkill -f anvil
pkill -f agent-service
pkill -f web-app
```

### 步骤 2: 清理 MetaMask 状态（可选）

在 MetaMask 中：

1. 设置 → 高级 → 清除活动数据
2. 或者切换账户再切换回来

### 步骤 3: 重新启动

```bash
# 使用一键启动脚本
./start-dev.sh
```

这会自动：

- ✅ 启动 Anvil
- ✅ 部署智能合约
- ✅ 更新配置文件
- ✅ 启动后端和前端

### 步骤 4: 重新连接 MetaMask

1. 访问 http://localhost:3000
2. 刷新页面（Ctrl+Shift+R / Cmd+Shift+R）
3. 点击 "Connect Wallet"
4. 选择 MetaMask
5. 如果提示切换网络，点击批准

---

## 网络配置快速参考

| 参数        | 值                                                                   |
| ----------- | -------------------------------------------------------------------- |
| 网络名称    | `Anvil Local`                                                        |
| RPC URL     | `http://127.0.0.1:8545` 或 `http://localhost:8545`                   |
| Chain ID    | `31337` (十六进制: `0x7a69`)                                         |
| 货币符号    | `ETH`                                                                |
| 测试账户 #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`                         |
| 测试私钥 #0 | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |

---

## 技术细节

### Anvil 简介

Anvil 是 Foundry 工具套件的一部分，是一个本地以太坊节点，用于开发和测试：

- **即时挖矿**: 交易立即确认（0 秒区块时间）
- **预充值账户**: 10 个账户，每个 10,000 ETH
- **确定性地址**: 每次启动使用相同的助记词
- **临时状态**: 重启后所有数据清空

### 为什么使用 Chain ID 31337？

- Anvil 的默认 Chain ID
- 不与任何公共网络冲突
- 在开发者社区中广泛使用
- 容易识别为本地开发环境

### 与其他本地节点的对比

| 特性          | Anvil          | Hardhat           | Ganache           |
| ------------- | -------------- | ----------------- | ----------------- |
| 启动速度      | ⚡ 极快 (Rust) | 🐢 较慢 (Node.js) | 🐢 较慢 (Node.js) |
| 内存占用      | 💚 低          | 💛 中             | 💛 中             |
| Solidity 支持 | ✅ 最新        | ✅ 最新           | ⚠️ 可能滞后       |
| 调试工具      | ✅ 优秀        | ✅ 优秀           | ✅ 良好           |
| Chain ID      | 31337          | 31337             | 1337              |

---

## 其他有用的命令

### 查看 Anvil 状态

```bash
# 检查 Anvil 进程
ps aux | grep anvil

# 查看 Anvil 日志
tail -f /tmp/anvil.log

# 测试 RPC 连接
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### 重置 Anvil 状态

```bash
# 停止 Anvil
pkill -f anvil

# 重新启动（会清除所有状态）
cd packages/contracts
anvil
```

### 查看已部署的合约

```bash
# 查看部署记录
cat packages/contracts/deployments.json

# 查看部署日志
ls -la packages/contracts/broadcast/
```

---

## 相关文档

- [SETUP.md](../SETUP.md) - 完整的环境设置指南
- [Story 1.7 测试指南](./stories/story-1.7-testing-guide.md) - 功能测试说明
- [Foundry Book - Anvil](https://book.getfoundry.sh/anvil/) - Anvil 官方文档
- [MetaMask 文档](https://docs.metamask.io/) - MetaMask 使用指南

---

**文档创建日期**: 2025-10-11  
**适用版本**: Anvil (Foundry 0.2.0+), MetaMask 11.0+  
**维护者**: James (Full Stack Developer)

---

## 反馈

如果本指南没有解决你的问题，请提供：

1. MetaMask 版本
2. 浏览器和版本
3. 错误截图或消息
4. Anvil 日志（`cat /tmp/anvil.log`）
5. 浏览器控制台错误（F12 → Console）

这将帮助我们快速诊断和解决问题。
