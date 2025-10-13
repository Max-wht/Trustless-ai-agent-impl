# Story 7.5: 治理权移交与创世规则

**Epic**: Epic 7 - DAO Governance System  
**Priority**: P2 - Medium  
**Story Points**: 3

---

## User Story

**As a** 项目团队  
**I want** 在 MVP 上线 1 个月后，执行治理权移交，将 ModerationRules 合约的所有权从团队转移到 Governance 合约  
**So that** 社区获得真正的自治权，平台实现去中心化承诺

---

## Acceptance Criteria

1. ✅ 在 `ModerationRules.sol` 实现 `transferOwnership(address newOwner)`

2. ✅ 创建治理移交脚本 `script/TransferGovernance.s.sol`

3. ✅ 移交前：团队控制规则，DAO 提案可创建但不执行

4. ✅ 移交后：规则只能通过 DAO 提案执行，团队失去权限

5. ✅ 前端显示治理状态：
   - 移交前："⏳ 治理权将在 [日期] 移交社区"
   - 移交后："✅ 社区完全自治"

6. ✅ 准备公告文案

7. ✅ 创建第一个社区提案（测试 DAO 流程）

8. ✅ 测试：移交后团队尝试更新规则 → 失败

---

**依赖**: Story 7.1, 7.2

**Story Status**: ✅ Ready
