# Trustless SocialFi Product Requirements Document (PRD)

## Goals and Background Context

### Goals

本 PRD 成功交付后将实现以下目标：

1. **建立去中心化内容治理系统** - 通过多 Agent 共识机制实现无需中心化控制的内容审核，同时保证内容质量

2. **验证 AI Agent 经济激励模型** - 证明基于质押、信誉评分和奖励的经济机制能够确保 Agent 诚实行为

3. **提供 Web2 级别的用户体验** - 在去中心化架构下实现低成本（Gas 费 < $0.10）、快速响应（审核 < 30 秒）的社交互动

4. **完成三层技术架构实现** - 交付完整的 MVP 系统，包括：

   - Web 客户端前端界面（React + Next.js + viem）
   - 后端服务器（TypeScript/Node.js，用于数据获取、Agent 服务、API 网关）
   - 智能合约层（Foundry + Solidity，部署在 Arbitrum）

5. **达成产品市场契合度（PMF）** - 在 6 个月内获取 5,000 注册用户和 1,500 月活跃用户，验证核心价值主张

6. **建立技术护城河** - 创建基于 ERC-8004 标准的 Agent 信誉系统，随数据积累形成竞争壁垒

7. **实现社区自治基础** - 通过 DAO 治理将内容合规规则的决策权移交社区，实现真正的去中心化

8. **吸引早期 Agent 网络** - 招募并激活至少 50 个 Agent 节点，建立可运行的去中心化审核网络

9. **为 Phase 2 扩展奠定基础** - MVP 架构设计需支持后续个性化推荐、多媒体内容等功能扩展

### Background Context

传统社交媒体平台的中心化审查机制导致言论自由争议和信息操控，而现有去中心化替代方案（Lens Protocol、Farcaster、Mastodon）虽然解决了抗审查问题，却因缺乏有效内容治理而面临垃圾内容泛滥和用户体验不佳的困境。市场急需一个**既能抵御单点审查，又能保证内容质量**的解决方案。

Trustless SocialFi 通过创新的多 Agent 共识机制填补这一市场空白。借鉴 Chainlink 去中心化预言机的成功模式，平台使用经济激励驱动的 AI Agent 网络进行内容审核：每次内容提交时，智能合约随机选择 5 个 Agent 独立判断，通过加权共识投票决定是否发布。Agent 的信誉评分基于历史审核准确率动态调整，配合质押和奖励机制确保诚实行为。

MVP 采用**全栈三层架构**：（1）**智能合约层**使用 Foundry 和 Solidity 开发，部署在 Arbitrum L2，实现 Agent 注册、随机选择、共识投票、信誉系统和代币经济；（2）**后端服务器**使用 TypeScript/Node.js 构建，提供 Agent 审核服务、数据索引、API 网关和与区块链的交互；（3）**Web 客户端前端**使用 React + Next.js + viem 开发，提供钱包登录、内容发布、社交互动的用户界面。内容存储在 IPFS，哈希值记录在链上，确保永久可访问性和防篡改。DAO 治理让社区掌握内容合规规则的制定权，实现真正的去中心化自治。

本 PRD 定义了 MVP 阶段（6 个月）的核心功能需求、技术规格、用户故事和验收标准，覆盖前端、后端和智能合约三个技术层，为实现"质量 + 抗审查 + 体验"三位一体的产品愿景提供可执行的开发指南。

### Change Log

| Date       | Version | Description      | Author |
| ---------- | ------- | ---------------- | ------ |
| 2025-10-09 | 1.0     | Initial PRD 创建 | John   |

---

## Requirements

### Functional Requirements（功能需求）

**智能合约层（Solidity + Foundry + Arbitrum）：**

- **FR1：** Agent 注册系统 - Agent 必须能够通过智能合约注册，质押最低数量的原生代币（具体数额由 DAO 治理决定，初始建议 1000 代币），并提供服务端点信息

- **FR2：** VRF 随机 Agent 选择 - 当用户提交内容时，智能合约必须使用 Chainlink VRF 随机选择 5 个 Agent，选择概率基于 Agent 信誉评分加权

- **FR3：** 加权共识投票机制 - 智能合约必须收集 5 个 Agent 的判断结果（通过/拒绝 + 置信度），根据各 Agent 的信誉权重计算最终决策（公式：`最终得分 = Σ(Agent判断 × Agent信誉权重)`，通过阈值 > 0.6 则发布）

- **FR4：** Agent 信誉系统 - 智能合约必须基于历史审核准确率和内容质量反馈动态计算 Agent 信誉评分，公式：`Score = Σ(判断质量 × 时间衰减因子 × 内容质量反馈)`，每日更新

- **FR5：** 时间衰减机制 - 信誉评分必须实现时间衰减（每周衰减 5%），确保近期表现权重大于历史表现

- **FR6：** 质押金罚没机制 - 当 Agent 判断与最终共识严重不符时（连续 10 次错误或单次恶意行为），智能合约必须自动罚没部分或全部质押金

- **FR7：** 内容哈希上链 - 通过审核的内容的 IPFS 哈希值必须记录在智能合约中，确保内容防篡改和永久可访问性

- **FR8：** Agent 判断结果透明化 - 所有 Agent 的判断结果（通过/拒绝、置信度、时间戳）必须记录在链上，用户可查询

- **FR9：** ERC-20 代币合约 - 实现符合 ERC-20 标准的原生代币，总量固定，支持质押、转账、授权功能

- **FR10：** DAO 提案与投票系统 - 智能合约必须支持代币持有者提交提案（修改合规规则）和投票（1 代币 = 1 票），提案通过阈值 > 50%

- **FR11：** 紧急提案快速通道 - 当 > 10% 活跃用户举报某类内容时，自动触发紧急提案，投票窗口 48 小时，通过后规则立即生效

- **FR12：** 用户信誉系统 - 智能合约必须基于用户发布内容的质量（点赞数、评论数、举报率）计算用户信誉评分，信誉影响内容互动的权重

- **FR13：** 用户偏好哈希存储 - 智能合约必须为每个用户存储其加密偏好数据的 IPFS 哈希值，支持更新和查询

**后端服务器层（TypeScript + Node.js）：**

- **FR14：** Agent 审核服务 - 后端必须提供 Agent 审核服务，接收内容提交，调用 OpenAI GPT-4 API 判断是否符合合规规则，返回判断结果和置信度

- **FR15：** 智能合约交互服务 - 后端必须提供与 Arbitrum 智能合约交互的服务，包括读取 Agent 选择结果、提交 Agent 判断、查询信誉评分

- **FR16：** IPFS 内容管理 - 后端必须提供 IPFS 内容上传和检索服务（帖子内容），使用 Pinata 或 Web3.Storage，确保内容上传延迟 < 10 秒

- **FR17：** IPFS 偏好数据管理 - 后端必须提供用户偏好数据的 IPFS 加密存储服务，包括：加密（使用用户钱包签名派生的密钥）、上传到 IPFS、更新哈希到智能合约、下载和解密（需用户签名授权）

- **FR18：** 个性化 Tag 生成服务 - 后端必须分析用户行为数据（点赞的内容主题、互动频率、关注的用户类型），自动生成个性化 Tag（如："DeFi 爱好者"、"政治评论"、"NFT 收藏"），Tag 包含名称、权重、来源说明

- **FR19：** 数据索引服务 - 后端必须使用 The Graph 索引链上数据（用户、内容、Agent、投票记录），提供高效查询 API

- **FR20：** API 网关 - 后端必须提供 RESTful API，供前端调用，包括：用户注册、内容发布、社交互动、Agent 状态查询、偏好管理等

- **FR21：** 链下数据库 - 后端必须使用 PostgreSQL 存储非关键数据（缓存、临时数据、分析指标），与链上数据保持同步

- **FR22：** 任务队列系统 - 后端必须实现任务队列（使用 Redis + Bull），处理异步任务（IPFS 上传、数据同步、Tag 生成、通知发送）

- **FR23：** 监控与日志 - 后端必须集成 Prometheus（指标收集）、Sentry（错误追踪），提供系统健康监控

**Web 前端层（React + Next.js + viem）：**

- **FR24：** 钱包连接登录 - 前端必须支持 MetaMask、WalletConnect 等钱包登录，连接成功率 > 95%

- **FR25：** 用户个人主页 - 前端必须提供用户个人主页，显示头像、简介、发帖历史、关注/粉丝数、信誉评分

- **FR26：** 内容发布功能 - 前端必须提供发布文本内容的界面（≤ 280 字符），提交后显示审核进度（实时状态：等待 Agent 选择 → Agent 审核中 → 共识投票 → 发布成功/拒绝），审核通过后自动显示在时间线

- **FR27：** 社交互动功能 - 前端必须支持关注/取关用户、点赞/取消点赞内容、发表评论（评论也需通过 Agent 审核）

- **FR28：** 时间线展示 - 前端必须提供时间线视图，按时间倒序展示关注用户的最新内容，支持无限滚动加载，每页加载 20 条内容

- **FR29：** 审核结果透明展示 - 用户必须能够点击内容查看审核详情弹窗，显示：参与的 5 个 Agent 信息、各自判断（通过/拒绝）、置信度、最终加权得分、审核时间

- **FR30：** Agent 信誉查询 - 前端必须提供 Agent 列表页面，显示所有 Agent 的：信誉评分、历史判断准确率、质押金额、总审核数量，支持排序和筛选

- **FR31：** DAO 提案与投票界面 - 前端必须提供提案列表页面（显示所有提案、状态、投票进度）、提案详情页面（提案内容、投票选项、当前结果）、投票按钮（需钱包签名）

- **FR32：** 用户通知系统 - 前端必须显示通知中心（新粉丝、内容被点赞/评论、审核结果、DAO 投票提醒），支持未读标记和通知历史

- **FR33：** 响应式设计 - 前端必须支持桌面（1920x1080、1366x768）和移动浏览器（iPhone、Android），页面加载时间 < 3 秒，交互响应 < 500ms

**用户偏好与个性化（IPFS 去中心化实现）：**

- **FR34：** 用户偏好 IPFS 加密存储 - 系统必须将用户行为数据（点赞主题、互动历史、关注偏好）加密后存储到 IPFS，加密密钥由用户钱包签名派生（使用 EIP-712 标准签名），IPFS 哈希记录在智能合约的用户档案中

- **FR35：** 个性化 Tag 自动生成 - 后端服务必须基于用户行为自动生成个性化 Tag（如："DeFi 爱好者"、"政治评论关注者"、"NFT 收藏者"），每个 Tag 包含：Tag 名称、兴趣权重（0-100）、生成来源（基于哪些行为）、生成时间，Tag 数据加密存储在 IPFS

