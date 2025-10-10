# Story 5.2: 代币奖励分配系统

**Epic**: Epic 5 - Reputation System & Economic Incentives  
**Priority**: P1 - High  
**Story Points**: 8

---

## User Story

**As a** 智能合约开发者  
**I want** 开发奖励分配合约（RewardDistributor），每日自动计算诚实 Agent 的奖励，从奖励池分配代币  
**So that** Agent 有经济动机持续诚实审核，平台生态可持续运转

---

## Acceptance Criteria

1. ✅ 创建合约 `src/RewardDistributor.sol`
2. ✅ 奖励池：40% 总量（4000 万代币）
3. ✅ 实现 `calculateDailyRewards()`
4. ✅ 实现 `claimReward()`
5. ✅ 测试奖励计算和领取

**依赖**: Story 5.1

**Story Status**: ✅ Ready

