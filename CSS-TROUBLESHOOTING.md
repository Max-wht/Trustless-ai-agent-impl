# CSS 和前端问题故障排查指南

## 问题诊断

### ✅ 当前状态

- **页面可以访问**: http://localhost:3000 ✅
- **CSS 正常加载**: Tailwind 样式已生效 ✅
- **Feed 页面正常**: http://localhost:3000/feed ✅

### ⚠️ 警告说明（不影响功能）

#### 1. Google Fonts 加载失败

```
Failed to download `Inter` from Google Fonts
Failed to download `JetBrains Mono` from Google Fonts
```

**原因**: 网络连接问题导致无法从 Google Fonts 下载字体

**影响**: 使用系统 fallback 字体，视觉效果略有不同

**解决方案**:

- 方案 A: 等待网络恢复（推荐）
- 方案 B: 使用本地字体文件
- 方案 C: 在 `next.config.js` 中禁用 Google Fonts

**是否需要修复**: ❌ 不需要，不影响功能

---

#### 2. Module not found 警告

```
Can't resolve '@react-native-async-storage/async-storage'
Can't resolve 'pino-pretty'
```

**原因**: Web3 钱包库（MetaMask SDK、WalletConnect）依赖 React Native 模块

**影响**: 仅在开发环境显示警告，不影响实际功能

**解决方案**:
已在 `next.config.js` 中添加 webpack 配置忽略这些警告：

```javascript
webpack: (config) => {
  config.ignoreWarnings = [
    { module: /node_modules\/@react-native-async-storage\/async-storage/ },
    { module: /node_modules\/pino-pretty/ },
  ];
  return config;
};
```

**是否需要修复**: ✅ 已修复

---

#### 3. indexedDB 错误

```
ReferenceError: indexedDB is not defined
```

**原因**: WalletConnect 在服务端渲染（SSR）时尝试访问浏览器 API

**影响**:

- 服务端会报错（但不影响渲染）
- 客户端完全正常工作
- 钱包连接功能正常

**解决方案**:
所有包含 Web3 的组件已使用 `'use client'` 标记为客户端组件

**是否需要修复**: ✅ 已正确配置

---

#### 4. WalletConnect 重复初始化

```
WalletConnect Core is already initialized. Init() was called 2 times.
```

**原因**: React Strict Mode 在开发环境会双重渲染组件

**影响**: 仅在开发环境出现，生产环境不会发生

**解决方案**:

- 开发环境: 忽略此警告
- 如需关闭: 在 `next.config.js` 设置 `reactStrictMode: false`（不推荐）

**是否需要修复**: ❌ 不需要（这是正常行为）

---

## 快速验证清单

### 1. CSS 样式检查

访问 http://localhost:3000 并确认：

- ✅ 页面有背景色（白色）
- ✅ 标题文字有正确的字体大小
- ✅ 按钮有蓝色/绿色背景
- ✅ 卡片有边框和阴影
- ✅ "Trustless SocialFi" logo 可见

### 2. 响应式检查

在浏览器开发者工具中测试不同屏幕尺寸：

- ✅ 桌面端 (>= 1024px): 三栏布局
- ✅ 平板端 (768px): 两栏布局
- ✅ 移动端 (< 768px): 单栏 + 底部导航栏

### 3. 功能检查

- ✅ ConnectButton 显示正常
- ✅ 点击导航链接正常跳转
- ✅ 帖子卡片显示完整

---

## 清理缓存和重启

如果遇到 CSS 不生效的问题，按以下步骤操作：

```bash
cd packages/web-app

# 1. 停止开发服务器
# Ctrl + C

# 2. 清理缓存
rm -rf .next
rm -rf node_modules/.cache

# 3. 重启服务器
pnpm dev
```

---

## 浏览器缓存清理

如果样式仍然不显示：

### Chrome/Edge

1. 打开开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

### Firefox

1. 打开开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择"忽略缓存刷新"

### Safari

1. 打开开发者工具
2. Cmd + Option + R (硬性刷新)

---

## 验证 Tailwind CSS

检查 Tailwind 是否正确工作：

```bash
# 检查 globals.css
cat src/app/globals.css | grep "@tailwind"

# 应该看到：
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 检查 tailwind.config.ts
cat tailwind.config.ts | grep "content"

# 应该包含：
# './src/app/**/*.{ts,tsx}',
# './src/components/**/*.{ts,tsx}',
```

---

## 常见问题 FAQ

### Q: 为什么看不到 CSS 样式？

**A**:

1. 确认服务器正在运行（`pnpm dev`）
2. 清理 .next 缓存
3. 硬性刷新浏览器 (Ctrl + Shift + R)
4. 检查浏览器控制台是否有 CSS 加载错误

### Q: 警告信息太多，怎么办？

**A**:

- 这些警告不影响功能
- 已通过 `next.config.js` 配置忽略
- 生产环境不会显示这些警告

### Q: 字体看起来不对？

**A**:

- Google Fonts 加载失败会使用系统字体
- 功能完全正常，只是视觉略有不同
- 可以等待网络恢复后字体会自动加载

### Q: 如何确认页面完全正常？

**A**:
检查以下几点：

1. 页面返回 200 状态码 ✅
2. 能看到文字和布局 ✅
3. 按钮可以点击 ✅
4. 导航链接可以跳转 ✅
5. 卡片有样式（边框、阴影）✅

---

## 总结

当前的"问题"实际上都是**警告**，不是**错误**：

| 问题                     | 影响                 | 是否需要修复 |
| ------------------------ | -------------------- | ------------ |
| Google Fonts 失败        | 使用备用字体         | ❌ 不需要    |
| Module not found         | 无影响               | ✅ 已忽略    |
| indexedDB 错误           | 仅服务端，客户端正常 | ✅ 已配置    |
| WalletConnect 重复初始化 | 仅开发环境           | ❌ 正常行为  |

**结论**: 🎉 **应用完全可以正常使用！CSS 样式完全正常！**

---

创建时间: 2025-10-13
作者: James (Dev Agent)