- **FR36：** 我的偏好管理页面 - 前端必须提供"我的偏好"专属页面，显示：

  - 所有自动生成的个性化 Tag（卡片或列表形式）
  - 每个 Tag 的详细信息（名称、权重条、来源说明、生成日期）
  - Tag 删除按钮（每个 Tag 旁边）
  - 总 Tag 数量统计
  - 最后更新时间

- **FR37：** Tag 删除功能 - 用户点击删除按钮后，前端必须：（1）请求用户签名确认；（2）从偏好数据中移除该 Tag；（3）重新加密并上传到 IPFS；（4）更新智能合约中的 IPFS 哈希；（5）刷新页面显示更新后的 Tag 列表

- **FR38：** 偏好数据跨设备同步 - 用户在新设备登录时，前端必须：（1）从智能合约读取用户偏好 IPFS 哈希；（2）从 IPFS 下载加密数据；（3）请求用户签名以解密；（4）恢复所有个性化 Tag 和偏好设置

- **FR39：** Agent 授权访问机制（Phase 2 准备）- 前端必须提供 Agent 授权界面，显示：Agent 名称和信誉、请求访问的数据范围、授权有效期选项（1 天/7 天/30 天/永久），用户签名授权后记录在本地和 IPFS

- **FR40：** 偏好数据导出/导入 - 前端必须提供"导出偏好"按钮（下载加密的 JSON 文件）和"导入偏好"按钮（上传文件并恢复），确保数据可移植性

- **FR41：** 隐私模式 - 前端必须提供"隐私模式"开关，启用后：不生成个性化 Tag、不存储行为数据到 IPFS、仅本地临时存储（会话结束后清除）、在 UI 上显示"隐私模式"标识

- **FR42：** Tag 可视化设计 - Tag 必须使用视觉化方式展示兴趣权重（如：进度条、大小不同的标签云、颜色深浅），让用户直观理解自己的偏好分布

- **FR43：** 多钱包地址关联 - 用户必须能够关联多个钱包地址（主钱包 + 最多 5 个子钱包），系统聚合所有关联钱包的行为数据生成统一的个性化 Tag，前端提供"关联钱包管理"界面，显示所有已关联的地址，支持添加和移除

- **FR44：** Tag 编辑和合并功能 - 用户必须能够：（1）编辑 Tag 名称（自定义显示名称）；（2）合并相似的 Tag（如："DeFi 爱好者" + "DeFi 交易者" → "DeFi 关注者"）；（3）调整 Tag 权重（手动增加/减少兴趣强度）

- **FR45：** 签名说明界面 - 当需要用户签名时（删除 Tag、更新偏好、授权 Agent），前端必须显示清晰的说明弹窗，包含：操作目的、为何需要签名、签名的安全性保证、"我明白了"按钮和"了解更多"链接

- **FR46：** 偏好数据本地缓存机制 - 前端必须在浏览器 IndexedDB 中缓存最新的偏好数据（已解密），当 IPFS 服务不可用时自动使用本地缓存，并显示警告提示："正在使用本地缓存，IPFS 恢复后将同步"

### Non-Functional Requirements（非功能需求）

**性能要求：**

- **NFR1：** 内容审核响应时间必须 < 30 秒（从用户提交到收到审核结果）

- **NFR2：** 单次交易 Gas 费必须 < $0.10（Arbitrum L2）

- **NFR3：** 前端页面首次加载时间必须 < 3 秒，后续页面切换 < 1 秒

- **NFR4：** API 响应时间必须 < 500ms（P95），< 200ms（P50）

- **NFR5：** IPFS 偏好数据上传/下载延迟必须 < 5 秒

- **NFR6：** 系统必须支持 1,000 并发用户（MVP 阶段），10,000 并发用户（6 个月后）

**可靠性要求：**

- **NFR7：** 系统正常运行时间必须 ≥ 99%（月度）

- **NFR8：** IPFS 内容（帖子 + 偏好数据）可访问性必须 ≥ 99%（使用 Pinata 和 Web3.Storage 双备份）

- **NFR9：** 智能合约必须通过第三方安全审计（OpenZeppelin 或 Trail of Bits），无高危和中危漏洞

- **NFR10：** 后端服务必须实现故障自动恢复（Kubernetes 健康检查和自动重启）

- **NFR11：** 用户偏好数据丢失风险必须 < 0.1%（IPFS 双 Pinning + 用户本地备份）

**安全与隐私要求：**

- **NFR12：** 所有 API 必须实现 Rate Limiting（防止 DDoS 攻击），限制：100 请求/分钟/IP

- **NFR13：** 用户偏好数据必须使用 AES-256 加密，加密密钥由用户钱包签名派生（EIP-712 标准），密钥永不存储在服务器或链上

- **NFR14：** 前后端通讯必须使用 HTTPS，智能合约交互必须验证签名

- **NFR15：** 智能合约必须使用多重签名（3/5）控制管理员权限，重大操作必须有时间锁（48 小时）

- **NFR16：** 个性化 Tag 生成逻辑必须在后端执行，前端不得暴露 Tag 生成算法（防止操纵）

- **NFR17：** 用户必须能够完全删除所有偏好数据（IPFS 文件取消 Pin，智能合约哈希清零），符合 GDPR"被遗忘权"

**可扩展性要求：**

- **NFR18：** Agent 服务必须支持水平扩展（通过 Kubernetes Auto-scaling）

- **NFR19：** 数据库必须支持读写分离（PostgreSQL 主从复制）

- **NFR20：** 智能合约设计必须模块化，支持后续升级（使用代理模式或模块化架构）

- **NFR21：** 偏好数据结构必须可扩展，支持 Phase 2 添加新的 Tag 类型（如：内容格式偏好、时间偏好）

- **NFR32：** 单个用户偏好文件大小必须 < 100 KB，超过阈值时自动归档旧数据（保留最近 3 个月行为），确保 IPFS 上传性能和成本可控

**可维护性要求：**

- **NFR22：** 代码必须使用 TypeScript 实现类型安全（前端 + 后端）

- **NFR23：** 智能合约单元测试覆盖率必须 > 90%（使用 Foundry Test）

- **NFR24：** 所有服务必须容器化（Docker），使用 Docker Compose 支持本地开发

- **NFR25：** 代码必须遵循统一的代码规范（ESLint + Prettier for TypeScript，Solhint for Solidity）

**合规要求：**

- **NFR26：** 系统必须符合 GDPR 和 CCPA 要求，提供用户数据导出和删除功能

- **NFR27：** 代币设计必须咨询证券法律师，确保不被认定为证券（符合 Howey Test）

- **NFR28：** 合规规则必须明确禁止违法内容（CSAM、暴力、诈骗），实施自动检测系统

**监控与可观测性：**

- **NFR29：** 系统必须集成 Prometheus + Grafana，监控关键指标（DAU、交易量、Agent 共识率、API 延迟、IPFS 可用性）

- **NFR30：** 所有服务必须输出结构化日志（JSON 格式），集成 ELK Stack 或类似方案

- **NFR31：** 关键业务指标必须实时追踪并可视化（北极星指标：周活跃创作者数 WAC、用户偏好 Tag 生成率）

---

## User Interface Design Goals

### Overall UX Vision（整体 UX 愿景）

Trustless SocialFi 的用户界面必须实现 **"Web2 的流畅体验 + Web3 的透明度"** 平衡：

**核心 UX 原则：**

1. **渐进式 Web3 onboarding** - 降低技术门槛，让非 Web3 用户也能快速上手

   - 首次登录：简化钱包连接流程，提供"什么是钱包？"引导
   - 渐进披露：复杂的 Web3 概念（Gas 费、IPFS、签名）按需解释，不一次性灌输

2. **透明度优先** - 所有关键决策可视化

   - 内容审核：显示参与的 Agent、判断结果、最终得分
   - 个性化 Tag：显示来源、权重、生成逻辑
   - 算法决策：用户能理解"为什么"（为什么这个内容被推荐/拒绝）

3. **快速反馈** - 即时 UI 反馈 + 异步操作进度展示

   - 发帖后：立即显示"审核中"状态 + 进度条（5 个 Agent 判断进度）
   - IPFS 上传：显示上传进度条，而非无响应
   - 区块链交易：显示"交易处理中"，提供 Arbiscan 链接

4. **错误友好** - 将技术错误翻译为用户可理解的语言

   - 不显示："Transaction reverted with reason: InsufficientStake"
   - 而显示："质押金额不足。您需要至少 1000 代币才能成为 Agent。"

5. **信任建立** - 通过设计传递"安全、透明、可控"的信任感
   - 使用绿色勾选 ✅ 表示"已验证"、蓝色盾牌 🛡️ 表示"去中心化"
   - 在关键操作（签名、交易）前显示安全提示
   - 提供"数据主权"可视化（IPFS 哈希、加密状态）

### Key Interaction Paradigms（关键交互范式）

**1. 钱包优先交互（Wallet-First）**

- 所有操作基于钱包身份（无传统用户名/密码）
- 钱包地址 = 用户 ID
- 签名 = 授权机制

**2. 实时状态反馈（Real-time Status）**

- 内容审核进度条（Agent 1/5 已判断 → 2/5 → ...）
- 区块链交易状态（待确认 → 确认中 → 已完成）
- IPFS 上传状态（准备中 → 上传中 50% → 完成）

**3. 透明度弹窗（Transparency Modals）**

- 点击内容 → 查看审核详情
- 点击 Tag → 查看生成来源和算法
- 点击信誉分数 → 查看计算公式和历史

**4. 渐进式复杂度（Progressive Complexity）**

- 基础功能（发帖、点赞）：一键操作
- 高级功能（Agent 注册、DAO 投票）：多步引导
- 专家功能（查看智能合约、IPFS 哈希）：折叠在"高级"菜单

**5. 社区感知（Community Awareness）**

- 显示在线 Agent 数量（"32 个 Agent 在线守护内容质量"）
- 显示 DAO 活跃度（"15 个提案待投票"）
- 显示社区里程碑（"🎉 我们刚达到 5000 用户！"）

### Core Screens and Views（核心页面与视图）

**1. 钱包连接页（Wallet Connection Screen）**

- 用途：用户首次访问的入口，建立 Web3 身份
- 关键元素：多钱包选项（MetaMask、WalletConnect）、"什么是钱包？"引导、安全提示

**2. 主时间线（Main Timeline / Feed）**

- 用途：用户消费内容的主要场景，查看关注用户的最新帖子
- 关键元素：无限滚动加载、帖子卡片（作者、内容、点赞/评论数、时间）、发帖快捷入口

**3. 内容发布界面（Post Composer）**

- 用途：用户创建和发布内容
- 关键元素：文本输入框（280 字符限制）、字符计数器、发布按钮、审核进度展示

