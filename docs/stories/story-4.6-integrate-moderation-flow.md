# Story 4.6: 修改内容发布流程集成审核

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 用户  
**I want** 发布内容后，内容先进入审核流程（选择 Agent → Agent 审核 → 共识投票），通过后自动显示在时间线  
**So that** 平台上的内容经过质量把关，垃圾内容和违规信息被过滤

---

## Acceptance Criteria

1. ✅ 修改 `ContentRegistry.publishContent()`：内容初始状态设为 Pending（而非 Approved）

2. ✅ 修改后端 `POST /posts` API：
   - 上传 IPFS
   - 调用 `ContentRegistry.publishContent()`
   - 自动调用 `AgentSelector.requestAgentSelection()`

3. ✅ 实现"我的帖子"页面（`app/my-posts/page.tsx`）：
   - 显示当前用户的所有帖子
   - 区分：审核中、已通过、已拒绝

4. ✅ 审核完成后，前端收到通知

5. ✅ 修改时间线 API `GET /feed`：只返回 status = Approved 的内容

6. ✅ 测试端到端流程：发布 → VRF 选择 → Agent 审核 → 共识投票 → 通过 → 显示

7. ✅ 整个审核流程 < 30 秒

---

## Technical Notes

**重大变更:** 将 Epic 3 的直接发布改为审核流程

**性能目标:** 30 秒端到端

**依赖 / Dependencies**: Story 4.5, 3.3

---

**Story Status**: ✅ Ready for Development
