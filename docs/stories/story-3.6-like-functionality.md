# Story 3.6: 点赞功能（Like/Unlike）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P1 - High  
**Story Points**: 5

---

## User Story

**As a** 用户  
**I want** 在时间线点击帖子的"点赞"按钮，点赞成功后按钮高亮，点赞数 +1  
**So that** 我可以表达对内容的喜欢，帮助优质内容获得更多曝光

---

## Acceptance Criteria

1. ✅ 在 `SocialGraph.sol` 添加点赞功能
2. ✅ 后端实现 API：`POST /posts/:id/like`、`DELETE /posts/:id/like`
3. ✅ 前端添加点赞按钮（Heart 图标）：未点赞灰色空心、已点赞红色实心 + 动画
4. ✅ 乐观更新 UI
5. ✅ 点赞数实时更新

**依赖**: Story 3.4 (Feed 显示)

**Story Status**: ✅ Ready
