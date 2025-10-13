# 🎯 Foundry & Viem 实战练习

**目标**: 通过 10 个递进式练习掌握 Foundry 和 Viem 开发  
**预计时间**: 3-4 小时  
**前置知识**: [FOUNDRY-VIEM-DEVELOPMENT-GUIDE.md](./FOUNDRY-VIEM-DEVELOPMENT-GUIDE.md)

---

## 📚 练习结构

每个练习包含：

- 🎯 **目标**: 你将学到什么
- 📝 **任务**: 具体要做什么
- 💡 **提示**: 帮助你的线索
- ✅ **验证**: 如何确认完成

---

## 练习 1: 环境验证和诊断

### 🎯 目标

熟悉开发环境的检查和诊断流程

### 📝 任务

1. 运行诊断脚本，确保所有服务正常：

   ```bash
   ./diagnose-connection.sh
   ```

2. 如果有服务未运行，使用启动脚本：

   ```bash
   ./start-dev.sh
   ```

3. 手动检查每个服务：

   ```bash
   # 检查 Anvil
   curl -X POST http://127.0.0.1:8545 \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

   # 检查后端
   curl http://localhost:3001/health

   # 检查前端（在浏览器中）
   open http://localhost:3000
   ```

### ✅ 验证

- [ ] 诊断脚本显示 6/6 检查通过
- [ ] Anvil 返回 Chain ID `0x7a69`
- [ ] 后端返回健康状态
- [ ] 前端页面正常加载

---

## 练习 2: Cast 命令行工具

### 🎯 目标

熟悉使用 `cast` 与区块链交互

### 📝 任务

1. 查询 Anvil 的基本信息：

   ```bash
   # 当前区块高度
   cast block-number --rpc-url http://localhost:8545

   # Chain ID
   cast chain-id --rpc-url http://localhost:8545

   # 当前 gas price
   cast gas-price --rpc-url http://localhost:8545
   ```

2. 查询账户信息：

   ```bash
   # 查询账户 #0 的余额（Wei）
   cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
     --rpc-url http://localhost:8545

   # 查询账户 #0 的余额（ETH）
   cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
     --rpc-url http://localhost:8545 \
     --ether

   # 查询账户 #1 的余额
   cast balance 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
     --rpc-url http://localhost:8545 \
     --ether
   ```

3. 发送一笔转账交易：

   ```bash
   # 从账户 #0 向账户 #1 转 1 ETH
   cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
     --value 1ether \
     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
     --rpc-url http://localhost:8545

   # 再次查询账户 #1 余额，应该增加了 1 ETH
   cast balance 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
     --rpc-url http://localhost:8545 \
     --ether
   ```

### 💡 提示

- Anvil 每个账户初始有 10000 ETH
- 转账后余额会变化，但 gas 费用很低（几乎可以忽略）
- 使用 `--ether` 参数可以显示为 ETH 而不是 Wei

### ✅ 验证

- [ ] 能够查询区块高度（应该 > 0）
- [ ] 能够查询账户余额（应该接近 10000 ETH）
- [ ] 转账成功，账户 #1 余额增加

**记录你的结果**:

- 转账前账户 #1 余额: \***\*\_\*\*** ETH
- 转账后账户 #1 余额: \***\*\_\*\*** ETH
- 差值: \***\*\_\*\*** ETH（应该接近 1）

---

## 练习 3: 读取智能合约

### 🎯 目标

使用 `cast` 读取 UserRegistry 合约状态

### 📝 任务

1. 获取 UserRegistry 合约地址：

   ```bash
   cat packages/contracts/deployments.json
   # 记录 UserRegistry 地址
   ```

2. 查询合约代码是否存在：

   ```bash
   # 替换 <CONTRACT_ADDRESS> 为实际地址
   cast code <CONTRACT_ADDRESS> --rpc-url http://localhost:8545

   # 如果返回非空字节码，说明合约已部署
   ```

3. 调用合约的只读函数：

   ```bash
   # 检查账户 #0 是否已注册
   cast call <CONTRACT_ADDRESS> \
     "isRegistered(address)" \
     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
     --rpc-url http://localhost:8545

   # 返回 0x0000...0001 表示 true（已注册）
   # 返回 0x0000...0000 表示 false（未注册）
   ```

