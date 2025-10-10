# Epic 1: Foundation & Core Infrastructure

## Epic Goal

建立 Trustless SocialFi 的技术基础设施，包括 Monorepo 项目结构、智能合约开发环境（Foundry）、后端 API 框架（Fastify + TypeScript）、前端应用（Next.js + shadcn/ui）。交付核心的用户身份功能（钱包连接、用户注册）和基本的社交互动界面（个人主页、简单时间线），确保项目可部署并演示基础功能。此 Epic 完成后，开发团队可以在稳定的技术栈上并行开发后续功能。

## Story 1.1: Monorepo 项目初始化与开发环境配置

As a **开发者**,  
I want **建立 Turborepo Monorepo 项目结构，配置 pnpm workspace，设置基础的 packages（contracts、agent-service、web-app、shared）**,  
so that **团队可以在统一的代码仓库中并行开发智能合约、后端和前端，代码共享和版本管理统一**。

### Acceptance Criteria

1. 使用 `create-turbo` 初始化 Monorepo，配置 Turborepo 缓存和任务依赖（`turbo.json`）
2. 配置 pnpm workspace（`pnpm-workspace.yaml`），包含 4 个 packages：contracts、agent-service、web-app、shared
3. 每个 package 有独立的 `package.json`，定义名称（`@trustless/contracts`、`@trustless/agent-service` 等）
4. 配置根目录 `.gitignore`，排除 `node_modules`、`dist`、`.env.local`、`.turbo` 等
5. 配置根目录 `tsconfig.json`（base config），每个 package 继承并扩展
6. 配置 ESLint + Prettier（统一代码规范），使用 `@typescript-eslint` 规则
7. 配置 Husky + lint-staged（Git hooks），提交前自动运行 lint 和格式化
8. 创建 `README.md`，包含项目简介、技术栈、开发环境搭建步骤
9. 运行 `pnpm install` 成功，无依赖冲突
10. 运行 `pnpm lint` 和 `pnpm format` 成功
11. Git 提交触发 Husky hooks，自动 lint 检查

## Story 1.2: Foundry 智能合约项目框架搭建

As a **智能合约开发者**,  
I want **在 `packages/contracts/` 初始化 Foundry 项目，配置 Arbitrum Sepolia 测试网，创建第一个 Hello World 合约并部署**,  
so that **智能合约开发环境就绪，可以开始开发 ERC-20 代币和 Agent 注册合约**。

### Acceptance Criteria

1. 在 `packages/contracts/` 运行 `forge init`，生成 Foundry 项目结构（`src/`、`test/`、`script/`、`foundry.toml`）
2. 配置 `foundry.toml`：Solidity 版本 0.8.24、Optimizer 启用（runs = 200）、Remappings 配置 OpenZeppelin
3. 安装 OpenZeppelin Contracts：`forge install OpenZeppelin/openzeppelin-contracts@v5.0.0`
4. 创建第一个合约 `src/HealthCheck.sol`（简单的 Hello World 合约，返回 "Trustless SocialFi"）
5. 创建测试 `test/HealthCheck.t.sol`，测试合约部署和函数调用
6. 运行 `forge test` 成功，测试通过
7. 配置 Arbitrum Sepolia RPC（在 `foundry.toml` 或 `.env`）
8. 创建部署脚本 `script/DeployHealthCheck.s.sol`
9. 部署到本地 Anvil：`anvil` + `forge script` 成功
10. 配置 `.env.example`（包含 PRIVATE_KEY、ARBISCAN_API_KEY、RPC_URL）
11. 在 `packages/contracts/README.md` 记录部署和测试命令

## Story 1.3: 后端 API 框架搭建（Fastify + TypeScript）

As a **后端开发者**,  
I want **在 `packages/agent-service/` 创建 Fastify + TypeScript 后端项目，实现健康检查 API 端点，配置数据库连接（Prisma + PostgreSQL）**,  
so that **后端服务框架就绪，可以开始开发 Agent 审核、IPFS 集成、区块链交互等功能**。

### Acceptance Criteria

