# 高层架构 / High Level Architecture

## 技术概要 / Technical Summary

Trustless SocialFi 采用**三层全栈架构**，结合智能合约（Arbitrum L2）、后端服务（TypeScript 微服务）和现代 Web 前端（Next.js）。系统通过经济激励和信誉评分机制协调多个 AI Agent 进行去中心化内容审核。

_Trustless SocialFi adopts a **three-layer fullstack architecture** combining smart contracts (Arbitrum L2), backend services (TypeScript microservices), and a modern web frontend (Next.js). The system orchestrates multiple AI agents for decentralized content moderation through economic incentives and reputation scoring._

**整体架构风格 / Overall Architectural Style**: 混合式去中心化架构 - Layer 2 区块链存储关键状态（Agent 选择、共识投票、信誉评分），IPFS 存储内容，传统后端服务处理性能关键操作（Agent 编排、数据索引、API 网关）。

**前后端选择 / Frontend & Backend Choices**: Next.js 14 的 App Router 提供优秀的 SEO、服务端渲染和开发体验。Fastify 后端提供比 Express 高 2-3 倍的吞吐量，适合高频 Agent API 调用。全栈 TypeScript 确保从智能合约到 UI 组件的类型安全。

**关键集成点 / Key Integration Points**:

- **前端 ↔ 区块链 / Frontend ↔ Blockchain**: viem + wagmi 实现钱包连接和合约交互
- **后端 ↔ 区块链 / Backend ↔ Blockchain**: viem 读取事件、提交 Agent 判断、更新信誉
- **后端 ↔ AI 服务 / Backend ↔ AI Services**: OpenAI GPT-4 API 内容审核（MVP），未来迁移至自托管 LLM
- **所有层 ↔ IPFS / All Layers ↔ IPFS**: 通过 Pinata 和 Web3.Storage 上传/检索内容

**基础设施平台 / Infrastructure Platform**: AWS/GCP 部署后端服务（Kubernetes），Vercel 部署前端（自动 CI/CD），Arbitrum One 部署智能合约。多区域部署（US-East、EU-West）实现全球 < 200ms API 延迟。

**实现 PRD 目标 / Achieving PRD Goals**: 架构直接支持所有核心需求 - 多 Agent 共识、<30 秒审核时间、<$0.10 Gas 费用、99% 正常运行时间、透明可审计性。

## 平台和基础设施选择 / Platform and Infrastructure Choice

**平台 / Platform:** AWS (后端服务) + Arbitrum One (智能合约) + Vercel (前端)

**核心服务 / Key Services:**

- **计算 / Compute**: AWS EKS (Kubernetes) 运行 Agent 服务和 API 网关
- **数据库 / Database**: AWS RDS PostgreSQL 15 (Multi-AZ 高可用)
- **缓存 / Cache**: AWS ElastiCache Redis 7
- **存储 / Storage**: AWS S3 (备份), IPFS (Pinata + Web3.Storage 存储内容)
- **区块链 / Blockchain**: Arbitrum One (智能合约), Alchemy (RPC 提供商)
- **前端 / Frontend**: Vercel (Next.js 托管，边缘缓存)
- **监控 / Monitoring**: AWS CloudWatch + Prometheus + Grafana + Sentry

**部署主机和区域 / Deployment Host and Regions:**

- **后端 / Backend**: AWS us-east-1 (主要), eu-west-1 (次要，降低延迟)
- **智能合约 / Smart Contracts**: Arbitrum One 主网 (全球 L2 网络)
- **前端 / Frontend**: Vercel 全球边缘网络 (自动地理路由)

## 仓库结构 / Repository Structure

**结构 / Structure:** Monorepo (Turborepo + pnpm)

**Monorepo 工具 / Monorepo Tool:** Turborepo 1.11+ with pnpm 8+

**包组织 / Package Organization:**

```
trustless-socialfi/
├── apps/
│   ├── web/                      # Next.js 前端 / Frontend (Port 3000)
│   └── api/                      # Fastify 后端 / Backend (Port 3001)
├── packages/
│   ├── contracts/                # Foundry 智能合约 / Smart contracts
│   ├── shared/                   # 共享类型和工具 / Shared types & utilities
│   ├── ui/                       # 共享 React 组件 / Shared React components
│   └── config/                   # 共享配置 / Shared configs
├── infrastructure/
│   ├── kubernetes/               # K8s 清单 / K8s manifests
│   └── terraform/                # 基础设施即代码 / Infrastructure as Code
├── scripts/                      # 构建和部署脚本 / Build & deployment scripts
└── turbo.json                    # Turborepo 配置 / Turborepo config
```

---
