#!/bin/bash

# Trustless SocialFi 开发环境启动脚本

echo "🚀 启动 Trustless SocialFi 开发环境..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
  exit 1
fi

# 1. 启动 Anvil 本地节点
echo -e "${BLUE}📦 步骤 1/4: 启动 Anvil 本地以太坊节点...${NC}"
cd packages/contracts

# 检查端口 8545 是否被占用
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
  echo -e "${YELLOW}⚠️  端口 8545 已被占用，尝试停止现有进程...${NC}"
  kill -9 $(lsof -ti:8545) 2>/dev/null || true
  sleep 2
fi

# 启动 Anvil (后台运行)
anvil > /tmp/anvil.log 2>&1 &
ANVIL_PID=$!
echo $ANVIL_PID > /tmp/anvil.pid
echo -e "${GREEN}✅ Anvil 已启动 (PID: $ANVIL_PID)${NC}"
echo "   日志文件: /tmp/anvil.log"
sleep 3

# 2. 部署智能合约
echo ""
echo -e "${BLUE}📝 步骤 2/4: 部署智能合约...${NC}"
# 使用 Anvil 默认第一个账户的私钥进行部署
ANVIL_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# 部署合约并捕获输出
DEPLOY_OUTPUT=$(forge script script/DeployUserRegistry.s.sol:DeployUserRegistry \
  --rpc-url http://localhost:8545 \
  --private-key $ANVIL_PRIVATE_KEY \
  --broadcast 2>&1)

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ 合约部署失败${NC}"
  echo "$DEPLOY_OUTPUT"
  kill $ANVIL_PID 2>/dev/null
  exit 1
fi

# 提取合约地址
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "UserRegistry deployed at:" | awk '{print $4}')

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo -e "${RED}❌ 无法提取合约地址${NC}"
  kill $ANVIL_PID 2>/dev/null
  exit 1
fi

echo -e "${GREEN}✅ 智能合约部署成功${NC}"
echo "   合约地址: $CONTRACT_ADDRESS"

# 更新 deployments.json
echo -e "${BLUE}📝 更新配置文件...${NC}"
cat > deployments.json << EOF
{
  "31337": {
    "chainName": "Anvil Local",
    "contracts": {
      "UserRegistry": "$CONTRACT_ADDRESS"
    }
  }
}
EOF

# 更新后端 web3.ts 中的合约地址
BACKEND_WEB3_FILE="../agent-service/src/lib/web3.ts"
if [ -f "$BACKEND_WEB3_FILE" ]; then
  # 使用 sed 更新合约地址（兼容 macOS 和 Linux）
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/USER_REGISTRY_ADDRESS = '0x[a-fA-F0-9]*'/USER_REGISTRY_ADDRESS = '$CONTRACT_ADDRESS'/" "$BACKEND_WEB3_FILE"
  else
    # Linux
    sed -i "s/USER_REGISTRY_ADDRESS = '0x[a-fA-F0-9]*'/USER_REGISTRY_ADDRESS = '$CONTRACT_ADDRESS'/" "$BACKEND_WEB3_FILE"
  fi
  echo -e "${GREEN}✅ 配置文件已更新${NC}"
else
  echo -e "${YELLOW}⚠️  后端 web3.ts 文件不存在，跳过更新${NC}"
fi

cd ../..

# 3. 启动后端服务
echo ""
echo -e "${BLUE}🔧 步骤 3/4: 启动后端服务...${NC}"

# 检查数据库配置
if [ ! -f "packages/agent-service/.env" ]; then
  echo -e "${YELLOW}⚠️  未找到后端 .env 文件，使用默认配置${NC}"
fi

# 启动后端 (后台运行)
pnpm --filter @trustless/agent-service dev > /tmp/agent-service.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid
echo -e "${GREEN}✅ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
echo "   日志文件: /tmp/agent-service.log"
echo "   API 地址: http://localhost:3001"
sleep 5

# 4. 启动前端应用
echo ""
echo -e "${BLUE}🎨 步骤 4/4: 启动前端应用...${NC}"

# 检查前端配置
if [ ! -f "packages/web-app/.env.local" ]; then
  echo -e "${YELLOW}⚠️  未找到前端 .env.local 文件，使用默认配置${NC}"
fi

# 启动前端 (后台运行)
pnpm --filter @trustless/web-app dev > /tmp/web-app.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/frontend.pid
echo -e "${GREEN}✅ 前端应用已启动 (PID: $FRONTEND_PID)${NC}"
echo "   日志文件: /tmp/web-app.log"
echo "   访问地址: http://localhost:3000"

# 等待服务启动
echo ""
echo -e "${BLUE}⏳ 等待所有服务完全启动...${NC}"
sleep 10

# 显示状态
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ 所有服务已成功启动！${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo "📌 服务地址："
echo "   • 前端应用: http://localhost:3000"
echo "   • 后端 API: http://localhost:3001"
echo "   • Anvil RPC: http://localhost:8545"
echo ""
echo "📋 进程 ID："
echo "   • Anvil: $ANVIL_PID"
echo "   • 后端: $BACKEND_PID"
echo "   • 前端: $FRONTEND_PID"
echo ""
echo "📝 日志文件："
echo "   • tail -f /tmp/anvil.log"
echo "   • tail -f /tmp/agent-service.log"
echo "   • tail -f /tmp/web-app.log"
echo ""
echo "🛑 停止所有服务："
echo "   • ./stop-dev.sh"
echo "   或手动: kill $ANVIL_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}💡 提示: 按 Ctrl+C 不会停止后台服务，请使用 ./stop-dev.sh${NC}"
echo ""

