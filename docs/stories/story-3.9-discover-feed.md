# Story 3.9: 发现 Feed（所有用户内容）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P2 - Medium  
**Story Points**: 3

---

## User Story

**As a** 新用户（未关注任何人）  
**I want** 在时间线查看"发现"Feed，显示所有用户的最新内容  
**So that** 我可以快速找到值得关注的用户，建立社交网络

---

## Acceptance Criteria

1. ✅ 修改时间线页面，添加 Tab 切换（shadcn Tabs）："关注" Tab、"发现" Tab
2. ✅ 后端实现 API `GET /posts/discover`
3. ✅ "发现" Tab 显示所有内容
4. ✅ 未关注任何人时自动切换到"发现"
5. ✅ 性能：加载 20 条内容 < 2 秒

**依赖**: Story 3.4

**Story Status**: ✅ Ready
