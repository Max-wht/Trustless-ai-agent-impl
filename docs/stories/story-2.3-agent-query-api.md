# Story 2.3: 后端 Agent 信息查询 API

**Epic**: Epic 2 - Token Economy & Agent Registration  
**Priority**: P1 - High  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者  
**I want** 实现 API 端点查询注册的 Agent 信息（从智能合约读取），并缓存到数据库提高查询效率  
**So that** 前端可以快速获取所有 Agent 列表和详情，无需直接调用智能合约

---

## Acceptance Criteria

1. ✅ 安装 viem：`pnpm add viem`

2. ✅ 在 `src/lib/web3.ts` 创建 viem Client（连接 Arbitrum Sepolia）

3. ✅ 导入 AgentRegistry 合约 ABI（从 Foundry 编译输出复制）

4. ✅ 实现函数 `fetchAgentsFromChain()`：调用合约 `getAllAgents()`，遍历获取每个 Agent 详情

5. ✅ 创建 Prisma schema：Agent 表
   - id、walletAddress、serviceEndpoint、stakedAmount、reputationScore、registeredAt、isActive

6. ✅ 实现函数 `syncAgentsToDb()`：从链上读取 Agent，同步到数据库（upsert）

7. ✅ 实现 API 端点 `GET /agents`：
   - 从数据库查询所有 Agent（Prisma）
   - 支持分页（query params: page、limit）
   - 支持排序（by: reputationScore desc）
   - 返回 Agent 列表

8. ✅ 实现 API 端点 `GET /agents/:address`：返回单个 Agent 详情

9. ✅ 创建定时任务（使用 Bull）：每 5 分钟运行 `syncAgentsToDb()`（保持数据库与链上同步）

10. ✅ 测试：注册一个 Agent（通过智能合约），5 分钟后数据库自动同步

11. ✅ 测试：调用 `GET /agents` 返回正确的 Agent 列表

---

## Technical Notes

**viem 合约调用示例:**
```typescript
const agents = await publicClient.readContract({
  address: CONTRACTS.AgentRegistry.address,
  abi: CONTRACTS.AgentRegistry.abi,
  functionName: 'getAllAgents',
});
```

**依赖 / Dependencies**: Story 2.2 (AgentRegistry 合约)  
**阻塞 / Blocks**: Story 2.4 (Agent 列表页面)

---

**Story Status**: ✅ Ready for Development