**4. 审核进度与结果页（Moderation Status Page）**

- 用途：让用户了解内容审核过程和结果（透明度核心功能）
- 关键元素：5 个 Agent 卡片、各自判断结果、最终得分、通过/拒绝原因

**5. 用户个人主页（User Profile Page）**

- 用途：展示用户身份、内容、社交关系、信誉
- 关键元素：头像、简介、信誉评分、发帖列表、关注/粉丝数、关注/取关按钮

**6. 我的偏好页（My Preferences Page）**

- 用途：管理个性化 Tag、隐私设置、多钱包关联（数据主权核心功能）
- 关键元素：Tag 列表（可视化权重）、删除/编辑/合并按钮、IPFS 数据信息、隐私模式开关、关联钱包管理

**7. Agent 列表页（Agent Directory）**

- 用途：展示所有 Agent 的信誉和性能（透明度核心功能）
- 关键元素：Agent 卡片（信誉评分、准确率、质押金）、排序/筛选、详情链接

**8. Agent 详情页（Agent Detail Page）**

- 用途：深入了解单个 Agent 的历史表现
- 关键元素：信誉趋势图、审核历史、质押信息、运营者信息

**9. DAO 治理页（DAO Governance Dashboard）**

- 用途：社区参与平台治理，查看和投票提案
- 关键元素：提案列表（进行中/已通过/已拒绝）、投票按钮、提案详情、投票结果图表

**10. 提案详情页（Proposal Detail Page）**

- 用途：查看提案完整信息并投票
- 关键元素：提案标题、内容、发起人、投票选项、当前投票结果、截止时间、投票按钮

**11. 用户设置页（Settings Page）**

- 用途：管理账户设置、通知偏好、隐私设置
- 关键元素：通知开关、隐私模式、语言选择、关联钱包、数据导出/删除

**12. 通知中心（Notification Center）**

- 用途：集中展示所有通知（社交互动、审核结果、DAO 更新）
- 关键元素：通知列表、未读标记、分类筛选、通知设置链接

### Accessibility（可访问性）

**级别：WCAG 2.1 AA**

**具体要求：**

- 所有交互元素必须支持键盘导航（Tab、Enter、Esc）
- 颜色对比度必须符合 WCAG AA 标准（正文 4.5:1，大字体 3:1）
- 所有图标和图像必须有 alt 文本
- 表单输入必须有清晰的 label 和错误提示
- 支持屏幕阅读器（ARIA 标签）

**shadcn/ui + Radix UI 提供的可访问性保证：**

- 自动管理焦点状态
- 内置键盘快捷键（如：Esc 关闭 Dialog）
- 正确的 ARIA 角色和属性
- 屏幕阅读器友好的语义化 HTML

**Phase 2 优化：**

- WCAG AAA 级别
- 深色模式（Dark Mode）
- 字体大小调节
- 高对比度模式

### Branding（品牌）

**品牌定位：** 现代、专业、值得信赖、去中心化

**视觉风格（基于 shadcn/ui + Tailwind 定制）：**

**色彩方案（Tailwind 调色板）：**

- **主色：** Blue-600 `#2563EB`（信任、专业）
- **强调色：** Emerald-500 `#10B981`（去中心化、自由）
- **警告色：** Amber-500 `#F59E0B`（重要提示）
- **危险色：** Red-500 `#EF4444`（错误、删除）
- **中性色：** Slate 系列（#F8FAFC → #0F172A）
- **背景：** 浅色模式 Slate-50，暗色模式 Slate-900

**字体系统：**

- **标题/正文：** Inter（shadcn/ui 默认，现代无衬线）
- **代码/哈希：** JetBrains Mono（等宽字体，显示地址和哈希）

**设计语言：**

- **圆角：** rounded-lg（8px）用于卡片，rounded-md（6px）用于按钮
- **阴影：** shadow-sm、shadow-md（subtle elevation）
- **动画：** transition-all duration-200（流畅但克制）
- **间距：** 基于 Tailwind spacing scale（4px 基数）

**shadcn/ui 主题定制（tailwind.config.ts）：**

```typescript
theme: {
  extend: {
    colors: {
      primary: colors.blue[600],
      accent: colors.emerald[500],
      // ... 自定义品牌色
    },
    borderRadius: {
      lg: '0.5rem',
      md: '0.375rem',
    }
  }
}
```

**品牌元素：**

- **Logo：** 简洁的网络节点图 + "Trustless" 文字（强调去中心化）
- **Slogan：** "Speak Freely, Trust Collectively"
- **视觉识别：** 透明度徽章、去中心化网络图案

### Target Device and Platforms（目标设备和平台）

**MVP 阶段：Web Responsive**

**支持的设备：**

- **桌面浏览器：**

  - Chrome/Brave 90+（优先级 1，MetaMask 支持最好）
  - Firefox 88+（优先级 2）
  - Safari 14+（优先级 3，WalletConnect 支持）
  - 分辨率：1920x1080、1366x768、1440x900

- **移动浏览器：**
  - iOS Safari 14+（iPhone 6s 及以上）
  - Android Chrome 90+
  - 分辨率：375x667（iPhone SE）、390x844（iPhone 12+）、360x800（Android）

**响应式断点（Tailwind 默认）：**

```
sm: 640px   (小型设备)
md: 768px   (平板)
lg: 1024px  (桌面)
xl: 1280px  (大屏桌面)
2xl: 1536px (超大屏)
```

**Phase 2 扩展：**

- 原生移动 App（React Native，12-18 个月）
- 桌面应用（Electron，可选）

**技术要求：**

- PWA（Progressive Web App）支持（可添加到主屏幕）
- 离线功能（缓存关键数据，无网络时可浏览已加载内容）
- Web Push API（浏览器通知）

---

## Technical Assumptions

### Repository Structure: Monorepo

**工具：** Turborepo + pnpm

**仓库结构：**

