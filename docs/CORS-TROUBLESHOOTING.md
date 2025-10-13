# CORS 跨域问题解决指南

## 问题描述

在使用 `http://localhost:3001/users/register` 等 API 接口时出现跨域（CORS）错误。

---

## ✅ 已实施的解决方案

### 后端 CORS 配置更新

已更新 `/packages/agent-service/src/index.ts` 的 CORS 配置：

**新配置特性**:

- ✅ 允许所有 localhost 和 127.0.0.1 源（开发环境）
- ✅ 支持所有常用 HTTP 方法（GET, POST, PUT, PATCH, DELETE, OPTIONS）
- ✅ 允许必要的请求头（Content-Type, Authorization, Accept）
- ✅ 启用 credentials（允许发送 cookies）
- ✅ 设置 preflight 缓存（24小时）

---

## 🔧 解决步骤

### 1. 重启后端服务

**CORS 配置更改需要重启服务才能生效！**

```bash
# 停止当前运行的后端服务（Ctrl+C）

# 重新启动后端
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev
```

### 2. 验证后端服务

确认服务正常运行：

```bash
# 测试健康检查端点
curl http://localhost:3001/health

# 应该返回：
# {"status":"ok","service":"agent-service","timestamp":...}
```

### 3. 测试 CORS 配置

使用 curl 测试 CORS 预检请求：

```bash
# 测试 OPTIONS 预检请求
curl -X OPTIONS http://localhost:3001/users/register \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i

# 应该看到响应头包含：
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
# Access-Control-Allow-Credentials: true
```

### 4. 清除浏览器缓存

CORS 错误可能被浏览器缓存：

**Chrome/Edge**:

1. 打开开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

**或者使用隐私模式/无痕模式测试**

### 5. 重启前端应用

```bash
# 停止前端服务（Ctrl+C）

# 重新启动前端
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

---

## 🔍 调试方法

### 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 切换到 **Console** 标签
3. 查找 CORS 相关错误消息

**常见错误消息**:

```
Access to fetch at 'http://localhost:3001/users/register' from origin
'http://localhost:3000' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 检查网络请求

1. 开发者工具 → **Network** 标签
2. 刷新页面触发请求
3. 找到失败的请求（通常显示为红色）
4. 点击查看详情

**检查项**:

- ✅ **Request Headers**: 是否包含 `Origin: http://localhost:3000`
- ✅ **Response Headers**: 是否包含 `Access-Control-Allow-Origin`
- ✅ **Status Code**: 如果是 `0` 或 `(failed)`，通常是 CORS 问题

### 查看后端日志

后端控制台应该显示请求日志：

```
{"level":30,"time":...,"msg":"incoming request","req":{...}}
```

如果看不到任何日志，说明请求根本没到达后端。

---

## 🚨 常见问题

### Q1: 重启后仍然有 CORS 错误

**解决方案**:

1. **确认服务端口**:

   ```bash
   # 检查 3001 端口是否被占用
   lsof -i :3001

   # 如果有旧进程，kill 掉
   kill -9 <PID>
   ```

2. **检查环境变量**:

   ```bash
   # 前端 .env.local
   cat packages/web-app/.env.local
   # 应该包含: NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **检查是否使用了反向代理**:
   - 如果使用了 nginx 或其他代理，需要在代理层配置 CORS

### Q2: Preflight 请求失败

**症状**: 看到 OPTIONS 请求返回 404 或 500

**解决方案**:

- 后端已配置支持 OPTIONS 方法
- 确认 `@fastify/cors` 插件正确注册
- 重启后端服务

### Q3: 只有某些请求失败

**可能原因**:

1. **请求方法不匹配**: 检查是否使用了配置中的方法
2. **自定义 Header**: 如果使用了自定义 header，需要添加到 `allowedHeaders`
3. **响应 Header**: 如果需要读取响应 header，添加到 `exposedHeaders`

### Q4: 生产环境 CORS 配置

**注意**: 当前配置允许所有 localhost，**不适合生产环境**

**生产环境配置示例**:

```typescript
await app.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

在 `.env` 中配置：

```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🧪 测试清单

在确认 CORS 问题解决后，测试以下场景：

- [ ] GET 请求（获取用户信息）
- [ ] POST 请求（用户注册）
- [ ] PATCH 请求（更新用户信息）
- [ ] 预检 OPTIONS 请求
- [ ] 带有 credentials 的请求
- [ ] 不同浏览器（Chrome, Firefox, Safari）

---

## 📚 参考资料

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Fastify CORS 插件](https://github.com/fastify/fastify-cors)
- [CORS 错误排查](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

---

## 🆘 仍然无法解决？

如果以上步骤都尝试过仍无法解决，请提供：

1. 浏览器控制台的完整错误消息（截图）
2. Network 标签中失败请求的详情（截图）
3. 后端控制台日志
4. 使用的浏览器和版本
5. `curl` 测试的结果

---

**最后更新**: 2025-10-11  
**相关文件**: `/packages/agent-service/src/index.ts`