4. 查询已注册用户的用户名：
   ```bash
   # 如果账户 #0 已注册，查询用户名
   cast call <CONTRACT_ADDRESS> \
     "getUsername(address)" \
     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
     --rpc-url http://localhost:8545
   ```

### 💡 提示

- 合约地址在 `packages/contracts/deployments.json`
- 如果合约未部署，运行 `./start-dev.sh`
- `cast call` 用于只读函数，不消耗 gas
- 返回值是十六进制编码的

### ✅ 验证

- [ ] 能够查询合约代码（非空）
- [ ] 能够调用 `isRegistered` 函数
- [ ] 理解返回值的含义（true/false）

**记录你的结果**:

- UserRegistry 地址: ****\*\*\*\*****\_****\*\*\*\*****
- 账户 #0 是否已注册: ☐ 是 ☐ 否

---

## 练习 4: 写入智能合约

### 🎯 目标

使用 `cast` 发送交易，修改合约状态

### 📝 任务

1. 注册一个新用户（使用账户 #1）：

   ```bash
   # 使用账户 #1 注册，用户名 "Bob"
   cast send <CONTRACT_ADDRESS> \
     "register(string)" \
     "Bob" \
     --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d \
     --rpc-url http://localhost:8545
   ```

2. 验证注册成功：

   ```bash
   # 检查账户 #1 是否已注册
   cast call <CONTRACT_ADDRESS> \
     "isRegistered(address)" \
     0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
     --rpc-url http://localhost:8545

   # 查询用户名
   cast call <CONTRACT_ADDRESS> \
     "getUsername(address)" \
     0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
     --rpc-url http://localhost:8545
   ```

3. 尝试重复注册（应该失败）：

   ```bash
   # 再次注册相同账户
   cast send <CONTRACT_ADDRESS> \
     "register(string)" \
     "Bob2" \
     --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d \
     --rpc-url http://localhost:8545

   # 应该返回错误: "User already registered"
   ```

### 💡 提示

- `cast send` 用于发送交易，会消耗 gas
- 交易成功会返回交易哈希
- 如果交易失败，会显示 revert 原因

### ✅ 验证

- [ ] 成功注册账户 #1
- [ ] 能够查询到用户名 "Bob"
- [ ] 重复注册被拒绝（抛出错误）

---

## 练习 5: Viem Public Client（后端）

### 🎯 目标

在后端使用 Viem 读取合约数据

### 📝 任务

创建一个测试脚本 `packages/agent-service/test-viem.ts`:

```typescript
import { createPublicClient, http } from 'viem';
import { anvil } from 'viem/chains';
import UserRegistryABI from './src/abis/UserRegistry.json';

// 创建 Public Client
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// 合约地址（从 deployments.json 获取）
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

async function main() {
  // 1. 检查账户 #0 是否注册
  const isRegistered = await publicClient.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'isRegistered',
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
  });

  console.log('Account #0 is registered:', isRegistered);

  // 2. 如果已注册，获取用户名
  if (isRegistered) {
    const username = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: UserRegistryABI,
      functionName: 'getUsername',
      args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    });

    console.log('Username:', username);
  }

  // 3. 获取当前区块号
  const blockNumber = await publicClient.getBlockNumber();
  console.log('Current block:', blockNumber);

  // 4. 获取账户余额
  const balance = await publicClient.getBalance({
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  });
  console.log('Balance (Wei):', balance);
  console.log('Balance (ETH):', Number(balance) / 1e18);
}

main().catch(console.error);
```

运行脚本：

```bash
cd packages/agent-service
npx tsx test-viem.ts
```

### 💡 提示

- 确保 `tsx` 已安装: `pnpm add -D tsx`
- 确保合约地址正确
- 使用 `as const` 可以获得更好的类型推断

### ✅ 验证

- [ ] 脚本成功运行
- [ ] 能够读取合约状态
- [ ] 能够查询账户余额
- [ ] 输出结果符合预期

---

## 练习 6: Viem Wallet Client（后端）

### 🎯 目标

在后端使用 Viem 发送交易

### 📝 任务

创建脚本 `packages/agent-service/test-viem-write.ts`:

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import UserRegistryABI from './src/abis/UserRegistry.json';

