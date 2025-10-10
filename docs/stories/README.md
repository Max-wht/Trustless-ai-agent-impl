# Trustless SocialFi - Product Backlog

本目录包含 Trustless SocialFi MVP 的所有用户故事，共 **47 个 Stories** 分布在 **7 个 Epic** 中。

_This directory contains all user stories for Trustless SocialFi MVP: **47 Stories** across **7 Epics**._

---

## Epic Overview / Epic 概览

| Epic | 名称 / Name                                     | Stories | 总 Story Points | 状态 / Status |
| ---- | ----------------------------------------------- | ------- | --------------- | ------------- |
| 1    | Foundation & Core Infrastructure                | 12      | ~56             | ✅ Ready      |
| 2    | Token Economy & Agent Registration              | 5       | ~34             | ✅ Ready      |
| 3    | Content Publishing & IPFS Storage               | 10      | ~59             | ✅ Ready      |
| 4    | Multi-Agent Content Moderation System           | 6       | ~73             | ✅ Ready      |
| 5    | Reputation System & Economic Incentives         | 5       | ~42             | ✅ Ready      |
| 6    | User Preferences & Personalized Tag Management  | 4       | ~42             | ✅ Ready      |
| 7    | DAO Governance System                           | 5       | ~34             | ✅ Ready      |
| -    | **Total / 总计**                                | **47**  | **~340**        | -             |

**预估开发时间 / Estimated Timeline:** 6 个月 / 6 months (以 2 周 sprint，每 sprint 完成 ~30-40 points 计算)

---

## Epic 1: Foundation & Core Infrastructure (12 Stories)

建立项目基础设施，包括 Monorepo、智能合约框架、前后端骨架。

_Establish project infrastructure including Monorepo, smart contract framework, backend and frontend skeleton._

| Story | 标题 / Title                               | Points | 文件 / File                              |
| ----- | ------------------------------------------ | ------ | ---------------------------------------- |
| 1.1   | Monorepo 项目初始化                        | 3      | story-1.1-monorepo-initialization.md     |
| 1.2   | Foundry 智能合约项目框架搭建               | 3      | story-1.2-foundry-setup.md               |
| 1.3   | 后端 API 框架搭建（Fastify + TypeScript）  | 5      | story-1.3-backend-api-framework.md       |
| 1.4   | 前端 Next.js 应用初始化                    | 5      | story-1.4-frontend-nextjs-initialization |
| 1.5   | RainbowKit 钱包连接集成                    | 5      | story-1.5-rainbowkit-wallet-integration  |
| 1.6   | 用户注册与基础档案创建                     | 8      | story-1.6-user-registration.md           |
| 1.7   | 用户个人主页基础界面                       | 5      | story-1.7-user-profile-page.md           |
| 1.8   | 数据库初始化与 Prisma 配置                 | 5      | story-1.8-database-prisma-setup.md       |
| 1.9   | 共享类型定义包（shared package）           | 3      | story-1.9-shared-types-package.md        |
| 1.10  | 简单时间线展示（Placeholder UI）           | 3      | story-1.10-timeline-placeholder-ui.md    |
| 1.11  | CI/CD 基础配置（GitHub Actions）           | 5      | story-1.11-cicd-github-actions.md        |
| 1.12  | 基础监控与日志配置                         | 5      | story-1.12-monitoring-logging-setup.md   |

**Epic 1 总计 / Total:** 56 points ≈ 4-5 周 / 4-5 weeks

---

## Epic 2: Token Economy & Agent Registration (5 Stories)

实现原生代币和 Agent 注册系统。

_Implement native token and Agent registration system._

| Story | 标题 / Title                 | Points | 文件 / File                         |
| ----- | ---------------------------- | ------ | ----------------------------------- |
| 2.1   | ERC-20 代币合约开发与部署    | 8      | story-2.1-erc20-token-contract.md   |
| 2.2   | Agent 注册智能合约开发       | 8      | story-2.2-agent-registry-contract   |
| 2.3   | 后端 Agent 信息查询 API      | 5      | story-2.3-agent-query-api.md        |
| 2.4   | Agent 列表页面前端实现       | 5      | story-2.4-agent-list-page.md        |
| 2.5   | Agent 注册界面（前端表单）   | 8      | story-2.5-agent-registration-form   |

