# 核心工作流程图 / Core Workflow Diagrams

## 用户发帖完整流程 / Complete Post Creation Flow

```mermaid
sequenceDiagram
    participant 用户/User
    participant 前端/Frontend
    participant 后端API/Backend
    participant IPFS
    participant 合约/Contract
    participant VRF
    participant Agents

    用户/User->>前端/Frontend: 输入内容，点击"发布"
    前端/Frontend->>后端API/Backend: POST /posts { content }
    后端API/Backend->>IPFS: 上传内容 (双pinning)
    IPFS-->>后端API/Backend: 返回 ipfsHash
    后端API/Backend->>合约/Contract: publishContent(ipfsHash)
    合约/Contract-->>后端API/Backend: contentId, status=Pending
    后端API/Backend-->>前端/Frontend: { postId, status: "Pending" }
    前端/Frontend-->>用户/User: 显示"审核中..."

    合约/Contract->>VRF: 请求随机选择5个Agent
    VRF-->>合约/Contract: 返回随机数
    合约/Contract->>合约/Contract: 基于信誉加权选择5个Agent
    合约/Contract-->>后端API/Backend: Event: AgentsSelected

    Note over 后端API/Backend: Agent Orchestrator监听事件

    par 并行调用5个Agent
        后端API/Backend->>Agents: Agent1-5并行审核
        Agents->>Agents: 调用OpenAI GPT-4判断
        Agents-->>后端API/Backend: 5个判断结果
    end

    后端API/Backend->>合约/Contract: 提交5个判断
    合约/Contract->>合约/Contract: 计算加权共识
    合约/Contract->>合约/Contract: score>60%? Approved : Rejected
    合约/Contract-->>前端/Frontend: Event: ModerationCompleted

    前端/Frontend-->>用户/User: "✅ 已通过审核" 或 "❌ 已拒绝"
```

**总耗时 / Total Time**: 约 25-30 秒 / ~25-30 seconds

- IPFS 上传 / IPFS upload: 3-5s
- VRF 随机数 / VRF randomness: 2-3s
- Agent 并行审核 / Parallel agent review: 10-15s
- 共识计算 / Consensus calculation: 2-5s

---
