# Story 1.8: 数据库初始化与 Prisma 配置

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者 / Backend Developer  
**I want** 配置 PostgreSQL 数据库（本地 Docker），使用 Prisma 创建完整的 schema（User、Post、Like、Follow 表），运行迁移生成数据库结构  
**So that** 后端服务可以持久化存储用户数据、内容数据、社交关系，支持高效查询

---

## Acceptance Criteria

1. ✅ 创建 `docker-compose.yml`：

   - PostgreSQL 15 服务（端口 5432）
   - Redis 7 服务（端口 6379）

2. ✅ 运行 `docker-compose up -d` 启动数据库

3. ✅ 在 `packages/agent-service/prisma/schema.prisma` 定义完整 schema：

   - User 表
   - Post 表
   - Like 表
   - Follow 表

4. ✅ 运行 `prisma migrate dev --name init` 创建初始迁移

5. ✅ 检查数据库，确认所有表和索引已创建

6. ✅ 运行 `prisma generate` 生成 TypeScript 类型

7. ✅ 在 `src/lib/db.ts` 创建 Prisma Client 单例

8. ✅ 在 `GET /users` 端点中使用 `prisma.user.findMany()` 查询数据库

9. ✅ 创建 Seed 脚本 `prisma/seed.ts`，插入 5 个测试用户

10. ✅ 运行 `prisma db seed` 成功，数据库有 5 条用户记录

11. ✅ 使用 Prisma Studio（`prisma studio`）可视化查看数据

---

## Technical Notes

**Prisma Schema 参考:**
详见 `docs/architecture/数据库-schema-database-schema.md`

**依赖 / Dependencies**: Story 1.3 (后端框架)

---

**Story Status**: ✅ Ready for Development
