# 数据模型 / Data Models

本节定义了前端、后端和智能合约之间共享的核心数据模型。

_This section defines the core data models that will be shared between frontend, backend, and smart contracts._

## 用户 / User

**用途 / Purpose**: 表示一个基于钱包身份的注册用户。

_Represents a registered user with wallet-based identity._

**关键属性 / Key Attributes:**

- `id`: UUID - 主键 / Primary key
- `walletAddress`: string - 以太坊地址（唯一，小写）/ Ethereum address (unique, lowercase)
- `username`: string? - 可选显示名称 / Optional display name
- `bio`: string? - 用户简介（最多 280 字符）/ User biography (max 280 characters)
- `reputationScore`: number - 用户信誉（0-100）/ User reputation (0-100)
- `createdAt`: DateTime - 注册时间戳 / Registration timestamp

**TypeScript 接口 / TypeScript Interface:**

```typescript
interface User {
  id: string;
  walletAddress: `0x${string}`;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  reputationScore: number; // 0-100
  preferencesIpfsHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## 帖子 / Post (Content)

**用途 / Purpose**: 用户生成的内容，IPFS 存储，带审核状态。

_User-generated content with IPFS storage and moderation status._

```typescript
enum ContentStatus {
  Pending = 'Pending', // 审核中 / Under review
  Approved = 'Approved', // 已批准 / Approved
  Rejected = 'Rejected', // 已拒绝 / Rejected
}

interface Post {
  id: string; // 匹配区块链 contentId / Matches blockchain contentId
  authorId: string; // 作者 UUID / Author UUID
  author?: User; // 作者信息 / Author info
  ipfsHash: string; // IPFS 内容哈希 / IPFS content hash
  contentPreview: string; // 前 280 字符预览 / First 280 chars preview
  status: ContentStatus; // 审核状态 / Moderation status
  moderationScore?: number | null; // 共识得分 0-100 / Consensus score 0-100
  likesCount: number; // 点赞数 / Like count
  commentsCount: number; // 评论数 / Comment count
  createdAt: Date; // 创建时间 / Creation time
  moderatedAt?: Date | null; // 审核完成时间 / Moderation completion time
}
```

## Agent / Agent

**用途 / Purpose**: 审核内容的 AI Agent，带质押和信誉。

_AI agent that moderates content with staking and reputation._

```typescript
interface Agent {
  id: string; // UUID
  walletAddress: `0x${string}`; // Agent 运营者地址 / Agent operator address
  serviceEndpoint: string; // HTTP API 端点 / HTTP API endpoint
  stakedAmount: bigint; // 质押金额（Wei）/ Staked amount (Wei)
  reputationScore: number; // 信誉评分 0-100 / Reputation score 0-100
  totalJudgments: number; // 总审核次数 / Total judgments
  accuracyRate: number; // 准确率 0-100% / Accuracy rate 0-100%
  isActive: boolean; // 是否活跃 / Whether active
  registeredAt: Date; // 注册时间 / Registration time
}
```

**其他模型 / Additional Models:** AgentJudgment (Agent 判断), Like (点赞), Comment (评论), Follow (关注), UserPreferences (用户偏好), Proposal (提案)

详见数据库 Schema 部分的完整定义。_See Database Schema section for complete definitions._

---
