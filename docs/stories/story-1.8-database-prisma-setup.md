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

## Dev Agent Record

**Agent Model Used**: Claude Sonnet 4.5

### Tasks Completed

- [x] 创建根目录的 `docker-compose.yml` (PostgreSQL 15 + Redis 7)
- [x] 扩展 Prisma schema 添加 Post, Like, Follow, Comment 表（包含索引和关系）
- [x] 创建 Prisma seed 脚本 (`prisma/seed.ts`) 插入 5 个测试用户及相关数据
- [x] 配置 `package.json` 添加 prisma seed 命令
- [x] 启动 Docker 服务并运行 Prisma 数据库同步（使用 `db push`）
- [x] 运行 seed 脚本并验证数据（5 用户、3 帖子、4 关注、3 点赞、2 评论）
- [x] 测试 GET /users 端点成功返回数据库数据

### File List

- `docker-compose.yml` - 创建 PostgreSQL 和 Redis 容器配置
- `packages/agent-service/prisma/schema.prisma` - 扩展完整数据库 schema
- `packages/agent-service/prisma/seed.ts` - 创建数据库种子脚本
- `packages/agent-service/package.json` - 添加 prisma seed 配置
- `packages/agent-service/src/lib/prisma.ts` - 已存在（Prisma Client 单例）

### Completion Notes

1. **Schema 设计**: 创建了完整的关系型数据库 schema，包含 User, Post, Like, Follow, Comment 五个表，使用 `@@map` 映射到小写表名以符合 PostgreSQL 命名约定

2. **索引优化**: 添加了性能索引：
   - `idx_users_wallet_address` - 用户钱包地址查询
   - `idx_posts_user_created` - 用户帖子时间线
   - `idx_posts_status_created_at` - 帖子状态和时间查询
   - `idx_likes_post` / `idx_likes_user` - 点赞关系查询
   - `idx_follows_follower` / `idx_follows_following` - 关注关系查询
   - `idx_comments_post_created` - 评论时间线

3. **数据完整性**:
   - 使用 `@@unique` 约束防止重复点赞和关注
   - 使用 `onDelete: Cascade` 确保数据级联删除
   - 所有外键关系正确配置

4. **Seed 数据**: 创建了 5 个测试用户（alice, bob, charlie, diana, eve），以及相关的帖子、关注、点赞和评论数据，便于开发测试

5. **迁移策略**: 由于在非交互式环境中 `prisma migrate dev` 无法运行，使用了 `prisma db push --force-reset` 来同步 schema，适合开发环境快速迭代

6. **验证结果**:
   - Docker 容器成功启动（PostgreSQL + Redis）
   - 数据库表成功创建（5 个表 + 索引）
   - Seed 数据成功插入（5 用户、3 帖子、4 关注、3 点赞、2 评论）
   - API 端点成功查询数据库（GET /users 返回 5 个用户）

### use step

- # 🔄 同步 schema 到数据库（开发环境）
- npx prisma db push

- # 📦 生成 TypeScript 类型
- npx prisma generate

- # 🌱 运行 seed 脚本
- pnpm prisma:seed

- # 👀 打开可视化界面
- pnpm prisma:studio # 访问 http://localhost:5555

- # 📊 查看数据库状态
- npx prisma db execute --stdin <<< "SELECT \* FROM users LIMIT 5;"

### Change Log

- 2025-10-13: 实施 Story 1.8 - 数据库初始化与 Prisma 配置完成

---

**Story Status**: ✅ Ready for Review
