# Epic 2: Token Economy & Agent Registration

## Epic Goal

实现 Trustless SocialFi 的原生代币经济模型和 Agent 注册系统。部署 ERC-20 代币合约（固定总量、支持质押），实现 Agent 注册智能合约（质押机制、Agent 信息存储），开发 Agent 列表前端界面（展示所有注册 Agent 及其信誉状态）。此 Epic 完成后，Agent 可以质押代币注册，用户可以查看 Agent 网络状态，为 Epic 4 的内容审核系统奠定基础。

## Story 2.1: ERC-20 代币合约开发与部署

As a **智能合约开发者**,  
I want **开发符合 ERC-20 标准的原生代币合约（TrustToken - $TRUST），固定总量 1 亿，支持转账、授权、质押功能**,  
so that **代币可以用于 Agent 质押、DAO 治理投票、创作者奖励，是整个经济模型的基础**。

### Acceptance Criteria

1. 创建合约 `src/TrustToken.sol`，继承 `@openzeppelin/contracts/token/ERC20/ERC20.sol`
2. 构造函数：铸造 1 亿代币（100,000,000 \* 10^18）到部署者地址
3. 实现代币信息：名称 "TrustToken"、符号 "$TRUST"、小数位 18
4. 继承 `ERC20Burnable`（支持销毁）、`Ownable`（所有权管理）
5. 编写完整测试 `test/TrustToken.t.sol`：
   - 测试总量正确（1 亿）
   - 测试转账功能
   - 测试授权和 transferFrom
   - 测试销毁功能
   - 测试所有权转移
6. 运行 `forge test` 所有测试通过，覆盖率 > 90%
7. 运行 `forge coverage` 检查覆盖率
8. 创建部署脚本 `script/DeployTrustToken.s.sol`
9. 部署到本地 Anvil，验证部署成功
10. 使用 `cast` 命令查询代币信息（name、symbol、totalSupply）正确
11. 在 `packages/shared/src/constants/contracts.ts` 添加代币地址

## Story 2.2: Agent 注册智能合约开发

As a **智能合约开发者**,  
I want **开发 Agent 注册合约（AgentRegistry），允许任何人质押最低 1000 $TRUST 代币注册成为 Agent，记录 Agent 信息和质押金额**,  
so that **Agent 可以加入审核网络，质押机制确保 Agent 有经济动机诚实审核**。

### Acceptance Criteria

1. 创建合约 `src/AgentRegistry.sol`
2. 定义 struct Agent：
   - address agentAddress
   - string serviceEndpoint（Agent 服务的 API 端点）
   - uint256 stakedAmount（质押金额）
   - uint256 reputationScore（信誉评分，初始 50）
   - uint256 registeredAt（注册时间）
   - bool isActive（是否活跃）
3. 实现函数 `registerAgent(string memory serviceEndpoint)`：
   - 要求调用者授权合约至少 1000 $TRUST（使用 `transferFrom`）
   - 从调用者地址转移代币到合约
   - 创建 Agent 记录
   - 触发事件 `AgentRegistered(address indexed agent, uint256 stakedAmount)`
4. 实现函数 `getAgent(address agentAddress)` 返回 Agent 信息
5. 实现函数 `getAllAgents()` 返回所有注册 Agent 的地址数组
6. 实现函数 `isActiveAgent(address)` 检查 Agent 是否活跃
7. 实现函数 `updateServiceEndpoint(string memory newEndpoint)`（Agent 可更新端点）
8. 实现函数 `deactivateAgent()`（Agent 可停用，但不取回质押金，需要 DAO 批准）
9. 编写完整测试 `test/AgentRegistry.t.sol`：
   - 测试成功注册（质押 1000 代币）
   - 测试质押不足失败（< 1000 代币）
   - 测试未授权失败
   - 测试更新端点
   - 测试停用 Agent
10. 运行 `forge test` 所有测试通过，覆盖率 > 90%
11. 部署到本地 Anvil，验证部署成功
12. 在 `packages/shared/src/constants/contracts.ts` 添加 AgentRegistry 地址

## Story 2.3: 后端 Agent 信息查询 API

As a **后端开发者**,  
I want **实现 API 端点查询注册的 Agent 信息（从智能合约读取），并缓存到数据库提高查询效率**,  
so that **前端可以快速获取所有 Agent 列表和详情，无需直接调用智能合约**。

### Acceptance Criteria

1. 安装 viem：`pnpm add viem`
2. 在 `src/lib/web3.ts` 创建 viem Client（连接 Arbitrum Sepolia）
3. 导入 AgentRegistry 合约 ABI（从 Foundry 编译输出复制）
4. 实现函数 `fetchAgentsFromChain()`：调用合约 `getAllAgents()`，遍历获取每个 Agent 详情
5. 创建 Prisma schema：Agent 表（id、walletAddress、serviceEndpoint、stakedAmount、reputationScore、registeredAt、isActive）
6. 实现函数 `syncAgentsToDb()`：从链上读取 Agent，同步到数据库（upsert）
7. 实现 API 端点 `GET /agents`：
   - 从数据库查询所有 Agent（Prisma）
   - 支持分页（query params: page、limit）
   - 支持排序（by: reputationScore desc）
   - 返回 Agent 列表
