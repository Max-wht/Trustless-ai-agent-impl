# 源代码树 / Source Tree

本文档描述 Trustless SocialFi 项目的完整源代码组织结构，包括每个目录和关键文件的用途说明。

_This document describes the complete source code organization structure of the Trustless SocialFi project, including the purpose of each directory and key files._

---

## 项目根目录 / Project Root

```
trustless-socialfi/
├── .github/                          # GitHub 配置 / GitHub configuration
├── apps/                             # 可部署应用 / Deployable applications
├── packages/                         # 可复用包 / Reusable packages
├── infrastructure/                   # 基础设施代码 / Infrastructure code
├── scripts/                          # 自动化脚本 / Automation scripts
├── docs/                             # 项目文档 / Project documentation
├── .bmad-core/                       # BMad 方法论配置 / BMad methodology config
├── .gitignore                        # Git 忽略规则 / Git ignore rules
├── .eslintrc.js                      # ESLint 根配置 / ESLint root config
├── .prettierrc                       # Prettier 配置 / Prettier config
├── docker-compose.yml                # 本地开发服务 / Local dev services
├── package.json                      # 根 package.json / Root package.json
├── pnpm-workspace.yaml               # pnpm 工作空间 / pnpm workspace config
├── turbo.json                        # Turborepo 配置 / Turborepo config
└── README.md                         # 项目说明 / Project README
```

---

## .github/ - GitHub 配置

GitHub Actions 工作流和 Issue 模板。

_GitHub Actions workflows and issue templates._

```
.github/
├── workflows/                        # CI/CD 工作流 / CI/CD workflows
│   ├── ci.yml                        # 持续集成：Lint、测试、构建
│   ├── deploy-staging.yml            # 自动部署到 Staging
│   ├── deploy-production.yml         # 手动部署到生产环境
│   ├── contract-test.yml             # Foundry 智能合约测试
│   └── docs.yml                      # API 文档自动生成和发布
├── ISSUE_TEMPLATE/                   # Issue 模板
│   ├── bug_report.md
│   ├── feature_request.md
│   └── epic.md
└── PULL_REQUEST_TEMPLATE.md          # PR 模板
```

**关键文件说明 / Key Files:**

- **ci.yml**: 每次 push/PR 触发，运行所有测试和 lint 检查
- **deploy-staging.yml**: develop 分支自动部署到 Staging 环境
- **deploy-production.yml**: main 分支手动触发，部署到生产环境

---

## apps/ - 可部署应用

包含两个主要应用：Web 前端和 API 后端。

_Contains two main applications: Web frontend and API backend._

### apps/web/ - Next.js 前端应用

