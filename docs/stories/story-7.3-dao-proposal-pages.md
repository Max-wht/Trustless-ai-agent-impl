# Story 7.3: DAO 提案列表与详情页面

**Epic**: Epic 7 - DAO Governance System  
**Priority**: P1 - High  
**Story Points**: 8

---

## User Story

**As a** 代币持有者  
**I want** 访问 DAO 治理页面，查看所有提案，点击查看详情并投票  
**So that** 我可以参与平台治理，对合规规则的修改投票

---

## Acceptance Criteria

1. ✅ 创建页面 `app/governance/page.tsx`

2. ✅ 后端实现 API `GET /governance/proposals`

3. ✅ 使用 shadcn Tabs 分组：进行中、已通过、已拒绝

4. ✅ 每个提案显示：标题、提案者、投票进度条、倒计时、状态徽章

5. ✅ 创建提案详情页 `app/governance/proposals/[id]/page.tsx`

6. ✅ 实现投票按钮："赞成"（绿色）、"反对"（红色）

7. ✅ 点击投票 → 确认 Dialog → 调用合约 `vote()`

8. ✅ 已投票提案显示"已投票"徽章

---

**依赖**: Story 7.1

**Story Status**: ✅ Ready

