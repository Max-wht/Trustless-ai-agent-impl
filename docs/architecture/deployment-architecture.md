# 部署架构 / Deployment Architecture

## 部署策略 / Deployment Strategy

**前端部署 / Frontend Deployment:**

- **平台 / Platform:** Vercel
- **构建命令 / Build:** `pnpm turbo build --filter=@trustless/web`
- **输出目录 / Output:** `apps/web/.next`
- **特性 / Features:** 自动 HTTPS、预览部署、边缘缓存

**后端部署 / Backend Deployment:**

- **平台 / Platform:** AWS EKS (Kubernetes)
- **构建方式 / Build:** Docker 多阶段构建
- **部署方法 / Method:** 滚动更新（零停机）/ Rolling update (zero downtime)
- **特性 / Features:** 自动扩展（2-10 个 pods）、健康检查、负载均衡器

## 环境 / Environments

| 环境 / Environment | 前端 URL / Frontend URL                | 后端 URL / Backend URL                     | 区块链 / Blockchain |
| ------------------ | -------------------------------------- | ------------------------------------------ | ------------------- |
| 开发 / Development | http://localhost:3000                  | http://localhost:3001                      | Anvil (本地)        |
| 预发布 / Staging   | https://staging.trustless-socialfi.xyz | https://staging-api.trustless-socialfi.xyz | Arbitrum Sepolia    |
| 生产 / Production  | https://trustless-socialfi.xyz         | https://api.trustless-socialfi.xyz         | Arbitrum One        |

## CI/CD 流水线 / CI/CD Pipeline

**GitHub Actions 工作流 / GitHub Actions workflows:**

- `ci.yml` - 每次 push/PR 时运行 Lint、测试、构建
- `deploy-staging.yml` - 自动部署到 Staging (develop 分支)
- `deploy-production.yml` - 手动部署到生产环境 (main 分支)

**部署步骤 / Deployment steps:**

1. 运行所有测试（合约、后端、前端）/ Run all tests (contracts, backend, frontend)
2. 构建 Docker 镜像 → 推送到 AWS ECR / Build Docker image → Push to AWS ECR
3. 部署到 Kubernetes → 滚动更新 / Deploy to Kubernetes → Rolling update
4. 运行冒烟测试 / Run smoke tests
5. 发送 Slack 通知 / Send Slack notification

---
