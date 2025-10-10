# 编码规范 / Coding Standards

## 关键全栈规则 / Critical Fullstack Rules

**1. 类型共享 / Type Sharing:**

始终在 `packages/shared` 定义类型，从 `@trustless/shared` 导入。

_Always define types in `packages/shared` and import from `@trustless/shared`._

**2. API 调用 / API Calls:**

不要直接发起 HTTP 请求 - 始终使用 API 客户端服务层。

_Never make direct HTTP calls - use API client service layer._

**3. 环境变量 / Environment Variables:**

仅通过 Zod 验证的配置对象访问，不要直接使用 `process.env`。

_Access only through config objects with Zod validation, never `process.env` directly._

**4. 错误处理 / Error Handling:**

所有异步函数必须有 try-catch，使用标准错误处理器。

_All async functions must have try-catch, use standard error handler._

**5. 状态更新 / State Updates:**

不要直接修改状态 - 使用 Zustand `set()` 或 React `setState()`。

_Never mutate state directly - use Zustand `set()` or React `setState()`._

**6. Token 金额使用 BigInt:**

对于 Wei 金额（18 位小数）始终使用 `bigint`，不要用 `number`。

_Always use `bigint` for Wei amounts (18 decimals), never `number`._

**7. 钱包地址规范化 / Wallet Address Normalization:**

存储/比较前始终将钱包地址转为小写。

_Always lowercase wallet addresses before storage/comparison._

## 命名约定 / Naming Conventions

| 元素 / Element    | 前端 / Frontend   | 后端 / Backend | 智能合约 / Contracts | 示例 / Example      |
| ----------------- | ----------------- | -------------- | -------------------- | ------------------- |
| 组件 / Components | PascalCase        | -              | -                    | `UserProfile.tsx`   |
| Hooks             | camelCase + 'use' | -              | -                    | `useAuth.ts`        |
| API 路由          | -                 | kebab-case     | -                    | `/api/user-profile` |
| 数据库表          | -                 | snake_case     | -                    | `user_preferences`  |
| 合约 / Contracts  | -                 | -              | PascalCase           | `TrustToken.sol`    |
| 函数 / Functions  | camelCase         | camelCase      | camelCase            | `formatAddress()`   |

## 代码风格 / Code Style

- **TypeScript**: Strict 模式，优先类型推断，使用 const assertions
- **React**: 函数式组件，命名导出，TypeScript props
- **Solidity**: 遵循风格指南，使用自定义错误（gas 高效）
- **导入顺序 / Imports**: 外部 → 内部 → 相对 → 样式
- **注释 / Comments**: 解释"为什么"而非"是什么"，公共 API 使用 JSDoc

---