```
trustless-socialfi/
├── packages/
│   ├── contracts/          # Foundry 智能合约
│   ├── agent-service/      # Agent 审核服务（TypeScript）
│   ├── web-app/            # Next.js 前端
│   ├── shared/             # 共享类型和工具
│   └── subgraph/           # The Graph 子图
├── infrastructure/         # K8s、Docker 配置
├── docs/                   # 文档
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Service Architecture

**架构：** Monolith 后端 + 独立智能合约 + SPA 前端

**技术栈：**

- **智能合约：** Foundry + Solidity 0.8.24 + OpenZeppelin + Arbitrum One
- **后端：** TypeScript + Node.js 20 + Fastify + viem + Prisma + PostgreSQL
- **前端：** Next.js 14 + React 18 + TypeScript + viem + wagmi + RainbowKit
- **UI 组件：** shadcn/ui + Tailwind CSS + Radix UI + Lucide Icons
- **存储：** IPFS (Pinata + Web3.Storage) + PostgreSQL
- **监控：** Prometheus + Grafana + Sentry

### Testing Requirements

**智能合约：** Foundry Test（覆盖率 > 90%）+ Fuzz Testing  
**后端：** Jest + Supertest（覆盖率 > 80%）  
**前端：** Vitest + React Testing Library（覆盖率 > 70%）+ Playwright（E2E）

### Additional Technical Assumptions and Requests

**关键技术决策：**

- 使用 viem（而非 ethers.js）- 性能更好、TypeScript 支持更强
- 使用 Fastify（而非 Express）- 吞吐量更高、TypeScript 原生支持
- 使用 shadcn/ui（而非 Chakra/MUI）- 可定制性强、现代美学、可访问性好
- 使用 Chainlink VRF v2.5 - Arbitrum 原生支持的随机数方案
- 使用 OpenAI GPT-4 Turbo（MVP）→ 开源 LLM（Phase 2，降低成本）
- 使用 The Graph 索引链上数据 - 高效查询，无需后端轮询事件
- 使用 EIP-712 签名派生加密密钥 - 标准化、安全、钱包兼容性好

**环境配置：**

- Development：本地 Anvil + 本地后端 + localhost:3000
- Staging：Arbitrum Sepolia + AWS Staging + Vercel Preview
- Production：Arbitrum One + AWS Production + Vercel Production

**部署策略：**

- 智能合约：Foundry Script 部署 + 合约验证（Arbiscan）
- 后端：Docker + Kubernetes（AWS EKS）
- 前端：Vercel（自动 CI/CD）

---

## Epic List

以下是 Trustless SocialFi MVP 的完整 Epic 列表。每个 Epic 交付一个重要的、端到端的、可部署的功能增量。

**Epic 1: Foundation & Core Infrastructure**  
建立项目基础设施（Monorepo、智能合约框架、前后端骨架），并交付基础的用户身份和社交功能，确保用户可以连接钱包、创建个人主页、查看基本时间线。

**Epic 2: Token Economy & Agent Registration**  
实现原生代币经济模型和 Agent 注册系统，允许 Agent 质押代币注册，用户可以查看所有注册的 Agent 及其信誉状态，为后续内容审核奠定基础。

**Epic 3: Content Publishing & IPFS Storage**  
实现内容发布和去中心化存储，用户可以发布文本帖子（存储在 IPFS），在时间线查看内容，执行基础社交互动（点赞、评论），但暂时跳过 Agent 审核（后续 Epic 添加）。

**Epic 4: Multi-Agent Content Moderation System**  
实现核心的多 Agent 内容审核机制，包括 VRF 随机选择、Agent 审核服务（OpenAI 集成）、加权共识投票、审核结果透明展示，确保所有新内容都经过去中心化审核。

**Epic 5: Reputation System & Economic Incentives**  
实现 Agent 和用户的动态信誉系统，包括信誉计算、时间衰减机制、奖励分配、质押金罚没，确保经济激励机制有效运转，Agent 诚实审核。

**Epic 6: User Preferences & Personalized Tag Management**  
实现用户偏好的 IPFS 去中心化存储和个性化 Tag 管理，包括 Tag 自动生成、"我的偏好"页面、Tag 编辑/删除/合并、多钱包关联、跨设备同步，为 Phase 2 的推荐系统奠定数据基础。

**Epic 7: DAO Governance System**  
实现社区自治的 DAO 治理框架，包括提案提交、投票机制、提案执行、紧急提案快速通道、治理界面，1 个月后将合规规则制定权移交社区。

---

## Epic 1: Foundation & Core Infrastructure

### Epic Goal

建立 Trustless SocialFi 的技术基础设施，包括 Monorepo 项目结构、智能合约开发环境（Foundry）、后端 API 框架（Fastify + TypeScript）、前端应用（Next.js + shadcn/ui）。交付核心的用户身份功能（钱包连接、用户注册）和基本的社交互动界面（个人主页、简单时间线），确保项目可部署并演示基础功能。此 Epic 完成后，开发团队可以在稳定的技术栈上并行开发后续功能。

### Story 1.1: Monorepo 项目初始化与开发环境配置

As a **开发者**,  
I want **建立 Turborepo Monorepo 项目结构，配置 pnpm workspace，设置基础的 packages（contracts、agent-service、web-app、shared）**,  
so that **团队可以在统一的代码仓库中并行开发智能合约、后端和前端，代码共享和版本管理统一**。

#### Acceptance Criteria

1. 使用 `create-turbo` 初始化 Monorepo，配置 Turborepo 缓存和任务依赖（`turbo.json`）
2. 配置 pnpm workspace（`pnpm-workspace.yaml`），包含 4 个 packages：contracts、agent-service、web-app、shared
3. 每个 package 有独立的 `package.json`，定义名称（`@trustless/contracts`、`@trustless/agent-service` 等）
4. 配置根目录 `.gitignore`，排除 `node_modules`、`dist`、`.env.local`、`.turbo` 等
5. 配置根目录 `tsconfig.json`（base config），每个 package 继承并扩展
6. 配置 ESLint + Prettier（统一代码规范），使用 `@typescript-eslint` 规则
7. 配置 Husky + lint-staged（Git hooks），提交前自动运行 lint 和格式化
8. 创建 `README.md`，包含项目简介、技术栈、开发环境搭建步骤
9. 运行 `pnpm install` 成功，无依赖冲突
10. 运行 `pnpm lint` 和 `pnpm format` 成功
11. Git 提交触发 Husky hooks，自动 lint 检查

### Story 1.2: Foundry 智能合约项目框架搭建

As a **智能合约开发者**,  
I want **在 `packages/contracts/` 初始化 Foundry 项目，配置 Arbitrum Sepolia 测试网，创建第一个 Hello World 合约并部署**,  
so that **智能合约开发环境就绪，可以开始开发 ERC-20 代币和 Agent 注册合约**。

#### Acceptance Criteria

1. 在 `packages/contracts/` 运行 `forge init`，生成 Foundry 项目结构（`src/`、`test/`、`script/`、`foundry.toml`）
2. 配置 `foundry.toml`：Solidity 版本 0.8.24、Optimizer 启用（runs = 200）、Remappings 配置 OpenZeppelin
3. 安装 OpenZeppelin Contracts：`forge install OpenZeppelin/openzeppelin-contracts@v5.0.0`
4. 创建第一个合约 `src/HealthCheck.sol`（简单的 Hello World 合约，返回 "Trustless SocialFi"）
5. 创建测试 `test/HealthCheck.t.sol`，测试合约部署和函数调用
6. 运行 `forge test` 成功，测试通过
7. 配置 Arbitrum Sepolia RPC（在 `foundry.toml` 或 `.env`）
8. 创建部署脚本 `script/DeployHealthCheck.s.sol`
9. 部署到本地 Anvil：`anvil` + `forge script` 成功
10. 配置 `.env.example`（包含 PRIVATE_KEY、ARBISCAN_API_KEY、RPC_URL）
11. 在 `packages/contracts/README.md` 记录部署和测试命令

### Story 1.3: 后端 API 框架搭建（Fastify + TypeScript）

As a **后端开发者**,  
I want **在 `packages/agent-service/` 创建 Fastify + TypeScript 后端项目，实现健康检查 API 端点，配置数据库连接（Prisma + PostgreSQL）**,  
so that **后端服务框架就绪，可以开始开发 Agent 审核、IPFS 集成、区块链交互等功能**。

#### Acceptance Criteria

1. 在 `packages/agent-service/` 初始化 TypeScript 项目，配置 `tsconfig.json`（strict mode）
2. 安装依赖：`fastify`、`@fastify/cors`、`dotenv`、`typescript`、`ts-node`、`@types/node`
3. 创建 `src/index.ts`，初始化 Fastify 服务器，监听端口 3001
4. 实现 `GET /health` 端点，返回 `{ status: 'ok', service: 'agent-service', timestamp: Date.now() }`
5. 配置 CORS（允许 `http://localhost:3000` 前端访问）
6. 配置环境变量（`.env`）：`PORT=3001`、`DATABASE_URL`、`NODE_ENV`
7. 安装并配置 Prisma：`npx prisma init`
8. 创建第一个 Prisma schema（`schema.prisma`）：定义 User 表（id、walletAddress、createdAt）
9. 运行 `prisma migrate dev` 创建数据库和表
10. 实现简单的 `GET /users` 端点，从数据库查询所有用户（使用 Prisma Client）
11. 配置启动脚本（`package.json`）：`dev`（ts-node-dev）、`build`（tsc）、`start`（node dist）
12. 运行 `pnpm dev` 成功，服务启动在 http://localhost:3001
13. 使用 curl 或 Postman 测试 `/health` 和 `/users` 端点成功
14. 在 `packages/agent-service/README.md` 记录 API 端点和启动命令

### Story 1.4: 前端 Next.js 应用初始化（shadcn/ui + Tailwind）

As a **前端开发者**,  
I want **在 `packages/web-app/` 创建 Next.js 14 项目（App Router），配置 Tailwind CSS 和 shadcn/ui，实现欢迎页面**,  
so that **前端开发环境就绪，可以开始开发钱包连接、用户界面等功能**。

#### Acceptance Criteria

1. 在 `packages/web-app/` 运行 `npx create-next-app@latest`，选择 TypeScript + Tailwind CSS + App Router
2. 配置 `tailwind.config.ts`：使用 shadcn/ui 推荐的配置、添加自定义主题色（primary: blue-600、accent: emerald-500）
3. 初始化 shadcn/ui：`npx shadcn-ui@latest init`，选择 New York 风格
4. 添加第一个 shadcn 组件：`npx shadcn-ui@latest add button card`
5. 创建欢迎页面 `app/page.tsx`：显示 "Welcome to Trustless SocialFi" 标题、项目 slogan、使用 shadcn Button 和 Card 组件、响应式设计
6. 配置字体（next/font）：Inter（标题和正文）、JetBrains Mono（代码/哈希）
7. 配置环境变量（`.env.local`）：`NEXT_PUBLIC_API_URL=http://localhost:3001`
8. 运行 `pnpm dev` 成功，应用启动在 http://localhost:3000
9. 在浏览器访问 http://localhost:3000，看到欢迎页面，样式正确
10. 测试响应式：在移动端（375px）和桌面端（1920px）显示正常
11. 配置 `next.config.js`：启用 TypeScript strict mode、图片域名白名单（IPFS 网关）
12. 在 `packages/web-app/README.md` 记录启动命令和开发规范

### Story 1.5: RainbowKit 钱包连接集成

As a **用户**,  
I want **在欢迎页面点击"连接钱包"按钮，选择 MetaMask 或 WalletConnect，成功连接后显示我的钱包地址**,  
so that **我可以使用 Web3 身份登录 Trustless SocialFi，无需传统的用户名/密码**。

#### Acceptance Criteria

1. 安装依赖：`wagmi`、`viem`、`@rainbow-me/rainbowkit`
2. 在 `app/providers.tsx` 创建 Wagmi + RainbowKit Providers：配置 Arbitrum Sepolia 链、配置 Alchemy RPC、配置支持的钱包（MetaMask、WalletConnect、Coinbase Wallet）
3. 在 `app/layout.tsx` 包裹 Providers
4. 在欢迎页面添加 RainbowKit `ConnectButton`
5. 点击"连接钱包"后，弹出钱包选择界面（RainbowKit Modal）
6. 选择 MetaMask，触发 MetaMask 弹窗，连接成功后：Button 显示钱包地址（缩写格式：0x1234...5678）、点击地址弹出 Account Modal（显示余额、断开连接按钮）
7. 刷新页面后，钱包状态保持（自动重连）
8. 断开钱包后，Button 恢复"连接钱包"状态
9. 在移动端测试 WalletConnect（扫码连接）成功
10. 配置 RainbowKit 主题（匹配 Trustless SocialFi 品牌色）
11. 钱包连接成功率 > 95%（测试 20 次连接）

### Story 1.6: 用户注册与基础档案创建

As a **新用户**,  
I want **连接钱包后自动创建我的用户档案（存储在数据库和智能合约），并跳转到我的个人主页**,  
so that **我在平台上有了身份，可以开始发布内容和社交互动**。

#### Acceptance Criteria

1. 创建智能合约 `src/UserRegistry.sol`：函数 `registerUser()`、`isRegistered(address)`、`getUserProfile(address)`、事件 `UserRegistered`
2. 编写 Foundry 测试 `test/UserRegistry.t.sol`，覆盖率 > 90%
3. 部署 `UserRegistry` 合约到本地 Anvil
4. 后端创建 Prisma schema：User 表（id、walletAddress、username、bio、createdAt、updatedAt）
5. 后端创建 API 端点 `POST /users/register`：接收 `{ walletAddress, signature }`、验证签名、调用智能合约 `registerUser()`、在数据库创建用户记录、返回用户 ID 和档案
6. 前端创建 Hook `useUserRegistration()`：检查当前钱包是否已注册、未注册则自动调用后端 `/users/register`、使用 wagmi `useSignMessage` 生成签名
7. 前端在钱包连接成功后，触发 `useUserRegistration()`
8. 注册成功后，跳转到 `/profile/[address]` 个人主页
9. 已注册用户连接钱包，直接跳转到主页（不重复注册）
10. 测试新用户注册流程（端到端）：连接钱包 → 签名 → 注册 → 跳转主页
11. 错误处理：签名拒绝、网络错误、合约调用失败，显示友好错误信息

### Story 1.7: 用户个人主页基础界面

As a **用户**,  
I want **访问我的个人主页，查看我的钱包地址、注册时间、信誉评分、关注/粉丝数（初始为 0）**,  
so that **我可以确认我的账户已创建，并了解我的基本信息**。

#### Acceptance Criteria

1. 创建页面 `app/profile/[address]/page.tsx`（动态路由）
2. 从 URL 参数获取钱包地址
3. 调用后端 API `GET /users/:address`，获取用户档案
4. 使用 shadcn Card 显示用户信息：Avatar（Blockies 生成）、用户名、简介、注册时间、信誉评分、关注/粉丝数
5. 如果访问的是当前登录用户的主页，显示"编辑个人资料"按钮（暂时占位）
6. 如果访问的是其他用户主页，显示"关注"按钮（暂时禁用，Epic 3 实现）
7. 响应式设计：移动端单列布局，桌面端两列
8. 加载状态：显示骨架屏（Skeleton）
9. 错误处理：用户不存在，显示 404 页面
10. 页面加载时间 < 2 秒

### Story 1.8: 数据库初始化与 Prisma 配置

