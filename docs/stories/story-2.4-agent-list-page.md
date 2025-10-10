# Story 2.4: Agent 列表页面前端实现

**Epic**: Epic 2 - Token Economy & Agent Registration  
**Priority**: P1 - High  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 用户  
**I want** 访问 Agent 列表页面，查看所有注册的 Agent（地址、信誉评分、质押金额、注册时间），按信誉评分排序  
**So that** 我可以了解哪些 Agent 在守护平台内容质量，选择信任度高的 Agent（为 Phase 2 推荐系统准备）

---

## Acceptance Criteria

1. ✅ 创建页面 `app/agents/page.tsx`

2. ✅ 调用后端 API `GET /agents`，获取 Agent 列表

3. ✅ 使用 shadcn Table 组件展示 Agent 列表：
   - 列：Agent 地址（可点击复制）、信誉评分、质押金额、注册时间、状态（活跃/停用）
   - 默认按信誉评分降序排序
   - 支持点击列头切换排序（信誉、质押金额、时间）

4. ✅ 实现分页（每页 20 个 Agent）：
   - 使用 shadcn Pagination 组件
   - 页码切换时调用 API（`?page=2&limit=20`）

5. ✅ 实现筛选（shadcn Select 组件）：
   - 筛选活跃 Agent / 所有 Agent
   - 筛选高信誉（> 80）/ 中信誉（50-80）/ 低信誉（< 50）

6. ✅ 点击 Agent 地址，跳转到 Agent 详情页（`/agents/[address]`，暂时显示占位内容）

7. ✅ 显示 Agent 总数统计（"共 32 个 Agent 守护平台"）

8. ✅ 响应式设计：移动端使用 Card 列表（而非 Table）

9. ✅ 加载状态：显示 Skeleton Table

10. ✅ 空状态：无 Agent 时显示"暂无注册 Agent，成为第一个！"

11. ✅ 页面性能：加载 100 个 Agent < 1 秒

---

## Technical Notes

**依赖 / Dependencies**: Story 2.3 (Agent API)

---

**Story Status**: ✅ Ready for Development