```
apps/web/
├── public/                           # 静态资源 / Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 路由组：需认证页面 / Route group: authenticated
│   │   │   ├── feed/
│   │   │   │   └── page.tsx          # 时间线页面 / Timeline feed
│   │   │   ├── profile/[address]/
│   │   │   │   └── page.tsx          # 用户主页 / User profile
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx          # Agent 列表 / Agent directory
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx      # Agent 注册 / Agent registration
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Agent 详情 / Agent details
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx          # 用户偏好管理 / User preferences
│   │   │   └── governance/
│   │   │       ├── page.tsx          # DAO 提案列表 / DAO proposals
│   │   │       ├── create/
│   │   │       │   └── page.tsx      # 创建提案 / Create proposal
│   │   │       └── [id]/
│   │   │           └── page.tsx      # 提案详情 / Proposal details
│   │   │
│   │   ├── posts/[id]/
│   │   │   └── page.tsx              # 帖子详情页 / Post details
│   │   │
│   │   ├── layout.tsx                # 根布局 / Root layout
│   │   ├── page.tsx                  # 落地页 / Landing page
│   │   ├── providers.tsx             # 全局 Providers (Wagmi, React Query)
│   │   ├── globals.css               # 全局样式 / Global styles
│   │   └── error.tsx                 # 全局错误页 / Global error page
│   │
│   ├── components/                   # React 组件 / React components
│   │   ├── ui/                       # shadcn/ui 原语 / Primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (30+ shadcn components)
│   │   │
│   │   ├── atoms/                    # 原子组件 / Atomic components
│   │   │   ├── WalletAddress.tsx     # 钱包地址显示（缩写格式）
│   │   │   ├── ReputationBadge.tsx   # 信誉徽章（星级显示）
│   │   │   ├── LoadingSpinner.tsx    # 加载动画
│   │   │   ├── StatusBadge.tsx       # 状态徽章（Pending/Approved/Rejected）
│   │   │   └── IPFSHashDisplay.tsx   # IPFS 哈希显示（可点击）
│   │   │
│   │   ├── molecules/                # 分子组件 / Molecular components
│   │   │   ├── PostCard.tsx          # 帖子卡片（作者+内容+操作）
│   │   │   ├── UserAvatar.tsx        # 用户头像（Blockies生成）
│   │   │   ├── AgentCard.tsx         # Agent 卡片（信誉+质押）
│   │   │   ├── ProposalCard.tsx      # 提案卡片（投票进度）
│   │   │   ├── CommentItem.tsx       # 评论项
│   │   │   └── NotificationItem.tsx  # 通知项
│   │   │
│   │   └── organisms/                # 有机组件 / Organism components
│   │       ├── Feed.tsx              # 时间线 Feed（无限滚动）
│   │       ├── ModerationPanel.tsx   # 审核详情面板（5个Agent判断）
│   │       ├── ProposalList.tsx      # 提案列表（Tab切换）
│   │       ├── Navigation.tsx        # 导航栏（Logo+搜索+钱包）
│   │       ├── UserProfileHeader.tsx # 用户主页头部
│   │       └── PreferencesManager.tsx # 偏好管理（Tag编辑）
│   │
│   ├── hooks/                        # 自定义 React Hooks
│   │   ├── useAuth.ts                # 认证状态和钱包连接
│   │   ├── useContracts.ts           # 智能合约交互总入口
│   │   ├── usePosts.ts               # 帖子相关操作（CRUD）
│   │   ├── useAgents.ts              # Agent 查询和注册
│   │   ├── useGovernance.ts          # DAO 提案和投票
│   │   ├── useIPFS.ts                # IPFS 上传和检索
│   │   └── useReputation.ts          # 信誉查询和计算
│   │
│   ├── services/                     # API 服务层 / API service layer
│   │   ├── posts.ts                  # 帖子 API（usePosts内部调用）
│   │   ├── users.ts                  # 用户 API
│   │   ├── agents.ts                 # Agent API
│   │   ├── governance.ts             # 治理 API
│   │   └── preferences.ts            # 偏好 API
│   │
│   ├── stores/                       # Zustand 状态存储 / Zustand stores
│   │   ├── authStore.ts              # 认证状态（token, user）
│   │   └── uiStore.ts                # UI 状态（sidebar, modals）
│   │
│   ├── lib/                          # 工具库 / Utility libraries
│   │   ├── apiClient.ts              # HTTP 客户端（fetch wrapper）
│   │   ├── utils.ts                  # 通用工具函数
│   │   ├── web3.ts                   # Web3 工具（viem配置）
│   │   ├── constants.ts              # 常量定义
│   │   └── format.ts                 # 格式化函数（地址、时间、数字）
│   │
│   └── styles/                       # 样式文件 / Style files
│       └── globals.css               # Tailwind 基础样式
│
├── __tests__/                        # 测试文件 / Test files
│   ├── components/                   # 组件测试
│   ├── hooks/                        # Hooks 测试
│   └── e2e/                          # Playwright E2E 测试
│       ├── auth.spec.ts              # 钱包连接和认证
│       ├── post-creation.spec.ts     # 发帖流程
│       └── moderation.spec.ts        # 审核流程
│
├── .env.local.example                # 环境变量模板
├── next.config.js                    # Next.js 配置
├── tailwind.config.ts                # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
├── vitest.config.ts                  # Vitest 测试配置
├── playwright.config.ts              # Playwright E2E 配置
├── package.json
└── README.md
```

**关键文件用途 / Key File Purposes:**

- **app/providers.tsx**: Wagmi、RainbowKit、React Query Providers 配置
- **hooks/useAuth.ts**: 统一的认证逻辑（连接钱包、签名、JWT）
- **lib/apiClient.ts**: 所有 API 请求的中心化客户端（自动附加 JWT）
- **stores/authStore.ts**: 认证状态持久化到 localStorage

---

### apps/api/ - Fastify 后端应用