As a **后端开发者**,  
I want **配置 PostgreSQL 数据库（本地 Docker），使用 Prisma 创建完整的 schema（User、Post、Like、Follow 表），运行迁移生成数据库结构**,  
so that **后端服务可以持久化存储用户数据、内容数据、社交关系，支持高效查询**。

#### Acceptance Criteria

1. 创建 `docker-compose.yml`：PostgreSQL 15 服务（端口 5432）、Redis 7 服务（端口 6379）
2. 运行 `docker-compose up -d` 启动数据库
3. 在 `packages/agent-service/prisma/schema.prisma` 定义完整 schema：User、Post、Like、Follow 表
4. 运行 `prisma migrate dev --name init` 创建初始迁移
5. 检查数据库，确认所有表和索引已创建
6. 运行 `prisma generate` 生成 TypeScript 类型
7. 在 `src/lib/db.ts` 创建 Prisma Client 单例
8. 在 `GET /users` 端点中使用 `prisma.user.findMany()` 查询数据库
9. 创建 Seed 脚本 `prisma/seed.ts`，插入 5 个测试用户
10. 运行 `prisma db seed` 成功，数据库有 5 条用户记录
11. 使用 Prisma Studio（`prisma studio`）可视化查看数据

### Story 1.9: 共享类型定义包（shared package）

As a **开发者**,  
I want **在 `packages/shared/` 创建共享的 TypeScript 类型定义和工具函数（合约 ABI 类型、API 请求/响应类型、工具函数）**,  
so that **前端和后端可以复用类型定义，确保类型安全，避免重复代码**。

#### Acceptance Criteria

1. 在 `packages/shared/` 初始化 TypeScript 项目
2. 配置 `tsconfig.json`（declaration: true，输出 `.d.ts` 文件）
3. 创建 `src/types/`：定义 user.ts、post.ts、agent.ts、api.ts 接口
4. 创建 `src/utils/`：实现 formatAddress、formatRelativeTime、validateEthAddress 工具函数
5. 创建 `src/constants/`：定义 contracts.ts（合约地址）、config.ts（应用配置）
6. 配置 `package.json`：`name: @trustless/shared`、exports 配置
7. 创建 `src/index.ts`，导出所有类型和工具
8. 运行 `pnpm build` 生成 `dist/` 目录
9. 在 `agent-service` 和 `web-app` 的 `package.json` 中添加依赖：`@trustless/shared: workspace:*`
10. 在后端和前端导入并使用共享类型
11. TypeScript 编译成功，类型检查通过

### Story 1.10: 简单时间线展示（Placeholder UI）

As a **用户**,  
I want **在主页查看时间线（目前显示欢迎信息和占位内容），了解未来将在这里看到关注用户的帖子**,  
so that **我可以理解平台的基本布局和功能方向**。

#### Acceptance Criteriax

1. 创建页面 `app/feed/page.tsx`（时间线页面）
2. 创建导航栏组件 `components/Navigation.tsx`：Logo + "Trustless SocialFi"、导航链接、ConnectButton
3. 时间线页面布局：左侧导航、中间时间线主体（最大宽度 600px）、右侧侧边栏占位
4. 主体区域显示欢迎卡片和 3 个占位帖子卡片（Mock 数据）
5. 响应式设计：移动端隐藏侧边栏，导航变为底部 Tab Bar
6. 页面加载时间 < 1 秒
7. 未连接钱包时，显示"请连接钱包"提示
8. 连接钱包后，URL 自动跳转到 `/feed`

### Story 1.11: CI/CD 基础配置（GitHub Actions）

As a **开发者**,  
I want **配置 GitHub Actions 自动化测试和部署流程，每次 push 代码后自动运行测试、Lint、构建**,  
so that **团队可以尽早发现代码错误，确保代码质量，自动化部署到 Staging 环境**。

#### Acceptance Criteria

1. 创建 `.github/workflows/ci.yml`：Lint、Test Contracts、Test Backend、Test Frontend、Build
2. 使用 Turborepo 缓存
3. 设置 GitHub Actions Cache
4. 失败时在 PR 显示错误信息
5. 创建 `.github/workflows/deploy-staging.yml`：部署前端到 Vercel Preview、部署后端到 AWS ECS Staging
6. 创建 Vercel 项目，连接 GitHub 仓库
7. 配置 Vercel 环境变量
8. 测试：Push 代码到 main，GitHub Actions 自动运行，所有测试通过
9. 测试：Push 到 develop，自动部署到 Staging
10. 在 PR 中自动显示 Vercel Preview 链接

### Story 1.12: 基础监控与日志配置

As a **DevOps 工程师**,  
I want **为后端服务配置结构化日志（Pino）和错误追踪（Sentry），为前端配置 Sentry，设置基础监控 Dashboard**,  
so that **团队可以实时监控系统健康状态，快速定位和修复错误**。

#### Acceptance Criteria

1. 后端安装 `pino` 和 `pino-pretty`
2. 在 `src/lib/logger.ts` 配置 Pino：生产环境 JSON 格式、开发环境 Pretty 格式
3. 在所有 API 端点添加请求日志
4. 后端安装并配置 Sentry SDK（`@sentry/node`）
5. 前端安装并配置 Sentry SDK（`@sentry/nextjs`）
6. 创建 Sentry 项目
7. 配置 Sentry DSN（环境变量）
8. 后端添加 `GET /metrics` 端点（Prometheus 格式）
9. 测试：触发一个错误，Sentry 收到错误报告
10. 测试：查看 `/metrics` 端点，返回 Prometheus 格式指标
11. 在 `README.md` 记录监控和日志查看方法

---

## Epic 2: Token Economy & Agent Registration

### Epic Goal

实现 Trustless SocialFi 的原生代币经济模型和 Agent 注册系统。部署 ERC-20 代币合约（固定总量、支持质押），实现 Agent 注册智能合约（质押机制、Agent 信息存储），开发 Agent 列表前端界面（展示所有注册 Agent 及其信誉状态）。此 Epic 完成后，Agent 可以质押代币注册，用户可以查看 Agent 网络状态，为 Epic 4 的内容审核系统奠定基础。

### Story 2.1: ERC-20 代币合约开发与部署

As a **智能合约开发者**,  
I want **开发符合 ERC-20 标准的原生代币合约（TrustToken - $TRUST），固定总量 1 亿，支持转账、授权、质押功能**,  
so that **代币可以用于 Agent 质押、DAO 治理投票、创作者奖励，是整个经济模型的基础**。

#### Acceptance Criteria

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

### Story 2.2: Agent 注册智能合约开发

As a **智能合约开发者**,  
I want **开发 Agent 注册合约（AgentRegistry），允许任何人质押最低 1000 $TRUST 代币注册成为 Agent，记录 Agent 信息和质押金额**,  
so that **Agent 可以加入审核网络，质押机制确保 Agent 有经济动机诚实审核**。

#### Acceptance Criteria

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

### Story 2.3: 后端 Agent 信息查询 API

As a **后端开发者**,  
I want **实现 API 端点查询注册的 Agent 信息（从智能合约读取），并缓存到数据库提高查询效率**,  
so that **前端可以快速获取所有 Agent 列表和详情，无需直接调用智能合约**。

#### Acceptance Criteria

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

### Story 2.4: Agent 列表页面前端实现

As a **用户**,  
I want **访问 Agent 列表页面，查看所有注册的 Agent（地址、信誉评分、质押金额、注册时间），按信誉评分排序**,  
so that **我可以了解哪些 Agent 在守护平台内容质量，选择信任度高的 Agent（为 Phase 2 推荐系统准备）**。

#### Acceptance Criteria

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

### Story 2.5: Agent 注册界面（前端表单）

As a **潜在 Agent 运营者**,  
I want **访问 Agent 注册页面，填写 Agent 服务端点，授权代币质押，提交注册交易**,  
so that **我可以成为审核网络的一部分，通过诚实审核获得代币奖励**。

#### Acceptance Criteria

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

### 🤔 Epic 2 设计理由

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

### 🎯 请选择下一步

**1.** 继续 Epic 3（Content Publishing & IPFS Storage）

**2.** 调整 Epic 2 的 Stories

**3.** 深化某个 Story（如：2.1 代币合约的代币分配策略）

---

## Epic 3: Content Publishing & IPFS Storage

### Epic Goal

实现用户内容发布和去中心化存储功能。用户可以发布文本帖子（≤ 280 字符），内容存储在 IPFS，哈希值记录在智能合约。实现时间线展示（查看关注用户的内容）和基础社交互动（关注、点赞、评论）。**注意：此 Epic 暂时跳过 Agent 审核流程**（Epic 4 添加），所有内容直接发布，以便快速验证社交功能和 IPFS 集成。此 Epic 完成后，平台具备完整的社交媒体基础功能。

### Story 3.1: 内容发布智能合约（ContentRegistry）

As a **智能合约开发者**,  
I want **开发内容注册合约（ContentRegistry），记录所有发布内容的 IPFS 哈希、作者、时间戳**,  
so that **内容元数据存储在链上，确保防篡改和永久可追溯，为后续审核系统提供数据基础**。

#### Acceptance Criteria

1. 创建合约 `src/ContentRegistry.sol`
2. 定义 enum ContentStatus { Pending, Approved, Rejected }
3. 定义 struct Content：uint256 id、address author、string ipfsHash、uint256 createdAt、uint256 likesCount、uint256 commentsCount、ContentStatus status
4. 实现函数 `publishContent(string memory ipfsHash)`：创建 Content 记录，status 设为 Approved（暂时直接通过），触发事件 `ContentPublished`
5. 实现函数 `getContent(uint256 contentId)` 返回内容信息
6. 实现函数 `getUserContents(address author)` 返回用户的所有内容 ID
7. 实现函数 `incrementLikes(uint256 contentId)` 和 `incrementComments(uint256 contentId)`
8. 编写完整测试 `test/ContentRegistry.t.sol`，覆盖率 > 90%
9. 运行 `forge test` 所有测试通过
10. 部署到本地 Anvil
11. 在 `packages/shared/src/constants/contracts.ts` 添加 ContentRegistry 地址

### Story 3.2: 后端 IPFS 内容上传服务

As a **后端开发者**,  
I want **实现 IPFS 内容上传服务，接收文本内容，上传到 Pinata 和 Web3.Storage（双备份），返回 IPFS 哈希**,  
so that **用户发布的内容可以存储在去中心化网络，确保永久可访问和防审查**。

#### Acceptance Criteria

