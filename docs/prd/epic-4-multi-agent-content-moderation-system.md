# Epic 4: Multi-Agent Content Moderation System

## Epic Goal

实现 Trustless SocialFi 的核心差异化功能：多 Agent 去中心化内容审核系统。整合 Chainlink VRF 随机选择 Agent，开发 Agent 审核服务（调用 OpenAI GPT-4 API 判断内容合规性），实现加权共识投票智能合约，开发审核结果透明展示前端界面。修改 Epic 3 的内容发布流程，所有新内容必须经过 Agent 审核，通过后才能发布到时间线。此 Epic 完成后，平台实现"去中心化内容治理 + 质量保证"的核心价值主张。

## Story 4.1: Chainlink VRF 随机 Agent 选择合约

As a **智能合约开发者**,  
I want **集成 Chainlink VRF v2.5，实现随机选择 5 个 Agent 的函数（选择概率基于 Agent 信誉评分加权）**,  
so that **内容审核过程公平且不可预测，防止 Agent 串通或操纵审核结果**。

### Acceptance Criteria

1. 安装 Chainlink Contracts：`forge install smartcontractkit/chainlink-brownie-contracts`
2. 创建合约 `src/AgentSelector.sol`，继承 `VRFConsumerBaseV2`
3. 配置 Chainlink VRF Coordinator（Arbitrum Sepolia 地址）
4. 实现函数 `requestAgentSelection(uint256 contentId)`：
   - 调用 Chainlink VRF `requestRandomWords()`
   - 存储 requestId → contentId 映射
   - 触发事件 `AgentSelectionRequested(uint256 indexed contentId, uint256 requestId)`
5. 实现回调函数 `fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)`：
   - 从 AgentRegistry 获取所有活跃 Agent
   - 基于信誉评分计算加权概率分布
   - 使用随机数选择 5 个不重复的 Agent
   - 存储 contentId → selectedAgents 映射
   - 触发事件 `AgentsSelected(uint256 indexed contentId, address[] agents)`
6. 实现函数 `getSelectedAgents(uint256 contentId)` 返回选中的 5 个 Agent 地址
7. 编写测试 `test/AgentSelector.t.sol`：
   - Mock VRF Coordinator
   - 测试请求随机数
   - 测试 Agent 选择逻辑（加权概率）
   - 测试选择 5 个不重复 Agent
8. 运行 `forge test` 所有测试通过
9. 部署到本地 Anvil（使用 Mock VRF Coordinator）
10. 在 `packages/shared/src/constants/contracts.ts` 添加 AgentSelector 地址

## Story 4.2: Agent 审核服务开发（OpenAI 集成）

As a **后端开发者**,  
I want **开发 Agent 审核服务，接收内容文本和合规规则，调用 OpenAI GPT-4 API 判断是否合规，返回判断结果（通过/拒绝）和置信度**,  
so that **Agent 可以自动化审核内容，过滤违规内容（暴力、诈骗、仇恨言论），确保平台内容质量**。

### Acceptance Criteria

1. 安装 OpenAI SDK：`pnpm add openai`
2. 配置环境变量：`OPENAI_API_KEY`
3. 在 `src/services/moderation.ts` 创建审核服务
4. 定义合规规则（`src/config/moderation-rules.ts`）：
   - 禁止暴力内容
   - 禁止诈骗信息
   - 禁止仇恨言论
   - 禁止成人内容（NSFW）
   - 禁止虚假信息（明显的谣言）
5. 实现函数 `moderateContent(content: string)`：
   - 构建 Prompt（包含内容和规则）
   - 调用 OpenAI API `chat.completions.create()`：
     - Model: `gpt-4-turbo-preview`
     - Temperature: 0.2
     - Max tokens: 500
   - 解析 AI 响应：判断（Pass/Reject）、置信度（0-100）、拒绝原因（如果拒绝）
   - 返回 `{ decision: 'Pass' | 'Reject', confidence: number, reason?: string }`
6. 实现 Prompt 工程：

   ```
   你是内容审核 AI Agent。判断以下内容是否违反规则：
   [规则列表]

   内容：
   [用户内容]

   返回 JSON：
   { "decision": "Pass" 或 "Reject", "confidence": 0-100, "reason": "拒绝原因" }
   ```

7. 实现 API 端点 `POST /agent/moderate`：
   - 接收 `{ content: string, agentAddress: string }`
   - 验证请求来自合法 Agent（检查 Agent 是否注册）
   - 调用 `moderateContent()`
   - 记录审核日志到数据库（用于后续信誉计算）
   - 返回判断结果
