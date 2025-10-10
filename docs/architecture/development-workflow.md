# 开发工作流 / Development Workflow

## 本地环境设置 / Local Setup

```bash
# 1. 克隆并安装 / Clone and install
git clone <repo>
pnpm install

# 2. 设置环境变量 / Setup environment
cp .env.example .env
# 编辑并填入您的 API keys / Edit with your API keys

# 3. 启动服务 / Start services
docker-compose up -d  # PostgreSQL, Redis, Anvil

# 4. 设置数据库 / Setup database
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed

# 5. 本地部署合约 / Deploy contracts locally
cd packages/contracts
forge build && forge test
./script/deploy-local.sh

# 6. 启动开发服务器 / Start dev servers
cd ../..
pnpm dev  # 前端 Frontend (3000) + 后端 Backend (3001)
```

## 开发命令 / Development Commands

```bash
# 启动所有服务 / Start all services
pnpm dev

# 运行测试 / Run tests
pnpm test                          # 所有测试 / All tests
pnpm test:contracts                # Foundry 测试 / Foundry tests
pnpm --filter @trustless/web test  # 仅前端 / Frontend only
pnpm --filter @trustless/api test  # 仅后端 / Backend only

# 代码检查和格式化 / Lint and format
pnpm lint
pnpm format

# 构建生产版本 / Build for production
pnpm build

# 数据库操作 / Database operations
cd apps/api
pnpm prisma migrate dev           # 运行迁移 / Run migrations
pnpm prisma studio                # 打开 GUI / Open GUI
```

---
