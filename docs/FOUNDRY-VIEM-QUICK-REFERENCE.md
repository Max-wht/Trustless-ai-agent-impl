# ⚡ Foundry & Viem 快速参考

**一页纸速查表** - 打印或保存为书签  
**最后更新**: 2025-10-11

---

## 🔥 Foundry 命令

### 编译和构建

```bash
forge build                    # 编译所有合约
forge build --force            # 强制重新编译
forge clean                    # 清理构建产物
```

### 测试

```bash
forge test                     # 运行所有测试
forge test -vv                 # 详细输出（console.log）
forge test -vvvv               # 极详细（堆栈跟踪）
forge test --match-test NAME   # 运行特定测试
forge test --gas-report        # Gas 使用报告
forge coverage                 # 代码覆盖率
```

### Anvil（本地节点）

```bash
anvil                          # 启动（默认端口 8545）
anvil --port 9545              # 自定义端口
anvil --accounts 20            # 20 个账户
anvil --balance 10000          # 每账户 10000 ETH
```

**默认配置**:

- 端口: `8545`
- Chain ID: `31337`
- 账户: `10`
- 余额: `10000 ETH/账户`

### 部署合约

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url http://localhost:8545 \
  --private-key 0xac09... \
  --broadcast
```

### Cast（区块链交互）

```bash
# 查询
cast block-number --rpc-url URL       # 区块高度
cast chain-id --rpc-url URL           # Chain ID
cast balance ADDR --rpc-url URL       # 余额
cast code ADDR --rpc-url URL          # 合约代码

# 调用只读函数
cast call ADDR "func(type)" ARG --rpc-url URL

# 发送交易
cast send ADDR "func(type)" ARG \
  --private-key KEY \
  --rpc-url URL

# 转账
cast send ADDR --value 1ether \
  --private-key KEY \
  --rpc-url URL
```

---

## 🌐 Viem（TypeScript）

### 创建 Clients

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { anvil } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Public Client（只读）
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// Wallet Client（可写）
const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({
  account,
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});
```

### 读取合约

```typescript
const result = await publicClient.readContract({
  address: '0x...',
  abi: ContractABI,
  functionName: 'balanceOf',
  args: ['0x...'],
});
```

### 写入合约

```typescript
// 1. 模拟交易
const { request } = await publicClient.simulateContract({
  address: '0x...',
  abi: ContractABI,
  functionName: 'transfer',
  args: ['0x...', 100n],
  account,
});

// 2. 发送交易
const hash = await walletClient.writeContract(request);

// 3. 等待确认
const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

### 监听事件

```typescript
const unwatch = publicClient.watchContractEvent({
  address: '0x...',
  abi: ContractABI,
  eventName: 'Transfer',
  onLogs: (logs) => console.log(logs),
});

// 停止监听
unwatch();
```

### 常用操作

```typescript
// 获取区块号
await publicClient.getBlockNumber();

// 获取余额
await publicClient.getBalance({ address: '0x...' });

// 获取交易收据
await publicClient.getTransactionReceipt({ hash: '0x...' });

// 获取 Gas Price
await publicClient.getGasPrice();
```

---

## ⚛️ Wagmi（React Hooks）

### 配置

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'My App',
  projectId: 'YOUR_ID',
  chains: [anvil],
  ssr: true,
});
```

### Providers

```typescript
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
      {children}
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### Hooks - 账户

```typescript
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const { address, isConnected } = useAccount();
const { connect } = useConnect();
const { disconnect } = useDisconnect();
```

### Hooks - 读取合约

```typescript
import { useReadContract } from 'wagmi';

const { data, isLoading, error, refetch } = useReadContract({
  address: '0x...',
  abi: ContractABI,
  functionName: 'balanceOf',
  args: ['0x...'],
});
```

### Hooks - 写入合约

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const { writeContract, data: hash } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

// 调用
writeContract({
  address: '0x...',
  abi: ContractABI,
  functionName: 'transfer',
  args: ['0x...', 100n],
});
```

### Hooks - 监听事件

```typescript
import { useWatchContractEvent } from 'wagmi';

useWatchContractEvent({
  address: '0x...',
  abi: ContractABI,
  eventName: 'Transfer',
  onLogs: (logs) => console.log(logs),
});
```

---

## 🔧 项目特定

### Anvil 测试账户

