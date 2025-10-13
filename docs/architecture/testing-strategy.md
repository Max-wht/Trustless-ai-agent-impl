# 测试策略 / Testing Strategy

## 测试金字塔 / Testing Pyramid

```
        E2E (5%)              端到端测试
       /         \
   Integration (15%)          集成测试
  /                  \
Frontend Unit (40%)  Backend Unit (40%)
前端单元测试          后端单元测试
```

## 覆盖率要求 / Coverage Requirements

- **智能合约 / Smart Contracts**: > 90% (Foundry)
- **后端 / Backend**: > 80% (Jest + Supertest)
- **前端 / Frontend**: > 70% (Vitest + React Testing Library)
- **E2E**: 仅关键流程 / Critical flows only (Playwright)

## 测试组织 / Test Organization

**前端 / Frontend:** `apps/web/__tests__/`

- 组件、hooks、服务、E2E / Components, hooks, services, E2E

**后端 / Backend:** `apps/api/__tests__/`

- 路由、服务、仓储、集成 / Routes, services, repositories, integration

**合约 / Contracts:** `packages/contracts/test/`

- 单元测试、模糊测试、集成测试 / Unit tests, fuzz tests, integration tests

## 关键测试示例 / Key Test Examples

**前端组件测试 / Frontend Component Test:**

```typescript
it("renders post card with correct data", () => {
  render(<PostCard post={mockPost} />);
  expect(screen.getByText(mockPost.contentPreview)).toBeInTheDocument();
});
```

**后端 API 测试 / Backend API Test:**

```typescript
it('creates post with valid auth', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/v1/posts',
    headers: { authorization: `Bearer ${token}` },
    payload: { content: 'Test post' },
  });
  expect(response.statusCode).toBe(201);
});
```

**智能合约测试 / Smart Contract Test:**

```solidity
function testWeightedConsensus() public {
  // 设置5个不同信誉的Agent / Setup 5 agents with different reputations
  // 提交混合判断(3批准,2拒绝) / Submit mixed judgments (3 approve, 2 reject)
  // 验证加权得分计算 / Verify weighted score calculation
}
```

---
