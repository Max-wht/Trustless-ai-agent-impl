# CI/CD 部署策略详解

## 📚 目录

1. [核心原则](#核心原则)
2. [环境架构](#环境架构)
3. [智能合约部署策略](#智能合约部署策略)
4. [CI/CD 工作流](#cicd-工作流)
5. [浏览器连接方式](#浏览器连接方式)
6. [常见问题](#常见问题)

---

## 🎯 核心原则

### ⚠️ **重要**: CI/CD **不部署**智能合约到区块链

**为什么？**

1. **安全性**: 部署需要私钥，不应存储在 CI/CD 环境中
2. **成本控制**: 每次 push 都部署会浪费 gas 费
3. **审核流程**: 智能合约部署需要人工审核和批准
4. **不可逆性**: 智能合约一旦部署无法删除，需谨慎操作

### ✅ CI/CD 的职责

- ✅ 代码质量检查（Lint）
- ✅ 编译智能合约（`forge build`）
- ✅ 运行测试（`forge test`）
- ✅ 安全分析（Slither）
- ✅ 代码覆盖率报告
- ✅ 构建前端和后端
- ✅ 部署前端到 Vercel Preview
- ❌ **不部署智能合约**

---

## 🌍 环境架构

### 1. 本地开发环境（Local Development）

**区块链**: Anvil 本地节点

```
开发者机器
├── Anvil (localhost:8545, Chain ID: 31337)
│   └── 临时状态，重启后清空
├── 后端 (localhost:4000)
│   └── 连接到 localhost:8545
└── 前端 (localhost:3000)
    └── 通过 MetaMask 连接到 localhost:8545
```

**特点**:

- ⚡ 即时确认（0 秒区块时间）
- 💰 免费（无 gas 费）
- 🔄 重启后数据丢失
- 👤 仅开发者本人可访问

**如何启动**:

```bash
# 终端 1: 启动 Anvil
anvil

# 终端 2: 部署合约
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --broadcast

# 终端 3: 启动后端
pnpm --filter @trustless/agent-service dev

# 终端 4: 启动前端
pnpm --filter @trustless/web-app dev
```

**MetaMask 配置**:

- Network Name: `Anvil Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

---

### 2. CI/CD 环境（GitHub Actions）

**区块链**: **无**（不部署合约）

```
GitHub Actions Runner
├── 编译合约 (forge build)
├── 测试合约 (forge test)
├── 安全分析 (Slither)
├── 构建前端/后端
└── 部署前端到 Vercel Preview
```

**特点**:

- 🔍 只验证代码质量
- 🚫 不部署智能合约
- 📊 生成测试报告和覆盖率
- 🔒 不需要私钥

**工作流**:

1. **ci.yml**: Lint + Build + Type Check
2. **contract-test.yml**: Foundry Tests + Slither
3. **deploy-staging.yml**: Vercel 前端部署

---

### 3. Staging 环境（测试环境）

**区块链**: 公共测试网（如 Arbitrum Sepolia）

```
公共测试网 (Arbitrum Sepolia)
├── 合约地址: 0x1234... (固定)
│   └── 永久存储，所有人可访问
├── 后端 (AWS ECS Staging)
│   └── 连接到测试网 RPC
└── 前端 (Vercel Preview)
    └── 通过 MetaMask 连接到测试网
```

**特点**:

- 🌐 公开可访问
- 💾 永久存储
- 💵 需要测试币（免费获取）
- 👥 团队共享

**如何部署合约（手动）**:

```bash
# 1. 配置环境变量
export PRIVATE_KEY="your_private_key"
export ARBITRUM_SEPOLIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# 2. 部署合约
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# 3. 记录合约地址
# 输出: UserRegistry deployed at: 0xABCD...

# 4. 更新配置文件
# 编辑 deployments.json
{
  "421614": {  // Arbitrum Sepolia Chain ID
    "chainName": "Arbitrum Sepolia",
    "contracts": {
      "UserRegistry": "0xABCD..."
    }
  }
}

# 5. 更新环境变量（Vercel, AWS）
# NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0xABCD...
# NEXT_PUBLIC_CHAIN_ID=421614
```

**前端部署**:

- Vercel 自动部署（GitHub 集成）
- 环境变量配置测试网 RPC 和合约地址

**MetaMask 配置**:

- Network: `Arbitrum Sepolia`（内置）
- Chain ID: `421614`

---

### 4. Production 环境（生产环境）

**区块链**: Arbitrum 主网

```
Arbitrum 主网
├── 合约地址: 0x5678... (固定)
│   └── 不可变，永久存储
├── 后端 (AWS ECS Production)
│   └── 连接到 Arbitrum RPC
└── 前端 (Vercel Production)
    └── 通过 MetaMask 连接到 Arbitrum
```

**特点**:

- 💰 需要真实 ETH
- 🔒 不可逆操作
- 🌍 全球可访问
- ⚡ 最终用户使用

**部署流程**（严格控制）:

```bash
# ⚠️ 生产部署需要多重审核！

# 1. 代码审计
# 2. 安全审查
# 3. 多签批准
# 4. 部署合约（使用多签钱包）
# 5. 验证合约
# 6. 更新前端环境变量
# 7. 灰度发布
```

---

## 🔗 智能合约部署策略

### 部署时机

| 环境           | 何时部署       | 谁来部署         | 如何部署                     |
| -------------- | -------------- | ---------------- | ---------------------------- |
| **Local**      | 每次重启 Anvil | 开发者           | `forge script`               |
| **CI/CD**      | **永不部署**   | N/A              | N/A                          |
| **Staging**    | Feature 测试前 | DevOps/Tech Lead | `forge script` + 手动验证    |
| **Production** | Release 后     | 多签钱包         | Gnosis Safe + `forge script` |

### 部署检查清单

**Staging 部署前**:

- [ ] 所有测试通过（`forge test`）
- [ ] 安全分析无高危漏洞（Slither）
- [ ] 代码审查完成
- [ ] Gas 优化完成
- [ ] 更新部署文档

**Production 部署前**:

- [ ] Staging 环境验证 7 天+
- [ ] 外部安全审计
- [ ] 多签钱包准备
- [ ] 紧急暂停机制测试
- [ ] 回滚计划准备
- [ ] 用户公告发布

---

## 🌐 浏览器连接方式

### 连接流程

```
用户浏览器
  └── 前端应用 (React)
       └── Web3 Provider (Viem)
            └── MetaMask
                 └── RPC URL
                      └── 区块链节点
```

### 不同环境的连接配置

#### 1. 本地开发

**前端配置** (`packages/web-app/.env.local`):

```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**MetaMask**:

- 手动添加 Anvil 网络
- 导入测试账户私钥

**连接过程**:

1. 用户访问 `localhost:3000`
2. 点击 "Connect Wallet"
3. MetaMask 弹出，选择 Anvil Local 网络
4. 批准连接
5. 前端通过 `localhost:8545` 与 Anvil 通信

#### 2. Staging

**前端配置** (Vercel 环境变量):

```env
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0x部署的合约地址
```

**MetaMask**:

- 使用内置的 Arbitrum Sepolia 网络
- 或添加自定义 RPC（Infura, Alchemy）

**连接过程**:

1. 用户访问 Vercel Preview URL
2. 点击 "Connect Wallet"
3. MetaMask 检测到需要 Arbitrum Sepolia
4. 提示切换网络
5. 用户批准后连接成功
6. 所有用户共享同一个区块链状态

#### 3. Production

**前端配置** (Vercel Production 环境变量):

```env
NEXT_PUBLIC_RPC_URL=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_CHAIN_ID=42161
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0x生产合约地址
```

**MetaMask**:

- 使用 Arbitrum One 主网

**连接过程**:

- 与 Staging 类似，但使用主网
- 需要真实 ETH 进行交易

---

## 🔧 CI/CD 工作流详解

### 1. ci.yml - 主 CI 流程

**触发时机**: 每次 push 到 `main` 或 `develop`，或创建 PR

**步骤**:

```yaml
jobs:
  lint:
    - Checkout (with submodules!) ← 关键！
    - Install pnpm
    - Install dependencies
    - Run lint

  build:
    - Checkout (with submodules!)
    - Install Foundry ← 新增！
    - Install pnpm & dependencies
    - Generate Prisma client
    - Build shared package
    - Build all packages (including contracts)
    - Upload artifacts

  typecheck:
    - Checkout (with submodules!)
    - Install pnpm & dependencies
    - Build shared package
    - Generate Prisma client
    - Type check all packages

  ci-success:
    - Check all jobs passed
    - Required for branch protection
```

**关键修复**:

1. ✅ 所有 jobs 都设置 `submodules: recursive`
2. ✅ Build job 安装 Foundry
3. ✅ 移除 `TURBO_FORCE`，让 contracts 正常构建
4. ✅ Typecheck 前先构建 shared 包

### 2. contract-test.yml - 智能合约测试

**触发时机**: 仅当 `packages/contracts/**` 变更时

**步骤**:

```yaml
jobs:
  foundry-tests:
    - Checkout (with submodules!)
    - Install Foundry
    - forge build --sizes
    - forge test -vvv
    - forge test --gas-report
    - forge coverage
    - Upload to Codecov

  slither-analysis:
    - Install Slither
    - Run security analysis
    - Upload report
```

**不做什么**:

- ❌ 不部署合约
- ❌ 不需要私钥
- ❌ 不连接真实区块链

### 3. deploy-staging.yml - Staging 部署

**触发时机**: Push 到 `develop` 分支

**步骤**:

```yaml
jobs:
  deploy-frontend:
    - Deploy to Vercel Preview
    - Comment PR with preview URL

  # 未来可添加
  deploy-backend:
    - Deploy to AWS ECS Staging
    - Run database migrations
    - Health check
```

**智能合约部署**:

- ❌ 不在 CI/CD 中自动部署
- ✅ 需要手动运行 `forge script` 命令
- ✅ 部署后更新环境变量

---

## ❓ 常见问题

### Q1: 为什么 CI 中 forge build 失败？

**A**: Git submodules 没有初始化

**解决**:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive # ← 必须添加！
```

### Q2: 本地能构建，CI 中失败？

**A**: 可能的原因：

1. 缺少 `submodules: recursive`
2. 缺少 Foundry 安装步骤
3. 缓存问题

**调试**:

```yaml
- name: Debug info
  run: |
    ls -la packages/contracts/lib/
    forge --version
    which forge
```

### Q3: 如何在 Staging 环境部署合约？

**A**: **手动部署**，不通过 CI/CD

```bash
# 本地执行
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url $STAGING_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify

# 记录输出的合约地址
# 更新 Vercel/AWS 环境变量
# 重新部署前端/后端应用
```

### Q4: 用户如何连接到区块链？

**A**: 通过 MetaMask

**流程**:

1. 前端检测 MetaMask
2. 请求连接 (`eth_requestAccounts`)
3. 检查 Chain ID
4. 如果不匹配，请求切换网络
5. 连接成功后，前端可以：
   - 读取区块链数据（通过 RPC）
   - 发送交易（通过 MetaMask 签名）

### Q5: Anvil 数据丢失怎么办？

**A**: 这是正常的！Anvil 是临时测试节点

**解决方案**:

1. **开发环境**: 重新部署即可

   ```bash
   ./start-dev.sh  # 自动部署
   ```

2. **持久化需求**: 使用测试网
   ```bash
   # 部署到 Arbitrum Sepolia
   # 数据永久保存
   ```

### Q6: 如何验证 CI 修复是否成功？

**A**: 创建 PR 或 Push 到分支

```bash
# 提交修改
git add .github/workflows/ci.yml
git commit -m "fix: Add Foundry to CI build job"
git push

# 查看 GitHub Actions
# https://github.com/your-repo/actions
```

**检查点**:

- ✅ Submodules 正确克隆
- ✅ Foundry 安装成功
- ✅ `forge build` 通过
- ✅ `pnpm build` 通过
- ✅ 所有测试通过

---

## 📝 总结

### 核心要点

1. **CI/CD 不部署智能合约** - 只验证代码质量
2. **智能合约手动部署** - 需要人工审核和批准
3. **不同环境使用不同区块链**:
   - Local: Anvil (临时)
   - Staging: 测试网 (永久)
   - Production: 主网 (永久)
4. **浏览器通过 MetaMask 连接** - 配置不同的 RPC URL
5. **Git submodules 很重要** - CI 中必须设置 `submodules: recursive`

### 最佳实践

- ✅ 本地开发使用 Anvil
- ✅ CI/CD 只做测试和构建
- ✅ Staging 用于团队测试
- ✅ Production 谨慎部署
- ✅ 所有合约部署都要文档记录
- ✅ 使用多签钱包管理生产合约

---

**最后更新**: 2025-10-13  
**作者**: Dev Agent  
**状态**: ✅ Active
