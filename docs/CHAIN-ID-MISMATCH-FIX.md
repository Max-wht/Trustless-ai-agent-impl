# Chain ID 不匹配问题 - 解决方案

## 🚨 问题描述

**错误信息**:

```
does not match the target chain for the transaction
Current Chain ID: 31337
Expected Chain ID: 1337 – Localhost
```

**问题原因**:

- Anvil 使用 Chain ID **31337**
- 钱包默认连接到 Chain ID **1337**（标准 localhost）
- 前端配置中没有 Anvil 本地链

---

## ✅ 已实施的修复

### 修改的文件

`packages/web-app/src/lib/wagmi.ts`

### 主要更改

1. ✅ **定义 Anvil 本地链**
   - Chain ID: 31337
   - RPC URL: http://127.0.0.1:8545

2. ✅ **添加到链配置**
   - 将 Anvil 链添加到支持的链列表
   - 配置对应的 RPC transport

3. ✅ **保留测试网支持**
   - 同时支持 Anvil 和 Arbitrum Sepolia
   - 方便在本地和测试网之间切换

---

## 🔧 立即修复步骤

### 步骤 1: 重启前端服务

前端配置已更新，需要重启才能生效：

```bash
# 停止当前前端服务（Ctrl+C）

cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

### 步骤 2: 清除浏览器缓存

**硬性刷新**:

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**或使用无痕模式测试**

### 步骤 3: 在钱包中切换网络

#### 方法 A: 使用 RainbowKit 切换（推荐）

1. 连接钱包后，在页面右上角找到网络选择器
2. 点击当前网络名称
3. 选择 **"Anvil"** (Chain ID: 31337)
4. 确认切换

#### 方法 B: 在 MetaMask 中手动添加网络

1. 打开 MetaMask
2. 点击顶部的网络下拉菜单
3. 点击 "添加网络" → "手动添加网络"
4. 填写以下信息：

```
网络名称: Anvil Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
货币符号: ETH
```

5. 点击保存
6. 切换到 Anvil Local 网络

### 步骤 4: 重新连接钱包

1. 访问 http://localhost:3000
2. 点击 "Connect Wallet"
3. 选择您的钱包
4. **确认当前网络是 "Anvil" (31337)**
5. 批准连接
6. 批准签名

---

## 🔍 验证修复

### 检查当前网络

在浏览器控制台（F12）运行：

```javascript
// 检查连接的链 ID
const chainId = await window.ethereum.request({ method: 'eth_chainId' });
console.log('Chain ID:', parseInt(chainId, 16));
// 应该显示: Chain ID: 31337
```

### 检查钱包账户

```javascript
// 获取账户
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
console.log('Connected:', accounts[0]);
// 应该显示您的钱包地址
```

---

## 📋 Chain ID 对照表

| 网络             | Chain ID | 用途           |
| ---------------- | -------- | -------------- |
| Anvil            | 31337    | 本地开发 ✅    |
| Localhost        | 1337     | 其他本地节点   |
| Ethereum Mainnet | 1        | 生产环境       |
| Sepolia          | 11155111 | 测试网         |
| Arbitrum One     | 42161    | Layer 2 主网   |
| Arbitrum Sepolia | 421614   | Layer 2 测试网 |

---

## 🚨 常见问题

### Q1: 为什么 Anvil 使用 31337？

**A**: 这是 Foundry/Anvil 的默认 Chain ID。

- ✅ 31337 = "ELEET" (1337 的变体，黑客文化)
- ✅ 避免与其他本地节点冲突
- ✅ Foundry 生态系统的标准

### Q2: 可以改成 1337 吗？

**A**: 可以，但不推荐。

**如果非要改**:

```bash
# 启动 Anvil 时指定 Chain ID
anvil --chain-id 1337
```

然后需要同步修改前端配置。

### Q3: 钱包显示网络不匹配怎么办？

**A**:

1. 确认前端已重启
2. 在钱包中切换到 Anvil 网络
3. 断开并重新连接钱包

### Q4: 看不到 Anvil 网络选项

**A**:

1. 确认前端已重启（应用最新配置）
2. 清除浏览器缓存
3. 手动在 MetaMask 中添加网络

### Q5: 部署的合约在哪个链上？

**A**: 查看部署输出：

```bash
cd packages/contracts
cat deployments.json
```

应该显示：

```json
{
  "31337": {
    "chainName": "Anvil Local",
    "contracts": {
      "UserRegistry": "0x..."
    }
  }
}
```

---

## 🔧 故障排查

### 问题 1: 前端显示 "Unsupported Chain"

**原因**: 钱包连接到了不支持的网络

**解决方案**:

1. 在钱包中切换到 Anvil (31337)
2. 或在页面上点击 "Switch Network" 按钮

### 问题 2: 切换网络后仍然报错

**解决方案**:

1. 断开钱包连接
2. 清除浏览器缓存
3. 重新连接钱包

### 问题 3: MetaMask 中看不到 Anvil 网络

**解决方案**:

手动添加网络（参考步骤 3 - 方法 B）

### 问题 4: RPC 连接失败

**检查清单**:

- [ ] Anvil 正在运行: `lsof -i :8545`
- [ ] RPC URL 正确: `http://127.0.0.1:8545`
- [ ] 防火墙允许本地连接
- [ ] 测试 RPC: `curl http://127.0.0.1:8545`

