# 🔨 Foundry & Viem 开发实战指南

**基于**: Story 1.7 实战经验  
**适用于**: Trustless SocialFi 项目开发  
**学习目标**: 掌握本地区块链开发完整流程

---

## 📚 目录

1. [开发架构概览](#开发架构概览)
2. [Foundry 核心概念](#foundry-核心概念)
3. [Viem 核心概念](#viem-核心概念)
4. [完整开发流程](#完整开发流程)
5. [常见问题和解决方案](#常见问题和解决方案)
6. [最佳实践](#最佳实践)
7. [调试技巧](#调试技巧)

---

## 开发架构概览

### 技术栈组合

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                            │
│  ┌────────────┐        ┌─────────────┐                  │
│  │  MetaMask  │ ←────→ │  前端应用   │                  │
│  │  (钱包插件)│        │  (Next.js)  │                  │
│  └────────────┘        └─────────────┘                  │
└─────────────────────────────────────────────────────────┘
         │                       │
         │ 签名/交易              │ API 调用
         ↓                       ↓
┌──────────────────┐    ┌──────────────────┐
│   Anvil 节点     │    │   后端 API       │
│   (本地链)       │←──→│   (Fastify)      │
│   Port: 8545     │    │   Port: 3001     │
│   Chain ID:31337 │    └──────────────────┘
└──────────────────┘            │
         │                       │
         │                       ↓
         │              ┌──────────────────┐
         │              │   PostgreSQL     │
         │              │   (数据库)       │
         │              └──────────────────┘
         ↓
┌──────────────────┐
│   智能合约        │
│   (Solidity)     │
│   UserRegistry   │
└──────────────────┘
```

### 技术选型原因

| 工具           | 作用           | 为什么选它                             |
| -------------- | -------------- | -------------------------------------- |
| **Foundry**    | 智能合约开发   | Rust 实现，速度快 10 倍，内置测试框架  |
| **Anvil**      | 本地以太坊节点 | 即时挖矿，预充值账户，重启后清空       |
| **Viem**       | Web3 库        | TypeScript 优先，比 ethers.js 快 10 倍 |
| **Wagmi**      | React Hooks    | 基于 Viem，简化前端 Web3 集成          |
| **RainbowKit** | 钱包连接       | 美观的 UI，支持多种钱包                |

---

## Foundry 核心概念

### 1. Foundry 工具集

Foundry 包含 4 个核心工具：

```bash
forge   # 编译、测试、部署智能合约
anvil   # 本地以太坊节点
cast    # 与区块链交互（查询、调用）
chisel  # Solidity REPL（交互式解释器）
```

### 2. 项目结构

```
packages/contracts/
├── src/                    # Solidity 源码
│   ├── UserRegistry.sol    # 用户注册合约
│   └── HealthCheck.sol     # 健康检查合约
├── test/                   # 测试文件
│   ├── UserRegistry.t.sol  # UserRegistry 测试
│   └── HealthCheck.t.sol
├── script/                 # 部署脚本
│   ├── DeployUserRegistry.s.sol
│   └── DeployHealthCheck.s.sol
├── out/                    # 编译输出（ABI、字节码）
├── lib/                    # 依赖库（如 OpenZeppelin）
├── foundry.toml            # Foundry 配置
└── remappings.txt          # 导入路径映射
```

### 3. 核心命令

#### 编译合约

```bash
cd packages/contracts

# 编译所有合约
forge build

# 查看编译输出
ls out/UserRegistry.sol/

# 输出:
# - UserRegistry.json        # ABI 和元数据
# - UserRegistry.dbg.json    # 调试信息
```

#### 运行测试

```bash
# 运行所有测试
forge test

# 详细输出（显示 gas 使用）
forge test -vv

# 非常详细（显示堆栈跟踪）
forge test -vvv

# 运行特定测试
forge test --match-test testRegisterUser

# 带 gas 报告
forge test --gas-report
```

#### 启动 Anvil

```bash
# 默认配置启动
anvil

# 自定义端口
anvil --port 8545

# 指定账户数量
anvil --accounts 20

# 指定初始余额（单位：ETH）
anvil --balance 10000
```

**Anvil 默认配置**:

- 端口: `8545`
- Chain ID: `31337`
- 账户数: `10`
- 初始余额: `10000 ETH/账户`
- 区块时间: `0` 秒（即时挖矿）

#### 部署合约

```bash
# 部署到 Anvil
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast

# --broadcast: 实际发送交易（不加此参数只是模拟）
# --private-key: Anvil 账户 #0 的私钥（公开的测试密钥）
```

**部署脚本示例** (`script/DeployUserRegistry.s.sol`):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Script.sol';
import '../src/UserRegistry.sol';

contract DeployUserRegistry is Script {
  function run() external {
    // 从环境变量或命令行参数读取私钥
    uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');

    // 开始广播交易
    vm.startBroadcast(deployerPrivateKey);

    // 部署合约
    UserRegistry registry = new UserRegistry();

    // 停止广播
    vm.stopBroadcast();

    // 输出合约地址
    console.log('UserRegistry deployed at:', address(registry));
  }
}
```

#### 与合约交互

```bash
# 使用 cast 调用合约

# 1. 调用只读函数（不需要 gas）
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  "isRegistered(address)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545

# 2. 发送交易（需要 gas 和私钥）
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  "register(string)" \
  "Alice" \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545

# 3. 查询区块链状态
cast block-number --rpc-url http://localhost:8545  # 当前区块高度
cast chain-id --rpc-url http://localhost:8545      # Chain ID
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545                   # 账户余额
```

---

## Viem 核心概念

### 1. Viem vs Ethers.js

| 特性         | Viem                    | Ethers.js   |
| ------------ | ----------------------- | ----------- |
| **类型安全** | ✅ 完整 TypeScript 支持 | ⚠️ 部分支持 |
| **性能**     | ⚡ 快 10 倍             | 🐢 较慢     |
| **包大小**   | 📦 40 KB                | 📦 300 KB   |
| **API 设计** | 🎯 函数式               | 🧱 类式     |
| **学习曲线** | 📈 陡峭                 | 📉 平缓     |

### 2. Viem 核心概念

#### Clients（客户端）

Viem 有两种主要客户端：

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { mainnet, anvil } from 'viem/chains';

// 1. Public Client - 只读操作（查询）
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// 用于:
// - 读取合约状态
// - 查询区块/交易
// - 监听事件

// 2. Wallet Client - 写入操作（签名、发送交易）
const walletClient = createWalletClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// 用于:
// - 发送交易
// - 签名消息
// - 部署合约
```

#### 在本项目中的使用

**后端配置** (`packages/agent-service/src/lib/web3.ts`):

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';

// 从环境变量读取配置
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
const USER_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Public Client（只读）
export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(RPC_URL),
});

// Wallet Client（可写）
const account = privateKeyToAccount(PRIVATE_KEY);
export const walletClient = createWalletClient({
  account,
  chain: anvil,
  transport: http(RPC_URL),
});
```

**前端配置** (`packages/web-app/src/lib/wagmi.ts`):

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, defineChain } from 'viem';

// 定义 Anvil 链
export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
});

// Wagmi 配置
export const config = getDefaultConfig({
  appName: 'Trustless SocialFi',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_ID',
  chains: [anvil],
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true, // Next.js SSR 支持
});
```

### 3. 合约交互

#### 读取合约（后端）

```typescript
import { publicClient } from './lib/web3';
import UserRegistryABI from './abis/UserRegistry.json';

// 调用只读函数
const isRegistered = await publicClient.readContract({
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: UserRegistryABI,
  functionName: 'isRegistered',
  args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
});

console.log('Is registered:', isRegistered); // true or false
```

#### 写入合约（后端）

```typescript
import { walletClient, publicClient } from './lib/web3';
import UserRegistryABI from './abis/UserRegistry.json';

// 1. 模拟交易（检查是否会成功）
const { request } = await publicClient.simulateContract({
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: UserRegistryABI,
  functionName: 'register',
  args: ['Alice'],
  account: walletClient.account,
});

// 2. 发送实际交易
const hash = await walletClient.writeContract(request);

// 3. 等待交易确认
const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log('Transaction confirmed:', receipt.transactionHash);
```

#### 读取合约（前端 - 使用 Wagmi Hooks）

```typescript
import { useReadContract } from 'wagmi';
import UserRegistryABI from '@/abis/UserRegistry.json';

function UserProfile() {
  const { data: isRegistered, isLoading } = useReadContract({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: UserRegistryABI,
    functionName: 'isRegistered',
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>;
}
```

#### 写入合约（前端 - 使用 Wagmi Hooks）

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import UserRegistryABI from '@/abis/UserRegistry.json';

function RegisterButton() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRegister = async () => {
    writeContract({
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      abi: UserRegistryABI,
      functionName: 'register',
      args: ['Alice'],
    });
  };

  return (
    <button onClick={handleRegister} disabled={isConfirming}>
      {isConfirming ? 'Confirming...' : 'Register'}
    </button>
  );
}
```

---

## 完整开发流程

### Story 1.7 的完整流程示例

#### 阶段 1: 编写和部署智能合约

```bash
# 1. 编写合约
cd packages/contracts
vim src/UserRegistry.sol

# 2. 编译
forge build

# 3. 编写测试
vim test/UserRegistry.t.sol

# 4. 运行测试
forge test -vv

# 5. 启动 Anvil
anvil  # 在新终端运行

# 6. 部署到 Anvil
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast

# 7. 记录合约地址
# 输出类似: UserRegistry deployed at: 0x5FbDB...0aa3
```

#### 阶段 2: 后端集成

```typescript
// packages/agent-service/src/lib/web3.ts

import { createPublicClient, http } from 'viem';
import { anvil } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

export const USER_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
```

```typescript
// packages/agent-service/src/routes/users.ts

import { FastifyInstance } from 'fastify';
import { publicClient, USER_REGISTRY_ADDRESS } from '../lib/web3';
import UserRegistryABI from '../abis/UserRegistry.json';

export async function userRoutes(fastify: FastifyInstance) {
  // GET /users/:address - 获取用户信息
  fastify.get('/users/:address', async (request, reply) => {
    const { address } = request.params as { address: string };

    // 1. 检查链上是否已注册
    const isRegistered = await publicClient.readContract({
      address: USER_REGISTRY_ADDRESS,
      abi: UserRegistryABI,
      functionName: 'isRegistered',
      args: [address as `0x${string}`],
    });

    if (!isRegistered) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // 2. 从数据库读取用户信息
    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    return user;
  });
}
```

#### 阶段 3: 前端集成

```typescript
// packages/web-app/src/app/profile/[address]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Blockies from 'react-blockies';

interface User {
  walletAddress: string;
  username: string | null;
  bio: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/users/${address}`);

        if (!response.ok) {
          throw new Error('User not found');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [address]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <Blockies
        seed={user.walletAddress.toLowerCase()}
        size={10}
        scale={8}
      />
      <h1>{user.username || 'Anonymous'}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

#### 阶段 4: 添加网络到 MetaMask

这是 **Story 1.7 最大的阻碍**！必须手动配置：

```
网络名称: Anvil Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
货币符号: ETH
```

使用我们创建的工具：

- `add-anvil-network.html` - 一键添加
- `./diagnose-connection.sh` - 诊断问题

---

## 常见问题和解决方案

### 问题 1: "Cannot connect to RPC"

**症状**:

```
Error: fetch failed
URL: http://localhost:8545
```

**原因**: Anvil 没有运行

**解决**:

```bash
# 检查 Anvil 是否运行
lsof -i :8545

# 如果没有，启动它
cd packages/contracts
anvil
```

---

### 问题 2: "Chain ID mismatch"

**症状**:

```
Expected chain ID 31337, but got 1
```

**原因**: MetaMask 连接到了错误的网络（如以太坊主网）

**解决**:

1. 在 MetaMask 中切换到 "Anvil Local" 网络
2. 如果没有此网络，使用 `add-anvil-network.html` 添加

---

### 问题 3: "Contract not deployed"

**症状**:

```
Error: Contract at address 0x... not found
```

**原因**:

- Anvil 重启后合约地址会变
- 合约未部署

**解决**:

```bash
# 重新部署合约
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast

# 更新代码中的合约地址
```

**最佳实践**: 使用 `./start-dev.sh` 脚本自动处理部署和更新配置。

---

### 问题 4: "Nonce too low"

**症状**:

```
Error: nonce too low: address 0x..., tx: 5 state: 10
```

**原因**: MetaMask 的 nonce 缓存与 Anvil 不同步（通常在 Anvil 重启后）

**解决**:

1. MetaMask → 设置 → 高级 → 清除活动数据
2. 或者切换账户再切换回来

---

### 问题 5: "Cannot estimate gas"

**症状**:

```
Error: cannot estimate gas; transaction may fail
```

**原因**:

- 合约函数会 revert
- 参数类型错误
- 合约未部署

**调试**:

```bash
# 使用 cast 模拟调用，查看详细错误
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  "register(string)" \
  "Alice" \
  --rpc-url http://localhost:8545
```

---

## 最佳实践

### 1. 使用脚本自动化

✅ **好**:

```bash
./start-dev.sh  # 一键启动所有服务
```

❌ **不好**:

```bash
# 手动启动每个服务（容易出错）
anvil &
forge script ... &
pnpm --filter @trustless/agent-service dev &
pnpm --filter @trustless/web-app dev &
```

### 2. 环境变量管理

✅ **好**:

```typescript
// packages/agent-service/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  RPC_URL: z.string().url().default('http://127.0.0.1:8545'),
  PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

❌ **不好**:

```typescript
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545'; // 没有验证
```

### 3. 类型安全的合约调用

✅ **好**:

```typescript
import { Address } from 'viem';

const address: Address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

await publicClient.readContract({
  address,
  abi: UserRegistryABI as const, // as const 确保类型推断
  functionName: 'isRegistered', // 自动补全和类型检查
  args: [userAddress],
});
```

❌ **不好**:

```typescript
await publicClient.readContract({
  address: '0x5FbDB...', // 没有类型检查
  abi: UserRegistryABI,
  functionName: 'isRegisted', // 拼写错误，编译器不会发现
  args: [userAddress],
});
```

### 4. 错误处理

✅ **好**:

```typescript
try {
  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    timeout: 60_000, // 60 秒超时
  });

  if (receipt.status === 'reverted') {
    throw new Error('Transaction reverted');
  }

  return receipt;
} catch (error) {
  if (error instanceof ContractFunctionExecutionError) {
    console.error('Contract error:', error.cause);
  }
  throw error;
}
```

❌ **不好**:

```typescript
const hash = await walletClient.writeContract(request);
// 不等待确认，可能交易失败但返回成功
return hash;
```

### 5. 合约地址管理

✅ **好**:

```typescript
// packages/shared/src/contracts/addresses.ts
export const CONTRACTS = {
  31337: {
    // Anvil
    UserRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  421614: {
    // Arbitrum Sepolia
    UserRegistry: '0x...',
  },
} as const;

// 使用
import { CONTRACTS } from '@trustless/shared';
const address = CONTRACTS[chainId].UserRegistry;
```

❌ **不好**:

```typescript
// 硬编码地址，散布在各处
const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
```

---

## 调试技巧

### 1. Foundry 调试

#### 使用 console.log 调试合约

```solidity
// test/UserRegistry.t.sol
import 'forge-std/Test.sol';
import 'forge-std/console.sol';

contract UserRegistryTest is Test {
  function testRegister() public {
    console.log('Testing register function...');
    console.log('User address:', address(this));

    registry.register('Alice');

    bool isReg = registry.isRegistered(address(this));
    console.log('Is registered:', isReg);

    assertTrue(isReg);
  }
}
```

运行测试查看输出：

```bash
forge test -vv  # -vv 显示 console.log 输出
```

#### 使用 Trace 调试

```bash
# 显示完整的调用堆栈
forge test --match-test testRegister -vvvv

# 输出:
# [CALL] UserRegistry::register("Alice")
#   ├─ [GAS] 50000
#   ├─ [STORAGE] slot 0x123... = 0x1
#   └─ [RETURN] ()
```

### 2. Viem 调试

#### 使用 simulateContract 预检查

```typescript
try {
  // 先模拟，不消耗 gas
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: UserRegistryABI,
    functionName: 'register',
    args: ['Alice'],
    account: walletClient.account,
  });

  console.log('Simulation successful, request:', request);

  // 再发送实际交易
  const hash = await walletClient.writeContract(request);
} catch (error) {
  console.error('Simulation failed:', error);
  // 提前发现问题，不消耗真实 gas
}
```

#### 监听合约事件

```typescript
// 监听 UserRegistered 事件
const unwatch = publicClient.watchContractEvent({
  address: USER_REGISTRY_ADDRESS,
  abi: UserRegistryABI,
  eventName: 'UserRegistered',
  onLogs: (logs) => {
    console.log('User registered:', logs);
  },
});

// 停止监听
unwatch();
```

### 3. Anvil 调试

#### 查看所有账户

```bash
cast rpc anvil_accounts --rpc-url http://localhost:8545
```

#### 查看账户余额

```bash
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545 \
  --ether  # 显示为 ETH 而不是 Wei
```

#### 查看合约代码

```bash
# 查看合约字节码
cast code 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  --rpc-url http://localhost:8545
```

#### 快速转账（用于测试）

```bash
cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  --value 1ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

---

## 学习资源

### 官方文档

| 资源         | 链接                        | 重点章节                                                |
| ------------ | --------------------------- | ------------------------------------------------------- |
| Foundry Book | https://book.getfoundry.sh/ | - Getting Started<br>- Testing<br>- Deploying           |
| Viem Docs    | https://viem.sh/            | - Getting Started<br>- Contract Interaction<br>- Chains |
| Wagmi Docs   | https://wagmi.sh/           | - useReadContract<br>- useWriteContract<br>- useAccount |

### 推荐学习路径

#### 第 1 周: Foundry 基础

1. 完成 Foundry Book 的 "Getting Started"
2. 练习编写简单合约和测试
3. 熟悉 `forge` 命令

#### 第 2 周: Viem 基础

1. 阅读 Viem "Getting Started"
2. 练习使用 Public Client 读取链上数据
3. 练习使用 Wallet Client 发送交易

#### 第 3 周: 集成实战

1. 研究本项目的 UserRegistry 合约
2. 理解后端的 Web3 集成
3. 理解前端的 Wagmi 集成

#### 第 4 周: 独立开发

1. 实现一个新的 Story（如 Story 1.8）
2. 编写智能合约
3. 集成到前后端

---

## 快速参考

### Anvil 默认账户

```
账户 #0:
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

账户 #1:
地址: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### 常用命令速查

```bash
# Foundry
forge build                    # 编译
forge test                     # 测试
forge test -vv                 # 详细测试
anvil                          # 启动节点

# Cast
cast call <addr> "<sig>" <args>      # 调用只读函数
cast send <addr> "<sig>" <args>      # 发送交易
cast balance <addr>                  # 查询余额
cast block-number                    # 当前区块

# 项目脚本
./diagnose-connection.sh       # 诊断
./start-dev.sh                 # 启动所有服务
./stop-dev.sh                  # 停止所有服务
```

---

## 总结

### Story 1.7 的关键学习点

1. **Foundry + Viem 是强大的组合**: 快速、类型安全、现代化
2. **本地开发需要 Anvil**: 即时反馈，但重启后数据清空
3. **MetaMask 配置是关键**: 必须手动添加网络配置
4. **自动化很重要**: 使用脚本减少手动操作
5. **类型安全能避免很多问题**: 充分利用 TypeScript

### 避免的主要陷阱

- ❌ 忘记启动 Anvil
- ❌ Anvil 重启后没有重新部署合约
- ❌ MetaMask 没有添加 Anvil 网络
- ❌ 合约地址硬编码且未更新
- ❌ 不使用 TypeScript 类型检查

### 下一步

1. ✅ 确保理解本指南的所有概念
2. ✅ 运行 Story 1.7 的完整流程
3. ✅ 尝试修改 UserRegistry 合约，添加新功能
4. ✅ 准备开发下一个 Story

---

**创建日期**: 2025-10-11  
**基于**: Story 1.7 实战经验  
**维护者**: James (Full Stack Developer)  
**反馈**: 欢迎提问和建议改进

---

## 附录：Story 1.7 问题复盘

### 遇到的主要问题

1. **MetaMask 连接失败**
   - 原因: 未添加 Anvil 网络
   - 解决: 创建 `add-anvil-network.html`

2. **500 错误（无法连接 RPC）**
   - 原因: Anvil 未运行
   - 解决: 创建 `start-dev.sh` 自动启动

3. **合约地址变化**
   - 原因: Anvil 重启清空数据
   - 解决: `start-dev.sh` 自动重新部署并更新配置

### 创建的工具

- ✅ `diagnose-connection.sh` - 自动诊断
- ✅ `add-anvil-network.html` - 一键添加网络
- ✅ `start-dev.sh` / `stop-dev.sh` - 服务管理
- ✅ 完整文档 - 避免他人重复踩坑

这些工具和文档将极大提升未来的开发效率！
