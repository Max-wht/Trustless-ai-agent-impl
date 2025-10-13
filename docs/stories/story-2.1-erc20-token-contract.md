# Story 2.1: ERC-20 代币合约开发与部署

**Epic**: Epic 2 - Token Economy & Agent Registration  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者 / Smart Contract Developer  
**I want** 开发符合 ERC-20 标准的原生代币合约（TrustToken - $TRUST），固定总量 1 亿，支持转账、授权、质押功能  
**So that** 代币可以用于 Agent 质押、DAO 治理投票、创作者奖励，是整个经济模型的基础

---

## Acceptance Criteria

1. ✅ 创建合约 `src/TrustToken.sol`，继承 `@openzeppelin/contracts/token/ERC20/ERC20.sol`

2. ✅ 构造函数：铸造 1 亿代币（100,000,000 \* 10^18）到部署者地址

3. ✅ 实现代币信息：
   - 名称 "TrustToken"
   - 符号 "$TRUST"
   - 小数位 18

4. ✅ 继承 `ERC20Burnable`（支持销毁）、`Ownable`（所有权管理）

5. ✅ 编写完整测试 `test/TrustToken.t.sol`：
   - 测试总量正确（1 亿）
   - 测试转账功能
   - 测试授权和 transferFrom
   - 测试销毁功能
   - 测试所有权转移

6. ✅ 运行 `forge test` 所有测试通过，覆盖率 > 90%

7. ✅ 运行 `forge coverage` 检查覆盖率

8. ✅ 创建部署脚本 `script/DeployTrustToken.s.sol`

9. ✅ 部署到本地 Anvil，验证部署成功

10. ✅ 使用 `cast` 命令查询代币信息（name、symbol、totalSupply）正确

11. ✅ 在 `packages/shared/src/constants/contracts.ts` 添加代币地址

---

## Technical Notes

**代币参数:**

- Total Supply: 100,000,000 tokens
- Decimals: 18
- Initial Distribution: 100% to deployer (后续通过脚本分配)

**安全考虑:**

- OpenZeppelin 5.0 审计通过的合约
- 固定总量（无增发）
- Ownable 控制管理功能

**依赖 / Dependencies**: Story 1.2 (Foundry 环境)  
**阻塞 / Blocks**: Story 2.2（Agent 注册需要代币）

---

**Story Status**: ✅ Ready for Development
