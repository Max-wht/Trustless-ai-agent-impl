#!/bin/bash

# Trustless SocialFi 开发环境停止脚本

echo "🛑 停止 Trustless SocialFi 开发环境..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 停止前端
if [ -f /tmp/frontend.pid ]; then
  FRONTEND_PID=$(cat /tmp/frontend.pid)
  if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${YELLOW}停止前端服务 (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    rm /tmp/frontend.pid
  fi
fi

# 停止后端
if [ -f /tmp/backend.pid ]; then
  BACKEND_PID=$(cat /tmp/backend.pid)
  if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${YELLOW}停止后端服务 (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null
    rm /tmp/backend.pid
  fi
fi

# 停止 Anvil
if [ -f /tmp/anvil.pid ]; then
  ANVIL_PID=$(cat /tmp/anvil.pid)
  if kill -0 $ANVIL_PID 2>/dev/null; then
    echo -e "${YELLOW}停止 Anvil 节点 (PID: $ANVIL_PID)...${NC}"
    kill $ANVIL_PID 2>/dev/null
    rm /tmp/anvil.pid
  fi
fi

# 强制清理端口（如果还有残留进程）
echo -e "${YELLOW}清理端口...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8545 | xargs kill -9 2>/dev/null || true

# 清理其他可能的 Next.js 和 Node 进程
pkill -f "next dev" 2>/dev/null || true
pkill -f "ts-node-dev.*agent-service" 2>/dev/null || true

sleep 2

echo ""
echo -e "${GREEN}✅ 所有服务已停止${NC}"
echo ""
echo -e "${YELLOW}💡 提示: 下次启动请使用 ./start-dev.sh${NC}"
echo -e "${YELLOW}   这将重新部署合约并更新配置${NC}"
echo ""

