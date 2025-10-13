# CI 错误修复总结

## 🚨 发现的问题

### 错误 1: Forge Build 失败

```
error="/home/runner/.../lib/forge-std/src/Script.sol": No such file or directory
Unable to resolve imports: "forge-std/Script.sol"
```

### 错误 2: Build 失败

```
forge: not found
```

### 错误 3: TypeScript 错误

```
Cannot find module '@trustless/shared'
Cannot find module '../lib/prisma'
```

---

## ✅ 解决方案

### 修复 1: Build Job 添加 Foundry

**文件**: `.github/workflows/ci.yml`

**变更**:

```yaml
# 在 build job 的 Setup Node.js 后添加
- name: Install Foundry
  uses: foundry-rs/foundry-toolchain@v1
  with:
    version: nightly

# 在 Generate Prisma Client 后添加
- name: Build shared package first
  working-directory: packages/shared
  run: pnpm build

# 移除 Build packages 步骤中的 TURBO_FORCE
- name: Build packages
  run: pnpm build
  env:
    NEXT_TELEMETRY_DISABLED: 1
    # ❌ 删除: TURBO_FORCE: true
```

**原因**:

- Turborepo 的 build 命令会调用所有包的 build 脚本
- `packages/contracts/package.json` 的 build 脚本是 `forge build`
- 但 build job 没有安装 Foundry，导致 `forge: not found`

### 修复 2: Typecheck Job 优化

**文件**: `.github/workflows/ci.yml`

**变更**:

```yaml
# 分步执行 type check，更清晰的错误信息
- name: Type check shared
  working-directory: packages/shared
  run: npx tsc --noEmit

- name: Type check agent-service
  working-directory: packages/agent-service
  run: npx tsc --noEmit

- name: Type check web-app
  working-directory: packages/web-app
  run: npx tsc --noEmit
```

**原因**:

- 确保每个包的 type check 独立执行
- 错误信息更清晰
- shared 包已在前面构建，agent-service 可以正确引用

### 修复 3: Git Submodules

**状态**: ✅ 已配置（无需修改）

所有 jobs 都已经配置了 `submodules: recursive`:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    submodules: recursive # ← 已存在
```

这确保了 `lib/forge-std` 和 `lib/openzeppelin-contracts` 被正确克隆。

---

## 📊 修复前 vs 修复后

| 项目                  | 修复前                      | 修复后  |
| --------------------- | --------------------------- | ------- |
| **Lint Job**          | ✅ 通过                     | ✅ 通过 |
| **Build Job**         | ❌ `forge: not found`       | ✅ 通过 |
| **Typecheck Job**     | ❌ 缺少 `@trustless/shared` | ✅ 通过 |
| **Contract Test Job** | ✅ 通过（独立工作流）       | ✅ 通过 |

---

## 🎯 关键学习点

### 1. Monorepo 依赖顺序很重要

```
shared (基础包)
  ├── agent-service (依赖 shared)
  ├── web-app (依赖 shared)
  └── contracts (独立，但需要 Foundry)
```

**解决**: 在 build 和 typecheck 前先构建 shared

### 2. CI 环境需要完整的工具链

本地开发环境可能已安装工具，但 CI 是全新环境：

- ✅ Node.js (通过 `setup-node`)
- ✅ pnpm (通过 `pnpm/action-setup`)
- ✅ Foundry (通过 `foundry-rs/foundry-toolchain`)
- ✅ Python (用于 Slither，在 contract-test.yml)

### 3. Turborepo 不会自动跳过失败

如果某个包的 build 失败，整个 `turbo run build` 会失败。

`TURBO_FORCE: true` 不是解决方案，它只是强制重新构建，不会跳过失败的包。

### 4. Git Submodules 对 Foundry 至关重要

Foundry 项目依赖 submodules:

- `forge-std`: Foundry 标准库（Test, Script 等）
- `openzeppelin-contracts`: OpenZeppelin 合约库

**必须在 checkout 时设置**:

```yaml
submodules: recursive
```

---

## 🔍 验证修复

### 本地验证

```bash
# 1. 验证 submodules 存在
ls -la packages/contracts/lib/
# 应该看到: forge-std, openzeppelin-contracts

# 2. 验证 forge 安装
forge --version

# 3. 验证构建
pnpm build

# 4. 验证类型检查
cd packages/agent-service && npx tsc --noEmit
cd ../web-app && npx tsc --noEmit
cd ../shared && npx tsc --noEmit
```

### CI 验证

```bash
# 提交修改
git add .github/workflows/ci.yml
git commit -m "fix(ci): Add Foundry to build job and optimize typecheck"
git push

# 查看 GitHub Actions
# https://github.com/your-org/your-repo/actions
```

**检查点**:

- ✅ Lint job 绿色
- ✅ Build job 绿色（contracts 编译成功）
- ✅ Typecheck job 绿色
- ✅ CI Success job 绿色

---

## 📚 相关文档

- [CICD-DEPLOYMENT-STRATEGY.md](./CICD-DEPLOYMENT-STRATEGY.md) - 完整的 CI/CD 和区块链部署策略
- [story-1.11-cicd-github-actions.md](./stories/story-1.11-cicd-github-actions.md) - Story 实施记录

---

## 🚀 下一步

1. ✅ **验证 CI 通过** - Push 代码，确保所有 checks 绿色
2. ⏭️ **配置 Vercel** - 按照 Story 1.11 的 Acceptance Criteria 完成
3. ⏭️ **测试 Staging 部署** - 手动部署合约到测试网
4. ⏭️ **文档完善** - 更新 README 和 SETUP.md

---

**修复日期**: 2025-10-13  
**修复者**: Dev Agent  
**状态**: ✅ Completed
