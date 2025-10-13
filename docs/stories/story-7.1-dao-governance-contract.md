# Story 7.1: DAO 治理智能合约开发

**Epic**: Epic 7 - DAO Governance System  
**Priority**: P1 - High  
**Story Points**: 13

---

## User Story

**As a** 智能合约开发者  
**I want** 开发 DAO 治理合约（Governance），支持代币持有者提交提案和投票（1 代币 = 1 票），提案通过后自动执行  
**So that** 社区可以民主决定平台规则，实现去中心化自治

---

## Acceptance Criteria

1. ✅ 创建合约 `src/Governance.sol`

2. ✅ 定义 enum ProposalStatus { Pending, Active, Passed, Rejected, Executed }

3. ✅ 定义 struct Proposal（id, proposer, title, description, newRules, votes, timestamps）

4. ✅ 实现 `createProposal()`：要求 ≥ 1000 代币，投票期 7 天

5. ✅ 实现 `vote(proposalId, support)`：投票权 = 代币余额

6. ✅ 实现 `executeProposal()`：验证通过 → 更新 ModerationRules 合约

7. ✅ 实现紧急提案 `createEmergencyProposal()`：48 小时投票期

8. ✅ 编写测试：创建提案、投票、通过、执行、拒绝

9. ✅ 运行 `forge test`，覆盖率 > 90%

10. ✅ 部署到本地 Anvil

---

**依赖**: Story 2.1 (TrustToken)

**Story Status**: ✅ Ready
