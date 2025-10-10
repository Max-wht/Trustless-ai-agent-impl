# Epic 5: Reputation System & Economic Incentives

## Epic Goal

实现 Agent 和用户的动态信誉系统，以及完整的经济激励机制。开发信誉计算智能合约（时间衰减、内容质量反馈），实现奖励分配系统（诚实 Agent 获得代币奖励），实现质押金罚没机制（恶意 Agent 被惩罚），开发前端信誉查询和可视化界面。此 Epic 完成后，经济激励闭环形成，确保 Agent 有动机诚实审核，优质创作者获得奖励，平台生态健康运转。

## Story 5.1: Agent 信誉计算智能合约

As a **智能合约开发者**,  
I want **开发信誉计算合约（ReputationSystem），基于历史审核准确率和内容质量反馈动态计算 Agent 信誉评分，实现每周 5% 的时间衰减**,  
so that **Agent 的信誉评分准确反映其近期表现，近期诚实审核权重大于历史，防止"慢性毒药攻击"**。

### Acceptance Criteria

1. 创建合约 `src/ReputationSystem.sol`
2. 定义信誉计算公式：`Score = Σ(判断质量 × 时间衰减因子 × 内容质量反馈)`
3. 实现函数 `updateAgentReputation(address agent, uint256 contentId, bool wasCorrect)`：
   - 读取 Agent 的审核判断和最终共识结果
   - 计算判断质量：判断与共识一致 = +10 分，不一致 = -5 分
   - 读取内容质量反馈（点赞数、评论数）
   - 应用时间衰减因子（每周衰减 5%）
   - 更新 Agent 信誉评分
4. 实现函数 `applyTimeDecay()`（定时任务调用，每周一次）：
   - 遍历所有 Agent
   - 信誉评分 × 0.95
   - 触发事件 `ReputationDecayed(address indexed agent, uint256 newScore)`
5. 实现函数 `getAgentReputation(address agent)` 返回当前信誉评分
6. 实现函数 `getReputationHistory(address agent)` 返回历史信誉评分（最近 30 天）
7. 编写测试 `test/ReputationSystem.t.sol`：
   - 测试正确判断 +10 分
   - 测试错误判断 -5 分
   - 测试时间衰减（95%）
   - 测试内容质量反馈影响
8. 运行 `forge test` 所有测试通过，覆盖率 > 90%
9. 部署到本地 Anvil
10. 在 `packages/shared/src/constants/contracts.ts` 添加 ReputationSystem 地址

## Story 5.2: 代币奖励分配系统

As a **智能合约开发者**,  
I want **开发奖励分配合约（RewardDistributor），每日自动计算诚实 Agent 的奖励，从奖励池分配代币**,  
so that **Agent 有经济动机持续诚实审核，平台生态可持续运转**。

### Acceptance Criteria

1. 创建合约 `src/RewardDistributor.sol`
2. 定义奖励池：constructor 时从 TrustToken 总量中分配 40%（4000 万代币）到奖励池
3. 实现函数 `calculateDailyRewards()`（定时任务调用，每日一次）：
   - 读取过去 24 小时所有 Agent 的审核数量和准确率
   - 计算奖励：`Reward = 审核数量 × 准确率 × 信誉评分`
   - 按比例分配当日奖励池（如：每日释放总池的 0.1%）
4. 实现函数 `claimReward()`：
   - Agent 可以领取累积的奖励
   - 转账代币到 Agent 地址
   - 触发事件 `RewardClaimed(address indexed agent, uint256 amount)`
5. 实现函数 `getPendingReward(address agent)` 返回可领取的奖励金额
6. 实现函数 `getRewardPoolBalance()` 返回奖励池余额
7. 编写测试 `test/RewardDistributor.t.sol`：
   - 测试奖励计算公式
   - 测试奖励领取
   - 测试奖励池余额
8. 运行 `forge test` 所有测试通过
9. 部署到本地 Anvil
10. 在后端实现定时任务：每日调用 `calculateDailyRewards()`

## Story 5.3: 质押金罚没机制

As a **智能合约开发者**,  
I want **实现质押金罚没机制，当 Agent 连续 10 次判断错误或单次恶意行为时，自动罚没部分或全部质押金**,  
so that **恶意 Agent 被经济惩罚，确保 Agent 网络的诚实性**。

### Acceptance Criteria

