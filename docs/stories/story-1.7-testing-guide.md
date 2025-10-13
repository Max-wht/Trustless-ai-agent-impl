# Story 1.7 测试指南

## 快速启动

### 1. 启动后端服务

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/agent-service dev
```

后端将在 `http://localhost:3001` 运行

### 2. 启动前端应用

在新的终端窗口：

```bash
cd /Users/max/code/foundry-code/foundry-trustless-ai-agent
pnpm --filter @trustless/web-app dev
```

前端将在 `http://localhost:3000` 运行

---

## 测试场景

### 场景 1: 查看已注册用户的个人主页

1. 访问首页 `http://localhost:3000`
2. 连接钱包（系统会自动注册）
3. 注册成功后会自动跳转到您的个人主页
4. **验证点**:
   - ✅ 看到 Blockies 生成的头像
   - ✅ 看到您的钱包地址
   - ✅ 看到注册时间
   - ✅ 看到"编辑个人资料（即将推出）"按钮
   - ✅ 看到绿色的成功提示
   - ✅ 关注/粉丝/信誉评分都显示为 0

### 场景 2: 查看他人的个人主页

1. 获取另一个已注册用户的钱包地址
2. 访问 `http://localhost:3000/profile/{其他用户地址}`
3. **验证点**:
   - ✅ 看到该用户的头像和信息
   - ✅ 看到"关注（Epic 3 实现）"按钮
   - ✅ 没有绿色成功提示

### 场景 3: 访问不存在的用户

1. 访问一个不存在的地址，例如:
   ```
   http://localhost:3000/profile/0x0000000000000000000000000000000000000000
   ```
2. **验证点**:
   - ✅ 看到 404 错误页面
   - ✅ 显示"用户未找到"消息
   - ✅ 有"返回首页"按钮

### 场景 4: 测试加载状态

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 将网络速度限制为"Slow 3G"
4. 访问任意用户主页
5. **验证点**:
   - ✅ 在数据加载时看到灰色的骨架屏
   - ✅ 骨架屏布局与实际内容布局一致
   - ✅ 加载完成后内容平滑过渡

### 场景 5: 测试响应式设计

#### 移动端（< 768px）

1. 按 F12 打开开发者工具
2. 点击设备工具栏图标（或按 Ctrl+Shift+M / Cmd+Shift+M）
3. 选择 iPhone 或其他移动设备
4. **验证点**:
   - ✅ 头像和用户信息居中显示
   - ✅ 统计数据（关注/粉丝/信誉）居中显示
   - ✅ 账户详情和活动统计卡片垂直堆叠（单列）
   - ✅ 按钮居中显示

#### 桌面端（≥ 768px）

1. 切换回桌面视图或放大浏览器窗口
2. **验证点**:
   - ✅ 头像和用户信息水平排列
   - ✅ 统计数据左对齐
   - ✅ 账户详情和活动统计卡片并排显示（两列）
   - ✅ 按钮左对齐

---

## 直接 API 测试

### 测试后端 API

```bash
# 获取所有用户
curl http://localhost:3001/users

# 获取特定用户（替换为实际地址）
curl http://localhost:3001/users/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1

# 测试不存在的用户（应返回 404）
curl -i http://localhost:3001/users/0x0000000000000000000000000000000000000000
```

---

## 已知问题

### 1. CORS 跨域问题 ⚠️

- **描述**: 前端调用后端 API 时出现跨域错误
- **症状**: 浏览器控制台显示 "blocked by CORS policy"
- **解决方案**:
  1. **重启后端服务**（最重要！CORS 配置更改需要重启）
     ```bash
     pnpm --filter @trustless/agent-service dev
     ```
  2. 清除浏览器缓存（硬性刷新：Ctrl+Shift+R / Cmd+Shift+R）
  3. 如果仍有问题，查看 `/docs/CORS-TROUBLESHOOTING.md` 详细指南
- **状态**: ✅ 已配置完整的 CORS 支持

### 2. 构建时的 indexedDB 警告

- **描述**: 构建时出现 "indexedDB is not defined" 错误
- **影响**: 仅影响静态生成过程，不影响客户端运行
- **原因**: RainbowKit/wagmi 使用浏览器 API
- **解决方案**: 页面使用 'use client' 指令，在客户端正常工作

### 3. 依赖警告

- **描述**: 某些钱包连接器的可选依赖缺失警告
- **影响**: 不影响核心功能
- **状态**: 这些是预期的可选依赖

---

## 数据库检查

### 查看数据库中的用户

如果您有 Prisma Studio：

```bash
cd packages/agent-service
npx prisma studio
```

或使用 SQL 查询（如果使用 PostgreSQL）：

```sql
SELECT * FROM "User";
```

---

## 性能测试

### 测试页面加载时间

1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 勾选"Disable cache"
4. 访问用户主页
5. 查看加载时间
6. **目标**: 首次加载 < 2 秒

### Lighthouse 测试

1. 打开 Chrome DevTools
2. 切换到 Lighthouse 标签
3. 选择 "Desktop" 或 "Mobile"
4. 点击 "Analyze page load"
5. **目标指标**:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 80

---

## 常见问题

### Q: 注册或 API 调用时出现 CORS 错误

**A**: CORS 错误是最常见的问题，按以下顺序解决：

1. **立即重启后端服务**（CORS 配置已更新）:

   ```bash
   # 停止当前后端服务（Ctrl+C）
   pnpm --filter @trustless/agent-service dev
   ```

2. **清除浏览器缓存**:
   - Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - 或使用隐私/无痕模式测试

3. **验证后端运行**:

   ```bash
   curl http://localhost:3001/health
   # 应返回: {"status":"ok",...}
   ```

4. **查看详细排查指南**: `/docs/CORS-TROUBLESHOOTING.md`

### Q: 页面显示"用户不存在"

**A**: 确保：

1. 后端服务正在运行
2. 钱包地址已注册（先访问首页并连接钱包）
3. URL 中的地址格式正确
4. 没有 CORS 错误（检查浏览器控制台）

### Q: 头像不显示

**A**: 检查：

1. react-blockies 包已安装：`pnpm list react-blockies`
2. 浏览器控制台是否有错误
3. 钱包地址是否有效

### Q: 加载状态一直显示

**A**: 检查：

1. 后端 API 是否可访问：`curl http://localhost:3001/users`
2. 浏览器控制台的网络请求是否成功
3. 环境变量 `NEXT_PUBLIC_API_URL` 是否正确配置

### Q: 样式显示不正确

**A**: 尝试：

1. 清除浏览器缓存
2. 重启开发服务器
3. 检查 Tailwind CSS 是否正确配置

---

## 反馈和问题报告

如果发现任何问题，请记录：

1. 复现步骤
2. 期望行为
3. 实际行为
4. 浏览器和版本
5. 控制台错误信息
6. 网络请求详情

---

**测试完成日期**: \***\*\_\*\***  
**测试人员**: \***\*\_\*\***  
**测试结果**: ⬜ 通过 / ⬜ 未通过  
**备注**: \***\*\_\*\***
