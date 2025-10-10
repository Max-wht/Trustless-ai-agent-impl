# Epic 7: DAO Governance System

## Epic Goal

实现社区自治的 DAO 治理框架，让代币持有者通过提案和投票决定平台的合规规则。实现提案提交智能合约、投票机制（1 代币 = 1 票）、提案执行（自动更新合规规则）、紧急提案快速通道（48 小时投票窗口）。开发 DAO 治理前端界面（提案列表、提案详情、投票）。1 个月后将合规规则制定权从项目团队移交社区，实现去中心化自治。此 Epic 完成后，Trustless SocialFi MVP 完整交付。

## Story 7.1: DAO 治理智能合约开发

As a **智能合约开发者**,  
I want **开发 DAO 治理合约（Governance），支持代币持有者提交提案（修改合规规则）和投票（1 代币 = 1 票），提案通过后自动执行**,  
so that **社区可以民主决定平台规则，实现去中心化自治，防止单一实体操控**。

### Acceptance Criteria

1. 创建合约 `src/Governance.sol`
2. 定义 enum ProposalStatus { Pending, Active, Passed, Rejected, Executed }
3. 定义 struct Proposal：
   - uint256 id
   - address proposer
   - string title
   - string description
   - string[] newRules（新的合规规则）
   - uint256 forVotes（赞成票数）
   - uint256 againstVotes（反对票数）
   - uint256 startTime
   - uint256 endTime（投票截止时间）
   - ProposalStatus status
   - bool isEmergency（是否紧急提案）
4. 实现函数 `createProposal(string memory title, string memory description, string[] memory newRules)`：
   - 要求提案者持有 ≥ 1000 代币（防止垃圾提案）
   - 创建提案，status 设为 Active
   - 投票期 7 天（常规提案）
   - 触发事件 `ProposalCreated(uint256 indexed proposalId, address indexed proposer)`
5. 实现函数 `vote(uint256 proposalId, bool support)`：
   - 读取投票者的代币余额（投票权 = 代币数量）
   - 记录投票
   - 更新 forVotes 或 againstVotes
   - 触发事件 `Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)`
6. 实现函数 `executeProposal(uint256 proposalId)`（提案通过后执行）：
   - 验证提案已通过（forVotes > againstVotes 且 forVotes > 总代币量的 50%）
   - 验证投票期已结束
   - 更新 ModerationRules 合约（存储合规规则）
   - 设置 status 为 Executed
   - 触发事件 `ProposalExecuted(uint256 indexed proposalId)`
7. 实现紧急提案功能 `createEmergencyProposal()`：
   - 要求 ≥ 10% 活跃用户签名支持
   - 投票期 48 小时（而非 7 天）
8. 编写测试 `test/Governance.t.sol`：
   - 测试创建提案
   - 测试投票
   - 测试提案通过 → 执行
   - 测试提案拒绝
   - 测试紧急提案
9. 运行 `forge test` 所有测试通过，覆盖率 > 90%
10. 部署到本地 Anvil

## Story 7.2: 合规规则存储与动态更新

As a **智能合约开发者**,  
I want **开发合规规则存储合约（ModerationRules），存储当前生效的规则，支持 DAO 投票后动态更新，Agent 读取最新规则进行审核**,  
so that **合规规则由社区治理，可以适应不同地区和文化差异，规则更新后所有 Agent 自动同步**。

### Acceptance Criteria

1. 创建合约 `src/ModerationRules.sol`
2. 定义 string[] rules（规则列表）
3. 初始化创世规则（constructor）：
   - "禁止暴力内容"
   - "禁止诈骗信息"
   - "禁止仇恨言论"
   - "禁止成人内容（NSFW）"
   - "禁止虚假信息"
4. 实现函数 `updateRules(string[] memory newRules)`：
   - 只能由 Governance 合约调用（权限控制）
   - 替换现有规则
   - 触发事件 `RulesUpdated(string[] newRules, uint256 timestamp)`
5. 实现函数 `getRules()` 返回当前规则列表
6. 实现函数 `getRuleHistory()` 返回历史规则版本（最近 10 次）
7. 编写测试 `test/ModerationRules.t.sol`
8. 部署到本地 Anvil
9. 修改 Story 4.2 的 Agent 审核服务：
   - 从 ModerationRules 合约读取最新规则
   - 每次审核前刷新规则（确保最新）
10. 测试：DAO 投票通过新规则 → 规则自动更新 → Agent 审核使用新规则

## Story 7.3: DAO 提案列表与详情页面

As a **代币持有者**,  
I want **访问 DAO 治理页面，查看所有提案（进行中、已通过、已拒绝），点击查看提案详情、当前投票结果、投票**,  
so that **我可以参与平台治理，对合规规则的修改投票，行使我的治理权**。