1. 安装依赖：`@pinata/sdk`、`web3.storage`
2. 配置环境变量：`PINATA_API_KEY`、`PINATA_SECRET_KEY`、`WEB3_STORAGE_TOKEN`
3. 在 `src/lib/ipfs.ts` 创建 IPFS 服务：`uploadToPinata`、`uploadToWeb3Storage`、`uploadContent`（并行上传到两个服务）
4. 实现 API 端点 `POST /ipfs/upload`：接收 `{ content: string }`、调用 `uploadContent()`、返回 IPFS 哈希和 URL
5. 实现 API 端点 `GET /ipfs/:hash`：从 Pinata 或 Web3.Storage 检索内容、缓存到 Redis（TTL 1 小时）
6. 实现内容验证：长度 ≤ 280 字符、内容不为空、过滤恶意字符（XSS 防护）
7. 测试：上传一段文本，返回 IPFS 哈希
8. 测试：使用返回的哈希调用 `GET /ipfs/:hash`，返回原始内容
9. 测试：上传延迟 < 10 秒（P95）
10. 错误处理：Pinata 或 Web3.Storage 故障，至少一个成功即可
11. 在 `README.md` 记录 IPFS API 使用方法

### Story 3.3: 内容发布前端界面与流程

As a **用户**,  
I want **在时间线页面点击"发布"按钮，弹出发帖界面，输入内容（≤ 280 字符），点击发布后内容上传到 IPFS 并记录到区块链**,  
so that **我可以在平台上发表想法，内容存储在去中心化网络，永久可访问**。

#### Acceptance Criteria

1. 在时间线页面添加"发布"浮动按钮（fixed position，右下角，shadcn Button）
2. 点击后打开 shadcn Dialog（发帖弹窗）
3. 弹窗内容：Textarea 输入框（自动聚焦）、字符计数器（"125/280"）、"发布"和"取消"按钮
4. 超过 280 字符，计数器变红，禁用发布按钮
5. 实现发布流程（React Hook Form）：调用后端 `POST /ipfs/upload` → 获得 IPFS 哈希 → 调用智能合约 `ContentRegistry.publishContent(ipfsHash)`
6. 显示发布进度（shadcn Progress）："正在上传到 IPFS..." → "正在提交到区块链..." → "等待交易确认..."
7. 发布成功后：显示成功 Toast、关闭弹窗、刷新时间线
8. 发布失败后：显示错误信息、保留用户输入内容
9. 快捷键：Ctrl/Cmd + Enter 快速发布
10. 移动端：全屏 Modal
11. 整个发布流程 < 30 秒

### Story 3.4: 时间线内容展示（真实数据）

As a **用户**,  
I want **在时间线查看我关注用户的最新帖子（从 IPFS 加载内容），按时间倒序排列，支持无限滚动加载**,  
so that **我可以消费内容，了解社区动态**。

#### Acceptance Criteria

1. 后端实现 API 端点 `GET /feed`：查询当前用户关注的用户列表、查询这些用户的最新内容、按时间倒序、支持分页、返回内容列表
2. 前端修改 `app/feed/page.tsx`：调用 `GET /feed`、遍历内容调用 `GET /ipfs/:hash` 获取文本、显示帖子卡片（头像、用户名、内容、时间、点赞/评论数）
3. 实现无限滚动（Intersection Observer）：滚动到底部自动加载下一页
4. 未关注任何人时，显示"发现"Feed
5. 实现下拉刷新（移动端）
6. 加载状态：显示 Skeleton 帖子卡片
7. 空状态：无内容时显示引导信息
8. 性能：加载 20 条内容 < 2 秒
9. IPFS 内容缓存
10. 错误处理：IPFS 加载失败显示占位

### Story 3.5: 关注功能（Follow/Unfollow）

As a **用户**,  
I want **在其他用户的个人主页点击"关注"按钮，关注成功后按钮变为"已关注"，我的关注列表增加该用户**,  
so that **我可以在时间线看到我关注用户的内容，建立社交关系**。

#### Acceptance Criteria

1. 创建智能合约 `src/SocialGraph.sol`
2. 定义 mapping：`following[follower][following] = bool`
3. 实现函数：`follow(address userToFollow)`、`unfollow(address userToUnfollow)`、`isFollowing`、`getFollowing`、`getFollowers`
4. 检查：不能关注自己、不能重复关注
5. 触发事件 `Followed(address indexed follower, address indexed following)`
6. 编写测试 `test/SocialGraph.t.sol`，覆盖率 > 90%
7. 部署到本地 Anvil
8. 后端实现 API：`POST /users/:address/follow`、`DELETE /users/:address/follow`、`GET /users/:address/following`、`GET /users/:address/followers`
9. 前端在个人主页添加"关注"按钮：未关注显示"关注"、已关注显示"已关注"（hover 变"取消关注"）
10. 点击后调用合约交易，交易确认后更新 UI 和关注/粉丝数
11. 在个人主页显示关注/粉丝数（可点击查看列表）
12. 错误处理：交易失败、重复关注、关注自己

### Story 3.6: 点赞功能（Like/Unlike）

As a **用户**,  
I want **在时间线或个人主页点击帖子的"点赞"按钮，点赞成功后按钮高亮，点赞数 +1**,  
so that **我可以表达对内容的喜欢，帮助优质内容获得更多曝光**。

#### Acceptance Criteria

1. 在 `SocialGraph.sol` 添加点赞功能：mapping `likes[contentId][user] = bool`、函数 `likeContent`、`unlikeContent`、`hasLiked`、`getLikesCount`
2. 点赞时调用 `ContentRegistry.incrementLikes(contentId)`
3. 编写测试，覆盖率 > 90%
4. 后端实现 API：`POST /posts/:id/like`、`DELETE /posts/:id/like`，同时更新数据库 Post 表的 likesCount
5. 前端在帖子卡片添加点赞按钮（Heart 图标 + 数字）：未点赞灰色空心、已点赞红色实心 + 动画
6. 点击后调用 API，乐观更新 UI
7. 使用 wagmi `useWriteContract` 提交交易
8. 点赞数实时更新
9. 移动端：Haptic Feedback
10. 测试：点赞 → 取消点赞 → 再点赞，状态和计数正确

### Story 3.7: 评论功能（Comment）

As a **用户**,  
I want **在帖子下方点击"评论"按钮，输入评论文本（≤ 280 字符），发布后评论显示在帖子下方**,  
so that **我可以与内容作者互动，参与讨论**。

#### Acceptance Criteria

1. 扩展 Prisma schema：Comment 表（id、postId FK、authorId FK、content、ipfsHash、createdAt）
2. 评论上传到 IPFS，哈希存储在数据库
3. 后端实现 API：`POST /posts/:id/comments`（上传 IPFS、存数据库、调用 `ContentRegistry.incrementComments()`）、`GET /posts/:id/comments`（返回评论列表，分页）
4. 前端在帖子卡片添加"评论"按钮和评论数
5. 点击后展开评论区域（Collapsible）：现有评论列表（最多 3 条）、评论输入框、"发表评论"按钮
6. 发表评论流程：上传 IPFS → API 创建评论 → 合约交易 → 显示在列表
7. 评论显示：作者头像 + 用户名、文本、时间
8. 响应式：移动端评论输入框全屏 Modal
9. 加载状态：Skeleton
10. 空状态："成为第一个评论的人！"

### Story 3.8: 帖子详情页

As a **用户**,  
I want **点击帖子内容，打开帖子详情页，查看完整的帖子信息、所有评论、点赞用户列表**,  
so that **我可以深入查看帖子的完整上下文和社区讨论**。

#### Acceptance Criteria

1. 创建页面 `app/posts/[id]/page.tsx`
2. 从 URL 参数获取帖子 ID
3. 调用后端 API `GET /posts/:id`，获取帖子详情
4. 页面布局：导航栏（返回按钮）、帖子完整内容、评论列表、评论输入框（固定底部）
5. 点赞按钮和评论按钮（功能同 Story 3.6、3.7）
6. 评论列表：每页 20 条、按时间正序、shadcn Pagination
7. 点击点赞数，弹出 Dialog 显示点赞用户列表
8. 分享功能：复制链接按钮
9. 响应式：移动端全屏
10. 加载状态：Skeleton
11. 错误处理：帖子不存在，显示 404

### Story 3.9: 发现 Feed（所有用户内容）

As a **新用户**（未关注任何人）,  
I want **在时间线查看"发现"Feed，显示所有用户的最新内容，帮助我发现感兴趣的创作者**,  
so that **我可以快速找到值得关注的用户，建立社交网络**。

#### Acceptance Criteria

1. 修改时间线页面，添加 Tab 切换（shadcn Tabs）："关注" Tab、"发现" Tab
2. 后端实现 API `GET /posts/discover`：查询所有用户的最新内容、按时间倒序、支持分页
3. "发现" Tab 显示所有内容，格式同"关注" Feed
4. 默认显示"关注" Tab，未关注任何人时自动切换到"发现"
5. 实现内容去重（不显示自己的内容）
6. 性能：加载 20 条内容 < 2 秒
7. Tab 切换动画流畅
8. 移动端：Tab 在顶部固定
9. 记住用户的 Tab 选择（localStorage）

### Story 3.10: 用户搜索与关注推荐

As a **用户**,  
I want **搜索其他用户（通过地址或用户名），查看搜索结果，点击进入用户主页并关注**,  
so that **我可以找到感兴趣的创作者，扩展我的社交网络**。

#### Acceptance Criteria

1. 在导航栏添加搜索框（shadcn Input + Command）
2. 后端实现 API `GET /users/search?q=query`：按用户名或地址搜索、模糊匹配、返回匹配用户列表（最多 10 个）
3. 前端实现搜索：输入 3 个字符后自动搜索（debounce 300ms）、显示结果下拉列表（shadcn Command）
4. 点击搜索结果，跳转到用户主页
5. 搜索框快捷键：Ctrl/Cmd + K
6. 移动端：搜索为单独页面
7. 搜索历史（localStorage，最多 10 个）
8. 空状态：无结果时显示"未找到匹配用户"
9. 加载状态：Loading 图标
10. 性能：搜索响应 < 500ms

---

## Epic 4: Multi-Agent Content Moderation System

### Epic Goal

实现 Trustless SocialFi 的核心差异化功能：多 Agent 去中心化内容审核系统。整合 Chainlink VRF 随机选择 Agent，开发 Agent 审核服务（调用 OpenAI GPT-4 API 判断内容合规性），实现加权共识投票智能合约，开发审核结果透明展示前端界面。修改 Epic 3 的内容发布流程，所有新内容必须经过 Agent 审核，通过后才能发布到时间线。此 Epic 完成后，平台实现"去中心化内容治理 + 质量保证"的核心价值主张。

### Story 4.1: Chainlink VRF 随机 Agent 选择合约

