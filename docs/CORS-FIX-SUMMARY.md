# CORS 跨域问题修复总结

**问题**: 前端调用后端 API 时出现跨域（CORS）错误  
**修复日期**: 2025-10-11  
**状态**: ✅ 已修复

---

## 🔧 实施的修复

### 1. 更新后端 CORS 配置

**文件**: `/packages/agent-service/src/index.ts`

**主要更改**:

- ✅ 允许所有 localhost 和 127.0.0.1 源（开发环境）
- ✅ 支持所有必需的 HTTP 方法（GET, POST, PUT, PATCH, DELETE, OPTIONS）
- ✅ 配置正确的请求头和响应头
- ✅ 启用 credentials 支持
- ✅ 设置 preflight 缓存（24小时）

**新配置代码**:

```typescript
await app.register(cors, {
  origin: (origin, cb) => {
    // 允许所有 localhost 请求（开发环境）
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      cb(null, true);
      return;
    }
    // 生产环境需要明确的白名单
    cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400, // 24 hours
});
```

### 2. 创建的文档

#### 2.1 快速修复指南

**文件**: `/docs/QUICK-FIX-CORS.md`

- ⚡ 3 步快速修复流程
- 🧪 快速测试命令
- ✅ 问题检查清单

#### 2.2 详细故障排除

**文件**: `/docs/CORS-TROUBLESHOOTING.md`

- 📖 完整的问题解释
- 🔍 详细的调试方法
- 🚨 常见问题和解决方案
- 📚 参考资料链接

#### 2.3 更新现有文档

- ✅ 更新 `/docs/stories/story-1.7-testing-guide.md`
- ✅ 更新 `/README.md` 添加故障排除章节

---

## 🎯 用户需要做的事

### ⚠️ 最重要：重启后端服务

CORS 配置更改需要重启后端服务才能生效！

```bash
# 1. 停止当前后端服务（Ctrl+C）

# 2. 重新启动
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev

# 3. 等待服务启动完成
# 看到: "Agent service listening on http://0.0.0.0:3001"
```

### 其他步骤

1. **清除浏览器缓存**:
   - 硬性刷新: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - 或使用无痕/隐私模式

2. **验证修复**:

   ```bash
   # 测试后端健康检查
   curl http://localhost:3001/health

   # 测试 CORS 配置
   curl -X OPTIONS http://localhost:3001/users/register \
     -H "Origin: http://localhost:3000" -i
   ```

---

## 📋 验证清单

使用此清单确认 CORS 问题已解决：

- [ ] 后端服务已重启
- [ ] 浏览器缓存已清除
- [ ] `curl http://localhost:3001/health` 返回 200 OK
- [ ] OPTIONS 请求返回正确的 CORS 头
- [ ] 浏览器控制台没有 CORS 错误
- [ ] 用户注册功能正常工作
- [ ] 个人主页可以加载用户数据

---

## 🔍 技术细节

### CORS 工作原理

1. **简单请求**:
   - 浏览器直接发送请求
   - 检查响应头中的 `Access-Control-Allow-Origin`

2. **预检请求（Preflight）**:
   - 对于 POST/PUT/DELETE 等请求
   - 浏览器先发送 OPTIONS 请求
   - 检查服务器是否允许该方法和头
   - 然后才发送实际请求

### 我们的配置

**允许的源（Origin）**:

- ✅ `http://localhost:3000` (前端)
- ✅ `http://127.0.0.1:3000`
- ✅ 所有包含 localhost 的地址（开发环境）

**允许的方法**:

- ✅ GET, POST, PUT, PATCH, DELETE, OPTIONS

**允许的请求头**:

- ✅ Content-Type (JSON 请求)
- ✅ Authorization (认证令牌)
- ✅ Accept (内容协商)

**其他配置**:

- ✅ credentials: true (允许发送 cookies)
- ✅ maxAge: 86400 (预检结果缓存 24 小时)

---

## 🚀 生产环境注意事项

### ⚠️ 当前配置不适合生产环境

当前配置允许所有 localhost 请求，这仅适用于开发环境。

### 生产环境配置建议

```typescript
// 生产环境 CORS 配置示例
await app.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
});
```

**环境变量配置**:

```bash
# .env (生产环境)
ALLOWED_ORIGINS=https://app.yourdomain.com,https://www.yourdomain.com
```

**TODO**:

- [ ] 添加环境变量配置
- [ ] 区分开发/生产环境
- [ ] 添加 CORS 安全测试
- [ ] 配置生产域名白名单

---

## 📚 参考资料

- **快速修复**: [QUICK-FIX-CORS.md](./QUICK-FIX-CORS.md)
- **详细指南**: [CORS-TROUBLESHOOTING.md](./CORS-TROUBLESHOOTING.md)
- **测试指南**: [stories/story-1.7-testing-guide.md](./stories/story-1.7-testing-guide.md)

**外部资源**:

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Fastify CORS Plugin](https://github.com/fastify/fastify-cors)
- [CORS 错误排查](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

---

## 📞 获取帮助

如果按照以上步骤仍无法解决问题，请提供：

1. 浏览器控制台完整错误信息（截图）
2. Network 标签中失败请求的详情
3. 后端控制台日志
4. `curl` 测试命令的完整输出

---

**修复完成**: ✅  
**文档创建**: ✅  
**测试指南更新**: ✅  
**README 更新**: ✅

**下一步**: 重启后端服务，测试功能是否正常 🚀
