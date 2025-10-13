# Story 3.4: 时间线内容展示（真实数据）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P0 - Critical  
**Story Points**: 8

---

## User Story

**As a** 用户  
**I want** 在时间线查看我关注用户的最新帖子（从 IPFS 加载内容），按时间倒序排列，支持无限滚动加载  
**So that** 我可以消费内容，了解社区动态

---

## Acceptance Criteria

1. ✅ 后端实现 API 端点 `GET /feed`
2. ✅ 前端调用 API，显示帖子卡片
3. ✅ 实现无限滚动（Intersection Observer）
4. ✅ 未关注任何人时，显示"发现"Feed
5. ✅ 加载状态：Skeleton 帖子卡片
6. ✅ 性能：加载 20 条内容 < 2 秒

**依赖**: Story 3.3

**Story Status**: ✅ Ready
