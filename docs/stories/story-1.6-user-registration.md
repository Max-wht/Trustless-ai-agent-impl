# Story 1.6: 用户注册与基础档案创建

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 新用户 / New User  
**I want** 连接钱包后自动创建我的用户档案（存储在数据库和智能合约），并跳转到我的个人主页  
**So that** 我在平台上有了身份，可以开始发布内容和社交互动

---

## Acceptance Criteria

### 智能合约 / Smart Contract

1. ✅ 创建智能合约 `src/UserRegistry.sol`：
   - 函数 `registerUser()`
   - 函数 `isRegistered(address)`
   - 函数 `getUserProfile(address)`
   - 事件 `UserRegistered`

2. ✅ 编写 Foundry 测试 `test/UserRegistry.t.sol`，覆盖率 > 90%

3. ✅ 部署 `UserRegistry` 合约到本地 Anvil

### 后端 / Backend

4. ✅ 后端创建 Prisma schema：User 表
   - id (UUID)
   - walletAddress (unique)
   - username
   - bio
   - createdAt
   - updatedAt

5. ✅ 后端创建 API 端点 `POST /users/register`：
   - 接收 `{ walletAddress, signature }`
   - 验证签名（viem）
   - 调用智能合约 `registerUser()`
   - 在数据库创建用户记录
   - 返回用户 ID 和档案

### 前端 / Frontend

6. ✅ 前端创建 Hook `useUserRegistration()`：
   - 检查当前钱包是否已注册
   - 未注册则自动调用后端 `/users/register`
   - 使用 wagmi `useSignMessage` 生成签名

7. ✅ 前端在钱包连接成功后，触发 `useUserRegistration()`

8. ✅ 注册成功后，跳转到 `/profile/[address]` 个人主页

9. ✅ 已注册用户连接钱包，直接跳转到主页（不重复注册）

### 测试 / Testing

10. ✅ 测试新用户注册流程（端到端）：连接钱包 → 签名 → 注册 → 跳转主页

11. ✅ 错误处理：签名拒绝、网络错误、合约调用失败，显示友好错误信息

---

## Technical Notes

**签名验证流程:**

```typescript
// 后端验证签名
import { verifyMessage } from 'viem';

const valid = await verifyMessage({
  address: walletAddress,
  message: 'Sign in to Trustless SocialFi',
  signature,
});
```

**依赖 / Dependencies**:

- Story 1.2 (UserRegistry 合约)
- Story 1.3 (后端 API)
- Story 1.5 (钱包连接)

**阻塞 / Blocks**: Story 1.7（个人主页需要用户数据）

---

**Story Status**: ✅ Completed & Verified

**验证报告**: [查看详细验证报告](./story-1.6-verification-report.md)