```
apps/api/
├── src/
│   ├── routes/                       # API 路由处理器 / API route handlers
│   │   ├── auth.routes.ts            # POST /auth/nonce, /auth/verify
│   │   ├── users.routes.ts           # 用户 CRUD / User CRUD
│   │   ├── posts.routes.ts           # 帖子 CRUD / Post CRUD
│   │   ├── agents.routes.ts          # Agent 管理 / Agent management
│   │   ├── ipfs.routes.ts            # IPFS 上传/检索 / IPFS upload/retrieve
│   │   ├── governance.routes.ts      # DAO 提案和投票 / DAO proposals
│   │   └── preferences.routes.ts     # 用户偏好 / User preferences
│   │
│   ├── services/                     # 业务逻辑层 / Business logic layer
│   │   ├── AgentOrchestrator.ts      # 核心：监听事件，协调Agent审核
│   │   ├── IPFSService.ts            # IPFS 上传（Pinata + Web3.Storage）
│   │   ├── ModerationService.ts      # OpenAI 内容审核
│   │   ├── ReputationService.ts      # 信誉计算逻辑
│   │   ├── BlockchainService.ts      # 区块链交互（viem）
│   │   ├── AuthService.ts            # Nonce生成、签名验证、JWT
│   │   └── TagGeneratorService.ts    # 个性化Tag生成（行为分析）
│   │
│   ├── repositories/                 # 数据访问层 / Data access layer
│   │   ├── UserRepository.ts         # User 表操作
│   │   ├── PostRepository.ts         # Post 表操作
│   │   ├── AgentRepository.ts        # Agent 表操作
│   │   ├── ProposalRepository.ts     # Proposal 表操作
│   │   └── BaseRepository.ts         # 基础仓储类（事务支持）
│   │
│   ├── middleware/                   # Fastify 中间件 / Fastify middleware
│   │   ├── auth.ts                   # JWT 验证中间件
│   │   ├── rateLimit.ts              # 限流中间件（Redis）
│   │   ├── validation.ts             # 请求验证（Zod）
│   │   ├── errorHandler.ts           # 全局错误处理器
│   │   ├── logger.ts                 # 请求日志中间件
│   │   └── metrics.ts                # Prometheus 指标收集
│   │
│   ├── lib/                          # 核心工具库 / Core utilities
│   │   ├── prisma.ts                 # Prisma Client 单例
│   │   ├── redis.ts                  # Redis Client 配置
│   │   ├── logger.ts                 # Pino 日志配置
│   │   ├── web3.ts                   # viem Clients（Public/Wallet）
│   │   ├── retry.ts                  # 重试逻辑（指数退避）
│   │   ├── circuitBreaker.ts         # 熔断器（OpenAI API）
│   │   └── cache.ts                  # Redis 缓存 wrapper
│   │
│   ├── config/                       # 配置文件 / Configuration files
│   │   ├── env.ts                    # 环境变量验证（Zod）
│   │   ├── moderation-rules.ts       # 合规规则（初始版本）
│   │   ├── contracts.ts              # 合约地址和ABI导入
│   │   └── constants.ts              # 常量定义
│   │
│   ├── types/                        # 类型定义 / Type definitions
│   │   ├── fastify.d.ts              # Fastify 类型扩展（request.user）
│   │   ├── express.d.ts              # Express 类型（如果使用）
│   │   └── index.ts                  # 导出所有自定义类型
│   │
│   ├── jobs/                         # 后台任务 / Background jobs
│   │   ├── syncAgents.ts             # 定时同步Agent数据（5分钟）
│   │   ├── calculateRewards.ts       # 每日计算奖励
│   │   ├── applyDecay.ts             # 每周应用时间衰减
│   │   └── generateTags.ts           # 每周生成个性化Tag
│   │
│   └── index.ts                      # 服务器入口点 / Server entry point
│
├── prisma/                           # Prisma ORM
│   ├── schema.prisma                 # 数据库 Schema 定义
│   ├── migrations/                   # 数据库迁移历史
│   │   ├── 001_initial/
│   │   │   └── migration.sql
│   │   ├── 002_add_agents/
│   │   │   └── migration.sql
│   │   └── ... (按时间顺序)
│   └── seed.ts                       # 数据库种子数据
│
├── __tests__/                        # 测试文件 / Test files
│   ├── routes/                       # 路由测试（API端点）
│   │   ├── auth.routes.test.ts
│   │   ├── posts.routes.test.ts
│   │   └── agents.routes.test.ts
│   ├── services/                     # 服务测试
│   │   ├── IPFSService.test.ts
│   │   └── ModerationService.test.ts
│   ├── repositories/                 # 仓储测试
│   │   └── PostRepository.test.ts
│   └── integration/                  # 集成测试
│       └── post-creation-flow.test.ts
│
├── .env.example                      # 环境变量模板
├── Dockerfile                        # 生产环境 Docker 镜像
├── docker-compose.yml                # 本地开发服务（PostgreSQL, Redis）
├── tsconfig.json
├── jest.config.js                    # Jest 测试配置
├── package.json
└── README.md
```

**关键服务说明 / Key Services:**

**AgentOrchestrator.ts** (核心服务 / Core Service):

```typescript
// 职责：监听区块链事件，协调整个审核流程
// Responsibility: Listen to blockchain events, coordinate moderation flow

export class AgentOrchestrator {
  // 1. 监听 AgentsSelected 事件
  async startEventListener() {}

  // 2. 并行调用5个Agent服务
  async handleModeration(contentId, agents) {}

  // 3. 提交判断到智能合约
  async submitJudgments(contentId, judgments) {}
}
```

