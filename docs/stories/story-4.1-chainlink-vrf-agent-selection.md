# Story 4.1: Chainlink VRF 随机 Agent 选择合约

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical (核心差异化功能)  
**Story Points**: 13  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者  
**I want** 集成 Chainlink VRF v2.5，实现随机选择 5 个 Agent 的函数（选择概率基于 Agent 信誉评分加权）  
**So that** 内容审核过程公平且不可预测，防止 Agent 串通或操纵审核结果

---

## Acceptance Criteria

1. ✅ 安装 Chainlink Contracts：`forge install smartcontractkit/chainlink-brownie-contracts`

2. ✅ 创建合约 `src/AgentSelector.sol`，继承 `VRFConsumerBaseV2`

3. ✅ 配置 Chainlink VRF Coordinator（Arbitrum Sepolia 地址）

4. ✅ 实现函数 `requestAgentSelection(uint256 contentId)`：
   - 调用 Chainlink VRF `requestRandomWords()`
   - 存储 requestId → contentId 映射
   - 触发事件 `AgentSelectionRequested`

5. ✅ 实现回调函数 `fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)`：
   - 从 AgentRegistry 获取所有活跃 Agent
   - 基于信誉评分计算加权概率分布
   - 使用随机数选择 5 个不重复的 Agent
   - 触发事件 `AgentsSelected(uint256 indexed contentId, address[] agents)`

6. ✅ 实现函数 `getSelectedAgents(uint256 contentId)` 返回选中的 5 个 Agent 地址

7. ✅ 编写测试 `test/AgentSelector.t.sol`：
   - Mock VRF Coordinator
   - 测试加权概率选择逻辑
   - 测试选择 5 个不重复 Agent

8. ✅ 运行 `forge test` 所有测试通过

9. ✅ 部署到本地 Anvil（使用 Mock VRF Coordinator）

10. ✅ 在 `packages/shared/src/constants/contracts.ts` 添加 AgentSelector 地址

---

## Technical Notes

**VRF 回调时间:** 2-3 秒

**加权选择算法:**
- Agent 信誉 90 → 权重 90
- Agent 信誉 50 → 权重 50
- 选中概率：90/140 = 64% vs 36%

**依赖 / Dependencies**: Story 2.2 (AgentRegistry)

---

**Story Status**: ✅ Ready for Development

