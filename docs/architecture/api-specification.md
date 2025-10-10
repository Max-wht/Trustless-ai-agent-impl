# API 规范 / API Specification

## REST API 概览 / REST API Overview

**基础 URL / Base URL**: `https://api.trustless-socialfi.xyz/v1`

**认证方式 / Authentication**: 钱包签名生成的 JWT (EIP-712) / JWT from wallet signature (EIP-712)

**关键端点 / Key Endpoints:**

### 认证 / Authentication

- `GET /auth/nonce` - 获取签名用的 nonce / Get nonce for signature
- `POST /auth/verify` - 验证签名，获取 JWT / Verify signature, get JWT

### 用户 / Users

- `POST /users/register` - 注册新用户 / Register new user
- `GET /users/{address}` - 获取用户档案 / Get user profile
- `GET /users/{id}/following` - 获取关注列表 / Get following list

### 帖子 / Posts

- `POST /posts` - 创建帖子（触发审核）/ Create post (triggers moderation)
- `GET /posts` - 列出帖子（分页）/ List posts (paginated)
- `GET /posts/{id}` - 获取帖子详情 / Get post details
- `GET /posts/{id}/moderation` - 获取审核状态 / Get moderation status
- `POST /posts/{id}/like` - 点赞帖子 / Like post
- `POST /posts/{id}/comments` - 添加评论 / Add comment

### Agent

- `GET /agents` - 列出 Agents（可排序、筛选）/ List agents (sortable, filterable)
- `GET /agents/{id}` - 获取 Agent 详情 / Get agent details
- `POST /agent/moderate` - Agent 审核端点 / Agent moderation endpoint

### IPFS

- `POST /ipfs/upload` - 上传内容到 IPFS / Upload content to IPFS
- `GET /ipfs/{hash}` - 从 IPFS 检索内容 / Retrieve content from IPFS

**错误响应格式 / Error Response Format:**

```json
{
  "error": {
    "code": "CONTENT_TOO_LONG",
    "message": "Post content exceeds maximum length",
    "details": {
      "maxLength": 5000,
      "actualLength": 5234
    },
    "timestamp": "2024-10-10T12:34:56Z",
    "requestId": "req_abc123"
  }
}
```

_完整 OpenAPI 3.0 规范可在 `/docs` 端点和 `docs/api/openapi.json` 中查看。_

_Full OpenAPI 3.0 specification available at `/docs` endpoint and in `docs/api/openapi.json`._

---
