# Story 1.2: Foundry 智能合约项目框架搭建

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 3  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者 / Smart Contract Developer  
**I want** 在 `packages/contracts/` 初始化 Foundry 项目，配置 Arbitrum Sepolia 测试网，创建第一个 Hello World 合约并部署  
**So that** 智能合约开发环境就绪，可以开始开发 ERC-20 代币和 Agent 注册合约

---

## Acceptance Criteria

1. ✅ 在 `packages/contracts/` 运行 `forge init`，生成 Foundry 项目结构（`src/`、`test/`、`script/`、`foundry.toml`）

2. ✅ 配置 `foundry.toml`：

   - Solidity 版本 0.8.24
   - Optimizer 启用（runs = 200）
   - Remappings 配置 OpenZeppelin

3. ✅ 安装 OpenZeppelin Contracts：`forge install OpenZeppelin/openzeppelin-contracts@v5.0.0`

4. ✅ 创建第一个合约 `src/HealthCheck.sol`（简单的 Hello World 合约，返回 "Trustless SocialFi"）

5. ✅ 创建测试 `test/HealthCheck.t.sol`，测试合约部署和函数调用

6. ✅ 运行 `forge test` 成功，测试通过

7. ✅ 配置 Arbitrum Sepolia RPC（在 `foundry.toml` 或 `.env`）

8. ✅ 创建部署脚本 `script/DeployHealthCheck.s.sol`

9. ✅ 部署到本地 Anvil：`anvil` + `forge script` 成功

10. ✅ 配置 `.env.example`（包含 PRIVATE_KEY、ARBISCAN_API_KEY、RPC_URL）

11. ✅ 在 `packages/contracts/README.md` 记录部署和测试命令

---

## Technical Notes

**foundry.toml 配置:**

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
arbitrum = "${ARBITRUM_RPC_URL}"
sepolia = "${ARBITRUM_SEPOLIA_RPC_URL}"
local = "http://localhost:8545"
```

**依赖 / Dependencies**: Story 1.1 (Monorepo 必须先创建)  
**阻塞 / Blocks**: Story 2.1, 2.2（代币和 Agent 合约开发）

---

**Story Status**: ✅ Ready for Development
