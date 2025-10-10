# 监控和可观测性 / Monitoring and Observability

## 监控栈 / Monitoring Stack

- **前端 / Frontend**: Sentry (错误) + Vercel Analytics (Web Vitals)
- **后端 / Backend**: Prometheus (指标) + Grafana (仪表板) + Pino (日志)
- **错误追踪 / Error Tracking**: Sentry (前后端统一)
- **正常运行时间 / Uptime**: 外部监控 (Uptime Robot)

## 关键指标 / Key Metrics

**前端指标 / Frontend:**

- Core Web Vitals (LCP, FID, CLS)
- JavaScript 错误 / JavaScript errors
- API 响应时间 / API response times
- 钱包连接成功率 / Wallet connection success rate

**后端指标 / Backend:**

- 请求速率 / Request rate (req/sec)
- 错误率 / Error rate (%)
- 响应时间 / Response time (P50, P95, P99)
- 数据库查询性能 / Database query performance
- Agent 审核持续时间 / Agent moderation duration

**业务指标 / Business Metrics:**

- 日活跃用户 / Daily Active Users (DAU)
- 创建的帖子（按状态）/ Posts created (by status)
- 活跃 Agent 数量 / Active agents count
- 平均审核时间 / Average moderation time
- Agent 共识率 / Agent consensus rate

## 告警规则 / Alerting

**严重告警 / Critical Alerts** (PagerDuty):

- API 错误率 > 5% 持续 5 分钟
- 活跃 Agent < 20 个持续 5 分钟
- 数据库连接 > 90% 持续 5 分钟
- OpenAI 熔断器开启

**警告告警 / Warning Alerts** (Slack):

- API P95 延迟 > 1s 持续 10 分钟
- 平均审核时间 > 30s 持续 10 分钟
- IPFS 上传失败率 > 10% 持续 5 分钟

---