const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// 使用账户 #2 的私钥
const account = privateKeyToAccount(
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
);

const walletClient = createWalletClient({
  account,
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

async function main() {
  console.log('Account:', account.address);

  // 1. 检查是否已注册
  const isRegistered = await publicClient.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'isRegistered',
    args: [account.address],
  });

  console.log('Already registered:', isRegistered);

  if (isRegistered) {
    console.log('User already registered, skipping...');
    return;
  }

  // 2. 模拟交易（不会实际发送）
  console.log('\nSimulating transaction...');
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'register',
    args: ['Charlie'],
    account,
  });

  console.log('Simulation successful!');

  // 3. 发送实际交易
  console.log('\nSending transaction...');
  const hash = await walletClient.writeContract(request);
  console.log('Transaction hash:', hash);

  // 4. 等待确认
  console.log('Waiting for confirmation...');
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Transaction confirmed!');
  console.log('Block number:', receipt.blockNumber);
  console.log('Gas used:', receipt.gasUsed);

  // 5. 验证注册成功
  const username = await publicClient.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'getUsername',
    args: [account.address],
  });

  console.log('\nRegistered username:', username);
}

main().catch(console.error);
```

运行：

```bash
cd packages/agent-service
npx tsx test-viem-write.ts
```

### 💡 提示

- 账户 #2 的地址: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- 先模拟交易可以避免浪费 gas
- `waitForTransactionReceipt` 会阻塞直到交易确认

### ✅ 验证

- [ ] 脚本成功运行
- [ ] 交易被确认
- [ ] 用户名成功注册
- [ ] 理解模拟和实际发送的区别

---

## 练习 7: Wagmi Hooks（前端）

### 🎯 目标

在前端使用 Wagmi Hooks 读取合约

### 📝 任务

创建组件 `packages/web-app/src/components/ContractReader.tsx`:

```typescript
'use client';

import { useReadContract, useAccount } from 'wagmi';
import UserRegistryABI from '@/abis/UserRegistry.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function ContractReader() {
  const { address, isConnected } = useAccount();

  const { data: isRegistered, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
  });

  const { data: username } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'getUsername',
    args: address ? [address] : undefined,
    query: {
      enabled: isRegistered === true, // 只有已注册时才查询
    },
  });

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Contract Reader</h2>
      <p>Your address: {address}</p>
      <p>Registered: {isRegistered ? 'Yes' : 'No'}</p>
      {isRegistered && <p>Username: {username}</p>}
    </div>
  );
}
```

在页面中使用：`packages/web-app/src/app/test/page.tsx`:

```typescript
import { ContractReader } from '@/components/ContractReader';

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Contract Test</h1>
      <ContractReader />
    </div>
  );
}
```

访问: http://localhost:3000/test

### 💡 提示

- 需要先连接 MetaMask 钱包
- `useReadContract` 会自动处理加载和错误状态
- 使用 `query.enabled` 可以条件性地执行查询

### ✅ 验证

- [ ] 页面正常渲染
- [ ] 连接钱包后显示地址
- [ ] 正确显示注册状态
- [ ] 如果已注册，显示用户名

---

## 练习 8: Wagmi 写入合约（前端）

### 🎯 目标

在前端使用 Wagmi 发送交易

### 📝 任务

扩展 `ContractReader` 组件，添加注册功能：

```typescript
'use client';