### Acceptance Criteria

1. 创建页面 `app/governance/page.tsx`
2. 后端实现 API `GET /governance/proposals`：
   - 从智能合约读取所有提案
   - 从数据库缓存（定时同步）
   - 支持筛选（Active、Passed、Rejected、Executed）
   - 返回提案列表
3. 使用 shadcn Tabs 分组提案：
   - "进行中" Tab（Active 状态）
   - "已通过" Tab（Passed 或 Executed）
   - "已拒绝" Tab（Rejected）
4. 每个提案显示为 Card：
   - 提案标题
   - 提案者地址
   - 投票进度条（赞成 vs 反对）
   - 截止时间倒计时（"还剩 3 天 5 小时"）
   - 状态徽章（Active、Passed、Rejected）
   - "查看详情"链接
5. 创建提案详情页 `app/governance/proposals/[id]/page.tsx`：
   - 显示完整提案内容（title、description、newRules）
   - 显示当前投票结果（可视化：饼图或条形图，使用 Recharts）
   - 显示投票统计（总票数、赞成百分比、参与率）
   - 显示提案者信息
   - 显示时间信息（提交时间、开始时间、结束时间）
6. 实现投票按钮（shadcn Button）：
   - "赞成" 按钮（绿色）
   - "反对" 按钮（红色）
   - 显示当前用户的投票权（代币余额）
7. 点击投票后：
   - 弹出确认 Dialog："您将使用 5000 $TRUST 投票赞成此提案"
   - 用户确认 → 调用智能合约 `Governance.vote()`
   - 交易确认后，更新投票结果
   - 显示 Toast："✅ 投票成功！"
8. 已投票的提案显示"已投票"徽章
9. 响应式设计
10. 加载状态：Skeleton
11. 空状态：无提案时显示"暂无提案，创建第一个！"

## Story 7.4: 提案创建界面

As a **代币持有者**,  
I want **创建新提案（填写标题、描述、新的合规规则），提交到 DAO 进行投票**,  
so that **我可以提议修改平台规则，如果社区支持则规则更新**。

### Acceptance Criteria

1. 在 DAO 治理页面添加"创建提案"按钮
2. 点击后跳转到 `app/governance/create/page.tsx`
3. 使用 React Hook Form + Zod 创建表单：
   - 字段：标题（必填，≤ 100 字符）
   - 字段：描述（必填，≤ 1000 字符）
   - 字段：新的合规规则（Textarea，多行，每行一条规则）
   - 验证：至少 1 条规则
4. 显示当前生效的规则（供参考）
5. 显示提案门槛："需要持有 ≥ 1000 $TRUST 才能创建提案"
6. 如果余额 < 1000，禁用提交按钮
7. 实现提交流程：
   - 调用智能合约 `Governance.createProposal()`
   - 显示"提交中"状态
   - 交易确认后，显示成功消息
   - 自动跳转到新创建的提案详情页
8. 提供"预览"功能：显示提案在详情页的样子
9. 提供"保存草稿"功能（localStorage）
10. 错误处理：余额不足、交易失败

## Story 7.5: 治理权移交与创世规则

As a **项目团队**,  
I want **在 MVP 上线 1 个月后，执行治理权移交，将 ModerationRules 合约的所有权从团队多签钱包转移到 Governance 合约**,  
so that **社区获得真正的自治权，规则修改完全由 DAO 决定，平台实现去中心化承诺**。

### Acceptance Criteria

1. 在 `ModerationRules.sol` 实现 `transferOwnership(address newOwner)`（OpenZeppelin Ownable）
2. 创建治理移交脚本 `script/TransferGovernance.s.sol`：
   - 调用 `ModerationRules.transferOwnership(GovernanceAddress)`
   - 验证移交成功
3. 在移交前：
   - 规则更新由团队多签钱包控制
   - DAO 提案可以创建和投票，但不能执行
4. 移交后：
   - 规则更新只能通过 DAO 提案执行
   - 团队失去规则修改权
5. 在前端 DAO 页面显示治理状态：
   - 移交前："⏳ 治理权将在 [日期] 移交社区"
   - 移交后："✅ 社区完全自治（[日期] 起）"
6. 准备公告文案（在移交时发布）：
   - 说明移交的意义
   - 指导社区如何参与治理
7. 创建第一个社区提案（由团队成员创建，但通过 DAO 投票）：
   - 作为移交后的第一次治理实践
   - 测试 DAO 流程
8. 记录移交事件到智能合约（事件日志）
9. 更新文档（README、官网）：说明当前治理状态
10. 测试：移交后团队尝试直接更新规则 → 交易失败（无权限）

---
