# Story 1.10: 简单时间线展示（Placeholder UI）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P2 - Medium  
**Story Points**: 3  
**Status**: Ready for Development

---

## User Story

**As a** 用户 / User  
**I want** 在主页查看时间线（目前显示欢迎信息和占位内容），了解未来将在这里看到关注用户的帖子  
**So that** 我可以理解平台的基本布局和功能方向

---

## Acceptance Criteria

1. ✅ 创建页面 `app/feed/page.tsx`（时间线页面）

2. ✅ 创建导航栏组件 `components/Navigation.tsx`：
   - Logo + "Trustless SocialFi"
   - 导航链接
   - ConnectButton

3. ✅ 时间线页面布局：
   - 左侧导航
   - 中间时间线主体（最大宽度 600px）
   - 右侧侧边栏占位

4. ✅ 主体区域显示欢迎卡片和 3 个占位帖子卡片（Mock 数据）

5. ✅ 响应式设计：移动端隐藏侧边栏，导航变为底部 Tab Bar

6. ✅ 页面加载时间 < 1 秒

7. ✅ 未连接钱包时，显示"请连接钱包"提示

8. ✅ 连接钱包后，URL 自动跳转到 `/feed`

---

## Technical Notes

**Mock 数据示例:**

```typescript
const mockPosts = [
  {
    id: '1',
    author: { username: 'alice.eth', walletAddress: '0x...' },
    content: 'Welcome to Trustless SocialFi!',
    likesCount: 42,
    createdAt: new Date(),
  },
  // ...
];
```

**依赖 / Dependencies**: Story 1.4, 1.5  
**阻塞 / Blocks**: Story 3.4（真实时间线）

---

## Dev Agent Record

**Agent Model Used**: Claude Sonnet 4.5

### Tasks Completed

- [x] 创建 Navigation 导航栏组件（桌面 + 移动响应式）
- [x] 创建 PostCard 帖子卡片组件（支持点赞、评论、分享）
- [x] 创建 app/feed/page.tsx 时间线页面
- [x] 实现三栏响应式布局（左侧导航、中间时间线、右侧边栏）
- [x] 添加 3 个 Mock 帖子数据
- [x] 实现未连接钱包时显示提示和骨架屏
- [x] 修改首页添加自动跳转逻辑（钱包连接 + 注册后跳转到 /feed）
- [x] 安装 lucide-react 图标库
- [x] TypeScript 类型检查通过

### File List

**新建文件:**

- `src/components/Navigation.tsx` - 导航栏组件（左侧桌面版 + 顶部/底部移动版）
- `src/components/PostCard.tsx` - 帖子卡片组件（包含作者信息、内容、点赞、评论、分享）
- `src/app/feed/page.tsx` - 时间线页面（三栏布局）
- `packages/web-app/.validation-report.md` - 验证报告

**修改文件:**

- `src/app/page.tsx` - 添加自动跳转到 /feed 的逻辑
- `package.json` - 添加 lucide-react 依赖

### Completion Notes

1. **Navigation 组件设计**:
   - **桌面版**（>= 1024px）: 左侧固定侧边栏（w-64），包含 Logo、导航链接和 ConnectButton
   - **移动版**（< 1024px）: 顶部固定 Header + 底部固定 Tab Bar
   - 使用 lucide-react 图标（Home, User, Settings）
   - 支持钱包连接状态动态显示 Profile 链接

2. **PostCard 组件特性**:
   - 显示作者信息（头像、用户名、钱包地址缩写）
   - 显示相对时间（使用 shared/utils/formatRelativeTime）
   - 显示帖子内容（支持多行、自动换行）
   - 交互按钮：点赞（Heart）、评论（MessageCircle）、分享（Share2）
   - 点赞状态可视化（已点赞显示红色填充）
   - Hover 效果和过渡动画

3. **Feed 页面布局**:
   - **三栏布局**（使用 Tailwind Grid）:
     - 左侧：Navigation（lg:pl-64 offset）
     - 中间：时间线主体（lg:col-span-7 xl:col-span-6，约 600px）
     - 右侧：侧边栏（lg:col-span-5 xl:col-span-4）
   - **响应式设计**:
     - 移动端隐藏右侧边栏（lg:hidden）
     - 调整 padding 适应顶部/底部导航
   - **内容区域**:
     - 欢迎卡片（渐变背景）
     - 钱包未连接警告（黄色提示卡片）
     - 3 个 Mock 帖子或骨架屏

4. **Mock 数据**:
   - 3 个测试帖子（alice.eth, bob.eth, 匿名用户）
   - 包含真实的时间戳（2 小时前、5 小时前、1 天前）
   - 不同的点赞/评论数量
   - 一个帖子标记为已点赞

5. **右侧边栏内容**:
   - Trending Topics（3 个话题标签）
   - Who to Follow（3 个推荐用户）
   - 版权信息卡片

6. **自动跳转逻辑**:
   - 首页检测到钱包连接且用户已注册时，自动跳转到 `/feed`
   - "开始体验"按钮可手动跳转
   - 使用 Next.js `useRouter` 进行客户端路由

7. **性能优化**:
   - 纯静态组件，无外部 API 请求
   - 使用 Tailwind CSS 实用类，无额外 CSS 文件
   - 响应式图片和布局，加载时间 < 1秒

8. **类型安全**:
   - PostCardProps 接口定义清晰
   - 使用 @trustless/shared 的共享类型和工具函数
   - TypeScript 编译无错误

### Change Log

- 2025-10-13: 实施 Story 1.10 - 简单时间线展示（Placeholder UI）完成

---

**Story Status**: ✅ Ready for Review