```
账户 #0（推荐用于开发）:
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

账户 #1:
地址: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

账户 #2:
地址: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
私钥: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### 项目脚本

```bash
./diagnose-connection.sh       # 诊断所有服务
./start-dev.sh                 # 启动所有服务
./stop-dev.sh                  # 停止所有服务
```

### 环境变量

**后端** (`.env`):

```bash
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac09...
DATABASE_URL=postgresql://...
```

**前端** (`.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
```

### 合约地址

```typescript
// packages/shared/src/contracts/addresses.ts
export const CONTRACTS = {
  31337: {
    // Anvil
    UserRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
};
```

---

## 🐛 常见问题速查

| 错误                    | 原因              | 解决                         |
| ----------------------- | ----------------- | ---------------------------- |
| "Cannot connect to RPC" | Anvil 未运行      | `anvil`                      |
| "Chain ID mismatch"     | MetaMask 网络错误 | 切换到 Anvil Local           |
| "Contract not deployed" | 合约未部署        | `./start-dev.sh`             |
| "Nonce too low"         | MetaMask 缓存     | 清除活动数据                 |
| "Cannot estimate gas"   | 交易会失败        | 使用 `simulateContract` 调试 |

---

## 📏 类型转换

### Wei ↔ ETH

```typescript
// ETH → Wei
import { parseEther } from 'viem';
const wei = parseEther('1.5'); // 1500000000000000000n

// Wei → ETH
import { formatEther } from 'viem';
const eth = formatEther(1500000000000000000n); // "1.5"
```

### 地址类型

```typescript
import { Address } from 'viem';

// 类型安全的地址
const addr: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// 检查地址有效性
import { isAddress } from 'viem';
isAddress('0x...'); // true/false

// 规范化地址（小写）
import { getAddress } from 'viem';
getAddress('0xF39FD...'); // '0xf39Fd...'
```

### BigInt

```typescript
// 创建 BigInt
const amount = 100n;
const amount2 = BigInt(100);

// 运算
const sum = 100n + 50n; // 150n
const product = 100n * 2n; // 200n

// 转换
Number(100n); // 100
BigInt(100); // 100n
```

---

## 🎯 最佳实践

### ✅ DO（推荐）

```typescript
// 1. 使用 const assertion
const abi = [...] as const;

// 2. 类型安全的地址
const addr: Address = '0x...';

// 3. 先模拟再发送
const { request } = await publicClient.simulateContract({...});
await walletClient.writeContract(request);

// 4. 等待交易确认
const receipt = await publicClient.waitForTransactionReceipt({ hash });

// 5. 错误处理
try {
  await writeContract({...});
} catch (error) {
  console.error(error);
}
```

### ❌ DON'T（不推荐）

```typescript
// 1. 没有类型检查
const abi = [...];

// 2. 直接字符串
const addr = '0x...';

// 3. 不模拟直接发送
await walletClient.writeContract({...}); // 可能失败浪费 gas

// 4. 不等待确认
const hash = await walletClient.writeContract({...});
return hash; // 交易可能失败

// 5. 忽略错误
await writeContract({...}); // 没有 try-catch
```

---

## 📚 学习路径

### 第 1 周: Foundry 基础

- ✅ 编译和测试合约
- ✅ 使用 Anvil 本地节点
- ✅ Cast 命令行工具

### 第 2 周: Viem 基础

- ✅ Public Client 读取
- ✅ Wallet Client 写入
- ✅ 事件监听

### 第 3 周: Wagmi 集成

- ✅ React Hooks
- ✅ 钱包连接
- ✅ 合约交互

### 第 4 周: 实战项目

- ✅ 完整 E2E 流程
- ✅ 测试和调试
- ✅ 优化和部署

---

## 🔗 快速链接

| 资源           | 链接                           |
| -------------- | ------------------------------ |
| Foundry Book   | https://book.getfoundry.sh/    |
| Viem Docs      | https://viem.sh/               |
| Wagmi Docs     | https://wagmi.sh/              |
| Solidity Docs  | https://docs.soliditylang.org/ |
| Anvil 默认账户 | [见上方](#anvil-测试账户)      |

---

## 💡 快速提示

- 🔥 **Anvil 重启清空所有数据** - 使用 `./start-dev.sh` 自动重新部署
- 🦊 **MetaMask 需要手动添加网络** - 使用 `add-anvil-network.html`
- ⚡ **先模拟后发送** - `simulateContract` 可以避免浪费 gas
- 🔍 **使用 `-vv` 查看详细输出** - `forge test -vv`
- 📝 **保存合约地址** - 部署后立即记录到配置文件
- 🧪 **编写测试** - 每个函数至少一个测试用例
- 🎯 **类型安全** - 使用 `as const` 和 TypeScript 严格模式

---

## 🆘 紧急救援

```bash
# 一切都不工作？试试完全重启：
./stop-dev.sh
pkill -f anvil
./start-dev.sh

# MetaMask 问题？
# 1. 切换网络到 Anvil Local
# 2. 清除活动数据（设置 → 高级）
# 3. 刷新页面（Ctrl+Shift+R）

# 合约问题？
cd packages/contracts
forge clean
forge build
forge test

# 诊断所有服务
./diagnose-connection.sh
```

---

**打印此页并贴在显示器旁边！** 📄  
**创建日期**: 2025-10-11  
**维护者**: James (Full Stack Developer)