1. 在 `packages/agent-service/` 初始化 TypeScript 项目，配置 `tsconfig.json`（strict mode）
2. 安装依赖：`fastify`、`@fastify/cors`、`dotenv`、`typescript`、`ts-node`、`@types/node`
3. 创建 `src/index.ts`，初始化 Fastify 服务器，监听端口 3001
4. 实现 `GET /health` 端点，返回 `{ status: 'ok', service: 'agent-service', timestamp: Date.now() }`
5. 配置 CORS（允许 `http://localhost:3000` 前端访问）
6. 配置环境变量（`.env`）：`PORT=3001`、`DATABASE_URL`、`NODE_ENV`
7. 安装并配置 Prisma：`npx prisma init`
8. 创建第一个 Prisma schema（`schema.prisma`）：定义 User 表（id、walletAddress、createdAt）
9. 运行 `prisma migrate dev` 创建数据库和表
10. 实现简单的 `GET /users` 端点，从数据库查询所有用户（使用 Prisma Client）
11. 配置启动脚本（`package.json`）：`dev`（ts-node-dev）、`build`（tsc）、`start`（node dist）
12. 运行 `pnpm dev` 成功，服务启动在 http://localhost:3001
13. 使用 curl 或 Postman 测试 `/health` 和 `/users` 端点成功
14. 在 `packages/agent-service/README.md` 记录 API 端点和启动命令

## Story 1.4: 前端 Next.js 应用初始化（shadcn/ui + Tailwind）

As a **前端开发者**,  
I want **在 `packages/web-app/` 创建 Next.js 14 项目（App Router），配置 Tailwind CSS 和 shadcn/ui，实现欢迎页面**,  
so that **前端开发环境就绪，可以开始开发钱包连接、用户界面等功能**。

### Acceptance Criteria

1. 在 `packages/web-app/` 运行 `npx create-next-app@latest`，选择 TypeScript + Tailwind CSS + App Router
2. 配置 `tailwind.config.ts`：使用 shadcn/ui 推荐的配置、添加自定义主题色（primary: blue-600、accent: emerald-500）
3. 初始化 shadcn/ui：`npx shadcn-ui@latest init`，选择 New York 风格
4. 添加第一个 shadcn 组件：`npx shadcn-ui@latest add button card`
5. 创建欢迎页面 `app/page.tsx`：显示 "Welcome to Trustless SocialFi" 标题、项目 slogan、使用 shadcn Button 和 Card 组件、响应式设计
6. 配置字体（next/font）：Inter（标题和正文）、JetBrains Mono（代码/哈希）
7. 配置环境变量（`.env.local`）：`NEXT_PUBLIC_API_URL=http://localhost:3001`
8. 运行 `pnpm dev` 成功，应用启动在 http://localhost:3000
9. 在浏览器访问 http://localhost:3000，看到欢迎页面，样式正确
10. 测试响应式：在移动端（375px）和桌面端（1920px）显示正常
11. 配置 `next.config.js`：启用 TypeScript strict mode、图片域名白名单（IPFS 网关）
12. 在 `packages/web-app/README.md` 记录启动命令和开发规范

## Story 1.5: RainbowKit 钱包连接集成

As a **用户**,  
I want **在欢迎页面点击"连接钱包"按钮，选择 MetaMask 或 WalletConnect，成功连接后显示我的钱包地址**,  
so that **我可以使用 Web3 身份登录 Trustless SocialFi，无需传统的用户名/密码**。

### Acceptance Criteria

1. 安装依赖：`wagmi`、`viem`、`@rainbow-me/rainbowkit`
2. 在 `app/providers.tsx` 创建 Wagmi + RainbowKit Providers：配置 Arbitrum Sepolia 链、配置 Alchemy RPC、配置支持的钱包（MetaMask、WalletConnect、Coinbase Wallet）
3. 在 `app/layout.tsx` 包裹 Providers
4. 在欢迎页面添加 RainbowKit `ConnectButton`
5. 点击"连接钱包"后，弹出钱包选择界面（RainbowKit Modal）
6. 选择 MetaMask，触发 MetaMask 弹窗，连接成功后：Button 显示钱包地址（缩写格式：0x1234...5678）、点击地址弹出 Account Modal（显示余额、断开连接按钮）
7. 刷新页面后，钱包状态保持（自动重连）
8. 断开钱包后，Button 恢复"连接钱包"状态
9. 在移动端测试 WalletConnect（扫码连接）成功
10. 配置 RainbowKit 主题（匹配 Trustless SocialFi 品牌色）
11. 钱包连接成功率 > 95%（测试 20 次连接）

