# Technical Assumptions

## Repository Structure: Monorepo

**工具：** Turborepo + pnpm

**仓库结构：**

```
trustless-socialfi/
├── packages/
│   ├── contracts/          # Foundry 智能合约
│   ├── agent-service/      # Agent 审核服务（TypeScript）
│   ├── web-app/            # Next.js 前端
│   ├── shared/             # 共享类型和工具
│   └── subgraph/           # The Graph 子图
├── infrastructure/         # K8s、Docker 配置
├── docs/                   # 文档
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## Service Architecture

**架构：** Monolith 后端 + 独立智能合约 + SPA 前端

**技术栈：**

- **智能合约：** Foundry + Solidity 0.8.24 + OpenZeppelin + Arbitrum One
- **后端：** TypeScript + Node.js 20 + Fastify + viem + Prisma + PostgreSQL
- **前端：** Next.js 14 + React 18 + TypeScript + viem + wagmi + RainbowKit
- **UI 组件：** shadcn/ui + Tailwind CSS + Radix UI + Lucide Icons
- **存储：** IPFS (Pinata + Web3.Storage) + PostgreSQL
- **监控：** Prometheus + Grafana + Sentry

## Testing Requirements

**智能合约：** Foundry Test（覆盖率 > 90%）+ Fuzz Testing  
**后端：** Jest + Supertest（覆盖率 > 80%）  
**前端：** Vitest + React Testing Library（覆盖率 > 70%）+ Playwright（E2E）

## Additional Technical Assumptions and Requests

**关键技术决策：**

- 使用 viem（而非 ethers.js）- 性能更好、TypeScript 支持更强
- 使用 Fastify（而非 Express）- 吞吐量更高、TypeScript 原生支持
- 使用 shadcn/ui（而非 Chakra/MUI）- 可定制性强、现代美学、可访问性好
- 使用 Chainlink VRF v2.5 - Arbitrum 原生支持的随机数方案
- 使用 OpenAI GPT-4 Turbo（MVP）→ 开源 LLM（Phase 2，降低成本）
- 使用 The Graph 索引链上数据 - 高效查询，无需后端轮询事件
- 使用 EIP-712 签名派生加密密钥 - 标准化、安全、钱包兼容性好

**环境配置：**

- Development：本地 Anvil + 本地后端 + localhost:3000
- Staging：Arbitrum Sepolia + AWS Staging + Vercel Preview
- Production：Arbitrum One + AWS Production + Vercel Production

**部署策略：**

- 智能合约：Foundry Script 部署 + 合约验证（Arbiscan）
- 后端：Docker + Kubernetes（AWS EKS）
- 前端：Vercel（自动 CI/CD）

---
