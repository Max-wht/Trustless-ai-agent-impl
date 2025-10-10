# Story 7.4: 提案创建界面

**Epic**: Epic 7 - DAO Governance System  
**Priority**: P2 - Medium  
**Story Points**: 5

---

## User Story

**As a** 代币持有者  
**I want** 创建新提案（填写标题、描述、新的合规规则），提交到 DAO 进行投票  
**So that** 我可以提议修改平台规则，如果社区支持则规则更新

---

## Acceptance Criteria

1. ✅ 创建页面 `app/governance/create/page.tsx`

2. ✅ 使用 React Hook Form + Zod：
   - 标题（≤ 100 字符）
   - 描述（≤ 1000 字符）
   - 新规则（Textarea，多行）

3. ✅ 显示提案门槛："需要 ≥ 1000 $TRUST"

4. ✅ 余额 < 1000，禁用提交按钮

5. ✅ 调用合约 `createProposal()` → 跳转到详情页

6. ✅ 提供"预览"和"保存草稿"功能

---

**依赖**: Story 7.3

**Story Status**: ✅ Ready

