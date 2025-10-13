# Story 3.7: 评论功能（Comment）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P2 - Medium  
**Story Points**: 8

---

## User Story

**As a** 用户  
**I want** 在帖子下方点击"评论"按钮，输入评论文本（≤ 280 字符），发布后评论显示在帖子下方  
**So that** 我可以与内容作者互动，参与讨论

---

## Acceptance Criteria

1. ✅ 扩展 Prisma schema：Comment 表
2. ✅ 评论上传到 IPFS，哈希存储在数据库
3. ✅ 后端实现 API：`POST /posts/:id/comments`、`GET /posts/:id/comments`
4. ✅ 前端添加评论按钮和评论区域（Collapsible）
5. ✅ 评论显示：作者头像 + 用户名、文本、时间

**依赖**: Story 3.6

**Story Status**: ✅ Ready
