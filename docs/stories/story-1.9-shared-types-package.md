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
import { User } from '@trustless/shared';

// apps/api - 后端使用
import { User } from '@trustless/shared';
```

**依赖 / Dependencies**: Story 1.1 (Monorepo)  
**阻塞 / Blocks**: 所有需要共享类型的 Stories

---

## Dev Agent Record

**Agent Model Used**: Claude Sonnet 4.5

### Tasks Completed

- [x] 创建 types 目录及 4 个类型文件（user.ts, post.ts, agent.ts, api.ts）
- [x] 创建 utils 目录及工具函数（formatAddress, formatRelativeTime, validateEthAddress 等）
- [x] 创建 constants 目录及常量文件（contracts.ts, config.ts）
- [x] 配置 package.json 添加 exports 字段支持子路径导入
- [x] 更新 src/index.ts 导出所有类型、工具和常量
- [x] 构建 shared 包生成 TypeScript 声明文件
- [x] 在 agent-service 中集成使用共享类型和工具函数
- [x] 在 web-app 中集成使用共享类型和工具函数
- [x] 验证 TypeScript 编译和类型检查通过

### File List

**新建文件:**

- `packages/shared/src/types/user.ts` - 用户相关类型定义
- `packages/shared/src/types/post.ts` - 帖子相关类型定义
- `packages/shared/src/types/agent.ts` - Agent 相关类型定义
- `packages/shared/src/types/api.ts` - API 通用类型定义
- `packages/shared/src/types/index.ts` - 类型导出索引
- `packages/shared/src/utils/format.ts` - 格式化工具函数
- `packages/shared/src/utils/validation.ts` - 验证工具函数
- `packages/shared/src/utils/index.ts` - 工具导出索引
- `packages/shared/src/constants/contracts.ts` - 合约地址和配置
- `packages/shared/src/constants/config.ts` - 应用配置常量
- `packages/shared/src/constants/index.ts` - 常量导出索引

**修改文件:**

- `packages/shared/src/index.ts` - 更新主导出文件
- `packages/shared/package.json` - 添加 exports 配置
- `packages/agent-service/src/routes/users.ts` - 使用共享类型
- `packages/web-app/src/hooks/useUserRegistration.ts` - 使用共享类型

### Completion Notes

1. **类型定义**: 创建了完整的 TypeScript 类型系统，涵盖：
   - 用户类型：User, UserProfile, CreateUserRequest, UserResponse
   - 帖子类型：Post, PostWithUser, PostStatus, CreatePostRequest
   - Agent 类型：Agent, AgentJudgment, RegisterAgentRequest
   - API 类型：ApiResponse, PaginatedResponse, ErrorResponse, ErrorCodes

2. **工具函数**: 实现了常用工具函数：
   - **格式化**: formatAddress（地址缩写）, formatRelativeTime（相对时间）, formatTokenAmount（Token 金额）, formatNumber（大数字）
   - **验证**: validateEthAddress（以太坊地址）, validateIPFSHash（IPFS 哈希）, validateUsername（用户名）, validatePostContent（帖子内容）

3. **常量定义**:
   - **合约常量**: CHAIN_IDS, CONTRACT_ADDRESSES, RPC_URLS, getContractAddress()
   - **应用配置**: API_CONFIG, CONTENT_CONFIG, REPUTATION_CONFIG, TOKEN_CONFIG, AGENT_CONFIG, TIME, STORAGE_KEYS, REGEX

4. **Package 配置**:
   - 配置了 exports 字段支持子路径导入：`@trustless/shared`, `@trustless/shared/types`, `@trustless/shared/utils`, `@trustless/shared/constants`
   - 生成了完整的 TypeScript 声明文件（.d.ts）和 source maps

5. **集成验证**:
   - ✅ agent-service 成功导入并使用共享类型（User, CreateUserRequest, UserResponse）
   - ✅ agent-service 成功使用工具函数（formatAddress, validateEthAddress）
   - ✅ web-app 成功导入并使用共享类型
   - ✅ web-app TypeScript 类型检查通过
   - ✅ 功能验证：formatAddress('0x1234...7890') 正常工作

6. **构建输出**:
   - dist/ 目录包含完整的编译输出
   - 生成了 .js, .d.ts, .js.map, .d.ts.map 文件
   - 目录结构：types/, utils/, constants/, index.js

### Change Log

- 2025-10-13: 实施 Story 1.9 - 共享类型定义包完成

---

**Story Status**: ✅ Ready for Review
