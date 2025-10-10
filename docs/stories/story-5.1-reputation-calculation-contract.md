# Story 5.1: Agent 信誉计算智能合约

**Epic**: Epic 5 - Reputation System & Economic Incentives  
**Priority**: P0 - Critical  
**Story Points**: 13  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者  
**I want** 开发信誉计算合约（ReputationSystem），基于历史审核准确率和内容质量反馈动态计算 Agent 信誉评分，实现每周 5% 的时间衰减  
**So that** Agent 的信誉评分准确反映其近期表现，防止"慢性毒药攻击"

---

## Acceptance Criteria

1. ✅ 创建合约 `src/ReputationSystem.sol`

2. ✅ 定义信誉计算公式：`Score = Σ(判断质量 × 时间衰减因子 × 内容质量反馈)`

3. ✅ 实现函数 `updateAgentReputation(address agent, uint256 contentId, bool wasCorrect)`：
   - 判断与共识一致 = +10 分
   - 判断与共识不一致 = -5 分
   - 应用时间衰减

4. ✅ 实现函数 `applyTimeDecay()`（每周调用）：
   - 遍历所有 Agent
   - 信誉评分 × 0.95

5. ✅ 实现函数 `getAgentReputation(address)`、`getReputationHistory(address)`

6. ✅ 编写测试：
   - 正确判断 +10 分
   - 错误判断 -5 分
   - 时间衰减 95%

7. ✅ 运行 `forge test`，覆盖率 > 90%

8. ✅ 部署到本地 Anvil

9. ✅ 在 `packages/shared` 添加合约地址

---

## Technical Notes

**时间衰减示例:**
- Week 0: 80 分
- Week 1: 76 分 (×0.95)
- Week 4: 65.2 分
- Week 8: 53.5 分

**依赖 / Dependencies**: Story 4.3 (ModerationWorkflow)

---

**Story Status**: ✅ Ready for Development