8. 实现成本控制：
   - Token 限制（内容 ≤ 280 字符）
   - 缓存相同内容的审核结果（24 小时）
9. 测试：提交合规内容，返回 `{ decision: 'Pass', confidence: 95 }`
10. 测试：提交违规内容（暴力），返回 `{ decision: 'Reject', confidence: 98, reason: '包含暴力内容' }`
11. 测试：并发 5 个 Agent 调用，响应时间 < 10 秒

## Story 4.3: 内容审核工作流智能合约（ModerationWorkflow）

As a **智能合约开发者**,  
I want **开发内容审核工作流合约，协调整个审核流程（请求 VRF 选择 Agent → 等待 Agent 判断 → 执行加权共识投票 → 更新内容状态）**,  
so that **内容审核过程完全自动化且去中心化，无需人工干预**。

### Acceptance Criteria

1. 创建合约 `src/ModerationWorkflow.sol`
2. 定义 struct AgentJudgment：address agent、bool decision（Pass/Reject）、uint8 confidence（0-100）、uint256 timestamp
3. 定义 mapping：`judgments[contentId][agentIndex] = AgentJudgment`（存储 5 个 Agent 的判断）
4. 实现函数 `submitJudgment(uint256 contentId, bool decision, uint8 confidence)`：
   - 验证调用者是选中的 5 个 Agent 之一
   - 验证未重复提交
   - 存储判断结果
   - 触发事件 `JudgmentSubmitted(uint256 indexed contentId, address indexed agent, bool decision)`
5. 实现函数 `executeConsensus(uint256 contentId)`（5 个 Agent 都提交后自动调用）：
   - 读取每个 Agent 的判断和信誉评分
   - 计算加权得分：`score = Σ(decision × confidence × agentReputation) / Σ(agentReputation)`
   - 如果 score > 0.6，设置内容状态为 Approved
   - 否则设置为 Rejected
   - 触发事件 `ModerationCompleted(uint256 indexed contentId, bool approved, uint256 score)`
6. 实现函数 `getModerationResult(uint256 contentId)` 返回审核结果和所有 Agent 判断
7. 实现超时机制：24 小时内未完成审核，自动拒绝（防止 Agent 不响应）
8. 编写测试 `test/ModerationWorkflow.t.sol`：
   - 测试 5 个 Agent 全部 Pass → Approved
   - 测试 3 Pass + 2 Reject → 根据权重计算
   - 测试加权投票正确性
   - 测试超时拒绝
9. 运行 `forge test` 所有测试通过，覆盖率 > 90%
10. 部署到本地 Anvil

## Story 4.4: 后端审核协调服务（Orchestrator）

As a **后端开发者**,  
I want **开发审核协调服务，监听 `AgentsSelected` 事件，自动调用 5 个 Agent 的审核端点，收集判断结果并提交到智能合约**,  
so that **审核流程自动化执行，Agent 服务无需直接与区块链交互，降低 Agent 运营门槛**。

### Acceptance Criteria

1. 在 `src/services/orchestrator.ts` 创建协调服务
2. 使用 viem 监听 `AgentSelector` 合约的 `AgentsSelected` 事件
3. 事件触发时：
   - 获取 contentId 和选中的 5 个 Agent 地址
   - 从 AgentRegistry 读取每个 Agent 的 serviceEndpoint
   - 从 IPFS 加载内容文本
   - 并行调用 5 个 Agent 的 `/moderate` 端点（HTTP POST）
   - 收集判断结果
4. 实现函数 `callAgentService(endpoint: string, content: string)`：
   - HTTP POST 到 `${endpoint}/moderate`
   - 请求体：`{ content: string }`
   - 超时时间：15 秒
   - 返回：`{ decision, confidence, reason }`
5. 收集到所有 5 个判断后，调用智能合约 `ModerationWorkflow.submitJudgment()`（5 次交易）
6. 实现重试机制：Agent 服务不可用时重试 3 次
7. 实现降级策略：某个 Agent 超时，使用默认判断（Reject，低置信度）
8. 记录审核日志到数据库（ModerationLog 表）：
   - contentId、agentAddress、decision、confidence、responseTime、timestamp
9. 实现 API 端点 `GET /moderation/:contentId/status`：返回审核进度（5 个 Agent 中已完成几个）
10. 测试：发布内容 → 触发 VRF → AgentsSelected 事件 → 自动调用 Agent 服务 → 提交判断
11. 测试：审核流程 < 30 秒（5 个 Agent 并行）

## Story 4.5: 审核进度与结果前端展示

