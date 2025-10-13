#!/bin/bash

# 连接诊断脚本 - Trustless SocialFi
# 检查所有服务状态和 MetaMask 连接问题

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Trustless SocialFi - 连接诊断工具                 ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo ""

# 检查计数器
PASSED=0
FAILED=0
WARNINGS=0

# 1. 检查 Anvil 是否运行
echo -e "${BLUE}[1/6] 检查 Anvil 本地节点...${NC}"
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
  PID=$(lsof -ti:8545)
  echo -e "${GREEN}  ✅ Anvil 正在运行${NC} (PID: $PID, 端口: 8545)"
  PASSED=$((PASSED + 1))
  
  # 测试 RPC 连接
  CHAIN_ID=$(curl -s -X POST http://127.0.0.1:8545 \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
  
  if [ "$CHAIN_ID" = "0x7a69" ]; then
    echo -e "${GREEN}  ✅ Chain ID 正确${NC} (31337 / 0x7a69)"
  else
    echo -e "${YELLOW}  ⚠️  Chain ID 不匹配${NC} (预期: 0x7a69, 实际: $CHAIN_ID)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}  ❌ Anvil 未运行${NC}"
  echo -e "${YELLOW}     启动命令: ${NC}cd packages/contracts && anvil"
  FAILED=$((FAILED + 1))
fi
echo ""

# 2. 检查后端服务
echo -e "${BLUE}[2/6] 检查后端 API 服务...${NC}"
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
  PID=$(lsof -ti:3001)
  echo -e "${GREEN}  ✅ 后端服务正在运行${NC} (PID: $PID, 端口: 3001)"
  PASSED=$((PASSED + 1))
  
  # 测试健康检查
  HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
  if [ "$HEALTH" = "200" ]; then
    echo -e "${GREEN}  ✅ 健康检查通过${NC} (GET /health)"
  else
    echo -e "${YELLOW}  ⚠️  健康检查失败${NC} (HTTP $HEALTH)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}  ❌ 后端服务未运行${NC}"
  echo -e "${YELLOW}     启动命令: ${NC}pnpm --filter @trustless/agent-service dev"
  FAILED=$((FAILED + 1))
fi
echo ""

# 3. 检查前端应用
echo -e "${BLUE}[3/6] 检查前端应用...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  PID=$(lsof -ti:3000)
  echo -e "${GREEN}  ✅ 前端应用正在运行${NC} (PID: $PID, 端口: 3000)"
  PASSED=$((PASSED + 1))
  
  # 测试前端响应
  FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
  if [ "$FRONTEND" = "200" ] || [ "$FRONTEND" = "304" ]; then
    echo -e "${GREEN}  ✅ 前端响应正常${NC} (HTTP $FRONTEND)"
  else
    echo -e "${YELLOW}  ⚠️  前端响应异常${NC} (HTTP $FRONTEND)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}  ❌ 前端应用未运行${NC}"
  echo -e "${YELLOW}     启动命令: ${NC}pnpm --filter @trustless/web-app dev"
  FAILED=$((FAILED + 1))
fi
echo ""

# 4. 检查智能合约部署
echo -e "${BLUE}[4/6] 检查智能合约部署...${NC}"
DEPLOYMENTS_FILE="packages/contracts/deployments.json"
if [ -f "$DEPLOYMENTS_FILE" ]; then
  CONTRACT_ADDRESS=$(grep -o '"UserRegistry": "[^"]*"' "$DEPLOYMENTS_FILE" | cut -d'"' -f4)
  if [ ! -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${GREEN}  ✅ UserRegistry 已部署${NC}"
    echo -e "     地址: ${CONTRACT_ADDRESS}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${YELLOW}  ⚠️  未找到 UserRegistry 地址${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}  ❌ 部署配置文件不存在${NC}"
  echo -e "${YELLOW}     部署命令: ${NC}cd packages/contracts && forge script script/DeployUserRegistry.s.sol:DeployUserRegistry --rpc-url http://localhost:8545 --broadcast"
  FAILED=$((FAILED + 1))
fi
echo ""

# 5. 检查数据库连接（如果配置了）
echo -e "${BLUE}[5/6] 检查数据库连接...${NC}"
ENV_FILE="packages/agent-service/.env"
if [ -f "$ENV_FILE" ]; then
  echo -e "${GREEN}  ✅ 后端环境配置存在${NC}"
  PASSED=$((PASSED + 1))
  
  # 检查数据库 URL
  if grep -q "DATABASE_URL" "$ENV_FILE"; then
    echo -e "${GREEN}  ✅ 数据库配置存在${NC}"
  else
    echo -e "${YELLOW}  ⚠️  未找到 DATABASE_URL 配置${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}  ⚠️  后端 .env 文件不存在${NC}"
  echo -e "     请参考: packages/agent-service/.env.example"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 6. 检查前端 Web3 配置
echo -e "${BLUE}[6/6] 检查 Web3 配置...${NC}"
WAGMI_FILE="packages/web-app/src/lib/wagmi.ts"
if [ -f "$WAGMI_FILE" ]; then
  if grep -q "31337" "$WAGMI_FILE" && grep -q "anvil" "$WAGMI_FILE"; then
    echo -e "${GREEN}  ✅ Anvil 网络配置正确${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${YELLOW}  ⚠️  Anvil 配置可能不正确${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}  ❌ Wagmi 配置文件不存在${NC}"
  FAILED=$((FAILED + 1))
fi
echo ""

# 总结
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    诊断结果总结                         ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}  ✅ 通过检查: $PASSED${NC}"
echo -e "${YELLOW}  ⚠️  警告: $WARNINGS${NC}"
echo -e "${RED}  ❌ 失败检查: $FAILED${NC}"
echo ""

# 根据结果给出建议
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  🎉 所有检查通过！系统运行正常。                       ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${BLUE}📝 下一步：在 MetaMask 中添加 Anvil 网络${NC}"
  echo ""
  echo "方式 1: 使用一键添加页面（推荐）"
  echo "  在浏览器中打开: file://$(pwd)/add-anvil-network.html"
  echo ""
  echo "方式 2: 手动添加"
  echo "  网络名称: Anvil Local"
  echo "  RPC URL: http://127.0.0.1:8545"
  echo "  Chain ID: 31337"
  echo "  货币符号: ETH"
  echo ""
  echo "方式 3: 查看详细指南"
  echo "  cat docs/METAMASK-ANVIL-CONNECTION-GUIDE.md"
  echo ""
elif [ $FAILED -gt 0 ]; then
  echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ 检测到 $FAILED 个严重问题，请先解决这些问题。        ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${YELLOW}🔧 快速修复：${NC}"
  echo ""
  echo "1. 停止所有服务："
  echo "   ./stop-dev.sh"
  echo ""
  echo "2. 重新启动所有服务："
  echo "   ./start-dev.sh"
  echo ""
  echo "3. 如果问题仍然存在，查看详细日志："
  echo "   tail -f /tmp/anvil.log"
  echo "   tail -f /tmp/agent-service.log"
  echo "   tail -f /tmp/web-app.log"
  echo ""
else
  echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║  ⚠️  检测到 $WARNINGS 个警告，但核心服务正常运行。       ║${NC}"
  echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${BLUE}💡 建议：${NC}"
  echo "  - 查看上方警告信息"
  echo "  - 根据提示解决非关键问题"
  echo "  - 如果应用功能正常，可以继续使用"
  echo ""
fi

# 显示有用的链接
echo -e "${BLUE}📚 相关文档：${NC}"
echo "  - MetaMask 连接指南: docs/METAMASK-ANVIL-CONNECTION-GUIDE.md"
echo "  - 测试指南: docs/stories/story-1.7-testing-guide.md"
echo "  - 快速修复: docs/stories/story-1.7-quickfix-500-error.md"
echo ""

# 退出码
if [ $FAILED -gt 0 ]; then
  exit 1
else
  exit 0
fi

