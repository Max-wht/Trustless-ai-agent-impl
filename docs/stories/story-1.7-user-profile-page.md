# Story 1.7: 用户个人主页基础界面

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P1 - High  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 用户 / User  
**I want** 访问我的个人主页，查看我的钱包地址、注册时间、信誉评分、关注/粉丝数（初始为 0）  
**So that** 我可以确认我的账户已创建，并了解我的基本信息

---

## Acceptance Criteria

1. ✅ 创建页面 `app/profile/[address]/page.tsx`（动态路由）

2. ✅ 从 URL 参数获取钱包地址

3. ✅ 调用后端 API `GET /users/:address`，获取用户档案

4. ✅ 使用 shadcn Card 显示用户信息：

   - Avatar（Blockies 生成）
   - 用户名
   - 简介
   - 注册时间
   - 信誉评分
   - 关注/粉丝数

5. ✅ 如果访问的是当前登录用户的主页，显示"编辑个人资料"按钮（暂时占位）

6. ✅ 如果访问的是其他用户主页，显示"关注"按钮（暂时禁用，Epic 3 实现）

7. ✅ 响应式设计：移动端单列布局，桌面端两列

8. ✅ 加载状态：显示骨架屏（Skeleton）

9. ✅ 错误处理：用户不存在，显示 404 页面

10. ✅ 页面加载时间 < 2 秒

---

## Technical Notes

**Blockies Avatar 生成:**

```typescript
import Blockies from "react-blockies";

<Blockies seed={walletAddress.toLowerCase()} size={10} scale={8} />;
```

**依赖 / Dependencies**: Story 1.6 (用户注册)  
**阻塞 / Blocks**: Epic 3 社交功能

---

**Story Status**: ✅ Ready for Development
