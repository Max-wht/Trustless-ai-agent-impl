# Story 5.3: 质押金罚没机制

**Epic**: Epic 5 - Reputation System & Economic Incentives  
**Priority**: P1 - High  
**Story Points**: 8

---

## User Story

**As a** 智能合约开发者  
**I want** 实现质押金罚没机制，当 Agent 连续 10 次判断错误或单次恶意行为时，自动罚没部分或全部质押金  
**So that** 恶意 Agent 被经济惩罚，确保 Agent 网络的诚实性

---

## Acceptance Criteria

1. ✅ 在 `AgentRegistry.sol` 添加罚没功能
2. ✅ 惩罚规则：连续 10 次错误 → 罚没 20%
3. ✅ 实现 `slashAgent(address, amount, reason)`
4. ✅ 罚没代币转入 DAO 金库
5. ✅ 测试罚没逻辑

**依赖**: Story 5.1

**Story Status**: ✅ Ready

