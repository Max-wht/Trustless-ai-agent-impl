# Story 2.5: Agent 注册界面（前端表单）

**Epic**: Epic 2 - Token Economy & Agent Registration  
**Priority**: P1 - High  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 潜在 Agent 运营者  
**I want** 访问 Agent 注册页面，填写 Agent 服务端点，授权代币质押，提交注册交易  
**So that** 我可以成为审核网络的一部分，通过诚实审核获得代币奖励

---

## Acceptance Criteria

1. ✅ 创建页面 `app/agents/register/page.tsx`

2. ✅ 使用 React Hook Form + Zod 创建表单：
   - 字段：Service Endpoint（URL，必填）
   - 验证：URL 格式正确（https://）、端点可访问（可选预检查）

3. ✅ 显示质押要求："注册需要质押 1000 $TRUST"

4. ✅ 显示当前钱包的 $TRUST 余额（调用 TrustToken 合约 `balanceOf`）

5. ✅ 如果余额 < 1000，显示警告："余额不足，请先获取 $TRUST 代币"

6. ✅ 实现注册流程（多步骤）：
   - 步骤 1：授权（调用 TrustToken `approve(AgentRegistry, 1000 * 10^18)`）
   - 步骤 2：注册（调用 AgentRegistry `registerAgent(serviceEndpoint)`）

7. ✅ 使用 shadcn Stepper 或 Progress 显示当前步骤

8. ✅ 授权和注册交易使用 wagmi `useWriteContract`

9. ✅ 交易提交后，显示"交易处理中"状态 + Arbiscan 链接

10. ✅ 交易确认后，显示成功消息："🎉 注册成功！您现在是 Trustless SocialFi 的 Agent"

11. ✅ 自动跳转到 Agent 列表页，新注册的 Agent 显示在列表中

12. ✅ 错误处理：授权拒绝、交易失败、余额不足，显示友好错误信息

---

## Technical Notes

**两步交易流程:**

```typescript
// Step 1: Approve
await writeContract({
  address: TrustToken.address,
  abi: TrustToken.abi,
  functionName: 'approve',
  args: [AgentRegistry.address, parseEther('1000')],
});

// Step 2: Register
await writeContract({
  address: AgentRegistry.address,
  abi: AgentRegistry.abi,
  functionName: 'registerAgent',
  args: [serviceEndpoint],
});
```

**依赖 / Dependencies**: Story 2.1, 2.2  
**阻塞 / Blocks**: Epic 4 (需要 Agent 网络)

---

**Story Status**: ✅ Ready for Development
