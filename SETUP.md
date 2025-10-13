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

## 6. 配置环境变量

### 后端服务 (agent-service)

创建 `packages/agent-service/.env` 文件：

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trustless_socialfi"
ETH_RPC_URL="http://localhost:8545"
```

### 前端应用 (web-app)

创建 `packages/web-app/.env.local` 文件：

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

## 7. 启动开发环境

### 方法 1: 一键启动（推荐）

使用提供的启动脚本：

```bash
./start-dev.sh
```

此脚本将自动：

1. 启动 Anvil 本地以太坊节点（端口 8545）
2. 部署智能合约
3. 启动后端 API 服务（端口 3001）
4. 启动前端应用（端口 3000）

停止所有服务：

```bash
./stop-dev.sh
```

### 方法 2: 手动启动（用于调试）

需要在 **3 个不同的终端** 中运行：

#### 终端 1: 启动 Anvil 节点

```bash
cd packages/contracts
anvil
```

#### 终端 2: 部署合约并启动后端

```bash
# 部署合约（仅首次或重启 Anvil 后需要）
cd packages/contracts
forge script script/DeployUserRegistry.s.sol:DeployUserRegistry --rpc-url http://localhost:8545 --broadcast

# 返回根目录并启动后端
cd ../..
pnpm --filter @trustless/agent-service dev
```

#### 终端 3: 启动前端

```bash
pnpm --filter @trustless/web-app dev
```

### 访问应用

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:3001
- **Anvil RPC**: http://localhost:8545

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

### 后端服务报 500 错误："HTTP request failed" 或 "fetch failed"

**问题**: 后端尝试连接 `http://localhost:8545` 失败

**原因**: Anvil 本地节点未启动

**解决方案**:

1. 停止当前后端服务
2. 使用 `./start-dev.sh` 启动完整环境
3. 或手动启动 Anvil: `cd packages/contracts && anvil`

### 端口已被占用

**问题**: `Error: listen EADDRINUSE: address already in use`

**解决方案**:

```bash
# 查找并停止占用端口的进程
lsof -ti:3000 | xargs kill -9  # 前端
lsof -ti:3001 | xargs kill -9  # 后端
lsof -ti:8545 | xargs kill -9  # Anvil

# 或使用停止脚本
./stop-dev.sh
```

### 数据库连接失败

**问题**: `Error: Can't reach database server`

**解决方案**:

1. 确保 PostgreSQL 已安装并运行
2. 创建数据库: `createdb trustless_socialfi`
3. 运行迁移: `cd packages/agent-service && npx prisma migrate dev`
4. 检查 `.env` 中的 `DATABASE_URL`

### 智能合约部署失败

**问题**: `Error: Failed to get EIP-1559 fees`

**解决方案**:

1. 确保 Anvil 正在运行
2. 检查 RPC URL: `http://localhost:8545`
3. 重新部署: `forge script script/DeployUserRegistry.s.sol:DeployUserRegistry --rpc-url http://localhost:8545 --broadcast`

## 下一步 / Next Steps

环境搭建完成后，请参考 [README.md](./README.md) 了解项目结构和开发流程。
