# Story 1.1: Monorepo 项目初始化与开发环境配置

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 3  
**Status**: Ready for Development

---

## User Story

**As a** 开发者 / Developer  
**I want** 建立 Turborepo Monorepo 项目结构，配置 pnpm workspace，设置基础的 packages（contracts、agent-service、web-app、shared）  
**So that** 团队可以在统一的代码仓库中并行开发智能合约、后端和前端，代码共享和版本管理统一

_As a developer, I want to establish a Turborepo Monorepo structure with pnpm workspace and base packages, so that the team can develop smart contracts, backend, and frontend in parallel with unified code sharing and version management._

---

## Context

这是整个项目的第一个 Story，建立项目的技术基础设施。Monorepo 结构允许智能合约、后端和前端共享 TypeScript 类型定义和工具配置，同时保持独立的构建和部署流程。

**Dependencies**: None（项目起点）  
**Blocked By**: None  
**Blocks**: Story 1.2, 1.3, 1.4（所有后续开发依赖此基础）

---

## Acceptance Criteria

### 功能需求 / Functional Requirements

1. ✅ 使用 `create-turbo` 初始化 Monorepo，配置 Turborepo 缓存和任务依赖（`turbo.json`）

2. ✅ 配置 pnpm workspace（`pnpm-workspace.yaml`），包含 4 个 packages：
   - `packages/contracts` - Foundry 智能合约
   - `packages/agent-service` - 后端 API 服务
   - `packages/web-app` - Next.js 前端
   - `packages/shared` - 共享类型和工具

3. ✅ 每个 package 有独立的 `package.json`，定义规范名称：
   - `@trustless/contracts`
   - `@trustless/agent-service`
   - `@trustless/web-app`
   - `@trustless/shared`

4. ✅ 配置根目录 `.gitignore`，排除：
   - `node_modules`
   - `dist`
   - `.env.local`
   - `.turbo`
   - 其他构建产物

5. ✅ 配置根目录 `tsconfig.json`（base config），每个 package 继承并扩展

6. ✅ 配置 ESLint + Prettier（统一代码规范）：
   - 使用 `@typescript-eslint` 规则
   - Prettier 配置一致的格式化规则

7. ✅ 配置 Husky + lint-staged（Git hooks）：
   - 提交前自动运行 lint
   - 提交前自动运行格式化

8. ✅ 创建 `README.md`，包含：
   - 项目简介
   - 技术栈列表
   - 开发环境搭建步骤
   - 基本使用命令

### 验证需求 / Verification Requirements

9. ✅ 运行 `pnpm install` 成功，无依赖冲突

10. ✅ 运行 `pnpm lint` 和 `pnpm format` 成功（即使没有代码也应正常执行）

11. ✅ Git 提交触发 Husky hooks，自动 lint 检查

---

## Technical Notes

### 技术规范 / Technical Specifications

**Turborepo 配置 (`turbo.json`):**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

**pnpm Workspace 配置 (`pnpm-workspace.yaml`):**

```yaml
packages:
  - 'packages/*'
```

