# Story 4.4: 后端审核协调服务（Orchestrator）

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical  
**Story Points**: 13  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者  
**I want** 开发审核协调服务，监听 `AgentsSelected` 事件，自动调用 5 个 Agent 的审核端点，收集判断结果并提交到智能合约  
**So that** 审核流程自动化执行，Agent 服务无需直接与区块链交互，降低 Agent 运营门槛

---

## Acceptance Criteria

1. ✅ 在 `src/services/orchestrator.ts` 创建协调服务

2. ✅ 使用 viem 监听 `AgentSelector` 合约的 `AgentsSelected` 事件

3. ✅ 事件触发时：
   - 获取 contentId 和选中的 5 个 Agent 地址
   - 从 AgentRegistry 读取每个 Agent 的 serviceEndpoint
   - 从 IPFS 加载内容文本
   - 并行调用 5 个 Agent 的 `/moderate` 端点
   - 收集判断结果

4. ✅ 实现函数 `callAgentService(endpoint, content)`（超时 15 秒）

5. ✅ 收集到所有 5 个判断后，调用智能合约 `ModerationWorkflow.submitJudgment()`（5 次交易）

6. ✅ 实现重试机制：Agent 服务不可用时重试 3 次

7. ✅ 实现降级策略：某个 Agent 超时，使用默认判断（Reject，低置信度）

8. ✅ 记录审核日志到数据库（ModerationLog 表）

9. ✅ 实现 API 端点 `GET /moderation/:contentId/status`：返回审核进度（5 个 Agent 中已完成几个）

10. ✅ 测试：发布内容 → 触发 VRF → AgentsSelected 事件 → 自动调用 Agent 服务 → 提交判断

11. ✅ 测试：审核流程 < 30 秒（5 个 Agent 并行）

---

## Technical Notes

**关键服务:** 这是整个审核系统的协调中心

**性能目标:** 30 秒内完成（5 个 Agent 并行，最慢的决定总时间）

**依赖 / Dependencies**: Story 4.2, 4.3

---

**Story Status**: ✅ Ready for Development