8. 实现 API 端点 `GET /agents/:address`：返回单个 Agent 详情
9. 创建定时任务（使用 Bull）：每 5 分钟运行 `syncAgentsToDb()`（保持数据库与链上同步）
10. 测试：注册一个 Agent（通过智能合约），5 分钟后数据库自动同步
11. 测试：调用 `GET /agents` 返回正确的 Agent 列表

## Story 2.4: Agent 列表页面前端实现

As a **用户**,  
I want **访问 Agent 列表页面，查看所有注册的 Agent（地址、信誉评分、质押金额、注册时间），按信誉评分排序**,  
so that **我可以了解哪些 Agent 在守护平台内容质量，选择信任度高的 Agent（为 Phase 2 推荐系统准备）**。

### Acceptance Criteria

1. 创建页面 `app/agents/page.tsx`
2. 调用后端 API `GET /agents`，获取 Agent 列表
3. 使用 shadcn Table 组件展示 Agent 列表：
   - 列：Agent 地址（可点击复制）、信誉评分、质押金额、注册时间、状态（活跃/停用）
   - 默认按信誉评分降序排序
   - 支持点击列头切换排序（信誉、质押金额、时间）
4. 实现分页（每页 20 个 Agent）：
   - 使用 shadcn Pagination 组件
   - 页码切换时调用 API（`?page=2&limit=20`）
5. 实现筛选（shadcn Select 组件）：
   - 筛选活跃 Agent / 所有 Agent
   - 筛选高信誉（> 80）/ 中信誉（50-80）/ 低信誉（< 50）
6. 点击 Agent 地址，跳转到 Agent 详情页（`/agents/[address]`，暂时显示占位内容）
7. 显示 Agent 总数统计（"共 32 个 Agent 守护平台"）
8. 响应式设计：移动端使用 Card 列表（而非 Table）
9. 加载状态：显示 Skeleton Table
10. 空状态：无 Agent 时显示"暂无注册 Agent，成为第一个！"
11. 页面性能：加载 100 个 Agent < 1 秒

## Story 2.5: Agent 注册界面（前端表单）

As a **潜在 Agent 运营者**,  
I want **访问 Agent 注册页面，填写 Agent 服务端点，授权代币质押，提交注册交易**,  
so that **我可以成为审核网络的一部分，通过诚实审核获得代币奖励**。

### Acceptance Criteria

1. 创建页面 `app/agents/register/page.tsx`
2. 使用 React Hook Form + Zod 创建表单：
   - 字段：Service Endpoint（URL，必填）
   - 验证：URL 格式正确（https://）、端点可访问（可选预检查）
3. 显示质押要求："注册需要质押 1000 $TRUST"
4. 显示当前钱包的 $TRUST 余额（调用 TrustToken 合约 `balanceOf`）
5. 如果余额 < 1000，显示警告："余额不足，请先获取 $TRUST 代币"
6. 实现注册流程（多步骤）：
   - 步骤 1：授权（调用 TrustToken `approve(AgentRegistry, 1000 * 10^18)`）
   - 步骤 2：注册（调用 AgentRegistry `registerAgent(serviceEndpoint)`）
7. 使用 shadcn Stepper 或 Progress 显示当前步骤
8. 授权和注册交易使用 wagmi `useWriteContract`
9. 交易提交后，显示"交易处理中"状态 + Arbiscan 链接
10. 交易确认后，显示成功消息："🎉 注册成功！您现在是 Trustless SocialFi 的 Agent"
11. 自动跳转到 Agent 列表页，新注册的 Agent 显示在列表中
12. 错误处理：授权拒绝、交易失败、余额不足，显示友好错误信息

---

## 🤔 Epic 2 设计理由

**Story 顺序：**

1. **2.1 代币合约** - 基础，所有后续 Stories 依赖
2. **2.2 Agent 注册合约** - 依赖 2.1（代币存在）
3. **2.3 后端 API** - 依赖 2.2（合约存在）
4. **2.4 Agent 列表页** - 依赖 2.3（API 存在）
5. **2.5 注册界面** - 依赖 2.1、2.2（合约存在）

**可交付价值：**

- Epic 2 完成后：Agent 可以注册、用户可以查看 Agent 网络状态
- 为 Epic 4 的审核系统准备好 Agent 池

---

## 🎯 请选择下一步

**1.** 继续 Epic 3（Content Publishing & IPFS Storage）

**2.** 调整 Epic 2 的 Stories

**3.** 深化某个 Story（如：2.1 代币合约的代币分配策略）

---
