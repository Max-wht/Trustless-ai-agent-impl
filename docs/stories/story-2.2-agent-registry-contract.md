# Story 2.2: Agent 注册智能合约开发

**Epic**: Epic 2 - Token Economy & Agent Registration  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者  
**I want** 开发 Agent 注册合约（AgentRegistry），允许任何人质押最低 1000 $TRUST 代币注册成为 Agent，记录 Agent 信息和质押金额  
**So that** Agent 可以加入审核网络，质押机制确保 Agent 有经济动机诚实审核

---

## Acceptance Criteria

1. ✅ 创建合约 `src/AgentRegistry.sol`

2. ✅ 定义 struct Agent：
   - address agentAddress
   - string serviceEndpoint（Agent 服务的 API 端点）
   - uint256 stakedAmount（质押金额）
   - uint256 reputationScore（信誉评分，初始 50）
   - uint256 registeredAt（注册时间）
   - bool isActive（是否活跃）

3. ✅ 实现函数 `registerAgent(string memory serviceEndpoint)`：
   - 要求调用者授权合约至少 1000 $TRUST（使用 `transferFrom`）
   - 从调用者地址转移代币到合约
   - 创建 Agent 记录
   - 触发事件 `AgentRegistered(address indexed agent, uint256 stakedAmount)`

4. ✅ 实现函数 `getAgent(address agentAddress)` 返回 Agent 信息

5. ✅ 实现函数 `getAllAgents()` 返回所有注册 Agent 的地址数组

6. ✅ 实现函数 `isActiveAgent(address)` 检查 Agent 是否活跃

7. ✅ 实现函数 `updateServiceEndpoint(string memory newEndpoint)`（Agent 可更新端点）

8. ✅ 实现函数 `deactivateAgent()`（Agent 可停用，但不取回质押金，需要 DAO 批准）

9. ✅ 编写完整测试 `test/AgentRegistry.t.sol`：
   - 测试成功注册（质押 1000 代币）
   - 测试质押不足失败（< 1000 代币）
   - 测试未授权失败
   - 测试更新端点
   - 测试停用 Agent

10. ✅ 运行 `forge test` 所有测试通过，覆盖率 > 90%

11. ✅ 部署到本地 Anvil，验证部署成功

12. ✅ 在 `packages/shared/src/constants/contracts.ts` 添加 AgentRegistry 地址

---

## Technical Notes

**最低质押要求:** 1000 $TRUST (1000 \* 10^18 Wei)

**依赖 / Dependencies**: Story 2.1 (TrustToken 必须先存在)  
**阻塞 / Blocks**: Story 2.3, 2.4, 2.5

---

**Story Status**: ✅ Ready for Development
