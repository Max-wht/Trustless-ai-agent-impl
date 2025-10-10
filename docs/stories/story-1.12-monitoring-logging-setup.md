# Story 1.12: 基础监控与日志配置

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P1 - High  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** DevOps 工程师 / DevOps Engineer  
**I want** 为后端服务配置结构化日志（Pino）和错误追踪（Sentry），为前端配置 Sentry，设置基础监控 Dashboard  
**So that** 团队可以实时监控系统健康状态，快速定位和修复错误

---

## Acceptance Criteria

### 后端日志 / Backend Logging

1. ✅ 后端安装 `pino` 和 `pino-pretty`

2. ✅ 在 `src/lib/logger.ts` 配置 Pino：

   - 生产环境 JSON 格式
   - 开发环境 Pretty 格式

3. ✅ 在所有 API 端点添加请求日志

### 错误追踪 / Error Tracking

4. ✅ 后端安装并配置 Sentry SDK（`@sentry/node`）

5. ✅ 前端安装并配置 Sentry SDK（`@sentry/nextjs`）

6. ✅ 创建 Sentry 项目

7. ✅ 配置 Sentry DSN（环境变量）

### 监控指标 / Monitoring Metrics

8. ✅ 后端添加 `GET /metrics` 端点（Prometheus 格式）

### 验证测试 / Verification Tests

9. ✅ 测试：触发一个错误，Sentry 收到错误报告

10. ✅ 测试：查看 `/metrics` 端点，返回 Prometheus 格式指标

11. ✅ 在 `README.md` 记录监控和日志查看方法

---

## Technical Notes

**Pino 配置示例:**

```typescript
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty" }
      : undefined,
});
```

**依赖 / Dependencies**: Story 1.3 (后端), Story 1.4 (前端)

---

**Story Status**: ✅ Ready for Development