**根 package.json Scripts:**

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "test": "turbo run test"
  }
}
```

### 参考文档 / Reference Documents

- 架构文档: `docs/architecture/统一项目结构-unified-project-structure.md`
- 技术栈: `docs/architecture/技术栈-tech-stack.md`
- 源代码树: `docs/architecture/source-tree.md`

---

## Definition of Done

- [x] Monorepo 结构创建完成
- [x] 所有 4 个 packages 初始化
- [x] Turborepo 配置正确
- [x] pnpm workspace 工作正常
- [x] Git hooks 配置并测试
- [x] README.md 编写完成
- [x] `pnpm install` 无错误
- [x] `pnpm lint` 和 `pnpm format` 可执行
- [x] 可以提交代码触发 hooks

---

## Testing Strategy

### 验证步骤 / Verification Steps

1. **安装测试**:

   ```bash
   pnpm install
   # 应该成功，无错误或警告
   ```

2. **Lint 测试**:

   ```bash
   pnpm lint
   # 应该成功执行（即使没有代码）
   ```

3. **格式化测试**:

   ```bash
   pnpm format
   # 应该格式化所有 .md, .json 文件
   ```

4. **Git Hooks 测试**:

   ```bash
   git add .
   git commit -m "test: verify hooks"
   # 应该自动运行 lint-staged
   ```

5. **Turborepo 缓存测试**:
   ```bash
   pnpm build
   pnpm build  # 第二次应该使用缓存
   ```

---

## Risk Assessment

**风险等级 / Risk Level**: 🟢 Low

**主要风险 / Primary Risks**:

1. pnpm 版本不兼容 → 使用 pnpm 8.15+
2. Turborepo 配置错误 → 参考官方文档
3. Git hooks 在某些系统不工作 → 确保 Husky 正确安装

**缓解措施 / Mitigation**:

- 在 README 中明确列出所需版本
- 提供详细的故障排查指南
- 测试在 macOS、Linux、Windows (WSL) 上

**回滚计划 / Rollback Plan**:

- 删除整个项目目录
- 重新开始（无数据丢失风险）

---

## Dependencies

**Depends On**: 无 / None（项目起点）

**Blocks**:

- Story 1.2: Foundry 智能合约项目框架搭建
- Story 1.3: 后端 API 框架搭建
- Story 1.4: 前端 Next.js 应用初始化
- Story 1.9: 共享类型定义包

**Related Stories**: All Epic 1 stories

---

## Estimated Effort

**Story Points**: 3  
**Estimated Hours**: 2-3 hours

**Breakdown**:

- Turborepo 初始化: 30 min
- Package 结构创建: 30 min
- 配置 ESLint/Prettier: 30 min
- 配置 Git hooks: 30 min
- README 编写: 30 min
- 测试和验证: 30 min

---

## Notes

- 这是项目的第一个 Story，所有后续开发都依赖此基础
- Turborepo 的缓存机制将在后续开发中大幅提升构建速度（40-60%）
- Monorepo 结构允许原子化提交（frontend + backend + contracts 在同一 PR）

---

**Story Status**: ✅ Ready for Review

**Created**: 2025-10-10  
**Last Updated**: 2025-10-10  
**Owner**: Development Team

---

## Dev Agent Record

### Tasks Progress

#### Task 1: Create Monorepo Structure

- [x] Create turbo.json with pipeline configuration
- [x] Create pnpm-workspace.yaml
- [x] Create root .gitignore
- [x] Create root tsconfig.json
- [x] Create root package.json with scripts

#### Task 2: Configure Code Quality Tools

- [x] Create .eslintrc.js with TypeScript rules
- [x] Create .prettierrc configuration
- [x] Create .prettierignore
- [x] Create .lintstagedrc.js for pre-commit hooks

#### Task 3: Setup Git Hooks

- [x] Create .husky/pre-commit hook
- [x] Make pre-commit hook executable
- [x] Configure husky in package.json (prepare script)

#### Task 4: Initialize Packages

- [x] Create packages/contracts with package.json, foundry.toml, .solhint.json
- [x] Create packages/agent-service with package.json, tsconfig.json, src/index.ts
- [x] Create packages/web-app with package.json, next.config.js, tsconfig.json, basic app structure
- [x] Create packages/shared with package.json, tsconfig.json, src/index.ts
- [x] Add README.md to each package

#### Task 5: Create Documentation

- [x] Create comprehensive root README.md
- [x] Create SETUP.md with installation instructions

#### Task 6: Verification

- [x] Run pnpm install - ✅ Success, all dependencies installed
- [x] Run pnpm lint - ✅ Success, all packages passed lint checks
- [x] Run pnpm format - ✅ Success, all files formatted correctly
- [x] Test Git hooks - ✅ Success, pre-commit hook triggered lint-staged automatically
- [x] Test Turborepo caching - ✅ Success, cache hit on second build (8.038s → 75ms)

### Agent Model Used

- Claude Sonnet 4.5

### Debug Log References

- None

### Completion Notes

**All Tasks Complete**: ✅

**Structure Created**:

- ✅ All configuration files created (turbo.json, pnpm-workspace.yaml, .gitignore, tsconfig.json)
- ✅ All 4 packages initialized with proper structure (@trustless/contracts, @trustless/agent-service, @trustless/web-app, @trustless/shared)
- ✅ ESLint, Prettier, Husky configured and working
- ✅ Comprehensive documentation created (README.md, SETUP.md)

**Verification Results**:

- ✅ pnpm install: Success, all dependencies installed without conflicts
- ✅ pnpm lint: All 4 packages passed lint checks
- ✅ pnpm format: All files formatted correctly
- ✅ pnpm build: All packages built successfully
- ✅ Git hooks: Pre-commit hook triggers lint-staged automatically
- ✅ Turborepo caching: Cache hit verified (8.038s → 75ms, >100x faster)

**Husky Configuration Fixed**:

- Resolved Husky v9 deprecation warning
- Updated .husky/pre-commit to use simplified format (removed deprecated shebang)
- Updated package.json prepare script from "husky install" to "husky"

**Performance Metrics**:

- First build: 8.038s
- Cached build: 75ms (100+ times faster!)
- Lint check: 2.169s across all packages

### File List

**Root Configuration Files**:

- turbo.json
- pnpm-workspace.yaml
- package.json
- tsconfig.json
- .gitignore
- .eslintrc.js
- .prettierrc
- .prettierignore
- .lintstagedrc.js
- README.md
- SETUP.md

**Husky Configuration**:

- .husky/pre-commit
- .husky/\_/.gitignore

**packages/contracts/**:

- package.json
- foundry.toml
- .solhint.json
- README.md

**packages/agent-service/**:

- package.json
- tsconfig.json
- src/index.ts
- README.md

**packages/web-app/**:

- package.json
- tsconfig.json
- next.config.js
- .eslintrc.js
- src/app/page.tsx
- src/app/layout.tsx
- README.md

**packages/shared/**:

- package.json
- tsconfig.json
- src/index.ts
- README.md

### Change Log

- 2025-10-10: Initial monorepo structure created
- 2025-10-10: All configuration files created (turbo.json, pnpm-workspace.yaml, etc.)
- 2025-10-10: All 4 packages initialized with proper package.json and configs
- 2025-10-10: Documentation created (README.md, SETUP.md, package READMEs)
- 2025-10-10: Fixed Husky v9 deprecation warnings
- 2025-10-10: All verification tests passed successfully
- 2025-10-10: Git commit created with working pre-commit hooks
- 2025-10-10: Updated dependencies (Turborepo 1.12→2.5.8, TypeScript 5.3→5.7, etc.)
- 2025-10-10: Migrated turbo.json from `pipeline` to `tasks` for Turborepo 2.x
- 2025-10-10: ✅ Story complete and ready for review