As a **智能合约开发者**,  
I want **集成 Chainlink VRF v2.5，实现随机选择 5 个 Agent 的函数（选择概率基于 Agent 信誉评分加权）**,  
so that **内容审核过程公平且不可预测，防止 Agent 串通或操纵审核结果**。

#### Acceptance Criteria

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

### Story 4.2: Agent 审核服务开发（OpenAI 集成）

As a **后端开发者**,  
I want **开发 Agent 审核服务，接收内容文本和合规规则，调用 OpenAI GPT-4 API 判断是否合规，返回判断结果（通过/拒绝）和置信度**,  
so that **Agent 可以自动化审核内容，过滤违规内容（暴力、诈骗、仇恨言论），确保平台内容质量**。

#### Acceptance Criteria

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

### Story 4.3: 内容审核工作流智能合约（ModerationWorkflow）

As a **智能合约开发者**,  
I want **开发内容审核工作流合约，协调整个审核流程（请求 VRF 选择 Agent → 等待 Agent 判断 → 执行加权共识投票 → 更新内容状态）**,  
so that **内容审核过程完全自动化且去中心化，无需人工干预**。

#### Acceptance Criteria

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

### Story 4.4: 后端审核协调服务（Orchestrator）

As a **后端开发者**,  
I want **开发审核协调服务，监听 `AgentsSelected` 事件，自动调用 5 个 Agent 的审核端点，收集判断结果并提交到智能合约**,  
so that **审核流程自动化执行，Agent 服务无需直接与区块链交互，降低 Agent 运营门槛**。

#### Acceptance Criteria

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

### Story 4.5: 审核进度与结果前端展示

As a **用户**,  
I want **发布内容后，在时间线看到"审核中"状态和进度条（5 个 Agent 判断进度），审核完成后查看详细结果（哪些 Agent 通过/拒绝、最终得分）**,  
so that **我可以实时了解审核进度，理解内容为何被通过或拒绝（透明度核心功能）**。

#### Acceptance Criteria

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

### Story 4.6: 修改内容发布流程集成审核

As a **用户**,  
I want **发布内容后，内容先进入审核流程（选择 Agent → Agent 审核 → 共识投票），通过后自动显示在时间线，拒绝后收到通知**,  
so that **平台上的内容经过质量把关，垃圾内容和违规信息被过滤，我享受高质量的内容环境**。

#### Acceptance Criteria

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

### 🤔 Epic 4 设计理由

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

### 🎯 请选择下一步

**1.** 继续 Epic 5（Reputation System & Economic Incentives）

**2.** 调整 Epic 4 的 Stories

**3.** 深化某个 Story（如：4.2 OpenAI Prompt 工程）

---

## Epic 5: Reputation System & Economic Incentives

### Epic Goal

实现 Agent 和用户的动态信誉系统，以及完整的经济激励机制。开发信誉计算智能合约（时间衰减、内容质量反馈），实现奖励分配系统（诚实 Agent 获得代币奖励），实现质押金罚没机制（恶意 Agent 被惩罚），开发前端信誉查询和可视化界面。此 Epic 完成后，经济激励闭环形成，确保 Agent 有动机诚实审核，优质创作者获得奖励，平台生态健康运转。

### Story 5.1: Agent 信誉计算智能合约

As a **智能合约开发者**,  
I want **开发信誉计算合约（ReputationSystem），基于历史审核准确率和内容质量反馈动态计算 Agent 信誉评分，实现每周 5% 的时间衰减**,  
so that **Agent 的信誉评分准确反映其近期表现，近期诚实审核权重大于历史，防止"慢性毒药攻击"**。

#### Acceptance Criteria

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

### Story 5.2: 代币奖励分配系统

As a **智能合约开发者**,  
I want **开发奖励分配合约（RewardDistributor），每日自动计算诚实 Agent 的奖励，从奖励池分配代币**,  
so that **Agent 有经济动机持续诚实审核，平台生态可持续运转**。

#### Acceptance Criteria

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

### Story 5.3: 质押金罚没机制

As a **智能合约开发者**,  
I want **实现质押金罚没机制，当 Agent 连续 10 次判断错误或单次恶意行为时，自动罚没部分或全部质押金**,  
so that **恶意 Agent 被经济惩罚，确保 Agent 网络的诚实性**。

#### Acceptance Criteria

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

### Story 5.4: 用户信誉系统实现

As a **智能合约开发者**,  
I want **实现用户信誉计算，基于发布内容的质量（点赞数、评论数、举报率）动态计算用户信誉评分**,  
so that **优质创作者信誉高，其内容互动（点赞、评论）权重大，防止刷量攻击**。

#### Acceptance Criteria

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

### Story 5.5: 前端信誉可视化与透明度展示

As a **用户**,  
I want **在我的个人主页查看信誉评分详情（如何计算、历史趋势、影响因素），理解如何提升信誉**,  
so that **我可以优化内容策略，提升信誉评分，获得更多曝光和奖励（透明度核心功能）**。

#### Acceptance Criteria

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

## Epic 6: User Preferences & Personalized Tag Management

### Epic Goal

实现用户偏好的 IPFS 去中心化存储和个性化 Tag 管理系统。用户行为数据（点赞、评论、关注）加密后存储在 IPFS，系统自动生成个性化 Tag（如："DeFi 爱好者"、"政治评论关注者"），用户可在"我的偏好"页面查看、编辑、删除、合并 Tag。支持多钱包关联、跨设备同步、隐私模式。此 Epic 为 Phase 2 的个性化推荐系统奠定数据基础，同时展示"数据主权 + 算法透明"的核心价值。

### Story 6.1: 用户偏好数据加密与 IPFS 存储

As a **后端开发者**,  
I want **实现用户偏好数据的 IPFS 加密存储服务，使用用户钱包签名派生的 AES-256 密钥加密，双 Pinning 备份**,  
so that **用户偏好数据去中心化存储，用户完全控制数据，跨设备同步，隐私得到保护**。

#### Acceptance Criteria

1. 在 `src/services/preferences.ts` 创建偏好管理服务
2. 定义偏好数据结构（TypeScript interface）：
   ```typescript
   interface UserPreferences {
     tags: PersonalizedTag[];
     behaviorData: {
       likedPosts: string[];
       commentedPosts: string[];
       followedUsers: string[];
     };
     privacy: {
       mode: "public" | "private";
       allowTagGeneration: boolean;
     };
     metadata: {
       version: string;
       lastUpdated: number;
     };
   }
   ```
3. 实现函数 `encryptPreferences(data: UserPreferences, userSignature: string)`：
   - 使用 EIP-712 签名派生 AES-256 密钥
   - 加密偏好数据（crypto-js）
   - 返回加密的 Buffer
4. 实现函数 `decryptPreferences(encryptedData: Buffer, userSignature: string)`：
   - 派生相同密钥
   - 解密数据
   - 返回 UserPreferences 对象
5. 实现 API 端点 `POST /preferences/upload`：
   - 接收 `{ preferences: UserPreferences, signature: string }`
   - 加密数据
   - 并行上传到 Pinata 和 Web3.Storage
   - 返回 IPFS 哈希
6. 实现 API 端点 `GET /preferences/:ipfsHash`：
   - 从 IPFS 下载加密数据
   - 返回给前端（前端负责解密）
7. 在 `UserRegistry.sol` 添加：mapping `userPreferencesHash[address] = string`（存储 IPFS 哈希）
8. 实现函数 `updatePreferencesHash(string memory ipfsHash)`：用户更新偏好哈希
9. 测试：加密 → 上传 IPFS → 下载 → 解密，数据一致
10. 测试：上传延迟 < 5 秒
11. 文件大小限制：< 100 KB

### Story 6.2: 个性化 Tag 自动生成服务

As a **后端开发者**,  
I want **开发 Tag 生成服务，分析用户行为（点赞的内容主题、关注的用户类型），自动生成个性化 Tag（名称、权重、来源说明）**,  
so that **用户可以直观了解自己的兴趣偏好，为 Phase 2 的推荐系统提供数据基础**。

#### Acceptance Criteria

1. 在 `src/services/tagGenerator.ts` 创建 Tag 生成服务
2. 定义 Tag 接口：
   ```typescript
   interface PersonalizedTag {
     id: string;
     name: string;
     weight: number; // 0-100
     source: string; // 生成来源说明
     generatedAt: number;
   }
   ```
3. 实现函数 `generateTagsFromBehavior(userId: string)`：
   - 读取用户最近 3 个月的行为数据（点赞、评论、关注）
   - 分析点赞内容的主题（使用简单的关键词提取）
   - 分析关注用户的类型（查看他们的简介关键词）
   - 生成 Tag 列表（最多 20 个）
4. Tag 生成规则（示例）：
   - 点赞 > 10 条 DeFi 相关内容 → 生成 Tag "DeFi 爱好者"，权重 = 点赞数 / 总点赞数 × 100
   - 关注 > 5 个政治评论员 → 生成 Tag "政治评论关注者"
   - 点赞 > 5 条 NFT 内容 → 生成 Tag "NFT 收藏者"
5. 实现 API 端点 `POST /preferences/generate-tags`：
   - 接收 `{ userId: string }`
   - 调用 `generateTagsFromBehavior()`
   - 返回生成的 Tag 列表
6. 实现定时任务（Bull）：每周为所有活跃用户生成 Tag
7. 测试：用户点赞 15 条 DeFi 内容 → 生成"DeFi 爱好者" Tag，权重 75
8. 测试：Tag 生成响应 < 3 秒
9. 测试：生成的 Tag 准确性（人工验证 10 个用户）
10. 在数据库记录 Tag 生成日志（用于优化算法）

### Story 6.3: "我的偏好"管理页面

As a **用户**,  
I want **访问"我的偏好"页面，查看所有自动生成的个性化 Tag（卡片形式，显示权重、来源、生成时间），可以删除、编辑、合并 Tag**,  
so that **我可以管理自己的偏好数据，删除不准确的 Tag，体验"数据主权"**。

#### Acceptance Criteria

1. 创建页面 `app/preferences/page.tsx`
2. 页面加载时：
   - 从智能合约读取用户偏好 IPFS 哈希
   - 从 IPFS 下载加密数据
   - 请求用户签名以解密
   - 显示所有 Tag
3. 使用 shadcn Card 展示每个 Tag：
   - Emoji 图标（根据 Tag 类型自动选择）
   - Tag 名称（大字号）
   - 权重条（shadcn Progress，颜色根据权重变化）
   - 来源说明（"点赞了 42 条 DeFi 相关内容"）
   - 生成日期（相对时间）
   - 操作按钮：编辑、删除