As a **用户**,  
I want **发布内容后，在时间线看到"审核中"状态和进度条（5 个 Agent 判断进度），审核完成后查看详细结果（哪些 Agent 通过/拒绝、最终得分）**,  
so that **我可以实时了解审核进度，理解内容为何被通过或拒绝（透明度核心功能）**。

### Acceptance Criteria

1. 修改 Story 3.3 的发布流程：
   - 调用 `ContentRegistry.publishContent()` 后，内容状态为 Pending
   - 自动触发 `AgentSelector.requestAgentSelection()`
   - 显示"审核中"状态
2. 帖子卡片在审核期间显示（shadcn Alert）：
   - "🕐 审核中..."
   - 进度条（5 个 Agent，已完成 2/5）
   - "预计还需 20 秒"
3. 实现前端轮询：
   - 每 5 秒调用 `GET /moderation/:contentId/status`
   - 更新进度条（已完成的 Agent 数量）
4. 审核完成后（Approved）：
   - 帖子卡片正常显示
   - 添加"✅ 已通过审核"徽章（shadcn Badge）
5. 审核拒绝后（Rejected）：
   - 帖子卡片显示"❌ 内容未通过审核"
   - 显示拒绝原因（汇总 Agent 的 reason）
   - 提供"申诉"按钮（Phase 2 功能，暂时占位）
6. 点击帖子卡片的"查看审核详情"链接，弹出 Dialog：
   - 显示 5 个 Agent 卡片（地址、信誉评分、判断、置信度）
   - 显示最终加权得分（可视化：进度条 + 数字）
   - 显示审核时间线（每个 Agent 的判断时间）
7. 使用 shadcn Table 或 Card 展示 Agent 判断
8. 颜色编码：Pass 绿色、Reject 红色
9. 响应式：移动端 Dialog 全屏
10. 性能：审核详情加载 < 1 秒

## Story 4.6: 修改内容发布流程集成审核

As a **用户**,  
I want **发布内容后，内容先进入审核流程（选择 Agent → Agent 审核 → 共识投票），通过后自动显示在时间线，拒绝后收到通知**,  
so that **平台上的内容经过质量把关，垃圾内容和违规信息被过滤，我享受高质量的内容环境**。

### Acceptance Criteria

1. 修改 `ContentRegistry.publishContent()`：
   - 内容初始状态设为 Pending（而非 Approved）
   - 发布后不立即显示在时间线
2. 修改后端 `POST /posts` API（从 Epic 3 扩展）：
   - 上传 IPFS
   - 调用 `ContentRegistry.publishContent()`
   - 自动调用 `AgentSelector.requestAgentSelection()`
   - 返回 contentId 和"审核中"状态
3. 前端发布流程更新：
   - 显示"内容已提交，等待 Agent 审核..."
   - 跳转到"我的帖子"页面，显示审核进度
4. 实现"我的帖子"页面（`app/my-posts/page.tsx`）：
   - 显示当前用户的所有帖子
   - 区分：审核中（Pending）、已通过（Approved）、已拒绝（Rejected）
   - 审核中的帖子显示进度条
5. 审核完成后：
   - 前端收到通知（Epic 1.12 的通知系统）
   - 通知内容："✅ 您的帖子已通过审核！" 或 "❌ 您的帖子未通过审核"
6. 修改时间线 API `GET /feed`：
   - 只返回 status = Approved 的内容
   - Pending 和 Rejected 的内容不显示
7. 在个人主页，用户可以查看自己的所有帖子（包括 Rejected）
8. 测试端到端流程：发布 → VRF 选择 → Agent 审核 → 共识投票 → 通过 → 显示在时间线
9. 测试：发布违规内容 → 拒绝 → 不显示在时间线 → 收到拒绝通知
10. 整个审核流程 < 30 秒

---

## 🤔 Epic 4 设计理由

**Story 顺序：**

1. **4.1 VRF 选择** - 审核流程的第一步
2. **4.2 Agent 审核服务** - 核心审核逻辑
3. **4.3 工作流合约** - 协调整个流程
4. **4.4 后端协调服务** - 自动化执行
5. **4.5 审核展示** - 用户可见性（透明度）
6. **4.6 集成发布流程** - 所有功能整合

**技术挑战：**

- Chainlink VRF 集成（需要 LINK 代币和订阅）
- OpenAI API 成本控制（每次审核约 $0.005-0.01）
- 审核流程性能优化（30 秒内完成）

**可交付价值：**

- Epic 4 完成后：所有内容经过去中心化审核，核心价值主张实现

---

## 🎯 请选择下一步

**1.** 继续 Epic 5（Reputation System & Economic Incentives）

**2.** 调整 Epic 4 的 Stories

**3.** 深化某个 Story（如：4.2 OpenAI Prompt 工程）

---
