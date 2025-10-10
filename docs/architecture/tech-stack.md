# 技术栈 / Tech Stack

这是 Trustless SocialFi 项目的**权威**技术选型。除非经过明确批准的变更请求，所有开发必须使用这些确切的版本。

_This is the **DEFINITIVE** technology selection for the entire Trustless SocialFi project. All development must use these exact versions unless explicitly approved through a change request._

## 技术栈表格 / Technology Stack Table

| 类别 / Category | 技术 / Technology    | 版本 / Version | 用途 / Purpose        | 理由 / Rationale                                        |
| --------------- | -------------------- | -------------- | --------------------- | ------------------------------------------------------- |
| 前端语言        | TypeScript           | 5.3+           | 类型安全的前端开发    | 防止运行时错误，IntelliSense 支持，强制 strict 模式     |
| 前端框架        | Next.js              | 14.1+          | React 框架 (SSR/SSG)  | App Router + React 服务端组件，流式 SSR，一流 SEO       |
| UI 组件库       | shadcn/ui            | 0.8+           | 可访问的组件原语      | 基于 Radix UI (WAI-ARIA)，高度可定制，零供应商锁定      |
| 状态管理        | Zustand              | 4.5+           | 轻量级 React 状态管理 | 比 Redux 小 10 倍，更简单的 API，TypeScript 优先        |
| 后端语言        | TypeScript           | 5.3+           | 类型安全的后端开发    | 全栈统一语言，前后端共享类型                            |
| 后端框架        | Fastify              | 4.26+          | 高性能 Web 框架       | 比 Express 快 2-3 倍，原生 TypeScript，schema 验证      |
| API 风格        | RESTful HTTP         | -              | 标准 HTTP API         | 比 GraphQL 简单，清晰的端点                             |
| 数据库          | PostgreSQL           | 15+            | 关系型数据库          | ACID 合规，JSON 支持，Prisma 类型安全查询               |
| 缓存            | Redis                | 7+             | 内存缓存和任务队列    | Bull 队列处理异步任务，会话存储，限流                   |
| 文件存储        | IPFS                 | -              | 去中心化内容存储      | 双 Pinning (Pinata + Web3.Storage)，内容寻址            |
| 认证            | 钱包签名             | EIP-712        | Web3 原生认证         | MetaMask 签名，viem 验证，无密码                        |
| 前端测试        | Vitest               | 1.2+           | 快速单元测试运行器    | 比 Jest 快 10 倍，原生 ESM，React Testing Library       |
| 后端测试        | Jest                 | 29+            | 后端单元/集成测试     | Supertest 集成，出色的 mock，80% 覆盖率                 |
| E2E 测试        | Playwright           | 1.41+          | 跨浏览器端到端测试    | 比 Cypress 快，自动等待，强大调试                       |
| 构建工具        | Turborepo            | 1.12+          | Monorepo 任务编排     | 缓存构建输出，CI/CD 提速 40-60%                         |
| 打包工具        | Turbopack            | 14.1+          | 前端资源打包          | 比 Webpack 快 10 倍 (Rust 实现)                         |
| 基础设施即代码  | Terraform            | 1.7+           | 基础设施即代码        | 声明式 AWS 资源管理，Helm 管理 K8s                      |
| CI/CD           | GitHub Actions       | -              | 自动化测试和部署      | Turborepo 缓存集成，Vercel 自动部署                     |
| 监控            | Prometheus + Grafana | 2.49+ / 10+    | 指标收集和可视化      | Prometheus 抓取指标，Grafana 仪表板                     |
| 日志            | Pino                 | 8.18+          | 结构化 JSON 日志      | 比 Winston 快 5 倍，请求关联                            |
| CSS 框架        | Tailwind CSS         | 3.4+           | 实用优先的 CSS 框架   | 快速开发，设计系统一致性                                |
| 智能合约语言    | Solidity             | 0.8.24         | 以太坊智能合约        | 最新稳定版，OpenZeppelin 5.0 支持                       |
| 智能合约框架    | Foundry              | 0.2.0+         | 合约开发工具包        | Rust 实现（快速），强大测试，gas 快照                   |
| 区块链          | Arbitrum One         | -              | 以太坊 Layer 2        | <$0.10 gas 费，完全 EVM 兼容，Chainlink VRF 支持        |
| Web3 库         | viem                 | 2.7+           | TypeScript 以太坊库   | 比 ethers.js 快 10 倍，更好的 TypeScript，40KB vs 300KB |
| 钱包集成        | RainbowKit           | 2.0+           | React 钱包连接 UI     | 美观 UX，支持 MetaMask/WalletConnect                    |
| 合约交互        | wagmi                | 2.5+           | 以太坊 React hooks    | 类型安全的合约调用，自动缓存                            |
| 数据索引        | The Graph            | Hosted         | 区块链数据索引        | GraphQL API，实时更新，减少 90% RPC 调用                |
| 随机数          | Chainlink VRF        | v2.5           | 可验证随机函数        | 密码学安全随机性，Arbitrum 原生支持                     |
| AI 服务 (MVP)   | OpenAI GPT-4 Turbo   | gpt-4-turbo    | 内容审核              | 85%+ 准确率，$0.01/1K tokens，12 个月后迁移至 Llama 3   |
| 容器运行时      | Docker               | 24+            | 应用容器化            | 可复现构建，一致环境                                    |
| 容器编排        | Kubernetes (EKS)     | 1.29+          | 容器编排              | 自动扩展，自愈，滚动更新                                |
| 包管理器        | pnpm                 | 8.15+          | 快速包管理器          | 比 npm 快 3 倍，内容寻址存储                            |
| 代码质量        | ESLint + Prettier    | 8+ / 3+        | 代码检查和格式化      | TypeScript 规则，Husky 预提交钩子                       |
| 错误追踪        | Sentry               | latest         | 错误监控和告警        | 前后端统一，source maps，Slack 集成                     |

---