**Epic 2 总计 / Total:** 34 points ≈ 2-3 周 / 2-3 weeks

---

## Epic 3: Content Publishing & IPFS Storage (10 Stories)

实现内容发布和去中心化存储，基础社交互动。

_Implement content publishing, decentralized storage, and basic social interactions._

| Story | 标题 / Title                       | Points | 文件 / File                       |
| ----- | ---------------------------------- | ------ | --------------------------------- |
| 3.1   | 内容发布智能合约（ContentRegistry）| 5      | story-3.1-content-registry-contract |
| 3.2   | 后端 IPFS 内容上传服务             | 5      | story-3.2-ipfs-upload-service     |
| 3.3   | 内容发布前端界面与流程             | 8      | story-3.3-post-creation-ui        |
| 3.4   | 时间线内容展示（真实数据）         | 8      | story-3.4-feed-display            |
| 3.5   | 关注功能（Follow/Unfollow）        | 8      | story-3.5-follow-functionality    |
| 3.6   | 点赞功能（Like/Unlike）            | 5      | story-3.6-like-functionality      |
| 3.7   | 评论功能（Comment）                | 8      | story-3.7-comment-functionality   |
| 3.8   | 帖子详情页                         | 5      | story-3.8-post-detail-page        |
| 3.9   | 发现 Feed（所有用户内容）          | 3      | story-3.9-discover-feed           |
| 3.10  | 用户搜索与关注推荐                 | 5      | story-3.10-user-search            |

**Epic 3 总计 / Total:** 59 points ≈ 4 周 / 4 weeks

---

## Epic 4: Multi-Agent Content Moderation System (6 Stories) 🌟 核心

实现多 Agent 去中心化内容审核（核心差异化功能）。

_Implement multi-agent decentralized content moderation (core differentiation)._

| Story | 标题 / Title                                | Points | 文件 / File                              |
| ----- | ------------------------------------------- | ------ | ---------------------------------------- |
| 4.1   | Chainlink VRF 随机 Agent 选择合约           | 13     | story-4.1-chainlink-vrf-agent-selection  |
| 4.2   | Agent 审核服务开发（OpenAI 集成）           | 13     | story-4.2-agent-moderation-service       |
| 4.3   | 内容审核工作流智能合约（ModerationWorkflow）| 13     | story-4.3-moderation-workflow-contract   |
| 4.4   | 后端审核协调服务（Orchestrator）            | 13     | story-4.4-agent-orchestrator             |
| 4.5   | 审核进度与结果前端展示                      | 8      | story-4.5-moderation-ui-display          |
| 4.6   | 修改内容发布流程集成审核                    | 8      | story-4.6-integrate-moderation-flow      |

**Epic 4 总计 / Total:** 73 points ≈ 5-6 周 / 5-6 weeks

**⚠️ 注意 / Note:** Epic 4 是核心功能，技术复杂度最高（Chainlink VRF、OpenAI 集成、加权共识）

---

## Epic 5: Reputation System & Economic Incentives (5 Stories)

实现动态信誉系统和经济激励机制。

_Implement dynamic reputation system and economic incentives._

| Story | 标题 / Title                       | Points | 文件 / File                              |
| ----- | ---------------------------------- | ------ | ---------------------------------------- |
| 5.1   | Agent 信誉计算智能合约             | 13     | story-5.1-reputation-calculation-contract |
| 5.2   | 代币奖励分配系统                   | 8      | story-5.2-reward-distribution            |
| 5.3   | 质押金罚没机制                     | 8      | story-5.3-slash-mechanism                |
| 5.4   | 用户信誉系统实现                   | 8      | story-5.4-user-reputation                |
| 5.5   | 前端信誉可视化与透明度展示         | 5      | story-5.5-reputation-ui-visualization    |

**Epic 5 总计 / Total:** 42 points ≈ 3 周 / 3 weeks

