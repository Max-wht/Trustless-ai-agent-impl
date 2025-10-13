# 🦊 MetaMask 连接 Anvil - 快速开始

## 📊 诊断结果

✅ **Anvil 本地节点运行正常**  
✅ **智能合约已部署**  
✅ **配置文件正确**

**问题**: MetaMask 需要手动添加 Anvil 本地网络才能连接。

---

## 🚀 3 分钟快速解决

### 方式 1: 一键添加（最简单）⭐

1. **在浏览器中打开这个文件**:

   ```
   file:///Users/max/code/foundry-code/foundry-trustless-ai-agent/add-anvil-network.html
   ```

   或者直接拖拽 `add-anvil-network.html` 到浏览器

2. **点击"添加 Anvil 网络到 MetaMask"按钮**

3. **在 MetaMask 弹窗中点击"批准"**

4. **完成！** 🎉

---

### 方式 2: 手动添加

#### 步骤 1: 打开 MetaMask 设置

1. 点击 MetaMask 扩展图标
2. 点击顶部的网络下拉菜单（可能显示"以太坊主网"）
3. 点击 **"添加网络"**
4. 点击 **"手动添加网络"**

#### 步骤 2: 填写网络信息

| 字段           | 值                      |
| -------------- | ----------------------- |
| **网络名称**   | `Anvil Local`           |
| **新 RPC URL** | `http://127.0.0.1:8545` |
| **链 ID**      | `31337`                 |
| **货币符号**   | `ETH`                   |

#### 步骤 3: 保存

点击 **"保存"**，MetaMask 会自动切换到 Anvil Local 网络。

---

## ✅ 验证连接

### 1. 启动应用服务

```bash
# 在项目根目录运行
./start-dev.sh
```

这会自动启动：

- ✅ Anvil（已运行）
- ✅ 后端 API
- ✅ 前端应用

### 2. 访问应用

打开浏览器访问：http://localhost:3000

### 3. 连接钱包

1. 点击 **"Connect Wallet"** 按钮
2. 选择 **MetaMask**
3. 确认连接
4. 如果提示切换网络，点击 **"切换网络"**

### 4. 成功标志

连接成功后你应该看到：

- ✅ 右上角显示你的钱包地址
- ✅ 网络显示为 "Anvil Local"
- ✅ MetaMask 显示连接到 localhost:3000

---

## 🧪 测试 Anvil 连接

### 浏览器控制台测试

按 F12 打开浏览器控制台，运行：

```javascript
// 检查 Chain ID
await window.ethereum.request({ method: 'eth_chainId' });
// 应返回: "0x7a69" (31337)

// 检查连接
await window.ethereum.request({ method: 'eth_requestAccounts' });
// 应返回你的账户地址数组
```

### 命令行测试

```bash
# 测试 Anvil RPC
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# 应返回: {"jsonrpc":"2.0","id":1,"result":"0x7a69"}
```

---

## 🎁 导入测试账户（可选）

Anvil 提供了预充值的测试账户，每个账户有 10,000 ETH。

### 推荐账户 #0

```
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
余额: 10,000 ETH
```

### 导入步骤

1. 打开 MetaMask
2. 点击右上角账户图标
3. 选择 **"导入账户"**
4. 粘贴上面的私钥
5. 点击 **"导入"**

⚠️ **警告**: 这是公开的测试私钥，仅用于本地开发，切勿在主网使用！

---

## 🐛 常见问题

### Q: 添加网络时提示"链 ID 已存在"

**A**: 你可能之前已经添加过了。

解决方法：

1. 在 MetaMask 设置中找到 Chain ID 31337 的网络
2. 编辑或删除它
3. 重新添加

### Q: 连接后显示"无法连接到网络"

**A**: 确保所有服务都在运行：

```bash
# 运行诊断脚本
./diagnose-connection.sh

# 如果有服务未运行，重启所有服务
./start-dev.sh
```

### Q: MetaMask 显示余额为 0

**A**: 可能的原因：

1. **使用的是主网账户**: 切换到导入的 Anvil 测试账户
2. **网络缓存问题**: 在 MetaMask 中刷新账户余额
3. **Anvil 重启了**: 重新启动后需要重新导入账户

### Q: 签名时报错"无法估算 gas"

**A**: 确保智能合约已部署：

```bash
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

---

## 📋 网络配置速查表

| 参数       | 值                    |
| ---------- | --------------------- |
| 网络名称   | Anvil Local           |
| RPC URL    | http://127.0.0.1:8545 |
| Chain ID   | 31337 (0x7a69)        |
| 货币符号   | ETH                   |
| 区块浏览器 | 无（本地网络）        |

---

## 🔧 工具和命令

### 诊断工具

```bash
# 完整诊断
./diagnose-connection.sh

# 检查 Anvil 状态
lsof -i :8545

# 查看 Anvil 日志
tail -f /tmp/anvil.log
```

### 服务管理

```bash
# 启动所有服务
./start-dev.sh

# 停止所有服务
./stop-dev.sh

# 手动启动 Anvil
cd packages/contracts && anvil

# 手动启动后端
pnpm --filter @trustless/agent-service dev

# 手动启动前端
pnpm --filter @trustless/web-app dev
```

---

## 📚 详细文档

- 📖 [完整 MetaMask 连接指南](./METAMASK-ANVIL-CONNECTION-GUIDE.md)
- 🧪 [Story 1.7 测试指南](./stories/story-1.7-testing-guide.md)
- 🔧 [500 错误快速修复](./stories/story-1.7-quickfix-500-error.md)
- 🚀 [项目设置指南](../SETUP.md)

---

## 💡 提示

### Anvil 特点

- ✅ **即时挖矿**: 交易立即确认（0 秒区块时间）
- ✅ **预充值账户**: 10 个账户，每个 10,000 ETH
- ✅ **确定性地址**: 每次启动使用相同的私钥
- ⚠️ **临时状态**: 重启后所有数据清空

### 开发工作流

1. **首次启动**: 运行 `./start-dev.sh`
2. **添加网络**: 在 MetaMask 中添加 Anvil Local（仅需一次）
3. **导入账户**: 导入测试账户（仅需一次）
4. **日常使用**: 确保 MetaMask 切换到 Anvil Local 网络

### 重启建议

如果遇到任何问题：

```bash
# 完全重启
./stop-dev.sh
./start-dev.sh

# 清除浏览器缓存
# Chrome/Edge: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

---

## ✨ 下一步

添加 Anvil 网络后，你可以：

1. ✅ 访问 http://localhost:3000
2. ✅ 连接 MetaMask 钱包
3. ✅ 注册用户账户
4. ✅ 查看个人主页
5. ✅ 开始使用 Trustless SocialFi！

---

**需要帮助？**

- 🐛 查看详细日志: `tail -f /tmp/*.log`
- 🔍 运行诊断: `./diagnose-connection.sh`
- 📖 阅读完整指南: `docs/METAMASK-ANVIL-CONNECTION-GUIDE.md`

---

**最后更新**: 2025-10-11  
**维护者**: James (Full Stack Developer)
