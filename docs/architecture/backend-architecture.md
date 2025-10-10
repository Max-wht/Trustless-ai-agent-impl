# 后端架构 / Backend Architecture

## 服务架构 / Service Architecture

**传统服务器架构（Kubernetes）/ Traditional Server (Kubernetes)** - 长期运行的进程用于 Agent 编排和事件监听。

_Long-running processes for Agent orchestration and event listening._

**控制器组织 / Controller Organization:**

```
apps/api/src/
├── routes/                       # API 端点 / API endpoints
│   ├── auth.routes.ts            # 认证路由 / Auth routes
│   ├── users.routes.ts           # 用户路由 / User routes
│   ├── posts.routes.ts           # 帖子路由 / Post routes
│   └── agents.routes.ts          # Agent 路由 / Agent routes
├── services/                     # 业务逻辑 / Business logic
│   ├── AgentOrchestrator.ts      # Agent 编排器 / Agent orchestrator
│   ├── IPFSService.ts            # IPFS 服务 / IPFS service
│   ├── ModerationService.ts      # 审核服务 / Moderation service
│   └── BlockchainService.ts      # 区块链服务 / Blockchain service
├── repositories/                 # 数据访问 / Data access
│   ├── UserRepository.ts         # 用户仓储 / User repository
│   └── PostRepository.ts         # 帖子仓储 / Post repository
└── middleware/                   # Fastify 中间件 / Fastify middleware
    ├── auth.ts                   # 认证中间件 / Auth middleware
    ├── rateLimit.ts              # 限流中间件 / Rate limit middleware
    └── errorHandler.ts           # 错误处理器 / Error handler
```

## 认证流程 / Authentication Flow

1. 前端请求 nonce / Frontend requests nonce (`GET /auth/nonce`)
2. 用户用钱包签名消息 / User signs message with wallet
3. 后端用 viem 验证签名 / Backend verifies signature with viem
4. 后端生成 JWT（24 小时有效期）/ Backend generates JWT (24h expiry)
5. 后续请求在 Authorization header 中包含 JWT / Subsequent requests include JWT in Authorization header

---
