#!/bin/bash
# GitHub Actions 工作流验证脚本

echo "=== GitHub Actions 工作流验证 ==="
echo ""

echo "1️⃣ 检查工作流文件..."
WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" | wc -l | xargs)
echo "   找到 $WORKFLOW_COUNT 个工作流文件"

for workflow in .github/workflows/*.yml; do
  echo "   ✓ $(basename $workflow)"
done

echo ""
echo "2️⃣ 检查 YAML 语法..."
for workflow in .github/workflows/*.yml; do
  if command -v yamllint &> /dev/null; then
    yamllint "$workflow" && echo "   ✓ $(basename $workflow) - 语法正确"
  else
    echo "   ⚠ yamllint 未安装，跳过语法检查"
    break
  fi
done

echo ""
echo "3️⃣ 检查模板文件..."
echo "   PR 模板: $([ -f .github/PULL_REQUEST_TEMPLATE.md ] && echo '✓ 存在' || echo '✗ 缺失')"
echo "   Bug 报告: $([ -f .github/ISSUE_TEMPLATE/bug_report.md ] && echo '✓ 存在' || echo '✗ 缺失')"
echo "   功能请求: $([ -f .github/ISSUE_TEMPLATE/feature_request.md ] && echo '✓ 存在' || echo '✗ 缺失')"

echo ""
echo "4️⃣ 检查 Vercel 配置..."
echo "   vercel.json: $([ -f vercel.json ] && echo '✓ 存在' || echo '✗ 缺失')"
echo "   .vercelignore: $([ -f packages/web-app/.vercelignore ] && echo '✓ 存在' || echo '✗ 缺失')"

echo ""
echo "5️⃣ 文档文件..."
echo "   README: $([ -f .github/README.md ] && echo '✓ 存在' || echo '✗ 缺失')"
echo "   ENV_SETUP: $([ -f .github/ENV_SETUP.md ] && echo '✓ 存在' || echo '✗ 缺失')"

echo ""
echo "=== 验证完成 ==="
