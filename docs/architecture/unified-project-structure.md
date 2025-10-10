# 统一项目结构 / Unified Project Structure

为 Turborepo 和 pnpm workspaces 优化的完整 monorepo 结构。

_Complete monorepo structure optimized for Turborepo and pnpm workspaces._

```
trustless-socialfi/
├── apps/
│   ├── web/                      # Next.js 前端 / Next.js frontend
│   └── api/                      # Fastify 后端 / Fastify backend
├── packages/
│   ├── contracts/                # Foundry 合约 / Foundry contracts
│   ├── shared/                   # 共享类型 / Shared types
│   ├── ui/                       # 组件库 / Component library
│   └── config/                   # 共享配置 / Shared configs
├── infrastructure/
│   ├── terraform/                # AWS IaC
│   └── kubernetes/               # K8s 清单 / K8s manifests
├── scripts/                      # 自动化脚本 / Automation scripts
├── docs/                         # 文档 / Documentation
├── turbo.json                    # Turborepo 配置 / Turborepo config
├── pnpm-workspace.yaml           # pnpm 工作空间 / pnpm workspaces
└── docker-compose.yml            # 本地开发服务 / Local dev services
```

**关键配置文件 / Key Configuration Files:**

- `turbo.json` - 构建管道和缓存 / Build pipeline and caching
- `pnpm-workspace.yaml` - 包管理 / Package management
- `docker-compose.yml` - PostgreSQL, Redis, Anvil

---
