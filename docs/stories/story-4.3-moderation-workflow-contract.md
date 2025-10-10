# Story 4.3: 内容审核工作流智能合约（ModerationWorkflow）

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical  
**Story Points**: 13  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者  
**I want** 开发内容审核工作流合约，协调整个审核流程（请求 VRF 选择 Agent → 等待 Agent 判断 → 执行加权共识投票 → 更新内容状态）  
**So that** 内容审核过程完全自动化且去中心化，无需人工干预

---

## Acceptance Criteria

1. ✅ 创建合约 `src/ModerationWorkflow.sol`

2. ✅ 定义 struct AgentJudgment：address agent、bool decision、uint8 confidence、uint256 timestamp

3. ✅ 实现函数 `submitJudgment(uint256 contentId, bool decision, uint8 confidence)`

4. ✅ 实现函数 `executeConsensus(uint256 contentId)`（5 个 Agent 都提交后自动调用）：
   - 计算加权得分：`score = Σ(decision × confidence × agentReputation) / Σ(agentReputation)`
   - 如果 score > 0.6，设置内容状态为 Approved
   - 否则设置为 Rejected

5. ✅ 实现函数 `getModerationResult(uint256 contentId)` 返回审核结果和所有 Agent 判断

6. ✅ 实现超时机制：24 小时内未完成审核，自动拒绝

7. ✅ 编写测试 `test/ModerationWorkflow.t.sol`：
   - 测试 5 个 Agent 全部 Pass → Approved
   - 测试 3 Pass + 2 Reject → 根据权重计算
   - 测试加权投票正确性
   - 测试超时拒绝

8. ✅ 运行 `forge test` 所有测试通过，覆盖率 > 90%

9. ✅ 部署到本地 Anvil

---

## Technical Notes

**共识阈值:** 60% (可通过 DAO 调整)

**加权算法示例:** 详见 `docs/architecture/智能合约详解-smart-contract-details.md`

**依赖 / Dependencies**: Story 4.1, 2.2

---

**Story Status**: ✅ Ready for Development

