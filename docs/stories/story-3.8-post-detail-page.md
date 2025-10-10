# Story 3.8: 帖子详情页

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P2 - Medium  
**Story Points**: 5

---

## User Story

**As a** 用户  
**I want** 点击帖子内容，打开帖子详情页，查看完整的帖子信息、所有评论、点赞用户列表  
**So that** 我可以深入查看帖子的完整上下文和社区讨论

---

## Acceptance Criteria

1. ✅ 创建页面 `app/posts/[id]/page.tsx`
2. ✅ 调用 API `GET /posts/:id`，获取帖子详情
3. ✅ 页面布局：导航栏、帖子内容、评论列表、评论输入框
4. ✅ 评论列表分页（每页 20 条）
5. ✅ 点击点赞数，弹出点赞用户列表
6. ✅ 分享功能：复制链接按钮

**依赖**: Story 3.7

**Story Status**: ✅ Ready

