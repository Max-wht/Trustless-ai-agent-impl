# 开发环境设置说明 / Development Environment Setup

## 1. 安装 pnpm

项目使用 pnpm 作为包管理器。请先安装 pnpm >= 8.15.0：

### macOS / Linux

```bash
# 使用 npm 安装
npm install -g pnpm@8.15.0

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用 curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Windows

```powershell
# 使用 npm 安装
npm install -g pnpm@8.15.0

# 或使用 Scoop
scoop install pnpm
```

### 验证安装

```bash
pnpm --version
# 应该显示 8.15.0 或更高版本
```

## 2. 安装项目依赖

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm install
```

## 3. 初始化 Husky (Git Hooks)

```bash
pnpm prepare
```

这将设置 Git hooks，在提交代码前自动运行 lint 和格式化。

## 4. 验证安装

运行以下命令验证所有配置正确：

```bash
# 检查 lint（应该成功，即使没有错误）
pnpm lint

# 检查格式化
pnpm format

# 测试构建
pnpm build
```

## 5. 安装 Foundry (可选，用于智能合约开发)

如果需要开发智能合约：

```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 验证安装
forge --version
```

## 6. 启动开发环境

```bash
# 启动所有服务
pnpm dev

# Web 应用将在 http://localhost:3000 运行
# API 服务将在 http://localhost:3001 运行
```

## 故障排查 / Troubleshooting

### pnpm install 失败

- 确保 Node.js 版本 >= 18.0.0
- 清除缓存：`pnpm store prune`
- 删除 `node_modules` 和 `pnpm-lock.yaml`，重新安装

### Husky hooks 不工作

- 确保在 Git 仓库中：`git rev-parse --git-dir`
- 重新运行：`pnpm prepare`
- 检查 `.husky/pre-commit` 是否可执行

### 构建失败

- 检查 TypeScript 版本
- 清理构建产物：`pnpm clean`
- 重新构建：`pnpm build`

## 下一步 / Next Steps

环境搭建完成后，请参考 [README.md](./README.md) 了解项目结构和开发流程。
