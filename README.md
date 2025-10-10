# Trustless SocialFi

去中心化内容审核平台 - Decentralized Content Moderation Platform

## 项目简介 / Project Overview

Trustless SocialFi 是一个基于区块链的去中心化社交平台，使用多 Agent 系统进行内容审核，通过智能合约实现透明的治理和经济激励机制。

Trustless SocialFi is a blockchain-based decentralized social platform that uses a multi-agent system for content moderation, with transparent governance and economic incentives via smart contracts.

## 技术栈 / Tech Stack

### 前端 / Frontend

- **Next.js 14.1+** - React 框架 (App Router, SSR)
- **TypeScript 5.3+** - 类型安全
- **shadcn/ui** - UI 组件库
- **Zustand** - 状态管理
- **viem + wagmi** - Web3 库
- **RainbowKit** - 钱包连接
- **Tailwind CSS** - CSS 框架

### 后端 / Backend

- **Fastify 4.26+** - 高性能 Web 框架
- **TypeScript 5.3+** - 类型安全
- **PostgreSQL 15+** - 关系型数据库
- **Prisma** - ORM
- **Redis 7+** - 缓存和任务队列
- **Pino** - 结构化日志

### 智能合约 / Smart Contracts

- **Solidity 0.8.24** - 智能合约语言
- **Foundry** - 合约开发框架
- **Arbitrum One** - Layer 2 区块链
- **Chainlink VRF** - 可验证随机数
- **OpenZeppelin** - 合约库

### 基础设施 / Infrastructure

- **Turborepo** - Monorepo 构建系统
- **pnpm** - 包管理器
- **Docker** - 容器化
- **Kubernetes (EKS)** - 容器编排
- **Terraform** - 基础设施即代码
- **GitHub Actions** - CI/CD

### 存储与服务 / Storage & Services

- **IPFS** - 去中心化文件存储
- **The Graph** - 区块链数据索引
- **OpenAI GPT-4** - AI 内容审核 (MVP)

## 项目结构 / Project Structure

```
trustless-socialfi/
├── packages/
│   ├── contracts/         # Foundry 智能合约
│   ├── agent-service/     # 后端 API 服务
│   ├── web-app/          # Next.js 前端应用
│   └── shared/           # 共享类型和工具
├── docs/                 # 项目文档
├── infrastructure/       # 基础设施代码
└── scripts/             # 自动化脚本
```

## 开发环境搭建 / Development Setup

### 前置要求 / Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.15.0
- **Foundry** (for smart contracts)
- **Docker** (for local services)

### 安装步骤 / Installation

1. **克隆仓库 / Clone repository**

```bash
git clone <repository-url>
cd trustless-socialfi
```

2. **安装依赖 / Install dependencies**

```bash
pnpm install
```

3. **启动本地服务 / Start local services**

```bash
docker-compose up -d  # PostgreSQL, Redis, Anvil
```

4. **初始化 Husky / Initialize Husky**

```bash
pnpm prepare
```

## 基本使用命令 / Basic Commands

### 开发 / Development

```bash
# 启动所有应用（并行）
pnpm dev

# 启动特定应用
pnpm --filter @trustless/web-app dev
pnpm --filter @trustless/agent-service dev

# 智能合约开发
cd packages/contracts
forge test
forge build
```

### 构建 / Build

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @trustless/web-app build
```

### 测试 / Testing

```bash
# 运行所有测试
pnpm test

# 智能合约测试
cd packages/contracts
forge test -vvv
```

### 代码质量 / Code Quality

```bash
# Lint 检查
pnpm lint

# 代码格式化
pnpm format

# 清理构建产物
pnpm clean
```

## Git Hooks

项目使用 Husky + lint-staged 实现自动化代码质量检查：

- **pre-commit**: 自动运行 ESLint 和 Prettier
- **pre-push**: 运行测试（未来添加）

## 文档 / Documentation

详细文档位于 `docs/` 目录：

- [架构文档](docs/architecture/index.md)
- [PRD 产品需求](docs/prd/index.md)
- [API 规范](docs/architecture/api-specification.md)
- [技术栈详情](docs/architecture/tech-stack.md)
- [源代码树](docs/architecture/source-tree.md)

## 环境变量 / Environment Variables

每个 package 需要各自的环境变量配置：

- `packages/web-app/.env.local` - 前端环境变量
- `packages/agent-service/.env` - 后端环境变量
- `packages/contracts/.env` - 合约部署配置

参考各 package 目录下的 `.env.example` 文件。

## 贡献指南 / Contributing

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交变更 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Commit 规范 / Commit Convention

遵循 Conventional Commits 规范：

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): format code
refactor(scope): refactor code
test(scope): add tests
chore(scope): update dependencies
```

## 许可证 / License

MIT License

## 联系方式 / Contact

- **GitHub**: [Repository URL]
- **Documentation**: [Docs URL]

---

**Status**: 🚧 In Development | 开发中

**Version**: 0.1.0

**Last Updated**: 2025-10-10