**IPFSService.ts**:

```typescript
// 职责：IPFS 上传和检索，双Pinning
// Responsibility: IPFS upload/retrieve, dual pinning

export class IPFSService {
  async uploadContent(content: string): Promise<string>; // 返回 IPFS hash
  async retrieveContent(ipfsHash: string): Promise<string>; // 从IPFS获取
  async unpinContent(ipfsHash: string): Promise<void>; // GDPR 删除
}
```

---

## packages/ - 可复用包

共享代码库，被 apps/ 中的应用导入使用。

_Shared code libraries imported by applications in apps/._

### packages/contracts/ - Foundry 智能合约

```
packages/contracts/
├── src/                              # Solidity 合约源码 / Solidity contracts
│   ├── TrustToken.sol                # ERC-20 原生代币（1亿总量）
│   ├── UserRegistry.sol              # 用户注册和档案
│   ├── AgentRegistry.sol             # Agent 注册和质押
│   ├── ContentRegistry.sol           # 内容元数据注册
│   ├── AgentSelector.sol             # VRF 随机Agent选择
│   ├── ModerationWorkflow.sol        # 审核工作流和共识
│   ├── ReputationSystem.sol          # 信誉计算和时间衰减
│   ├── SocialGraph.sol               # 社交关系（关注、点赞）
│   ├── Governance.sol                # DAO 治理（提案、投票）
│   ├── ModerationRules.sol           # 合规规则存储
│   └── RewardDistributor.sol         # 奖励分配系统
│
├── test/                             # Foundry 测试 / Foundry tests
│   ├── TrustToken.t.sol
│   ├── AgentRegistry.t.sol
│   ├── ModerationWorkflow.t.sol      # 核心：测试加权共识算法
│   ├── AgentSelector.t.sol           # 测试VRF随机选择
│   ├── ReputationSystem.t.sol
│   └── ... (每个合约对应一个测试)
│
├── script/                           # 部署脚本 / Deployment scripts
│   ├── Deploy.s.sol                  # 主部署脚本（所有合约）
│   ├── DeployLocal.s.sol             # 本地Anvil部署
│   ├── Verify.s.sol                  # Arbiscan 合约验证
│   └── TransferGovernance.s.sol      # 治理权移交脚本
│
├── lib/                              # 合约依赖 / Contract dependencies
│   └── openzeppelin-contracts/       # OpenZeppelin（通过forge install）
│
├── out/                              # 编译输出 / Compilation output
│   └── ... (ABI JSON 文件)
│
├── foundry.toml                      # Foundry 配置
├── remappings.txt                    # 导入映射
├── .env.example
└── README.md
```

**合约交互关系图 / Contract Interaction Diagram:**

```
用户操作                      智能合约调用链
UserRegistry  ← 用户注册
AgentRegistry ← Agent注册 → TrustToken (质押转账)
ContentRegistry ← 发布帖子 → AgentSelector (请求VRF)
AgentSelector → Chainlink VRF → fulfillRandomWords (回调)
                ↓
AgentsSelected事件 → 后端监听
                ↓
ModerationWorkflow ← Agent提交判断 ← 后端代理
ModerationWorkflow → ReputationSystem (更新信誉)
                   → ContentRegistry (更新状态)
SocialGraph ← 关注、点赞
Governance ← 创建提案、投票 → ModerationRules (更新规则)
```

---

### packages/shared/ - 共享类型和工具

```
packages/shared/
├── src/
│   ├── types/                        # TypeScript 类型定义
│   │   ├── user.ts                   # User 接口
│   │   ├── post.ts                   # Post, Comment 接口
│   │   ├── agent.ts                  # Agent, AgentJudgment 接口
│   │   ├── proposal.ts               # Proposal, Vote 接口
│   │   └── api.ts                    # API 请求/响应类型
│   │
│   ├── contracts/                    # 合约 ABI 和地址
│   │   ├── abis/                     # 从 Foundry 编译输出生成
│   │   │   ├── TrustToken.ts         # TrustToken ABI
│   │   │   ├── AgentRegistry.ts
│   │   │   ├── ContentRegistry.ts
│   │   │   └── ... (所有合约的ABI)
│   │   │
│   │   └── addresses.ts              # 部署的合约地址
│   │       // export const CONTRACTS = {
│   │       //   TrustToken: { address: '0x...', abi: TrustTokenABI },
│   │       //   AgentRegistry: { ... },
│   │       // }
│   │
│   ├── constants/                    # 共享常量 / Shared constants
│   │   ├── chains.ts                 # 链配置（Arbitrum One/Sepolia）
│   │   ├── config.ts                 # 应用配置
│   │   └── errorCodes.ts             # 错误码常量
│   │
│   ├── utils/                        # 工具函数 / Utility functions
│   │   ├── format.ts                 # formatAddress, formatTokenAmount
│   │   ├── validation.ts             # validateEthAddress, validateIPFSHash
│   │   ├── crypto.ts                 # 加密工具（AES-256）
│   │   └── time.ts                   # formatRelativeTime, calculateDecay
│   │
│   └── index.ts                      # 导出所有 / Export all
│
├── package.json
├── tsconfig.json
└── README.md
```