---

## Epic 6: User Preferences & Personalized Tag Management (4 Stories)

实现用户偏好 IPFS 存储和个性化 Tag 管理。

_Implement user preferences IPFS storage and personalized tag management._

| Story | 标题 / Title                           | Points | 文件 / File                             |
| ----- | -------------------------------------- | ------ | --------------------------------------- |
| 6.1   | 用户偏好数据加密与 IPFS 存储           | 13     | story-6.1-preferences-ipfs-encryption   |
| 6.2   | 个性化 Tag 自动生成服务                | 8      | story-6.2-tag-generation-service        |
| 6.3   | "我的偏好"管理页面                     | 13     | story-6.3-preferences-management-page   |
| 6.4   | 多钱包关联与偏好聚合                   | 8      | story-6.4-multi-wallet-linking          |

**Epic 6 总计 / Total:** 42 points ≈ 3 周 / 3 weeks

---

## Epic 7: DAO Governance System (5 Stories)

实现社区自治 DAO 治理框架。

_Implement community-governed DAO governance framework._

| Story | 标题 / Title                   | Points | 文件 / File                           |
| ----- | ------------------------------ | ------ | ------------------------------------- |
| 7.1   | DAO 治理智能合约开发           | 13     | story-7.1-dao-governance-contract     |
| 7.2   | 合规规则存储与动态更新         | 5      | story-7.2-moderation-rules-storage    |
| 7.3   | DAO 提案列表与详情页面         | 8      | story-7.3-dao-proposal-pages          |
| 7.4   | 提案创建界面                   | 5      | story-7.4-proposal-creation-form      |
| 7.5   | 治理权移交与创世规则           | 3      | story-7.5-governance-transfer         |

**Epic 7 总计 / Total:** 34 points ≈ 2-3 周 / 2-3 weeks

---

## Sprint Planning 建议 / Suggested Sprint Planning

### Sprint 1-2: Epic 1 (Weeks 1-4)
**目标:** 建立技术基础  
**Stories:** 1.1 - 1.12  
**可交付:** 可运行的空架子（钱包登录、空时间线、健康检查）

### Sprint 3-4: Epic 2 (Weeks 5-8)
**目标:** 代币经济和 Agent 注册  
**Stories:** 2.1 - 2.5  
**可交付:** Agent 可以注册，用户可以查看 Agent 列表

### Sprint 5-6: Epic 3 (Weeks 9-12)
**目标:** 内容发布和社交互动  
**Stories:** 3.1 - 3.10  
**可交付:** 用户可以发帖、关注、点赞、评论（无审核）

### Sprint 7-9: Epic 4 (Weeks 13-18) 🌟
**目标:** 多 Agent 审核系统（核心功能！）  
**Stories:** 4.1 - 4.6  
**可交付:** 所有内容经过去中心化审核

### Sprint 10-11: Epic 5 (Weeks 19-22)
**目标:** 信誉系统和经济激励  
**Stories:** 5.1 - 5.5  
**可交付:** 信誉系统运行，Agent 获得奖励/惩罚

### Sprint 12-13: Epic 6 (Weeks 23-26)
**目标:** 用户偏好和 Tag 管理  
**Stories:** 6.1 - 6.4  
**可交付:** 用户偏好 IPFS 存储，Tag 自动生成

### Sprint 14-15: Epic 7 (Weeks 27-30) - MVP 完成！
**目标:** DAO 治理系统  
**Stories:** 7.1 - 7.5  
**可交付:** 完整 MVP，社区可以治理规则

---

## 优先级说明 / Priority Levels

- **P0 - Critical**: 核心功能，MVP 必需
- **P1 - High**: 重要功能，显著提升用户价值
- **P2 - Medium**: 优化功能，提升体验
- **P3 - Low**: 可选功能，Phase 2 考虑

---

## Story Points 估算指南 / Story Points Guide

