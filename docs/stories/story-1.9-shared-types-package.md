# Story 1.9: 共享类型定义包（shared package）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 3  
**Status**: Ready for Development

---

## User Story

**As a** 开发者 / Developer  
**I want** 在 `packages/shared/` 创建共享的 TypeScript 类型定义和工具函数（合约 ABI 类型、API 请求/响应类型、工具函数）  
**So that** 前端和后端可以复用类型定义，确保类型安全，避免重复代码

---

## Acceptance Criteria

1. ✅ 在 `packages/shared/` 初始化 TypeScript 项目

2. ✅ 配置 `tsconfig.json`（declaration: true，输出 `.d.ts` 文件）

3. ✅ 创建 `src/types/`：定义 user.ts、post.ts、agent.ts、api.ts 接口

4. ✅ 创建 `src/utils/`：实现工具函数

   - formatAddress
   - formatRelativeTime
   - validateEthAddress

5. ✅ 创建 `src/constants/`：定义常量

   - contracts.ts（合约地址）
   - config.ts（应用配置）

6. ✅ 配置 `package.json`：

   - `name: @trustless/shared`
   - exports 配置

7. ✅ 创建 `src/index.ts`，导出所有类型和工具

8. ✅ 运行 `pnpm build` 生成 `dist/` 目录

9. ✅ 在 `agent-service` 和 `web-app` 的 `package.json` 中添加依赖：
   `@trustless/shared: workspace:*`

10. ✅ 在后端和前端导入并使用共享类型

11. ✅ TypeScript 编译成功，类型检查通过

---

## Technical Notes

**类型共享示例:**

```typescript
// packages/shared/src/types/user.ts
export interface User {
  id: string;
  walletAddress: `0x${string}`;
  username?: string;
  reputationScore: number;
}

// apps/web - 前端使用
import { User } from "@trustless/shared";

// apps/api - 后端使用
import { User } from "@trustless/shared";
```

**依赖 / Dependencies**: Story 1.1 (Monorepo)  
**阻塞 / Blocks**: 所有需要共享类型的 Stories

---

**Story Status**: ✅ Ready for Development
