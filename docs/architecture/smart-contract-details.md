# 智能合约详解 / Smart Contract Details

## 合约列表 / Contract List

| 合约名称 / Contract        | 作用 / Purpose      | 关键功能 / Key Functions                    |
| -------------------------- | ------------------- | ------------------------------------------- |
| **TrustToken.sol**         | ERC-20 原生代币     | 发行 1 亿代币，转账，授权，质押             |
| **UserRegistry.sol**       | 用户注册管理        | 注册用户，存储档案，多钱包关联              |
| **AgentRegistry.sol**      | Agent 注册和质押    | Agent 注册，质押代币，更新端点，罚没        |
| **ContentRegistry.sol**    | 内容元数据注册      | 发布内容，存储 IPFS 哈希，更新状态          |
| **AgentSelector.sol**      | VRF 随机 Agent 选择 | 请求随机数，基于信誉加权选择 5 个 Agent     |
| **ModerationWorkflow.sol** | 审核工作流和共识    | 接收 Agent 判断，计算加权共识，更新内容状态 |
| **ReputationSystem.sol**   | 信誉计算和时间衰减  | 更新 Agent/用户信誉，应用时间衰减，触发罚没 |
| **SocialGraph.sol**        | 社交关系管理        | 关注/取关，点赞/取消点赞，查询关系          |
| **Governance.sol**         | DAO 治理系统        | 创建提案，投票，执行提案                    |
| **ModerationRules.sol**    | 合规规则存储        | 存储规则，DAO 更新规则，Agent 读取规则      |

## 合约详细说明 / Detailed Contract Descriptions

### 1. TrustToken.sol - 原生代币合约

**用途 / Purpose**: ERC-20 代币，用于质押、奖励、治理投票。

```solidity
// 核心功能 / Core Functions
function transfer(address to, uint256 amount) external returns (bool);
function approve(address spender, uint256 amount) external returns (bool);
function burn(uint256 amount) external;  // 代币销毁 / Token burning

// 参数 / Parameters
名称 / Name: "TrustToken"
符号 / Symbol: "$TRUST"
总量 / Total Supply: 100,000,000 tokens (1e8 * 1e18 wei)
```

### 2. UserRegistry.sol - 用户注册合约

**用途 / Purpose**: 管理用户身份和档案。

```solidity
// 核心功能 / Core Functions
function registerUser() external;
// 创建用户记录，初始信誉50分

function updatePreferencesHash(string memory ipfsHash) external;
// 更新用户偏好数据的IPFS哈希（加密存储）

function linkWallet(address subWallet, bytes memory signature) external;
// 关联多个钱包（主钱包+最多5个子钱包）

function getUserProfile(address user) external view returns (UserProfile);
```

### 3. AgentRegistry.sol - Agent 注册合约

**用途 / Purpose**: Agent 注册、质押管理、罚没机制。

```solidity
// 核心功能 / Core Functions
function registerAgent(string memory serviceEndpoint) external;
// 要求: 已授权合约转移 ≥1000 $TRUST
// 流程: 转移代币到合约 → 创建Agent记录 → 初始信誉50

function slashAgent(address agent, uint256 amount, string memory reason) external;
// 罚没质押金（连续错误或恶意行为）
// 罚没金额转入DAO金库
// 如果质押<最低要求，自动停用Agent

function getAgent(address agentAddress) external view returns (Agent);
function getAllAgents() external view returns (address[]);
```

**存储结构 / Storage Structure:**

```solidity
struct Agent {
    address agentAddress;       // Agent运营者地址
    string serviceEndpoint;     // HTTP API端点 (e.g., https://agent.com/moderate)
    uint256 stakedAmount;       // 质押金额（Wei）
    uint256 reputationScore;    // 信誉评分 (0-100)
    uint256 registeredAt;       // 注册时间戳
    bool isActive;              // 是否活跃（未被罚没）
}
```

### 4. ContentRegistry.sol - 内容注册合约

**用途 / Purpose**: 记录所有内容的 IPFS 哈希和状态。

```solidity
function publishContent(string memory ipfsHash) external returns (uint256 contentId);
// 创建Content记录(status=Pending)
// 返回自增contentId

function updateStatus(uint256 contentId, ContentStatus status) external;
// 只能由ModerationWorkflow调用
// 审核完成后更新status为Approved/Rejected

function getContent(uint256 contentId) external view returns (Content);
function getUserContents(address author) external view returns (uint256[]);
function incrementLikes(uint256 contentId) external;
```

### 5. AgentSelector.sol - VRF 随机选择合约

**用途 / Purpose**: 使用 Chainlink VRF 公平随机选择 5 个 Agent。

```solidity
function requestAgentSelection(uint256 contentId) external returns (uint256 requestId);
// 1. 调用Chainlink VRF requestRandomWords()
// 2. 存储requestId → contentId映射
// 3. 触发AgentSelectionRequested事件

function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override;
// Chainlink VRF回调（2-3秒后）
// 1. 获取所有活跃Agent及其信誉
// 2. 基于信誉计算加权概率分布
//    例: Agent1信誉90 → 权重90, Agent2信誉50 → 权重50
//        选中概率: 90/140=64% vs 50/140=36%
// 3. 使用随机数选择5个不重复Agent
// 4. 触发AgentsSelected事件 → 后端监听
```

