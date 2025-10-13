# Story 6.2: 个性化 Tag 自动生成服务

**Epic**: Epic 6 - User Preferences & Personalized Tag Management  
**Priority**: P1 - High  
**Story Points**: 8

---

## User Story

**As a** 后端开发者  
**I want** 开发 Tag 生成服务，分析用户行为，自动生成个性化 Tag（名称、权重、来源说明）  
**So that** 用户可以直观了解自己的兴趣偏好，为 Phase 2 推荐系统提供数据基础

---

## Acceptance Criteria

1. ✅ 在 `src/services/tagGenerator.ts` 创建 Tag 生成服务

2. ✅ 定义 PersonalizedTag 接口

3. ✅ 实现 `generateTagsFromBehavior(userId)`：
   - 读取用户最近 3 个月行为数据
   - 分析点赞内容主题
   - 生成 Tag 列表（最多 20 个）

4. ✅ Tag 生成规则：
   - 点赞 > 10 条 DeFi 内容 → "DeFi 爱好者"
   - 权重 = 点赞数 / 总点赞数 × 100

5. ✅ 实现 API `POST /preferences/generate-tags`

6. ✅ 实现定时任务：每周为活跃用户生成 Tag

7. ✅ 测试：用户点赞 15 条 DeFi 内容 → 生成 Tag，权重 75

8. ✅ 测试：Tag 生成响应 < 3 秒

---

**依赖**: Story 6.1

**Story Status**: ✅ Ready
