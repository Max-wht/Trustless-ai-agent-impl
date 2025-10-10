# Story 4.2: Agent 审核服务开发（OpenAI 集成）

**Epic**: Epic 4 - Multi-Agent Content Moderation System  
**Priority**: P0 - Critical  
**Story Points**: 13  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者  
**I want** 开发 Agent 审核服务，接收内容文本和合规规则，调用 OpenAI GPT-4 API 判断是否合规  
**So that** Agent 可以自动化审核内容，过滤违规内容，确保平台内容质量

---

## Acceptance Criteria

1. ✅ 安装 OpenAI SDK：`pnpm add openai`

2. ✅ 配置环境变量：`OPENAI_API_KEY`

3. ✅ 在 `src/services/moderation.ts` 创建审核服务

4. ✅ 定义合规规则（`src/config/moderation-rules.ts`）：
   - 禁止暴力内容
   - 禁止诈骗信息
   - 禁止仇恨言论
   - 禁止成人内容（NSFW）
   - 禁止虚假信息

5. ✅ 实现函数 `moderateContent(content: string)`：
   - 调用 OpenAI API `chat.completions.create()`
   - Model: `gpt-4-turbo-preview`
   - Temperature: 0.2
   - 返回 `{ decision: 'Pass' | 'Reject', confidence: number, reason?: string }`

6. ✅ 实现 API 端点 `POST /agent/moderate`：
   - 验证请求来自合法 Agent
   - 调用 `moderateContent()`
   - 记录审核日志到数据库

7. ✅ 实现成本控制：
   - Token 限制
   - 缓存相同内容的审核结果（24 小时）

8. ✅ 测试：合规内容 → `{ decision: 'Pass', confidence: 95 }`

9. ✅ 测试：违规内容 → `{ decision: 'Reject', confidence: 98, reason: '包含暴力内容' }`

10. ✅ 测试：并发 5 个 Agent 调用，响应时间 < 10 秒

---

## Technical Notes

**OpenAI API 成本:** ~$0.05-0.10 per moderation

**Prompt 工程:** 详见 PRD Epic 4.2

**依赖 / Dependencies**: Story 1.3 (后端框架)

---

**Story Status**: ✅ Ready for Development