**防作弊机制 / Anti-cheat Mechanism:**

- VRF 提供可验证的随机性（无法预测）
- 高信誉 Agent 被选概率更高（激励诚实）
- 选择结果链上公开（透明度）

### 6. ModerationWorkflow.sol - 审核工作流合约

**用途 / Purpose**: 协调整个审核流程，执行加权共识。

```solidity
function submitJudgment(uint256 contentId, bool decision, uint8 confidence) external;
// 由Agent调用（通过后端代理）
// 验证: msg.sender是选中的5个Agent之一
// 存储: 判断结果
// 触发: 5个都提交后自动executeConsensus()

function executeConsensus(uint256 contentId) internal;
// 加权共识算法:
// score = Σ(decision × confidence × agentReputation) / Σ(agentReputation)
//
// 示例计算:
// Agent1 (信誉90): Approve, 置信95 → 8550
// Agent2 (信誉80): Approve, 置信90 → 7200
// Agent3 (信誉70): Reject,  置信85 → -5950
// Agent4 (信誉60): Approve, 置信92 → 5520
// Agent5 (信誉50): Reject,  置信70 → -3500
//
// Approve总分: (8550+7200+5520) = 21270
// Reject总分: (5950+3500) = 9450
// 总权重: 90+80+70+60+50 = 350
// 最终得分: 21270/350 = 60.8% > 60% → Approved ✅

function getModerationResult(uint256 contentId) external view
    returns (bool approved, uint256 score, AgentJudgment[5] memory judgments);
```

**共识阈值 / Consensus Threshold**: 60% (可通过 DAO 调整)

### 7. ReputationSystem.sol - 信誉系统合约

**用途 / Purpose**: 动态计算 Agent 和用户信誉，时间衰减。

```solidity
function updateAgentReputation(address agent, uint256 contentId, bool wasCorrect) external;
// 判断与共识一致: +10分
// 判断与共识不一致: -5分
// 应用时间衰减: score × 0.95^(周数)

function applyTimeDecay() external;
// 每周调用一次（定时任务）
// 所有Agent信誉 × 0.95
// 目的: 优先考虑近期表现

function updateUserReputation(address user) external;
// 基于发布内容质量:
// (点赞数 × 点赞者平均信誉 + 评论数×2 - 举报数×10) / 发布数

function checkSlashConditions(address agent) internal;
// 检查罚没条件:
// - 连续10次错误 → 罚没20%质押金
// - 极端错误(高置信度但完全错) → 罚没50%
```

**时间衰减示例 / Time Decay Example:**

```
Agent初始信誉: 80分
第1周后: 80 × 0.95 = 76分
第4周后: 80 × 0.95^4 = 65.2分
第8周后: 80 × 0.95^8 = 53.5分

→ 不活跃8周后，信誉降至中等水平
→ 激励Agent持续参与审核
```

### 8. SocialGraph.sol - 社交图谱合约

**用途 / Purpose**: 管理关注和点赞关系。

```solidity
function follow(address userToFollow) external;
// 检查: 不能关注自己、不能重复关注
// 更新: following[msg.sender][userToFollow] = true

function likeContent(uint256 contentId) external;
// 1. 检查未重复点赞
// 2. 记录点赞和点赞者信誉（用于内容质量评分）
// 3. 调用ContentRegistry.incrementLikes()

function isFollowing(address follower, address following) external view returns (bool);
function getFollowers(address user) external view returns (address[]);
```

### 9. Governance.sol - DAO 治理合约

**用途 / Purpose**: 社区提案和投票系统。

```solidity
function createProposal(
    string memory title,
    string memory description,
    string[] memory newRules
) external returns (uint256 proposalId);
// 要求: 提案者持有 ≥1000 $TRUST
// 创建提案，投票期7天（常规）或48小时（紧急）

function vote(uint256 proposalId, bool support) external;
// 投票权 = 代币余额
// 1代币 = 1票
// Phase 2: 二次方投票 (cost = votes²)

function executeProposal(uint256 proposalId) external;
// 验证: forVotes > 50%总量 且 > againstVotes
// 执行: 调用ModerationRules.updateRules()
```

**提案类型 / Proposal Types:**

- **标准提案 / Standard**: 7 天投票期
- **紧急提案 / Emergency**: 48 小时投票期，需要 ≥10% 活跃用户签名触发

### 10. ModerationRules.sol - 规则存储合约

**用途 / Purpose**: 存储和管理内容合规规则。

```solidity
string[] public rules;  // 当前生效规则

function getRules() external view returns (string[] memory);
// Agent审核时调用，获取最新规则

function updateRules(string[] memory newRules, uint256 proposalId) external;
// 只能由Governance合约调用
// 更新规则 → 触发RulesUpdated事件 → 所有Agent同步
```

**创世规则 / Genesis Rules** (合约部署时):

1. 禁止暴力内容 / No violence
2. 禁止诈骗信息 / No scams
3. 禁止仇恨言论 / No hate speech
4. 禁止成人内容 / No NSFW
5. 禁止虚假信息 / No misinformation

**规则更新流程 / Rule Update Flow:**

```
社区成员创建提案 → DAO投票7天 → 通过(>50%)
→ 自动执行 → ModerationRules.updateRules()
→ RulesUpdated事件 → Agent重新加载规则
```

---
