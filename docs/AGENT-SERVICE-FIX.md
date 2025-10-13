# Agent Service 构建修复

## 🚨 问题

GitHub Actions CI 构建失败：

```
@trustless/agent-service:build:
Error: src/routes/users.ts(3,24): error TS2307: Cannot find module '../lib/prisma' or its corresponding type declarations.
Error: src/routes/users.ts(4,62): error TS2307: Cannot find module '../lib/web3' or its corresponding type declarations.
```

---

## 🔍 根本原因

**TypeScript Composite 模式问题**

`packages/agent-service/tsconfig.json` 继承了根目录 `tsconfig.json` 的配置：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    // 继承了 composite: true 和 incremental: true
  }
}
```

**根配置** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "composite": true, // 项目引用模式
    "incremental": true // 增量编译
  }
}
```

### 为什么会失败？

1. **Composite 模式**：TypeScript 项目引用（Project References）模式
   - 需要使用 `tsc --build` 或 `tsc -b`
   - 需要在根 tsconfig 中声明项目引用
   - 适用于大型 monorepo，但需要额外配置

2. **Incremental 模式**：增量编译
   - 生成 `.tsbuildinfo` 文件缓存编译状态
   - 在没有正确设置时可能不输出文件

3. **实际情况**：
   - CI 环境中使用 `tsc`（不是 `tsc --build`）
   - 没有项目引用配置
   - TypeScript 编译"成功"，但没有生成任何 `.js` 文件
   - 导致运行时找不到模块

---

## ✅ 解决方案

在 `packages/agent-service/tsconfig.json` 中禁用 composite 和 incremental：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "composite": false, // ← 显式禁用
    "incremental": false // ← 显式禁用
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**为什么需要显式禁用？**

TypeScript 的 `extends` 会继承父配置的所有选项。即使不想使用 composite 模式，也需要显式设置为 `false` 来覆盖父配置。

---

## 🧪 验证

### 本地测试

```bash
# 清理并重新构建
cd packages/agent-service
rm -rf dist
pnpm build

# 验证输出
ls dist/lib/
# 输出:
# prisma.d.ts  prisma.js  prisma.js.map
# web3.d.ts    web3.js    web3.js.map
```

### 完整构建

```bash
cd ../..
pnpm build

# 输出:
# Tasks:    4 successful, 4 total
# Cached:    3 cached, 4 total
# Time:    2.222s
```

### TypeScript 检查

```bash
cd packages/agent-service
npx tsc --noEmit
# 无错误 ✅
```

---

## 📊 修复前 vs 修复后

| 项目                | 修复前            | 修复后           |
| ------------------- | ----------------- | ---------------- |
| **本地构建**        | ✅ 成功（但警告） | ✅ 成功          |
| **CI 构建**         | ❌ 失败           | ✅ 成功          |
| **dist/ 输出**      | ❌ 空或不一致     | ✅ 完整文件      |
| **TypeScript 模式** | Composite（复杂） | Standard（简单） |

---

## 🎯 关键学习点

### 1. TypeScript Composite 模式

**什么时候使用**:

- ✅ 大型 monorepo 需要项目间引用
- ✅ 需要增量构建加速
- ✅ 有明确的依赖关系图

**什么时候不使用**:

- ❌ 小型项目或独立包
- ❌ 不需要项目间引用
- ❌ CI 环境简单构建

### 2. tsconfig.json 继承

```json
// 子配置可以覆盖父配置
{
  "extends": "../parent.json",
  "compilerOptions": {
    "composite": false // 覆盖父配置的 true
  }
}
```

### 3. 诊断 TypeScript 构建问题

```bash
# 1. 检查配置
npx tsc --showConfig

# 2. 列出编译文件
npx tsc --listFiles

# 3. 详细输出（仅 --build 模式）
npx tsc --build --verbose

# 4. 强制重新编译
npx tsc --build --force
```

### 4. Monorepo 最佳实践

**推荐方式 1：不使用 composite**

```json
// 根 tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "sourceMap": true
    // 不设置 composite 和 incremental
  }
}

// 子包 tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**推荐方式 2：使用 composite（高级）**

```json
// 根 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/agent-service" }
  ]
}

// shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  }
}

// agent-service/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ]
}

// package.json
{
  "scripts": {
    "build": "tsc --build"  // 必须使用 --build
  }
}
```

---

## 🔗 相关文档

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [docs/完整修复总结.md](./完整修复总结.md) - 所有修复的完整记录
- [docs/CI-FIX-SUMMARY.md](./CI-FIX-SUMMARY.md) - CI 修复总结

---

## 📝 总结

**问题**: TypeScript Composite 模式导致 CI 构建不输出文件

**解决**: 在子包中显式禁用 `composite` 和 `incremental`

**结果**: ✅ 本地和 CI 构建都成功，所有文件正确生成

---

**修复日期**: 2025-10-13  
**修复者**: Dev Agent  
**状态**: ✅ Completed