**类型共享流程 / Type Sharing Flow:**

```
1. 合约编译 (Foundry)
   → out/TrustToken.sol/TrustToken.json

2. 脚本提取ABI
   → packages/shared/src/contracts/abis/TrustToken.ts

3. 前端导入使用
   import { CONTRACTS } from '@trustless/shared';
   useWriteContract({ address: CONTRACTS.TrustToken.address, abi: CONTRACTS.TrustToken.abi })

4. 后端导入使用
   import { CONTRACTS } from '@trustless/shared';
   viem.readContract({ address: CONTRACTS.AgentRegistry.address, ... })
```

---

### packages/ui/ - 共享 UI 组件库

```
packages/ui/
├── src/
│   ├── components/                   # 所有 UI 组件
│   │   ├── primitives/               # shadcn/ui 基础组件（复制到项目）
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── atoms/                    # 项目特定原子组件
│   │   │   └── ... (从 apps/web 提取可复用的)
│   │   │
│   │   └── index.ts                  # 导出所有组件
│   │
│   └── styles/
│       └── globals.css               # 共享基础样式
│
├── tailwind.config.ts                # 共享 Tailwind 配置
├── package.json
└── README.md
```

**用途 / Purpose**: Phase 2 可能开发移动端 App 或桌面 App，UI 组件可复用。

---

### packages/config/ - 共享配置

```
packages/config/
├── eslint/
│   └── index.js                      # 共享 ESLint 配置
├── typescript/
│   ├── base.json                     # 基础 tsconfig
│   ├── nextjs.json                   # Next.js tsconfig
│   └── node.json                     # Node.js tsconfig
└── jest/
    └── jest.config.js                # 共享 Jest 配置
```

**继承关系 / Inheritance:**

```
apps/web/tsconfig.json
  → extends: "@trustless/config/typescript/nextjs.json"
  → extends: "@trustless/config/typescript/base.json"

apps/api/tsconfig.json
  → extends: "@trustless/config/typescript/node.json"
  → extends: "@trustless/config/typescript/base.json"
```

---

## infrastructure/ - 基础设施代码

部署和运维相关的所有配置。

_All deployment and operations-related configuration._

```
infrastructure/
├── terraform/                        # Terraform IaC
│   ├── modules/                      # 可复用模块
│   │   ├── eks/                      # EKS 集群定义
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── rds/                      # PostgreSQL RDS
│   │   ├── elasticache/              # Redis ElastiCache
│   │   ├── networking/               # VPC, Subnets, Security Groups
│   │   └── monitoring/               # CloudWatch, Prometheus
│   │
│   ├── environments/                 # 环境特定配置
│   │   ├── staging/
│   │   │   └── main.tf               # Staging 环境
│   │   └── production/
│   │       └── main.tf               # 生产环境
│   │
│   ├── backend.tf                    # Terraform 状态后端（S3）
│   └── README.md
│
└── kubernetes/                       # Kubernetes 配置
    ├── base/                         # 基础 K8s 清单
    │   ├── deployment.yaml           # API 部署定义
    │   ├── service.yaml              # Service（ClusterIP）
    │   ├── ingress.yaml              # ALB Ingress
    │   ├── configmap.yaml            # 配置映射
    │   ├── secrets.yaml              # Secret（从AWS Secrets Manager）
    │   └── hpa.yaml                  # 水平Pod自动扩展
    │
    ├── overlays/                     # Kustomize 覆盖
    │   ├── staging/
    │   │   └── kustomization.yaml
    │   └── production/
    │       └── kustomization.yaml
    │
    └── helm/                         # Helm Charts
        └── trustless-api/
            ├── Chart.yaml
            ├── values.yaml           # 默认值
            ├── values-staging.yaml   # Staging 覆盖
            ├── values-production.yaml # 生产覆盖
            └── templates/
                ├── deployment.yaml
                ├── service.yaml
                └── ingress.yaml
```

**部署命令 / Deployment Commands:**

```bash
# Terraform 部署基础设施
cd infrastructure/terraform/environments/staging
terraform init
terraform plan
terraform apply

# Kubernetes 部署应用
cd infrastructure/kubernetes
kubectl apply -k overlays/staging

# 或使用 Helm
helm upgrade --install trustless-api ./helm/trustless-api \
  -f helm/trustless-api/values-staging.yaml \
  -n staging
```

