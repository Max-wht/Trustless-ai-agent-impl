# Story 4.5: 审核进度与结果前端展示

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 用户  
**I want** 发布内容后，在时间线看到"审核中"状态和进度条（5 个 Agent 判断进度），审核完成后查看详细结果  
**So that** 我可以实时了解审核进度，理解内容为何被通过或拒绝（透明度核心功能）

---

## Acceptance Criteria

1. ✅ 帖子卡片在审核期间显示：
   - "🕐 审核中..."
   - 进度条（5 个 Agent，已完成 2/5）
   - "预计还需 20 秒"

2. ✅ 实现前端轮询：每 5 秒调用 `GET /moderation/:contentId/status`

3. ✅ 审核完成后（Approved）：帖子正常显示 + "✅ 已通过审核"徽章

4. ✅ 审核拒绝后（Rejected）：显示"❌ 内容未通过审核" + 拒绝原因

5. ✅ 点击"查看审核详情"，弹出 Dialog：
   - 显示 5 个 Agent 卡片（地址、信誉、判断、置信度）
   - 显示最终加权得分
   - 显示审核时间线

6. ✅ 颜色编码：Pass 绿色、Reject 红色

7. ✅ 性能：审核详情加载 < 1 秒

---

## Technical Notes

**轮询 vs WebSocket:** MVP 使用轮询，Phase 2 考虑 WebSocket

**依赖 / Dependencies**: Story 4.4

---

**Story Status**: ✅ Ready for Development

