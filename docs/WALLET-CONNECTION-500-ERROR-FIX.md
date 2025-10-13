# 连接钱包时 500 错误 - 解决方案

## 🚨 问题描述

**错误日志**:

```json
{"level":30,"res":{"statusCode":500},"responseTime":45.9ms,"msg":"request completed"}
```

**错误原因**:

```
"expected valid r: 1 <= n < 115792089237316195423570985008687907852837564279074904382605163141518161494337, got 0"
```

这是**签名验证失败**导致的 500 错误。

---

## ✅ 已实施的修复

### 1. 后端改进

✅ 添加了签名验证的 try-catch 错误处理  
✅ 提供更详细的错误信息  
✅ 区分签名格式错误和验证失败

### 2. 前端改进

✅ 添加签名请求的错误捕获  
✅ 验证签名格式  
✅ 提供中文错误提示  
✅ 改进的错误日志

---

## 🔧 立即修复步骤

### 步骤 1: 重启后端服务（必须！）

```bash
# 停止当前后端服务（Ctrl+C）

# 重新启动
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev
```

等待看到: `✔ Agent service listening on http://0.0.0.0:3001`

### 步骤 2: 重启前端服务

```bash
# 停止当前前端服务（Ctrl+C）

# 重新启动
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

等待看到: `✔ Ready in Xs` 和 `- Local: http://localhost:3000`

### 步骤 3: 清除浏览器缓存

**硬性刷新**:

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**或使用隐私/无痕模式测试**

### 步骤 4: 重新测试

1. 访问 http://localhost:3000
2. 点击 "Connect Wallet"
3. 选择您的钱包（MetaMask, WalletConnect 等）
4. **批准连接请求**
5. **批准签名请求**（重要！）

---

## 🔍 可能的错误原因

### 原因 1: 用户拒绝签名 ❌

**症状**: 钱包弹窗出现后点击"拒绝"或"取消"

**解决方案**:

- 重新连接钱包
- 这次点击"签名"或"批准"
- 签名消息是: "Sign in to Trustless SocialFi"

### 原因 2: 签名格式无效 ❌

**症状**: 签名长度不足或格式错误

**解决方案**:

- 更新钱包到最新版本
- 尝试不同的钱包（MetaMask, Coinbase Wallet 等）
- 检查钱包设置

### 原因 3: 网络问题 ❌

**症状**: 请求超时或连接失败

**解决方案**:

- 检查后端和 Anvil 是否运行
- 验证环境变量配置
- 查看后端日志

---

## 📋 检查清单

### 服务状态

- [ ] PostgreSQL 运行中 (`lsof -i :5432`)
- [ ] Anvil 区块链运行中 (`lsof -i :8545`)
- [ ] 后端服务运行中 (`lsof -i :3001`)
- [ ] 前端服务运行中 (`lsof -i :3000`)

### 环境配置

- [ ] `/packages/agent-service/.env` 存在且配置正确
- [ ] `/packages/web-app/.env.local` 存在且配置正确
- [ ] 合约已部署 (`cat packages/contracts/deployments.json`)

### 浏览器

- [ ] 使用最新版本的 Chrome/Firefox/Brave
- [ ] 钱包插件已安装并登录
- [ ] 浏览器控制台无错误（F12）

---

## 🧪 调试方法

### 1. 查看浏览器控制台

打开开发者工具（F12）→ Console 标签

**期望看到的日志**:

```
Signature request successful
Registration API call...
User registered successfully
```

**如果看到错误**:

```
Signature request error: User rejected the request
用户拒绝签名或签名失败
```

→ 这意味着您拒绝了签名请求

### 2. 查看后端日志

在后端服务的终端中查看日志

**正常日志**:

```json
{"level":30,"msg":"incoming request","req":{...}}
{"level":30,"msg":"request completed","res":{"statusCode":201}}
```

**错误日志**:

```json
{"level":50,"msg":"Signature verification error"}
{"error":"expected valid r: ..."}
```

### 3. 测试签名功能

在浏览器控制台手动测试:

```javascript
// 1. 获取连接的地址
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});
console.log('Connected:', accounts[0]);

// 2. 请求签名
const message = 'Sign in to Trustless SocialFi';
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: [message, accounts[0]],
});
console.log('Signature:', signature);
console.log('Signature length:', signature.length);

// 签名长度应该是 132 字符（0x + 130 个十六进制字符）
```

### 4. 直接测试后端 API

```bash
# 使用有效的签名测试（需要先获取真实签名）
curl -X POST http://localhost:3001/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xYourAddress",
    "signature": "0xYourSignature",
    "username": "test",
    "bio": "test"
  }'
```

---

## 💡 常见问题解答

### Q: 为什么需要签名？

**A**: 签名用于验证您确实拥有该钱包地址。这是 Web3 应用的标准安全措施，确保没人能冒充您注册账户。

### Q: 签名会花费 Gas 费吗？

**A**: ❌ **不会！** 签名只是一个密码学证明，不会发送交易，完全免费。

### Q: 签名安全吗？

**A**: ✅ **安全！** 签名只证明您拥有该地址，不会授权任何资金转移。消息内容是明文的 "Sign in to Trustless SocialFi"。

### Q: 为什么还会有区块链交易？

**A**: 在签名验证通过后，后端会调用智能合约在链上注册您的账户。这个交易由后端支付 Gas 费，您无需支付。

### Q: 可以跳过签名吗？

**A**: 在生产环境不可以，这是安全必需的。但如果您是开发者，可以在开发环境临时禁用签名验证（不推荐）。

---

## 🔧 高级调试

### 查看完整的请求/响应

在浏览器开发者工具：

1. Network 标签
2. 找到 `/users/register` 请求
3. 查看 Request Payload 和 Response

**正常请求**:

```json
{
  "walletAddress": "0x...",
  "signature": "0x... (132 字符)",
  "username": "",
  "bio": ""
}
```

**正常响应 (201)**:

```json
{
  "success": true,
  "user": {...},
  "txHash": "0x..."
}
```

**错误响应 (400/500)**:

```json
{
  "error": "Signature verification failed",
  "details": "expected valid r: ..."
}
```

---

## 📚 相关文档

- [服务重启指南](./RESTART-SERVICES.md)
- [CORS 问题修复](./QUICK-FIX-CORS.md)
- [Story 1.7 测试指南](./stories/story-1.7-testing-guide.md)

---

## 🆘 仍然无法解决？

如果按照以上步骤仍有问题，请提供：

1. **浏览器控制台完整日志**（截图）
2. **Network 标签中的请求详情**（截图）
3. **后端控制台日志**（文本）
4. **使用的钱包和版本**
5. **签名测试的结果**

---

**修复完成时间**: 2025-10-11  
**状态**: ✅ 错误处理已改进，请重启服务测试
