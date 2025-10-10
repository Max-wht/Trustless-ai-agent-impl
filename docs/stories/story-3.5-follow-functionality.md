# Story 3.5: 关注功能（Follow/Unfollow）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P0 - Critical  
**Story Points**: 8

---

## User Story

**As a** 用户  
**I want** 在其他用户的个人主页点击"关注"按钮，关注成功后按钮变为"已关注"  
**So that** 我可以在时间线看到我关注用户的内容，建立社交关系

---

## Acceptance Criteria

1. ✅ 创建智能合约 `src/SocialGraph.sol`
2. ✅ 实现函数：`follow`、`unfollow`、`isFollowing`、`getFollowing`、`getFollowers`
3. ✅ 检查：不能关注自己、不能重复关注
4. ✅ 编写测试，覆盖率 > 90%
5. ✅ 后端实现 API：`POST /users/:address/follow`、`DELETE /users/:address/follow`
6. ✅ 前端添加"关注"按钮，交易确认后更新 UI

**依赖**: Story 1.7 (用户主页)

**Story Status**: ✅ Ready