---

## scripts/ - 自动化脚本

构建、部署和维护脚本。

_Build, deployment, and maintenance scripts._

```
scripts/
├── generate-openapi.ts               # 从 Fastify 路由生成 OpenAPI spec
├── generate-contract-types.ts        # 从 Foundry 编译输出生成 TypeScript types
├── deploy-contracts.sh               # 部署智能合约到不同网络
├── seed-data.sh                      # 批量插入测试数据
├── health-check.sh                   # 检查开发环境依赖
├── backup-db.sh                      # 数据库备份脚本
└── update-contract-addresses.ts      # 部署后更新合约地址到 shared/
```

**常用脚本 / Common Scripts:**

```bash
# 生成合约类型（部署后运行）
pnpm run generate:contract-types

# 生成 API 文档
pnpm run docs:generate

# 健康检查
./scripts/health-check.sh

# 部署合约到 Sepolia
./scripts/deploy-contracts.sh sepolia
```

---

## docs/ - 项目文档

所有项目文档，已分片为模块化结构。

_All project documentation, sharded into modular structure._

```
docs/
├── architecture.md                   # 架构主文档（完整版）
├── architecture/                     # 架构文档分片（23个文件）⭐
│   ├── index.md
│   ├── 技术栈-tech-stack.md          # 开发者必读
│   ├── 编码规范-coding-standards.md  # AI Agent 自动加载
│   ├── source-tree.md                # 本文档 / This document
│   └── ... (其他20个模块)
│
├── prd.md                            # PRD 主文档（完整版）
├── prd/                              # PRD 文档分片（14个文件）⭐
│   ├── index.md
│   ├── requirements.md               # 46功能需求+32非功能需求
│   ├── epic-1-foundation-core-infrastructure.md
│   ├── epic-2-token-economy-agent-registration.md
│   └── ... (其他10个Epic/章节)
│
├── brief.md                          # 项目简报（执行摘要）
├── competitor-analysis.md            # 竞品分析（Lens、Farcaster等）
├── brainstorming-session-results.md  # 头脑风暴记录
│
└── api/                              # API 文档
    ├── openapi.json                  # OpenAPI 3.0 规范（自动生成）
    └── postman-collection.json       # Postman 测试集合
```

---

## 配置文件详解 / Configuration Files Explained

### package.json (Root)

```json
{
  "name": "trustless-socialfi",
  "private": true,
  "scripts": {
    "dev": "turbo run dev --parallel", // 启动所有应用
    "dev:web": "turbo run dev --filter=@trustless/web",
    "dev:api": "turbo run dev --filter=@trustless/api",
    "build": "turbo run build", // 构建所有包
    "test": "turbo run test", // 运行所有测试
    "test:contracts": "cd packages/contracts && forge test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo run clean && rm -rf node_modules"
  }
}
```

### turbo.json - Turborepo 配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // 先构建依赖包
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false, // 开发模式不缓存
      "persistent": true // 长期运行进程
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "clean": { "cache": false }
  }
}
```

**缓存优势 / Caching Benefits:**

- 首次构建: ~80 秒
- 无变更重新构建: ~0.5 秒 (160x faster!) ⚡
- 仅修改一个包: ~20 秒 (只重建该包和依赖它的包)

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**工作空间好处 / Workspace Benefits:**

- 所有包共享 `node_modules` (节省磁盘空间)
- 内部包通过 `workspace:*` 链接
- 单一 `pnpm-lock.yaml` (统一版本)

### docker-compose.yml - 本地开发服务

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: trustless_dev
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  anvil:
    image: ghcr.io/foundry-rs/foundry:latest
    command: anvil --host 0.0.0.0
    ports: ["8545:8545"]
```

**启动命令 / Start Command:**

```bash
docker-compose up -d  # 后台启动所有服务
docker-compose ps     # 查看服务状态
docker-compose logs -f postgres  # 查看日志
docker-compose down   # 停止并删除
```

---

## 开发工作流关键路径 / Development Workflow Key Paths

### 新功能开发流程 / New Feature Development Flow

**示例：添加"帖子收藏"功能**