1. 在 `AgentRegistry.sol` 添加罚没功能
2. 定义惩罚规则：
   - 连续 10 次判断与共识不符：罚没 20% 质押金
   - 单次极端错误（置信度 > 90% 但判断完全错误）：罚没 50% 质押金
   - 服务端点长期不可用（> 3 天）：罚没 10% 质押金
3. 实现函数 `slashAgent(address agent, uint256 slashAmount, string memory reason)`：
   - 只能由 ReputationSystem 合约调用（权限控制）
   - 从 Agent 质押金中扣除 slashAmount
   - 罚没的代币转入 DAO 金库
   - 如果质押金 < 最低要求（1000），Agent 自动停用
   - 触发事件 `AgentSlashed(address indexed agent, uint256 amount, string reason)`
4. 在 `ReputationSystem.sol` 添加罚没触发逻辑：
   - 检测连续错误次数（使用 mapping 记录）
   - 达到阈值时调用 `AgentRegistry.slashAgent()`
5. 实现函数 `getSlashHistory(address agent)` 返回罚没历史记录
6. 编写测试 `test/AgentRegistry.t.sol`（扩展）：
   - 测试连续 10 次错误 → 罚没 20%
   - 测试极端错误 → 罚没 50%
   - 测试质押金不足 → 自动停用
7. 运行 `forge test` 所有测试通过
8. 前端在 Agent 详情页显示罚没历史（如果有）
9. 显示警告：Agent 被罚没，信誉降低
10. 测试：模拟 Agent 连续错误 → 自动罚没 → 质押金减少

## Story 5.4: 用户信誉系统实现

As a **智能合约开发者**,  
I want **实现用户信誉计算，基于发布内容的质量（点赞数、评论数、举报率）动态计算用户信誉评分**,  
so that **优质创作者信誉高，其内容互动（点赞、评论）权重大，防止刷量攻击**。

### Acceptance Criteria

1. 在 `ReputationSystem.sol` 添加用户信誉功能
2. 定义用户信誉计算公式：`UserScore = Σ(内容质量 × 时间衰减)`
3. 内容质量 = `(点赞数 × 点赞者平均信誉 + 评论数 × 2 - 举报数 × 10) / 发布数量`
4. 实现函数 `updateUserReputation(address user)`：
   - 读取用户所有内容的点赞、评论、举报数
   - 计算加权平均质量
   - 应用时间衰减
   - 更新用户信誉评分（存储在 UserRegistry）
5. 实现函数 `getUserReputation(address user)` 返回用户信誉评分
6. 实现点赞权重机制：
   - 修改 `SocialGraph.likeContent()`
   - 点赞时记录点赞者的信誉评分
   - 高信誉用户（> 80）的点赞权重 × 1.5
   - 低信誉用户（< 30）的点赞权重 × 0.5
7. 编写测试：
   - 测试优质内容（高点赞）→ 用户信誉提升
   - 测试被举报内容 → 用户信誉下降
   - 测试加权点赞
8. 运行 `forge test` 所有测试通过
9. 前端在用户主页显示信誉评分趋势图（使用 Recharts）
10. 显示信誉等级徽章（如：⭐⭐⭐⭐⭐ 五星创作者）

## Story 5.5: 前端信誉可视化与透明度展示

As a **用户**,  
I want **在我的个人主页查看信誉评分详情（如何计算、历史趋势、影响因素），理解如何提升信誉**,  
so that **我可以优化内容策略，提升信誉评分，获得更多曝光和奖励（透明度核心功能）**。

### Acceptance Criteria

1. 在用户个人主页添加"信誉详情"卡片（shadcn Card）
2. 显示当前信誉评分（大字号 + 星级可视化）
3. 显示信誉等级：
   - 新手（< 30）
   - 普通（30-60）
   - 优秀（60-80）
   - 卓越（80-95）
   - 传奇（> 95）
4. 显示信誉趋势图（Recharts 折线图）：
   - X 轴：时间（最近 30 天）
   - Y 轴：信誉评分
   - 标注重要事件（如：某条内容爆红、被举报）
5. 显示信誉影响因素（shadcn Accordion）：
   - 内容质量得分（平均点赞数、评论数）
   - 被举报次数（如果有）
   - 时间衰减影响
6. 显示"如何提升信誉"提示：
   - "发布优质内容获得点赞和评论"
   - "避免发布违规内容被举报"
   - "持续活跃（时间衰减会降低不活跃用户的信誉）"
7. 点击"查看计算公式"，弹出 Dialog 显示详细公式和示例
8. 响应式设计
9. 加载状态：Skeleton
10. 数据每日更新（不需要实时）

---
