# Story 1.10: 简单时间线展示（Placeholder UI）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P2 - Medium  
**Story Points**: 3  
**Status**: Ready for Development

---

## User Story

**As a** 用户 / User  
**I want** 在主页查看时间线（目前显示欢迎信息和占位内容），了解未来将在这里看到关注用户的帖子  
**So that** 我可以理解平台的基本布局和功能方向

---

## Acceptance Criteria

1. ✅ 创建页面 `app/feed/page.tsx`（时间线页面）

2. ✅ 创建导航栏组件 `components/Navigation.tsx`：

   - Logo + "Trustless SocialFi"
   - 导航链接
   - ConnectButton

3. ✅ 时间线页面布局：

   - 左侧导航
   - 中间时间线主体（最大宽度 600px）
   - 右侧侧边栏占位

4. ✅ 主体区域显示欢迎卡片和 3 个占位帖子卡片（Mock 数据）

5. ✅ 响应式设计：移动端隐藏侧边栏，导航变为底部 Tab Bar

6. ✅ 页面加载时间 < 1 秒

7. ✅ 未连接钱包时，显示"请连接钱包"提示

8. ✅ 连接钱包后，URL 自动跳转到 `/feed`

---

## Technical Notes

**Mock 数据示例:**

```typescript
const mockPosts = [
  {
    id: "1",
    author: { username: "alice.eth", walletAddress: "0x..." },
    content: "Welcome to Trustless SocialFi!",
    likesCount: 42,
    createdAt: new Date(),
  },
  // ...
];
```

**依赖 / Dependencies**: Story 1.4, 1.5  
**阻塞 / Blocks**: Story 3.4（真实时间线）

---

**Story Status**: ✅ Ready for Development