## Story 1.6: 用户注册与基础档案创建

As a **新用户**,  
I want **连接钱包后自动创建我的用户档案（存储在数据库和智能合约），并跳转到我的个人主页**,  
so that **我在平台上有了身份，可以开始发布内容和社交互动**。

### Acceptance Criteria

1. 创建智能合约 `src/UserRegistry.sol`：函数 `registerUser()`、`isRegistered(address)`、`getUserProfile(address)`、事件 `UserRegistered`
2. 编写 Foundry 测试 `test/UserRegistry.t.sol`，覆盖率 > 90%
3. 部署 `UserRegistry` 合约到本地 Anvil
4. 后端创建 Prisma schema：User 表（id、walletAddress、username、bio、createdAt、updatedAt）
5. 后端创建 API 端点 `POST /users/register`：接收 `{ walletAddress, signature }`、验证签名、调用智能合约 `registerUser()`、在数据库创建用户记录、返回用户 ID 和档案
6. 前端创建 Hook `useUserRegistration()`：检查当前钱包是否已注册、未注册则自动调用后端 `/users/register`、使用 wagmi `useSignMessage` 生成签名
7. 前端在钱包连接成功后，触发 `useUserRegistration()`
8. 注册成功后，跳转到 `/profile/[address]` 个人主页
9. 已注册用户连接钱包，直接跳转到主页（不重复注册）
10. 测试新用户注册流程（端到端）：连接钱包 → 签名 → 注册 → 跳转主页
11. 错误处理：签名拒绝、网络错误、合约调用失败，显示友好错误信息

## Story 1.7: 用户个人主页基础界面

As a **用户**,  
I want **访问我的个人主页，查看我的钱包地址、注册时间、信誉评分、关注/粉丝数（初始为 0）**,  
so that **我可以确认我的账户已创建，并了解我的基本信息**。

### Acceptance Criteria

1. 创建页面 `app/profile/[address]/page.tsx`（动态路由）
2. 从 URL 参数获取钱包地址
3. 调用后端 API `GET /users/:address`，获取用户档案
4. 使用 shadcn Card 显示用户信息：Avatar（Blockies 生成）、用户名、简介、注册时间、信誉评分、关注/粉丝数
5. 如果访问的是当前登录用户的主页，显示"编辑个人资料"按钮（暂时占位）
6. 如果访问的是其他用户主页，显示"关注"按钮（暂时禁用，Epic 3 实现）
7. 响应式设计：移动端单列布局，桌面端两列
8. 加载状态：显示骨架屏（Skeleton）
9. 错误处理：用户不存在，显示 404 页面
10. 页面加载时间 < 2 秒

## Story 1.8: 数据库初始化与 Prisma 配置

As a **后端开发者**,  
I want **配置 PostgreSQL 数据库（本地 Docker），使用 Prisma 创建完整的 schema（User、Post、Like、Follow 表），运行迁移生成数据库结构**,  
so that **后端服务可以持久化存储用户数据、内容数据、社交关系，支持高效查询**。

### Acceptance Criteria

1. 创建 `docker-compose.yml`：PostgreSQL 15 服务（端口 5432）、Redis 7 服务（端口 6379）
2. 运行 `docker-compose up -d` 启动数据库
3. 在 `packages/agent-service/prisma/schema.prisma` 定义完整 schema：User、Post、Like、Follow 表
4. 运行 `prisma migrate dev --name init` 创建初始迁移
5. 检查数据库，确认所有表和索引已创建
6. 运行 `prisma generate` 生成 TypeScript 类型
7. 在 `src/lib/db.ts` 创建 Prisma Client 单例
8. 在 `GET /users` 端点中使用 `prisma.user.findMany()` 查询数据库
9. 创建 Seed 脚本 `prisma/seed.ts`，插入 5 个测试用户
10. 运行 `prisma db seed` 成功，数据库有 5 条用户记录
11. 使用 Prisma Studio（`prisma studio`）可视化查看数据

## Story 1.9: 共享类型定义包（shared package）