---

## 💡 开发最佳实践

### 本地开发

1. **始终使用 Anvil (31337)**

   ```bash
   ./start-dev.sh  # 自动启动并配置
   ```

2. **在钱包中保存 Anvil 网络**
   - 方便快速切换
   - 避免每次手动添加

3. **使用 Anvil 默认账户**
   - 地址: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - 私钥: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - 余额: 10000 ETH

### 测试网开发

1. **切换到 Arbitrum Sepolia**
   - 在钱包中选择 Arbitrum Sepolia
   - 获取测试 ETH: https://faucet.arbitrum.io/

2. **更新合约地址**
   - 部署到测试网后更新 `deployments.json`

### 生产环境

1. **使用真实网络**
   - Ethereum Mainnet 或 Arbitrum One
   - 更新 `wagmi.ts` 配置

2. **移除本地链**
   - 生产环境不应包含 Anvil 链配置

---

## 📊 网络配置对比

### 开发环境 (当前)

```typescript
chains: [anvil, arbitrumSepolia];
```

**优点**:

- ✅ 支持本地开发
- ✅ 支持测试网测试
- ✅ 灵活切换

### 测试环境

```typescript
chains: [arbitrumSepolia];
```

**优点**:

- ✅ 真实网络环境
- ✅ 测试钱包集成
- ✅ 测试 Gas 费用

### 生产环境

```typescript
chains: [arbitrum, mainnet];
```

**优点**:

- ✅ 主网部署
- ✅ 真实用户
- ✅ 真实资产

---

## 🎯 快速检查命令

### 检查 Anvil 状态

```bash
# 检查 Anvil 是否运行
lsof -i :8545

# 测试 RPC 连接
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# 应该返回: {"jsonrpc":"2.0","id":1,"result":"0x7a69"}
# 0x7a69 (hex) = 31337 (decimal)
```

### 检查前端配置

```bash
# 查看编译后的配置
cd packages/web-app
grep -r "31337" .next/
```

### 检查钱包网络

在浏览器控制台：

```javascript
window.ethereum
  .request({ method: 'eth_chainId' })
  .then((chainId) => console.log('Current Chain:', parseInt(chainId, 16)));
```

---

## 📚 相关文档

- [RainbowKit - Custom Chains](https://www.rainbowkit.com/docs/custom-chains)
- [Viem - Chains](https://viem.sh/docs/chains/introduction.html)
- [Anvil 文档](https://book.getfoundry.sh/anvil/)
- [开发脚本使用](./DEV-SCRIPTS-USAGE.md)

---

## 🎉 总结

**问题**: Chain ID 不匹配（1337 vs 31337）

**解决方案**:

1. ✅ 在前端添加 Anvil 链配置（Chain ID: 31337）
2. ✅ 重启前端服务
3. ✅ 在钱包中切换到 Anvil 网络
4. ✅ 重新连接钱包

**结果**: 可以正常连接和使用 Anvil 本地网络！

---

**修复完成时间**: 2025-10-11  
**状态**: ✅ Chain ID 配置已修复  
**下一步**: 重启前端并切换钱包网络