| Points | 复杂度 / Complexity | 估算时间 / Estimated Time | 示例 / Example        |
| ------ | ------------------- | ------------------------- | --------------------- |
| 1-2    | 极简单 / Trivial    | < 2 hours                 | 配置文件修改          |
| 3      | 简单 / Simple       | 2-4 hours                 | 简单组件、API 端点    |
| 5      | 中等 / Medium       | 4-8 hours (1 day)         | 复杂组件、合约功能    |
| 8      | 复杂 / Complex      | 1-2 days                  | 多层集成、复杂业务    |
| 13     | 非常复杂 / Very Complex | 2-3 days              | 核心系统、新技术集成  |
| 21+    | 应拆分 / Should Split   | > 3 days              | Epic 级别，需拆分     |

---

## 开发建议 / Development Recommendations

### 关键路径 / Critical Path

```
Epic 1 → Epic 2 → Epic 3 → Epic 4
                              ↓
                     (核心功能实现)
                              ↓
                    Epic 5 → Epic 6 → Epic 7
```

**必须按顺序 / Must Follow Sequence:**
- Epic 1 必须首先完成（基础设施）
- Epic 2 必须在 Epic 4 之前（需要 Agent 网络）
- Epic 4 必须在 Epic 5 之前（信誉基于审核结果）

**可并行 / Can Parallelize:**
- Epic 6 可与 Epic 5 并行（不同团队）
- Epic 7 可与 Epic 5/6 并行

### 团队分工建议 / Team Division Suggestion

**智能合约团队 / Smart Contract Team:**
- Stories: 1.2, 2.1, 2.2, 3.1, 4.1, 4.3, 5.1-5.4, 6.1, 7.1-7.2

**后端团队 / Backend Team:**
- Stories: 1.3, 1.8, 1.12, 2.3, 3.2, 4.2, 4.4, 6.2

**前端团队 / Frontend Team:**
- Stories: 1.4-1.7, 1.10, 2.4-2.5, 3.3-3.10, 4.5-4.6, 5.5, 6.3-6.4, 7.3-7.4

**DevOps 团队 / DevOps Team:**
- Stories: 1.1, 1.11, 1.12

---

## 风险识别 / Risk Identification

### 高风险 Stories / High-Risk Stories

| Story | 风险 / Risk                             | 缓解措施 / Mitigation                     |
| ----- | --------------------------------------- | ----------------------------------------- |
| 4.1   | Chainlink VRF 集成复杂                  | 提前 POC 验证，预留时间 buffer            |
| 4.2   | OpenAI API 成本可能超预算               | 实现缓存，监控成本，准备迁移计划          |
| 4.4   | 事件监听可靠性                          | 实现重试，添加监控告警                    |
| 6.1   | 加密密钥派生安全性                      | 使用标准 EIP-712，安全审计                |

---

## 下一步行动 / Next Actions

### 立即开始 / Start Immediately

1. **设置开发环境**
   - 参考：`docs/architecture/开发工作流-development-workflow.md`
   - 执行：Story 1.1 的验收标准

2. **创建 Sprint 1 Backlog**
   - 选择：Stories 1.1 - 1.4
   - 总 Points: 16 (适合 2 周 sprint)

3. **分配团队任务**
   - Story 1.1: DevOps
   - Story 1.2: 合约开发者
   - Story 1.3: 后端开发者
   - Story 1.4: 前端开发者

### 持续跟踪 / Ongoing Tracking

- 每日 Stand-up：更新 Story 状态
- 每周 Sprint Review：Demo 完成的 Stories
- 每 2 周 Sprint Planning：选择下一个 Sprint 的 Stories

---

## 文档链接 / Documentation Links

- **PRD**: [docs/prd/](../prd/)
- **Architecture**: [docs/architecture/](../architecture/)
- **Tech Stack**: [docs/architecture/技术栈-tech-stack.md](../architecture/技术栈-tech-stack.md)
- **Coding Standards**: [docs/architecture/编码规范-coding-standards.md](../architecture/编码规范-coding-standards.md)

---

**Backlog Status**: ✅ Complete - 47 Stories Ready

**Created**: 2025-10-10  
**Maintained By**: Product Manager (John) & Product Owner (Sarah)

