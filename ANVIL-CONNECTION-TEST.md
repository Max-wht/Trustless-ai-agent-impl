# 🔍 Anvil 连接测试报告

**测试时间**: 2025-10-11  
**状态**: ✅ Anvil 服务正常运行

---

## ✅ 测试结果

### 1. Anvil 进程状态

- **状态**: ✅ 运行中
- **PID**: 34483
- **端口**: 8545
- **监听地址**: localhost (127.0.0.1)

### 2. RPC 连接测试

```bash
✅ eth_chainId: 0x7a69 (31337)
✅ net_version: 31337
✅ CORS 支持: access-control-allow-origin: *
```

### 3. CORS 配置

```
✅ 允许所有源: access-control-allow-origin: *
✅ Vary 头正确配置
```

---

## 🎯 浏览器访问问题诊断

Anvil 本身运行正常，问题可能在 MetaMask 配置。请按以下步骤排查：

### 步骤 1: 打开诊断工具

**方式 1**: 如果浏览器已自动打开诊断页面，直接使用

**方式 2**: 手动打开

```
file:///Users/max/code/foundry-code/foundry-trustless-ai-agent/diagnose-wallet.html
```

**方式 3**: 通过 HTTP 服务器访问（推荐）

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
python3 -m http.server 8888
```

然后在浏览器访问: http://localhost:8888/diagnose-wallet.html

### 步骤 2: 检查 MetaMask 配置

在诊断页面中按顺序点击：

1. **检查钱包是否可用** - 确认 MetaMask 已安装
2. **获取当前网络** - 查看当前连接的链 ID
3. **添加 Anvil 网络** - 自动添加正确的配置
4. **切换到 Anvil** - 切换到本地测试网络
5. **连接钱包** - 连接并查看余额

---

## ⚠️ 常见问题及解决方案

### 问题 1: MetaMask RPC URL 配置错误

**症状**: 无法连接到 Anvil

**解决方案**: 在 MetaMask 中检查 RPC URL 配置

**正确配置**:

```
网络名称: Anvil (或任意名称)
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
货币符号: ETH
```

**关键点**:

- ✅ 使用 `http://127.0.0.1:8545`（推荐）
- ✅ 或使用 `http://localhost:8545`
- ❌ 不要使用 `https://`
- ❌ 不要使用 `0.0.0.0:8545`

### 问题 2: Chain ID 不匹配

**症状**: MetaMask 提示 Chain ID 不匹配

**当前 Anvil Chain ID**: 31337 (0x7a69)

**解决方案**:

1. 在 MetaMask 中编辑网络
2. 确认 Chain ID 设置为: `31337`
3. 保存并重新连接

### 问题 3: 浏览器安全策略限制

**症状**: 控制台显示 Mixed Content 错误

**解决方案**:

1. 确保前端应用也使用 HTTP (不是 HTTPS)
2. 或在 Chrome 中允许不安全的本地主机连接

### 问题 4: MetaMask 缓存问题

**症状**: 修改配置后仍然无法连接

**解决方案**:

1. 在 MetaMask 中删除 Anvil 网络
2. 重新添加网络（使用诊断工具）
3. 清除浏览器缓存
4. 重新加载页面

---

## 🔧 手动配置 MetaMask

如果诊断工具无法自动配置，请手动在 MetaMask 中添加网络：

1. 打开 MetaMask
2. 点击网络下拉菜单
3. 点击"添加网络"
4. 填写以下信息：
   - **网络名称**: Anvil Local
   - **新的 RPC URL**: `http://127.0.0.1:8545`
   - **链 ID**: `31337`
   - **货币符号**: `ETH`
5. 点击"保存"
6. 切换到新添加的 Anvil 网络

---

## 🧪 命令行测试

验证 Anvil 连接性：

```bash
# 测试 1: 获取 Chain ID
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
# 预期结果: {"jsonrpc":"2.0","id":1,"result":"0x7a69"}

# 测试 2: 获取区块高度
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# 测试 3: 检查 CORS
curl -v -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  2>&1 | grep -i "access-control"
# 预期结果: access-control-allow-origin: *
```

---

## 📊 Anvil 默认账户

Anvil 启动时提供了 10 个测试账户，每个账户有 10000 ETH：

**账户 0** (用于合约部署):

```
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
余额: 10000 ETH
```

你可以在 MetaMask 中导入这个账户进行测试。

---

## 🚀 如果一切正常

测试通过后，访问前端应用：

```
http://localhost:3000
```

确认：

- ✅ MetaMask 显示连接到 Anvil (31337)
- ✅ 账户余额显示正确
- ✅ 可以进行交易和合约交互

---

## 📞 仍然无法连接？

如果按照以上步骤仍无法连接，请提供：

1. **MetaMask 截图**:
   - 网络配置页面
   - 当前选择的网络
   - 任何错误消息

2. **浏览器控制台**:
   - 打开开发者工具 (F12)
   - Console 标签中的错误信息
   - Network 标签中失败的请求

3. **诊断工具结果**:
   - 每个测试步骤的结果截图

---

## ✅ 验证清单

- [ ] Anvil 进程正在运行 (ps aux | grep anvil)
- [ ] 端口 8545 可访问 (lsof -i :8545)
- [ ] curl 测试返回正确的 Chain ID
- [ ] 诊断页面已在浏览器中打开
- [ ] MetaMask 已安装并解锁
- [ ] MetaMask 中已添加 Anvil 网络 (Chain ID: 31337)
- [ ] MetaMask 已切换到 Anvil 网络
- [ ] 在诊断页面中可以看到账户余额
- [ ] 前端应用可以连接钱包

---

**下一步**: 打开诊断工具，按顺序执行测试步骤 🚀
