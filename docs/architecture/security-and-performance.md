# 安全和性能 / Security and Performance

## 安全要求 / Security Requirements

**前端安全 / Frontend Security:**

- **CSP Headers**: 严格的内容安全策略 / Strict Content-Security-Policy
- **XSS 防护 / XSS Prevention**: React 自动转义 + DOMPurify（富文本）
- **安全存储 / Secure Storage**: HttpOnly cookies 存储 JWT（不用 localStorage）

**后端安全 / Backend Security:**

- **输入验证 / Input Validation**: 所有请求使用 Zod schema 验证
- **限流 / Rate Limiting**: 一般 100 req/min，发帖 10 req/min
- **CORS 策略 / CORS Policy**: 仅白名单可信来源
- **SQL 注入防护 / SQL Injection**: Prisma 参数化查询

**认证安全 / Authentication Security:**

- **Token 存储 / Token Storage**: HttpOnly, Secure, SameSite=Strict cookies
- **会话管理 / Session Management**: JWT 24 小时有效期 + refresh tokens
- **Nonce 机制 / Nonce Mechanism**: 一次性 nonce 防止重放攻击

## 性能优化 / Performance Optimization

**前端 / Frontend:**

- **Bundle 大小 / Bundle Size**: < 300KB 初始 JS (gzipped)
- **加载策略 / Loading Strategy**: 代码分割、懒加载、动态导入
- **缓存策略 / Caching**: 静态资源（1 年），API 数据（React Query 30s stale）
- **图片优化 / Image Optimization**: Next.js Image 组件，AVIF/WebP 格式

**后端 / Backend:**

- **响应时间 / Response Time**: P50 < 200ms, P95 < 500ms, P99 < 1s
- **数据库 / Database**: 索引查询、连接池（最多 100）
- **缓存 / Caching**: Redis 缓存热点数据（用户、Agent、IPFS 内容）
- **压缩 / Compression**: Gzip/Brotli 响应压缩

**关键性能目标 / Critical Performance Target:**

- **内容审核 / Content Moderation**: < 30 秒端到端（IPFS 上传 → Agent 判断 → 共识 → 结果）

---