```
1. 智能合约 / Smart Contract
   packages/contracts/src/SocialGraph.sol
   → 添加 bookmarkContent() 函数
   → 编写测试 test/SocialGraph.t.sol
   → forge test && forge build

2. 共享类型 / Shared Types
   packages/shared/src/types/post.ts
   → 添加 isBookmarked: boolean
   → pnpm run generate:contract-types (更新ABI)

3. 后端 API / Backend API
   apps/api/src/routes/posts.routes.ts
   → POST /posts/:id/bookmark
   apps/api/src/repositories/PostRepository.ts
   → bookmarkPost() 方法

4. 前端 UI / Frontend UI
   apps/web/src/hooks/usePosts.ts
   → useBookmarkPost() hook
   apps/web/src/components/molecules/PostCard.tsx
   → 添加书签按钮

5. 测试 / Tests
   packages/contracts/test/SocialGraph.t.sol
   apps/api/__tests__/routes/posts.routes.test.ts
   apps/web/__tests__/components/PostCard.test.tsx

6. 文档 / Documentation
   docs/architecture/api-规范-api-specification.md
   → 添加 POST /posts/:id/bookmark 说明
```

### 常见文件查找 / Common File Lookups

| 需要查找什么  | 文件位置                              |
| ------------- | ------------------------------------- |
| API 端点定义  | `apps/api/src/routes/*.routes.ts`     |
| 智能合约      | `packages/contracts/src/*.sol`        |
| React 组件    | `apps/web/src/components/**/*.tsx`    |
| 数据库 Schema | `apps/api/prisma/schema.prisma`       |
| 合约 ABI      | `packages/shared/src/contracts/abis/` |
| 环境变量配置  | `.env.example`, `apps/*/.env.example` |
| 部署配置      | `infrastructure/kubernetes/base/`     |
| 测试文件      | `**/__tests__/**/*.test.ts`           |
| 类型定义      | `packages/shared/src/types/`          |

---

## 命名规范总结 / Naming Convention Summary

### 文件命名 / File Naming

```
组件 Components:       PascalCase.tsx        (UserProfile.tsx, PostCard.tsx)
Hooks:                camelCase.ts          (useAuth.ts, usePosts.ts)
服务 Services:         PascalCase.ts         (IPFSService.ts, AgentOrchestrator.ts)
仓储 Repositories:     PascalCase.ts         (UserRepository.ts)
路由 Routes:           kebab-case.routes.ts  (auth.routes.ts, posts.routes.ts)
工具 Utils:            camelCase.ts          (format.ts, validation.ts)
类型 Types:            camelCase.ts          (user.ts, post.ts)
测试 Tests:            *.test.ts 或 *.t.sol
智能合约 Contracts:    PascalCase.sol        (TrustToken.sol, AgentRegistry.sol)
测试合约:              PascalCase.t.sol      (TrustToken.t.sol)
部署脚本:              PascalCase.s.sol      (Deploy.s.sol)
```

### 目录命名 / Directory Naming

```
应用/包 Apps/Packages:    kebab-case        (web-app, agent-service)
组件目录:                  kebab-case        (components, atoms, molecules)
服务目录:                  camelCase         (services, repositories)
K8s 清单:                  kebab-case        (kubernetes/base, overlays)
```

---

## 关键文件详解 / Key Files Explained

### apps/api/src/index.ts - 后端入口点

```typescript
import Fastify from "fastify";
import { userRoutes } from "./routes/users.routes";
import { postRoutes } from "./routes/posts.routes";
import { AgentOrchestrator } from "./services/AgentOrchestrator";

const fastify = Fastify({ logger: true });

// 注册插件 / Register plugins
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/jwt"), { secret: env.JWT_SECRET });
fastify.register(require("@fastify/rate-limit"));

// 注册路由 / Register routes
fastify.register(userRoutes, { prefix: "/v1/users" });
fastify.register(postRoutes, { prefix: "/v1/posts" });

// 启动 Agent 编排器 / Start Agent Orchestrator
const orchestrator = new AgentOrchestrator();
orchestrator.startEventListener();

// 启动服务器 / Start server
fastify.listen({ port: 3001, host: "0.0.0.0" });
```

### apps/web/src/app/providers.tsx - 前端 Providers

```typescript
"use client";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/web3"; // Wagmi 配置
import { queryClient } from "@/lib/apiClient";

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### packages/contracts/foundry.toml - Foundry 配置

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200
via_ir = false

[rpc_endpoints]
arbitrum = "${ARBITRUM_RPC_URL}"
sepolia = "${ARBITRUM_SEPOLIA_RPC_URL}"
local = "http://localhost:8545"

[etherscan]
arbitrum = { key = "${ARBISCAN_API_KEY}" }

[fmt]
line_length = 100
tab_width = 4
bracket_spacing = true
```

---

## 环境变量组织 / Environment Variables Organization

### 变量分布 / Variable Distribution

**apps/web/.env.local** (前端专用):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
NEXT_PUBLIC_CHAIN_ID=42161
NEXT_PUBLIC_ALCHEMY_KEY=xxx
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx
NEXT_PUBLIC_TRUST_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x...
```

**apps/api/.env** (后端专用):

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trustless_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_min_32_chars
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/xxx
PRIVATE_KEY=0x...
PINATA_API_KEY=xxx
OPENAI_API_KEY=sk-xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
```

