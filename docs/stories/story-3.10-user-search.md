# Story 3.10: 用户搜索与关注推荐

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P2 - Medium  
**Story Points**: 5

---

## User Story

**As a** 用户  
**I want** 搜索其他用户（通过地址或用户名），查看搜索结果，点击进入用户主页并关注  
**So that** 我可以找到感兴趣的创作者，扩展我的社交网络

---

## Acceptance Criteria

1. ✅ 在导航栏添加搜索框（shadcn Input + Command）
2. ✅ 后端实现 API `GET /users/search?q=query`
3. ✅ 输入 3 个字符后自动搜索（debounce 300ms）
4. ✅ 显示结果下拉列表（shadcn Command）
5. ✅ 搜索框快捷键：Ctrl/Cmd + K
6. ✅ 搜索响应 < 500ms

**依赖**: Story 3.5

**Story Status**: ✅ Ready