import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import UserRegistryABI from '@/abis/UserRegistry.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function ContractReader() {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');

  // 读取注册状态
  const { data: isRegistered, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
  });

  // 读取用户名
  const { data: registeredUsername } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    functionName: 'getUsername',
    args: address ? [address] : undefined,
    query: {
      enabled: isRegistered === true,
    },
  });

  // 写入合约
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRegister = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: UserRegistryABI,
      functionName: 'register',
      args: [username],
    });
  };

  // 交易成功后刷新数据
  if (isSuccess) {
    refetch();
  }

  if (!isConnected) {
    return <div className="p-4">Please connect your wallet</div>;
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Contract Reader</h2>

      <div>
        <p className="text-sm text-gray-600">Your address:</p>
        <p className="font-mono">{address}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Registration Status:</p>
        <p className="font-bold">
          {isRegistered ? '✅ Registered' : '❌ Not Registered'}
        </p>
      </div>

      {isRegistered ? (
        <div>
          <p className="text-sm text-gray-600">Username:</p>
          <p className="font-bold">{registeredUsername}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleRegister}
            disabled={isConfirming}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isConfirming ? 'Confirming...' : 'Register'}
          </button>
        </div>
      )}

      {hash && (
        <div className="text-sm">
          <p className="text-gray-600">Transaction Hash:</p>
          <p className="font-mono break-all">{hash}</p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-2 rounded">
          ✅ Transaction confirmed!
        </div>
      )}
    </div>
  );
}
```

### 💡 提示

- `useWriteContract` 返回 `writeContract` 函数
- `useWaitForTransactionReceipt` 自动等待交易确认
- 交易成功后需要 `refetch()` 刷新数据

### ✅ 验证

- [ ] 能够输入用户名
- [ ] 点击注册触发 MetaMask 签名
- [ ] 交易确认后显示成功消息
- [ ] 页面自动刷新显示注册状态

---

## 练习 9: 监听合约事件

### 🎯 目标

学习监听和响应合约事件

### 📝 任务

1. 首先，确保 UserRegistry 合约发出事件：

```solidity
// src/UserRegistry.sol
event UserRegistered(address indexed user, string username, uint256 timestamp);

function register(string memory _username) public {
  require(!isRegistered[msg.sender], 'User already registered');

  users[msg.sender] = User({ username: _username, registeredAt: block.timestamp });
  isRegistered[msg.sender] = true;

  emit UserRegistered(msg.sender, _username, block.timestamp);
}
```

2. 后端监听事件脚本 `packages/agent-service/test-events.ts`:

```typescript
import { createPublicClient, http } from 'viem';
import { anvil } from 'viem/chains';
import UserRegistryABI from './src/abis/UserRegistry.json';

const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

async function main() {
  console.log('Listening for UserRegistered events...\n');

  // 监听事件
  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: UserRegistryABI,
    eventName: 'UserRegistered',
    onLogs: (logs) => {
      logs.forEach((log) => {
        console.log('🎉 New user registered!');
        console.log('  User:', log.args.user);
        console.log('  Username:', log.args.username);
        console.log('  Timestamp:', new Date(Number(log.args.timestamp) * 1000).toISOString());
        console.log('  Block:', log.blockNumber);
        console.log('  Tx:', log.transactionHash);
        console.log('');
      });
    },
  });

  // 运行 60 秒后停止
  setTimeout(() => {
    unwatch();
    console.log('Stopped listening.');
    process.exit(0);
  }, 60000);
}

main().catch(console.error);
```

3. 测试：
   - 运行监听脚本: `npx tsx test-events.ts`
   - 在另一个终端或前端注册新用户
   - 观察事件输出

### 💡 提示

- 事件监听是异步的
- `watchContractEvent` 返回一个取消监听的函数
- 可以同时监听多个事件

### ✅ 验证

- [ ] 监听脚本成功运行
- [ ] 注册用户时收到事件通知
- [ ] 事件数据正确显示

---

## 练习 10: 完整的 E2E 测试

### 🎯 目标

整合所有知识，实现一个完整的功能

### 📝 任务

实现一个"更新用户名"功能：

1. **合约层**: 添加 `updateUsername` 函数

```solidity
// src/UserRegistry.sol
event UsernameUpdated(address indexed user, string oldUsername, string newUsername);

function updateUsername(string memory _newUsername) public {
  require(isRegistered[msg.sender], 'User not registered');
  require(bytes(_newUsername).length > 0, 'Username cannot be empty');

  string memory oldUsername = users[msg.sender].username;
  users[msg.sender].username = _newUsername;

  emit UsernameUpdated(msg.sender, oldUsername, _newUsername);
}
```

2. **测试**: 编写 Foundry 测试

```solidity
// test/UserRegistry.t.sol
function testUpdateUsername() public {
  // 先注册
  registry.register('Alice');

  // 更新用户名
  registry.updateUsername('Alice2');

  // 验证更新成功
  string memory username = registry.getUsername(address(this));
  assertEq(username, 'Alice2');
}

