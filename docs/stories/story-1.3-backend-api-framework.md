# Story 1.3: 后端 API 框架搭建（Fastify + TypeScript）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者 / Backend Developer  
**I want** 在 `packages/agent-service/` 创建 Fastify + TypeScript 后端项目，实现健康检查 API 端点，配置数据库连接（Prisma + PostgreSQL）  
**So that** 后端服务框架就绪，可以开始开发 Agent 审核、IPFS 集成、区块链交互等功能

---

## Acceptance Criteria

1. ✅ 在 `packages/agent-service/` 初始化 TypeScript 项目，配置 `tsconfig.json`（strict mode）

2. ✅ 安装依赖：`fastify`、`@fastify/cors`、`dotenv`、`typescript`、`ts-node`、`@types/node`

3. ✅ 创建 `src/index.ts`，初始化 Fastify 服务器，监听端口 3001

4. ✅ 实现 `GET /health` 端点，返回：

   ```json
   {
     "status": "ok",
     "service": "agent-service",
     "timestamp": Date.now()
   }
   ```

5. ✅ 配置 CORS（允许 `http://localhost:3000` 前端访问）

6. ✅ 配置环境变量（`.env`）：
   - `PORT=3001`
   - `DATABASE_URL`
   - `NODE_ENV`

7. ✅ 安装并配置 Prisma：`npx prisma init`

8. ✅ 创建第一个 Prisma schema（`schema.prisma`）：定义 User 表（id、walletAddress、createdAt）

9. ✅ 运行 `prisma migrate dev` 创建数据库和表

10. ✅ 实现简单的 `GET /users` 端点，从数据库查询所有用户（使用 Prisma Client）

11. ✅ 配置启动脚本（`package.json`）：
    - `dev`（ts-node-dev）
    - `build`（tsc）
    - `start`（node dist）

12. ✅ 运行 `pnpm dev` 成功，服务启动在 http://localhost:3001

13. ✅ 使用 curl 或 Postman 测试 `/health` 和 `/users` 端点成功

14. ✅ 在 `packages/agent-service/README.md` 记录 API 端点和启动命令

---

## Technical Notes

**需要 Docker 运行 PostgreSQL:**

```bash
docker-compose up -d postgres
```

**依赖 / Dependencies**: Story 1.1 (Monorepo)  
**阻塞 / Blocks**: Story 1.8, 2.3, 3.2（所有后端功能）

---

**Story Status**: ✅ Completed & Verified

**验证报告**: [查看详细验证报告](./story-1.3-verification-report.md)
