# 数据库 Schema / Database Schema

完整的 Prisma schema，包含索引、约束和关系。详见 `apps/api/prisma/schema.prisma`。

_Complete Prisma schema with indexes, constraints, and relationships. See full schema in `apps/api/prisma/schema.prisma`._

**核心表 / Key Tables:**

- `users` - 用户档案和信誉 / User profiles and reputation
- `posts` - 内容元数据和状态 / Content metadata and status
- `agents` - Agent 注册表和性能 / Agent registry and performance
- `agent_judgments` - 单个 Agent 决策 / Individual agent decisions
- `likes` - 用户点赞 / User likes on posts
- `comments` - 帖子评论 / Post comments
- `follows` - 关注关系 / Follow relationships
- `proposals` - DAO 治理提案 / DAO governance proposals
- `user_preferences` - IPFS 哈希引用 / IPFS hash references

**性能索引 / Performance Indexes:**

- `idx_posts_status_created_at` - 时间线查询 / Timeline queries
- `idx_agents_active_reputation` - Agent 排行榜 / Agent leaderboard
- `idx_users_wallet_address` - 用户查找 / User lookups

**数据完整性 / Data Integrity:**

- 钱包地址唯一约束 / Unique constraints on wallet addresses
- 外键级联删除 / Foreign key cascades for data cleanup
- 检查约束（信誉 0-100）/ Check constraints (reputation 0-100)

---