function testUpdateUsernameNotRegistered() public {
  vm.expectRevert('User not registered');
  registry.updateUsername('Bob');
}
```

3. **后端 API**: 添加更新端点

```typescript
// src/routes/users.ts
fastify.patch('/users/:address', async (request, reply) => {
  const { address } = request.params;
  const { username } = request.body;

  // 调用合约更新
  const { request: contractRequest } = await publicClient.simulateContract({
    address: USER_REGISTRY_ADDRESS,
    abi: UserRegistryABI,
    functionName: 'updateUsername',
    args: [username],
    account: walletClient.account,
  });

  const hash = await walletClient.writeContract(contractRequest);
  await publicClient.waitForTransactionReceipt({ hash });

  // 更新数据库
  await prisma.user.update({
    where: { walletAddress: address.toLowerCase() },
    data: { username },
  });

  return { success: true, hash };
});
```

4. **前端**: 添加更新 UI

```typescript
// components/UpdateUsername.tsx
export function UpdateUsername() {
  const [newUsername, setNewUsername] = useState('');
  const { writeContract, data: hash } = useWriteContract();

  const handleUpdate = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: UserRegistryABI,
      functionName: 'updateUsername',
      args: [newUsername],
    });
  };

  return (
    <div>
      <input
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="New username"
      />
      <button onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}
```

### ✅ 验证

完整测试流程：

1. [ ] 合约编译成功: `forge build`
2. [ ] 测试通过: `forge test --match-test testUpdate`
3. [ ] 重新部署合约: `./start-dev.sh`
4. [ ] 后端 API 工作: 使用 curl 测试
5. [ ] 前端 UI 工作: 在浏览器中测试
6. [ ] E2E 流程完整: 注册 → 更新 → 验证

---

## 🎓 总结和下一步

### 你已经学会了

✅ 环境诊断和问题排查  
✅ 使用 Cast 与区块链交互  
✅ 读写智能合约（命令行）  
✅ 使用 Viem Public Client（后端读取）  
✅ 使用 Viem Wallet Client（后端写入）  
✅ 使用 Wagmi Hooks（前端读取）  
✅ 使用 Wagmi Hooks（前端写入）  
✅ 监听和处理合约事件  
✅ 实现完整的 E2E 功能

### 推荐的后续练习

1. **实现 Story 1.8**: 如果有下一个 Story，尝试独立实现
2. **优化 Gas**: 研究如何减少合约的 gas 消耗
3. **错误处理**: 完善前后端的错误处理逻辑
4. **测试覆盖**: 为合约编写更完整的测试
5. **性能优化**: 使用 React Query 缓存减少 RPC 调用

### 学习资源

- 📖 [Foundry Book](https://book.getfoundry.sh/)
- 📖 [Viem Docs](https://viem.sh/)
- 📖 [Wagmi Docs](https://wagmi.sh/)
- 🎥 [Foundry Tutorial](https://www.youtube.com/watch?v=uelA7U_Kzs0)
- 💬 [Discord: Foundry](https://discord.gg/foundry)

---

## 📝 练习记录表

记录你的完成情况：

| 练习           | 完成日期     | 难度     | 用时     | 笔记                     |
| -------------- | ------------ | -------- | -------- | ------------------------ |
| 1. 环境验证    | **\_\_\_\_** | ⭐       | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 2. Cast 命令   | **\_\_\_\_** | ⭐       | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 3. 读取合约    | **\_\_\_\_** | ⭐⭐     | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 4. 写入合约    | **\_\_\_\_** | ⭐⭐     | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 5. Viem Public | **\_\_\_\_** | ⭐⭐     | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 6. Viem Wallet | **\_\_\_\_** | ⭐⭐⭐   | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 7. Wagmi Read  | **\_\_\_\_** | ⭐⭐⭐   | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 8. Wagmi Write | **\_\_\_\_** | ⭐⭐⭐   | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 9. 事件监听    | **\_\_\_\_** | ⭐⭐⭐   | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |
| 10. E2E 测试   | **\_\_\_\_** | ⭐⭐⭐⭐ | \_\_\_\_ | **\*\***\_\_\_\_**\*\*** |

---

**创建日期**: 2025-10-11  
**基于**: Story 1.7 实战经验  
**预计完成时间**: 3-4 小时  
**维护者**: James (Full Stack Developer)

祝你学习愉快！🚀 如有问题，随时查看文档或运行诊断脚本。