**packages/contracts/.env** (合约部署):

```bash
PRIVATE_KEY=0x...
ARBISCAN_API_KEY=xxx
ARBITRUM_RPC_URL=xxx
CHAINLINK_VRF_COORDINATOR=0x...
```

---

## Git 工作流 / Git Workflow

### 分支策略 / Branch Strategy

```
main                    # 生产环境 / Production
  └── develop           # 开发主分支 / Development main
      ├── feature/user-preferences      # 功能分支
      ├── feature/agent-registration
      ├── fix/ipfs-timeout              # Bug 修复
      └── epic/dao-governance           # Epic 分支
```

### Commit 规范 / Commit Convention

```
feat(frontend): add user preferences page
fix(api): resolve IPFS upload timeout
perf(contracts): optimize gas in consensus calculation
docs(architecture): update API specification
test(api): add integration test for moderation flow
chore(deps): update Next.js to 14.1.0

格式 / Format: <type>(<scope>): <subject>
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore

---

## 代码统计 / Code Statistics (预估)

| 类别 / Category | 文件数 / Files     | 代码行数 / Lines of Code |
| --------------- | ------------------ | ------------------------ |
| Smart Contracts | 10-12              | ~3,000 lines             |
| Backend (API)   | 40-50              | ~8,000 lines             |
| Frontend (Web)  | 60-80              | ~12,000 lines            |
| Shared Packages | 20-30              | ~2,000 lines             |
| Tests           | 50-70              | ~6,000 lines             |
| Infrastructure  | 15-20              | ~1,500 lines             |
| **Total**       | **~200-260 files** | **~32,500 lines**        |

---

## 开发者快速参考 / Developer Quick Reference

### 我在哪里找...? / Where Do I Find...?

**问题：如何添加新的 API 端点？**

1. 创建路由文件：`apps/api/src/routes/my-feature.routes.ts`
2. 定义路由和 handler
3. 在 `apps/api/src/index.ts` 注册路由
4. 添加测试：`apps/api/__tests__/routes/my-feature.routes.test.ts`
5. 更新文档：`docs/architecture/api-规范-api-specification.md`

**问题：如何添加新的智能合约？**

1. 创建合约：`packages/contracts/src/MyContract.sol`
2. 编写测试：`packages/contracts/test/MyContract.t.sol`
3. 运行 `forge test` 确保覆盖率 > 90%
4. 部署：`forge script script/Deploy.s.sol --broadcast`
5. 生成 TypeScript 类型：`pnpm run generate:contract-types`

**问题：如何添加新的 React 组件？**

1. 根据复杂度选择目录：
   - 简单：`apps/web/src/components/atoms/`
   - 组合：`apps/web/src/components/molecules/`
   - 复杂：`apps/web/src/components/organisms/`
2. 创建组件文件（PascalCase）
3. 添加测试：`apps/web/__tests__/components/`
4. 在父组件中导入使用

**问题：如何修改数据库 Schema？**

1. 编辑：`apps/api/prisma/schema.prisma`
2. 运行迁移：`pnpm prisma migrate dev --name add_my_field`
3. 生成 Prisma Client：`pnpm prisma generate`
4. 更新 Repository（如果需要）
5. 更新 TypeScript 类型（`packages/shared/src/types/`）

---

## 构建产物位置 / Build Artifacts Location

```
apps/web/.next/              # Next.js 构建输出
apps/api/dist/               # TypeScript 编译输出
packages/contracts/out/      # Foundry 编译输出（ABI）
packages/shared/dist/        # 共享包构建输出
coverage/                    # 测试覆盖率报告
.turbo/                      # Turborepo 缓存
node_modules/                # 依赖包
```

**⚠️ 注意 / Note**: 这些目录都在 `.gitignore` 中，不提交到 Git。

---

## 文档维护指南 / Documentation Maintenance Guide

### 何时更新源代码树文档？ / When to Update This Document?

- ✅ 添加新的顶层目录时
- ✅ 添加新的重要文件类型时
- ✅ 项目结构重大重构时
- ❌ 添加单个组件或文件时（不需要）

### 其他架构文档同步 / Sync with Other Architecture Docs

当源代码树变化时，也需要更新：

- `docs/architecture/统一项目结构-unified-project-structure.md`
- `docs/architecture/开发工作流-development-workflow.md`
- 根目录 `README.md`

---

**文档状态 / Document Status**: ✅ 完成 / Complete

**最后更新 / Last Updated**: 2025-10-10

**维护者 / Maintainer**: Winston (Architect)

---
