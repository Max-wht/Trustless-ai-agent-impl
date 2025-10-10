# 组件 / Components

## 前端组件 / Frontend Components (Next.js)

**1. 认证与钱包管理 / Authentication & Wallet Management**

- **职责 / Responsibility**: 钱包连接、签名认证、钱包状态管理
- **关键接口 / Key Interfaces**: `connectWallet()`, `signMessage()`, `useAuth()` hook
- **技术栈 / Technology**: RainbowKit + wagmi + Zustand
- **依赖 / Dependencies**: API Client (认证验证)

**2. API 客户端与数据获取 / API Client & Data Fetching**

- **职责 / Responsibility**: 带认证、缓存、错误处理的 HTTP 客户端
- **关键接口 / Key Interfaces**: `apiClient.get/post/put/delete()`, React Query hooks
- **技术栈 / Technology**: TanStack Query + Zod 验证
- **依赖 / Dependencies**: Auth store (JWT tokens)

**3. 智能合约交互层 / Smart Contract Interaction**

- **职责 / Responsibility**: 类型安全的合约调用、交易管理
- **关键接口 / Key Interfaces**: `useContractRead()`, `useContractWrite()`, `useContractEvent()`
- **技术栈 / Technology**: wagmi + viem + 生成的 ABIs
- **依赖 / Dependencies**: @trustless/shared (合约地址/ABIs)

**4. UI 组件库 / UI Component Library**

- **职责 / Responsibility**: 可复用的可访问 UI 组件
- **关键接口 / Key Interfaces**: 原子组件 (Button, Input), 分子组件 (PostCard), 有机组件 (Feed)
- **技术栈 / Technology**: shadcn/ui + Radix UI + Tailwind CSS
- **依赖 / Dependencies**: None (自包含)

**5. 状态管理 / State Management**

- **职责 / Responsibility**: 全局应用状态
- **关键接口 / Key Interfaces**: `useAuthStore()`, `useUIStore()`
- **技术栈 / Technology**: Zustand with persist middleware
- **依赖 / Dependencies**: None

## 后端组件 / Backend Components (Fastify)

**6. API 网关与路由 / API Gateway & Router**

- **职责 / Responsibility**: HTTP 服务器、路由、验证、认证
- **关键接口 / Key Interfaces**: 路由处理器、中间件
- **技术栈 / Technology**: Fastify + Zod 验证 + JWT
- **依赖 / Dependencies**: 所有服务层组件

**7. Agent 编排器 / Agent Orchestrator**

- **职责 / Responsibility**: 监听事件、协调 Agent 调用、提交判断
- **关键接口 / Key Interfaces**: `startEventListener()`, `handleModeration()`
- **技术栈 / Technology**: viem (事件) + Bull (队列) + Redis
- **依赖 / Dependencies**: Agent 服务客户端、区块链服务

**8. IPFS 服务 / IPFS Service**

- **职责 / Responsibility**: 上传/检索内容，双 Pinning
- **关键接口 / Key Interfaces**: `uploadContent()`, `retrieveContent()`
- **技术栈 / Technology**: Pinata SDK + Web3.Storage + Redis 缓存
- **依赖 / Dependencies**: None

**9. 数据库仓储层 / Database Repository Layer**

- **职责 / Responsibility**: 抽象 Prisma 查询，提供事务支持
- **关键接口 / Key Interfaces**: `UserRepository`, `PostRepository`, `AgentRepository`
- **技术栈 / Technology**: Prisma ORM + PostgreSQL
- **依赖 / Dependencies**: None

---
