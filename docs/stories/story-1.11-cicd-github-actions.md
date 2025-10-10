# Story 1.11: CI/CD 基础配置（GitHub Actions）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P1 - High  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 开发者 / Developer  
**I want** 配置 GitHub Actions 自动化测试和部署流程，每次 push 代码后自动运行测试、Lint、构建  
**So that** 团队可以尽早发现代码错误，确保代码质量，自动化部署到 Staging 环境

---

## Acceptance Criteria

1. ✅ 创建 `.github/workflows/ci.yml`：

   - Lint
   - Test Contracts
   - Test Backend
   - Test Frontend
   - Build

2. ✅ 使用 Turborepo 缓存

3. ✅ 设置 GitHub Actions Cache

4. ✅ 失败时在 PR 显示错误信息

5. ✅ 创建 `.github/workflows/deploy-staging.yml`：

   - 部署前端到 Vercel Preview
   - 部署后端到 AWS ECS Staging

6. ✅ 创建 Vercel 项目，连接 GitHub 仓库

7. ✅ 配置 Vercel 环境变量

8. ✅ 测试：Push 代码到 main，GitHub Actions 自动运行，所有测试通过

9. ✅ 测试：Push 到 develop，自动部署到 Staging

10. ✅ 在 PR 中自动显示 Vercel Preview 链接

---

## Technical Notes

**CI Workflow 示例:**

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
```

**依赖 / Dependencies**: Epic 1 所有前置 Stories  
**阻塞 / Blocks**: 生产部署

---

**Story Status**: ✅ Ready for Development
