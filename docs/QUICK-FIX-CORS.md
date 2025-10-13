# ⚡ CORS 跨域问题 - 快速修复

## 🚨 看到这个错误？

```
Access to fetch at 'http://localhost:3001/users/register' from origin
'http://localhost:3000' has been blocked by CORS policy
```

## ✅ 3 步快速修复

### 步骤 1️⃣: 重启后端服务（必须！）

```bash
# 在后端服务的终端按 Ctrl+C 停止

# 重新启动
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev

# 等待看到: "Agent service listening on http://0.0.0.0:3001"
```

### 步骤 2️⃣: 清除浏览器缓存

**方法 A - 硬性刷新**:

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**方法 B - 使用隐私模式**:

- Chrome: `Ctrl/Cmd + Shift + N`
- Firefox: `Ctrl/Cmd + Shift + P`

### 步骤 3️⃣: 验证修复

打开浏览器开发者工具（F12），查看 Console 和 Network 标签，应该不再看到 CORS 错误。

---

## 🧪 快速测试

### 测试后端是否正常运行

```bash
curl http://localhost:3001/health
```

**期望输出**:

```json
{"status":"ok","service":"agent-service","timestamp":1728...}
```

### 测试 CORS 配置

```bash
curl -X OPTIONS http://localhost:3001/users/register \
  -H "Origin: http://localhost:3000" \
  -i
```

**期望看到响应头包含**:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

---

## 🔍 仍然有问题？

### 检查清单

- [ ] 后端服务在 3001 端口运行？`lsof -i :3001`
- [ ] 前端服务在 3000 端口运行？`lsof -i :3000`
- [ ] 环境变量配置正确？检查 `packages/web-app/.env.local`
- [ ] 浏览器缓存已清除？
- [ ] 使用了最新代码？`git pull`

### 查看详细指南

📚 完整排查步骤: [CORS-TROUBLESHOOTING.md](./CORS-TROUBLESHOOTING.md)

---

## 💡 为什么会出现 CORS 错误？

**简单解释**:

- 前端运行在 `localhost:3000`
- 后端运行在 `localhost:3001`
- 浏览器默认阻止跨域请求（安全机制）
- 需要后端明确允许前端的跨域请求

**已实施的解决方案**:
✅ 后端已配置 CORS，允许 localhost 的所有请求  
✅ 支持所有必需的 HTTP 方法和请求头  
✅ 启用 credentials 支持（cookies/认证）

---

## 📞 获取帮助

如果以上步骤都无法解决，请提供：

1. 浏览器控制台错误截图
2. Network 标签中的请求详情
3. 后端日志输出
4. `curl` 测试结果

---

**快速参考** | **最后更新**: 2025-10-11
