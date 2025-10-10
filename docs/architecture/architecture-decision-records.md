# 架构决策记录 / Architecture Decision Records

## ADR-001: 使用 Turborepo Monorepo / Use Turborepo Monorepo

**状态 / Status**: 已接受 / Accepted

**背景 / Context**: 需要在前端、后端和合约之间共享类型。

_Need to share types between frontend, backend, and contracts._

**决策 / Decision**: 使用 Turborepo monorepo 和 pnpm workspaces。

**后果 / Consequences**:

- ✅ 通过 `@trustless/shared` 共享类型
- ✅ 跨栈原子化变更
- ✅ CI/CD 提速 40-60%（缓存）
- ❌ 初始设置稍复杂

## ADR-002: 使用 Fastify 而非 Express / Use Fastify over Express

**状态 / Status**: 已接受 / Accepted

**背景 / Context**: 需要高吞吐量后端处理 Agent API 调用。

_Need high-throughput backend for Agent API calls._

**决策 / Decision**: 使用 Fastify 代替 Express。

**后果 / Consequences**:

- ✅ 性能提升 2-3 倍
- ✅ 原生 TypeScript 支持
- ✅ 内置 schema 验证
- ❌ 生态系统比 Express 小

## ADR-003: 使用 viem 而非 ethers.js / Use viem over ethers.js

**状态 / Status**: 已接受 / Accepted

**背景 / Context**: 需要现代化的 Web3 库，优秀的 TypeScript 支持。

_Need modern Web3 library with excellent TypeScript support._

**决策 / Decision**: 所有区块链交互使用 viem。

**后果 / Consequences**:

- ✅ 快 10 倍，bundle 40KB vs 300KB
- ✅ 更好的 TypeScript 类型推断
- ✅ 现代 API（原生 BigInt）
- ❌ 较新的库，Stack Overflow 答案较少

## ADR-004: 使用 PostgreSQL 而非 MongoDB / PostgreSQL over MongoDB

**状态 / Status**: 已接受 / Accepted

**背景 / Context**: 为后端服务选择数据库。

_Choose database for backend services._

**决策 / Decision**: 使用 PostgreSQL 配合 Prisma ORM。

**后果 / Consequences**:

- ✅ 关键数据的 ACID 事务
- ✅ 优秀的 TypeScript 集成（Prisma）
- ✅ JSONB 支持灵活 schema
- ❌ 水平扩展比 MongoDB 复杂

## ADR-005: OpenAI API (MVP) → 自托管 LLM (Post-MVP)

**状态 / Status**: 已接受 / Accepted

**背景 / Context**: Agent 审核需要 AI 模型进行内容分类。

_Agent moderation needs AI model for content classification._

**决策 / Decision**: MVP 使用 OpenAI GPT-4 Turbo API，10K MAU 后迁移至自托管 Llama 3。

**后果 / Consequences**:

- ✅ 快速 MVP 验证（< 2 周集成）
- ✅ 高准确率（85-90%）
- ❌ MVP 规模成本 $500-1000/月
- 📅 计划在 10K MAU 时迁移（成本降低 80%）

---
