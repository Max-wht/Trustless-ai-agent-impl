# Story 7.2: 合规规则存储与动态更新

**Epic**: Epic 7 - DAO Governance System  
**Priority**: P1 - High  
**Story Points**: 5

---

## User Story

**As a** 智能合约开发者  
**I want** 开发合规规则存储合约（ModerationRules），存储当前生效的规则，支持 DAO 投票后动态更新  
**So that** 合规规则由社区治理，规则更新后所有 Agent 自动同步

---

## Acceptance Criteria

1. ✅ 创建合约 `src/ModerationRules.sol`

2. ✅ 初始化创世规则（constructor）：
   - "禁止暴力内容"
   - "禁止诈骗信息"
   - "禁止仇恨言论"
   - "禁止成人内容（NSFW）"
   - "禁止虚假信息"

3. ✅ 实现 `updateRules(string[] memory newRules)`：只能由 Governance 调用

4. ✅ 实现 `getRules()` 返回当前规则列表

5. ✅ 实现 `getRuleHistory()` 返回历史版本（最近 10 次）

6. ✅ 修改 Agent 审核服务：从合约读取最新规则

7. ✅ 测试：DAO 投票通过 → 规则更新 → Agent 使用新规则

---

**依赖**: Story 7.1

**Story Status**: ✅ Ready