As a **开发者**,  
I want **在 `packages/shared/` 创建共享的 TypeScript 类型定义和工具函数（合约 ABI 类型、API 请求/响应类型、工具函数）**,  
so that **前端和后端可以复用类型定义，确保类型安全，避免重复代码**。

### Acceptance Criteria

1. 在 `packages/shared/` 初始化 TypeScript 项目
2. 配置 `tsconfig.json`（declaration: true，输出 `.d.ts` 文件）
3. 创建 `src/types/`：定义 user.ts、post.ts、agent.ts、api.ts 接口
4. 创建 `src/utils/`：实现 formatAddress、formatRelativeTime、validateEthAddress 工具函数
5. 创建 `src/constants/`：定义 contracts.ts（合约地址）、config.ts（应用配置）
6. 配置 `package.json`：`name: @trustless/shared`、exports 配置
7. 创建 `src/index.ts`，导出所有类型和工具
8. 运行 `pnpm build` 生成 `dist/` 目录
9. 在 `agent-service` 和 `web-app` 的 `package.json` 中添加依赖：`@trustless/shared: workspace:*`
10. 在后端和前端导入并使用共享类型
11. TypeScript 编译成功，类型检查通过

## Story 1.10: 简单时间线展示（Placeholder UI）

As a **用户**,  
I want **在主页查看时间线（目前显示欢迎信息和占位内容），了解未来将在这里看到关注用户的帖子**,  
so that **我可以理解平台的基本布局和功能方向**。

### Acceptance Criteriax

1. 创建页面 `app/feed/page.tsx`（时间线页面）
2. 创建导航栏组件 `components/Navigation.tsx`：Logo + "Trustless SocialFi"、导航链接、ConnectButton
3. 时间线页面布局：左侧导航、中间时间线主体（最大宽度 600px）、右侧侧边栏占位
4. 主体区域显示欢迎卡片和 3 个占位帖子卡片（Mock 数据）
5. 响应式设计：移动端隐藏侧边栏，导航变为底部 Tab Bar
6. 页面加载时间 < 1 秒
7. 未连接钱包时，显示"请连接钱包"提示
8. 连接钱包后，URL 自动跳转到 `/feed`

## Story 1.11: CI/CD 基础配置（GitHub Actions）

As a **开发者**,  
I want **配置 GitHub Actions 自动化测试和部署流程，每次 push 代码后自动运行测试、Lint、构建**,  
so that **团队可以尽早发现代码错误，确保代码质量，自动化部署到 Staging 环境**。

### Acceptance Criteria

1. 创建 `.github/workflows/ci.yml`：Lint、Test Contracts、Test Backend、Test Frontend、Build
2. 使用 Turborepo 缓存
3. 设置 GitHub Actions Cache
4. 失败时在 PR 显示错误信息
5. 创建 `.github/workflows/deploy-staging.yml`：部署前端到 Vercel Preview、部署后端到 AWS ECS Staging
6. 创建 Vercel 项目，连接 GitHub 仓库
7. 配置 Vercel 环境变量
8. 测试：Push 代码到 main，GitHub Actions 自动运行，所有测试通过
9. 测试：Push 到 develop，自动部署到 Staging
10. 在 PR 中自动显示 Vercel Preview 链接

## Story 1.12: 基础监控与日志配置

As a **DevOps 工程师**,  
I want **为后端服务配置结构化日志（Pino）和错误追踪（Sentry），为前端配置 Sentry，设置基础监控 Dashboard**,  
so that **团队可以实时监控系统健康状态，快速定位和修复错误**。

### Acceptance Criteria

1. 后端安装 `pino` 和 `pino-pretty`
2. 在 `src/lib/logger.ts` 配置 Pino：生产环境 JSON 格式、开发环境 Pretty 格式
3. 在所有 API 端点添加请求日志
4. 后端安装并配置 Sentry SDK（`@sentry/node`）
5. 前端安装并配置 Sentry SDK（`@sentry/nextjs`）
6. 创建 Sentry 项目
7. 配置 Sentry DSN（环境变量）
8. 后端添加 `GET /metrics` 端点（Prometheus 格式）
9. 测试：触发一个错误，Sentry 收到错误报告
10. 测试：查看 `/metrics` 端点，返回 Prometheus 格式指标
11. 在 `README.md` 记录监控和日志查看方法

---