4. 实现 Tag 删除：
   - 点击删除按钮 → 确认弹窗（shadcn Alert Dialog）
   - 用户确认 → 请求签名 → 从偏好数据中移除 Tag → 重新加密 → 上传 IPFS → 更新智能合约哈希
   - 显示 Toast："Tag 已删除"
   - 刷新页面显示更新后的 Tag 列表
5. 实现 Tag 编辑：
   - 点击编辑按钮 → 弹出 Dialog（输入框）
   - 用户修改 Tag 名称 → 保存 → 重新加密上传
6. 实现 Tag 合并：
   - 多选模式（Checkbox）
   - 选择 2+ 个 Tag → 点击"合并"按钮
   - 弹出 Dialog：输入合并后的 Tag 名称，权重 = sum(选中 Tag 的权重)
   - 保存后删除原 Tag，创建新 Tag
7. 显示统计信息：
   - Tag 总数
   - 最后更新时间
   - IPFS 哈希（可点击查看原始数据）
8. 显示"数据主权"信息框：
   - "您的数据加密存储在 IPFS"
   - "只有您能访问（通过钱包签名）"
   - "删除 Tag 不影响已发布的内容"
9. 提供"导出偏好"和"导入偏好"按钮（FR40）
10. 提供"隐私模式"开关（FR41）
11. 提供"删除所有偏好数据"按钮（需二次确认）

### Story 6.4: 多钱包关联与偏好聚合

As a **用户**,  
I want **关联多个钱包地址（主钱包 + 子钱包），系统聚合所有关联钱包的行为数据生成统一的 Tag**,  
so that **我在不同设备使用不同钱包时，偏好数据保持一致，不会分裂**。

#### Acceptance Criteria

1. 在 `UserRegistry.sol` 添加多钱包关联功能
2. 定义 mapping：`linkedWallets[mainWallet] = address[]`（最多 5 个子钱包）
3. 实现函数 `linkWallet(address subWallet, bytes memory signature)`：
   - 验证 subWallet 的签名（证明拥有该钱包）
   - 添加到主钱包的关联列表
   - 触发事件 `WalletLinked(address indexed mainWallet, address indexed subWallet)`
4. 实现函数 `unlinkWallet(address subWallet)`
5. 实现函数 `getLinkedWallets(address mainWallet)` 返回所有关联钱包
6. 修改 Tag 生成逻辑：
   - 读取主钱包 + 所有子钱包的行为数据
   - 聚合生成统一的 Tag
7. 前端在"我的偏好"页面添加"关联钱包管理"区域：
   - 显示所有已关联的钱包（地址缩写 + 关联时间）
   - "添加钱包"按钮（弹出 Dialog，连接钱包 + 签名）
   - "移除"按钮（每个子钱包旁边）
8. 实现添加钱包流程：
   - 用户切换到子钱包（MetaMask 切换账户）
   - 点击"添加钱包"
   - 使用子钱包签名消息："Link to [主钱包地址]"
   - 调用智能合约 `linkWallet()`
9. 测试：用户有 2 个钱包，钱包 A 点赞 DeFi，钱包 B 点赞 NFT → 关联后生成两个 Tag
10. 显示关联钱包数量限制（最多 5 个）

---

## Epic 7: DAO Governance System

### Epic Goal

实现社区自治的 DAO 治理框架，让代币持有者通过提案和投票决定平台的合规规则。实现提案提交智能合约、投票机制（1 代币 = 1 票）、提案执行（自动更新合规规则）、紧急提案快速通道（48 小时投票窗口）。开发 DAO 治理前端界面（提案列表、提案详情、投票）。1 个月后将合规规则制定权从项目团队移交社区，实现去中心化自治。此 Epic 完成后，Trustless SocialFi MVP 完整交付。

### Story 7.1: DAO 治理智能合约开发

As a **智能合约开发者**,  
I want **开发 DAO 治理合约（Governance），支持代币持有者提交提案（修改合规规则）和投票（1 代币 = 1 票），提案通过后自动执行**,  
so that **社区可以民主决定平台规则，实现去中心化自治，防止单一实体操控**。

#### Acceptance Criteria

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

### Story 7.2: 合规规则存储与动态更新

As a **智能合约开发者**,  
I want **开发合规规则存储合约（ModerationRules），存储当前生效的规则，支持 DAO 投票后动态更新，Agent 读取最新规则进行审核**,  
so that **合规规则由社区治理，可以适应不同地区和文化差异，规则更新后所有 Agent 自动同步**。

#### Acceptance Criteria

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

### Story 7.3: DAO 提案列表与详情页面

As a **代币持有者**,  
I want **访问 DAO 治理页面，查看所有提案（进行中、已通过、已拒绝），点击查看提案详情、当前投票结果、投票**,  
so that **我可以参与平台治理，对合规规则的修改投票，行使我的治理权**。

#### Acceptance Criteria

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

### Story 7.4: 提案创建界面

As a **代币持有者**,  
I want **创建新提案（填写标题、描述、新的合规规则），提交到 DAO 进行投票**,  
so that **我可以提议修改平台规则，如果社区支持则规则更新**。

#### Acceptance Criteria

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

### Story 7.5: 治理权移交与创世规则

As a **项目团队**,  
I want **在 MVP 上线 1 个月后，执行治理权移交，将 ModerationRules 合约的所有权从团队多签钱包转移到 Governance 合约**,  
so that **社区获得真正的自治权，规则修改完全由 DAO 决定，平台实现去中心化承诺**。

#### Acceptance Criteria

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

## Next Steps

### 产品经理交接

这份 PRD 为 Trustless SocialFi MVP 提供了完整的功能需求、技术规格和用户故事。

**PRD 概要：**

- **46 个功能需求** + **32 个非功能需求**
- **7 个 Epic**，共 **约 40-45 个 User Stories**（详细 Stories 已完成 Epic 1-4，Epic 5-7 已定义）
- **技术栈：** Foundry + Arbitrum + TypeScript + OpenAI + React/Next.js + viem + shadcn/ui
- **MVP 时间线：** 6 个月（Epic 1-2: 月 1-2，Epic 3-4: 月 3-4，Epic 5-7: 月 5-6）

**关键成功标准：**

- 5,000 注册用户，1,500 MAU
- 50 个活跃 Agent
- Day 30 留存率 ≥ 20%
- 审核响应时间 < 30 秒
- Gas 费 < $0.10/交易

**下一步建议：**

1. **架构师（Architect）接手** - 基于此 PRD 创建详细的技术架构文档，包括：

   - 系统架构图（前端、后端、智能合约交互）
   - 数据流图
   - API 设计文档
   - 数据库 Schema 详细设计
   - 智能合约接口定义
   - 安全架构设计

2. **UX 专家（UX Expert）接手** - 基于 UI Design Goals 创建详细的设计规范，包括：

   - Wireframes（12 个核心页面）
   - 高保真 Mockups（Figma）
   - 用户流程图（Onboarding、发帖、审核、投票）
   - 组件库设计（shadcn/ui 定制）
   - Design Tokens（颜色、字体、间距）

3. **开发团队开始 Epic 1** - 建立项目基础设施，搭建开发环境

**关键决策点需要确认：**

- 代币分配方案（团队、投资者、社区、Agent 奖励池的具体比例）
- Agent 质押门槛（1000 $TRUST 是否合适？）
- Tag 生成频率（每周批量 vs 实时）
- IPFS Pinning 成本承担（平台补贴 vs 用户支付）

---

### Architect Prompt

请基于此 PRD 创建 **Trustless SocialFi 技术架构文档**，包括：

1. **系统架构图** - 前端、后端、智能合约三层架构的详细交互流程
2. **数据流图** - 用户发帖 → IPFS 上传 → VRF 选择 → Agent 审核 → 共识投票 → 发布的完整流程
3. **API 设计文档** - 所有后端 API 端点的详细规格（请求/响应、错误码）
4. **智能合约接口定义** - 所有合约的函数签名、事件定义、状态变量
5. **数据库 Schema** - 完整的 Prisma schema（User、Post、Agent、Comment、Like、Follow、ModerationLog 等）
6. **安全架构** - 签名验证、权限控制、API 安全、智能合约安全
7. **部署架构** - Kubernetes 配置、Docker 镜像、环境配置
8. **监控与可观测性** - Prometheus 指标、Grafana Dashboard、日志架构

技术栈已在 PRD 中明确，请严格遵循：

- 智能合约：Foundry + Solidity 0.8.24 + OpenZeppelin + Arbitrum One
- 后端：TypeScript + Node.js 20 + Fastify + viem + Prisma + PostgreSQL
- 前端：Next.js 14 + React 18 + viem + wagmi + RainbowKit + shadcn/ui + Tailwind CSS

参考文档：

- 项目简报：`docs/brief.md`
- 竞争对手分析：`docs/competitor-analysis.md`
- 本 PRD：`docs/prd.md`

---

### UX Expert Prompt

请基于此 PRD 的 UI Design Goals 创建 **Trustless SocialFi 用户体验设计文档**，包括：

1. **Wireframes** - 12 个核心页面的线框图（低保真）
2. **High-Fidelity Mockups** - 关键页面的高保真设计（Figma）
3. **用户旅程图** - 首次用户 Onboarding、发帖与审核、DAO 投票的完整流程
4. **组件库** - 基于 shadcn/ui 的定制组件设计
5. **Design Tokens** - 品牌色、字体、间距、圆角、阴影的完整规格（Tailwind config）
6. **交互动画** - 关键交互的动画规格（发布进度、审核进度、投票动画）
7. **响应式设计** - 移动端和桌面端的布局差异
8. **可访问性规范** - WCAG 2.1 AA 的具体实现指南

设计原则（从 PRD）：

- Web2 的流畅体验 + Web3 的透明度
- 渐进式 Web3 onboarding
- 透明度优先（审核详情、Tag 来源可视化）
- 快速反馈（实时状态展示）
- 信任建立（安全提示、数据主权可视化）

品牌风格：

- 色彩：Blue-600（主色）、Emerald-500（强调色）
- 字体：Inter（正文）、JetBrains Mono（代码）
- 风格：现代、专业、值得信赖

参考文档：

- 项目简报：`docs/brief.md`
- 本 PRD：`docs/prd.md`

---

**🎉 PRD 已完成！**

这份文档涵盖了：

- ✅ 9 个目标和背景
- ✅ 46 个功能需求 + 32 个非功能需求
- ✅ 完整的技术假设（Monorepo、技术栈、测试策略）
- ✅ UI 设计目标（UX 原则、核心页面、品牌、可访问性）
- ✅ 7 个 Epic 的详细定义
- ✅ Epic 1-4 的完整 User Stories（约 30 个 Stories）
- ✅ Epic 5-7 的核心 Stories
- ✅ Architect 和 UX Expert 的交接 Prompts

总计约 **1450+ 行**的详细产品需求文档！

---
