# Story 1.6 快速启动指南

本指南帮助您快速测试用户注册功能的完整端到端流程。

---

## 前置条件

1. ✅ **MetaMask** 已安装（浏览器扩展）
2. ✅ **PostgreSQL** 正在运行
3. ✅ **Node.js 20+** 和 **pnpm** 已安装

---

## 启动步骤

### 1. 启动 Anvil 本地区块链

在**终端 1**运行：

```bash
cd packages/contracts
anvil
```

**预期输出**:

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Private Keys
==================
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...

Listening on 127.0.0.1:8545
```

保持此终端运行。

---

### 2. 部署 UserRegistry 合约

在**终端 2**运行：

```bash
cd packages/contracts

forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**预期输出**:

```
UserRegistry deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ Sequence #1 on anvil-hardhat
```

---

### 3. 启动后端 API

在**终端 3**运行：

```bash
cd packages/agent-service

# 确保 ABI 文件存在
mkdir -p dist/abis
cp src/abis/UserRegistry.json dist/abis/

# 启动开发服务器
pnpm dev
```

**预期输出**:

```
Agent service listening on http://0.0.0.0:3001
```

保持此终端运行。

---

### 4. 启动前端应用

在**终端 4**运行：

```bash
cd packages/web-app
pnpm dev
```

**预期输出**:

```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  ✓ Ready in 2.3s
```

保持此终端运行。

---

## 测试流程

### 步骤 1: 打开应用

在浏览器访问: **http://localhost:3000**

### 步骤 2: 连接 MetaMask

1. 点击右上角 **"连接钱包"** 按钮
2. 选择 **MetaMask**
3. 在 MetaMask 弹窗中点击 **"下一步"** → **"连接"**

### 步骤 3: 添加 Anvil 网络到 MetaMask

如果 MetaMask 未连接到 Anvil，需要手动添加网络：

1. 打开 MetaMask
2. 点击网络下拉菜单
3. 点击 **"添加网络"**
4. 点击 **"手动添加网络"**
5. 填写以下信息：
   - **网络名称**: Anvil Local
   - **RPC URL**: http://localhost:8545
   - **链 ID**: 31337
   - **货币符号**: ETH
6. 点击 **"保存"**

### 步骤 4: 导入测试账户

1. 打开 MetaMask
2. 点击账户图标 → **"导入账户"**
3. 粘贴 Anvil 提供的私钥:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. 点击 **"导入"**

现在您的测试账户应该有 **10000 ETH** 余额。

### 步骤 5: 签名注册

钱包连接成功后，应用会**自动触发注册流程**：

1. MetaMask 弹出签名请求
2. 消息内容: **"Sign in to Trustless SocialFi"**
3. 点击 **"签名"**

### 步骤 6: 等待注册完成

页面会显示:

- 🔄 **正在注册您的账户，请稍候...**

注册过程包括：

1. 验证签名
2. 调用智能合约
3. 写入数据库

### 步骤 7: 查看个人主页

注册成功后，页面会**自动跳转**到:

```
http://localhost:3000/profile/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

您应该看到:

- ✅ **注册成功！这是您的个人主页。**
- 显示您的钱包地址

---

## 验证数据

### 验证链上数据

在**终端**运行：

```bash
cd packages/contracts

cast call 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
  "isRegistered(address)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545
```

**预期输出**: `true` (0x01)

### 验证数据库数据

使用 Prisma Studio：

```bash
cd packages/agent-service
pnpm prisma:studio
```

在浏览器打开 http://localhost:5555，查看 **User** 表。

### 验证 API 数据

```bash
curl http://localhost:3001/users/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | jq
```

**预期输出**:

```json
{
  "id": "cm2x...",
  "walletAddress": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "username": "",
  "bio": "",
  "createdAt": "2025-10-11T...",
  "updatedAt": "2025-10-11T..."
}
```

---

## 测试已注册用户

### 场景: 刷新页面

1. 在 http://localhost:3000 刷新页面
2. 钱包应自动重连
3. 应用检测到用户已注册
4. **不会**再次触发注册
5. 显示正常界面

### 场景: 断开并重连

1. 在 MetaMask 中断开连接
2. 重新点击 "连接钱包"
3. 授权连接
4. 应用检测到已注册
5. **不会**重复注册

---

## 故障排除

### 问题 1: "RPC endpoint not found"

**原因**: Anvil 未运行

**解决方案**:

```bash
cd packages/contracts
anvil
```

### 问题 2: "Failed to fetch"

**原因**: 后端 API 未运行

**解决方案**:

```bash
cd packages/agent-service
pnpm dev
```

### 问题 3: "User already registered"

**原因**: 该钱包地址已经注册过

**解决方案**:

- 使用不同的 MetaMask 账户，或
- 重启 Anvil 和后端（会清空数据）

### 问题 4: 签名后卡住

**原因**: 区块链交易可能失败

**检查**:

1. Anvil 终端是否有错误日志
2. 后端终端是否有错误日志
3. 浏览器控制台是否有错误

**解决方案**:

- 刷新页面重试
- 检查合约地址是否正确

---

## 清理和重置

### 重置所有数据

```bash
# 1. 停止所有服务 (Ctrl+C)

# 2. 清空数据库
cd packages/agent-service
pnpm prisma migrate reset

# 3. 重新启动 Anvil（会清空链上数据）
cd packages/contracts
anvil

# 4. 重新部署合约
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 5. 重新启动后端和前端
```

---

## 成功标志

✅ **完整的端到端流程成功** 当您看到：

1. ✅ Anvil 正在运行 (终端 1)
2. ✅ 合约已部署 (终端 2 输出地址)
3. ✅ 后端 API 正在监听 3001 端口 (终端 3)
4. ✅ 前端应用正在运行 3000 端口 (终端 4)
5. ✅ MetaMask 成功连接
6. ✅ 签名请求弹出并成功签名
7. ✅ 自动跳转到个人主页
8. ✅ 显示 "注册成功" 提示
9. ✅ `cast call` 返回 true
10. ✅ API 返回用户数据

---

## 下一步

体验完整的用户注册流程后，您可以：

1. 尝试注册多个账户（切换 MetaMask 账户）
2. 查看 Anvil 终端的交易日志
3. 使用 Prisma Studio 查看数据库记录
4. 开发 Story 1.7 - 个人主页完善

---

**祝您测试愉快！** 🚀

如有问题，请查看完整的验证报告: [story-1.6-verification-report.md](./story-1.6-verification-report.md)
