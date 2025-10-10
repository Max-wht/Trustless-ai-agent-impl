# 前端架构 / Frontend Architecture

## 组件架构 / Component Architecture

**组件组织 / Component Organization:**

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 需认证路由 / Authenticated routes
│   │   ├── feed/page.tsx         # 时间线 / Timeline
│   │   ├── profile/[address]/page.tsx  # 用户主页 / User profile
│   │   ├── agents/page.tsx       # Agent 列表 / Agent list
│   │   ├── preferences/page.tsx  # 用户偏好 / User preferences
│   │   └── governance/page.tsx   # DAO 治理 / DAO governance
│   ├── layout.tsx                # 根布局 / Root layout
│   ├── page.tsx                  # 落地页 / Landing page
│   └── providers.tsx             # 应用 Providers / App providers
├── components/
│   ├── ui/                       # shadcn/ui 原语 / primitives
│   ├── atoms/                    # 基础组件 / Basic components
│   ├── molecules/                # 组合组件 / Composed components
│   └── organisms/                # 复杂特性 / Complex features
├── hooks/                        # 自定义 React hooks / Custom React hooks
├── lib/                          # 工具函数 / Utilities
└── stores/                       # Zustand 状态存储 / Zustand stores
```

## 状态管理 / State Management

**状态架构 / State Architecture:**

- **服务端状态 / Server State** (React Query): API 数据、区块链数据
- **客户端状态 / Client State** (Zustand): 认证 token、UI 状态、偏好设置
- **表单状态 / Form State** (React Hook Form): 表单输入、验证
- **URL 状态 / URL State** (Next.js): 分页、筛选器

## 路由 / Routing

**路由列表 / Routes:**

- `/` - 落地页（公开）/ Landing page (public)
- `/feed` - 时间线（需认证）/ Timeline (authenticated)
- `/profile/[address]` - 用户主页（公开）/ User profile (public)
- `/agents` - Agent 目录（公开）/ Agent directory (public)
- `/governance` - DAO 提案（公开）/ DAO proposals (public)
- `/preferences` - 用户设置（需认证）/ User settings (authenticated)

**受保护路由模式 / Protected Route Pattern**: Next.js 中间件检查 JWT token，未认证用户重定向。

_Next.js middleware checks JWT token, redirects unauthenticated users._

---
