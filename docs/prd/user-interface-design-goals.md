# User Interface Design Goals

## Overall UX Vision（整体 UX 愿景）

Trustless SocialFi 的用户界面必须实现 **"Web2 的流畅体验 + Web3 的透明度"** 平衡：

**核心 UX 原则：**

1. **渐进式 Web3 onboarding** - 降低技术门槛，让非 Web3 用户也能快速上手
   - 首次登录：简化钱包连接流程，提供"什么是钱包？"引导
   - 渐进披露：复杂的 Web3 概念（Gas 费、IPFS、签名）按需解释，不一次性灌输

2. **透明度优先** - 所有关键决策可视化
   - 内容审核：显示参与的 Agent、判断结果、最终得分
   - 个性化 Tag：显示来源、权重、生成逻辑
   - 算法决策：用户能理解"为什么"（为什么这个内容被推荐/拒绝）

3. **快速反馈** - 即时 UI 反馈 + 异步操作进度展示
   - 发帖后：立即显示"审核中"状态 + 进度条（5 个 Agent 判断进度）
   - IPFS 上传：显示上传进度条，而非无响应
   - 区块链交易：显示"交易处理中"，提供 Arbiscan 链接

4. **错误友好** - 将技术错误翻译为用户可理解的语言
   - 不显示："Transaction reverted with reason: InsufficientStake"
   - 而显示："质押金额不足。您需要至少 1000 代币才能成为 Agent。"

5. **信任建立** - 通过设计传递"安全、透明、可控"的信任感
   - 使用绿色勾选 ✅ 表示"已验证"、蓝色盾牌 🛡️ 表示"去中心化"
   - 在关键操作（签名、交易）前显示安全提示
   - 提供"数据主权"可视化（IPFS 哈希、加密状态）

## Key Interaction Paradigms（关键交互范式）

**1. 钱包优先交互（Wallet-First）**

- 所有操作基于钱包身份（无传统用户名/密码）
- 钱包地址 = 用户 ID
- 签名 = 授权机制

**2. 实时状态反馈（Real-time Status）**

- 内容审核进度条（Agent 1/5 已判断 → 2/5 → ...）
- 区块链交易状态（待确认 → 确认中 → 已完成）
- IPFS 上传状态（准备中 → 上传中 50% → 完成）

**3. 透明度弹窗（Transparency Modals）**

- 点击内容 → 查看审核详情
- 点击 Tag → 查看生成来源和算法
- 点击信誉分数 → 查看计算公式和历史

**4. 渐进式复杂度（Progressive Complexity）**

- 基础功能（发帖、点赞）：一键操作
- 高级功能（Agent 注册、DAO 投票）：多步引导
- 专家功能（查看智能合约、IPFS 哈希）：折叠在"高级"菜单

**5. 社区感知（Community Awareness）**

- 显示在线 Agent 数量（"32 个 Agent 在线守护内容质量"）
- 显示 DAO 活跃度（"15 个提案待投票"）
- 显示社区里程碑（"🎉 我们刚达到 5000 用户！"）

## Core Screens and Views（核心页面与视图）

**1. 钱包连接页（Wallet Connection Screen）**

- 用途：用户首次访问的入口，建立 Web3 身份
- 关键元素：多钱包选项（MetaMask、WalletConnect）、"什么是钱包？"引导、安全提示

**2. 主时间线（Main Timeline / Feed）**

- 用途：用户消费内容的主要场景，查看关注用户的最新帖子
- 关键元素：无限滚动加载、帖子卡片（作者、内容、点赞/评论数、时间）、发帖快捷入口

**3. 内容发布界面（Post Composer）**

- 用途：用户创建和发布内容
- 关键元素：文本输入框（280 字符限制）、字符计数器、发布按钮、审核进度展示

**4. 审核进度与结果页（Moderation Status Page）**

- 用途：让用户了解内容审核过程和结果（透明度核心功能）
- 关键元素：5 个 Agent 卡片、各自判断结果、最终得分、通过/拒绝原因

**5. 用户个人主页（User Profile Page）**

- 用途：展示用户身份、内容、社交关系、信誉
- 关键元素：头像、简介、信誉评分、发帖列表、关注/粉丝数、关注/取关按钮

**6. 我的偏好页（My Preferences Page）**

- 用途：管理个性化 Tag、隐私设置、多钱包关联（数据主权核心功能）
- 关键元素：Tag 列表（可视化权重）、删除/编辑/合并按钮、IPFS 数据信息、隐私模式开关、关联钱包管理

**7. Agent 列表页（Agent Directory）**

- 用途：展示所有 Agent 的信誉和性能（透明度核心功能）
- 关键元素：Agent 卡片（信誉评分、准确率、质押金）、排序/筛选、详情链接

**8. Agent 详情页（Agent Detail Page）**

- 用途：深入了解单个 Agent 的历史表现
- 关键元素：信誉趋势图、审核历史、质押信息、运营者信息

**9. DAO 治理页（DAO Governance Dashboard）**

- 用途：社区参与平台治理，查看和投票提案
- 关键元素：提案列表（进行中/已通过/已拒绝）、投票按钮、提案详情、投票结果图表

**10. 提案详情页（Proposal Detail Page）**

- 用途：查看提案完整信息并投票
- 关键元素：提案标题、内容、发起人、投票选项、当前投票结果、截止时间、投票按钮

**11. 用户设置页（Settings Page）**

- 用途：管理账户设置、通知偏好、隐私设置
- 关键元素：通知开关、隐私模式、语言选择、关联钱包、数据导出/删除

**12. 通知中心（Notification Center）**

- 用途：集中展示所有通知（社交互动、审核结果、DAO 更新）
- 关键元素：通知列表、未读标记、分类筛选、通知设置链接

## Accessibility（可访问性）

**级别：WCAG 2.1 AA**

**具体要求：**

- 所有交互元素必须支持键盘导航（Tab、Enter、Esc）
- 颜色对比度必须符合 WCAG AA 标准（正文 4.5:1，大字体 3:1）
- 所有图标和图像必须有 alt 文本
- 表单输入必须有清晰的 label 和错误提示
- 支持屏幕阅读器（ARIA 标签）

**shadcn/ui + Radix UI 提供的可访问性保证：**

- 自动管理焦点状态
- 内置键盘快捷键（如：Esc 关闭 Dialog）
- 正确的 ARIA 角色和属性
- 屏幕阅读器友好的语义化 HTML

**Phase 2 优化：**

- WCAG AAA 级别
- 深色模式（Dark Mode）
- 字体大小调节
- 高对比度模式

## Branding（品牌）

**品牌定位：** 现代、专业、值得信赖、去中心化

**视觉风格（基于 shadcn/ui + Tailwind 定制）：**

**色彩方案（Tailwind 调色板）：**

- **主色：** Blue-600 `#2563EB`（信任、专业）
- **强调色：** Emerald-500 `#10B981`（去中心化、自由）
- **警告色：** Amber-500 `#F59E0B`（重要提示）
- **危险色：** Red-500 `#EF4444`（错误、删除）
- **中性色：** Slate 系列（#F8FAFC → #0F172A）
- **背景：** 浅色模式 Slate-50，暗色模式 Slate-900

**字体系统：**

- **标题/正文：** Inter（shadcn/ui 默认，现代无衬线）
- **代码/哈希：** JetBrains Mono（等宽字体，显示地址和哈希）

**设计语言：**

- **圆角：** rounded-lg（8px）用于卡片，rounded-md（6px）用于按钮
- **阴影：** shadow-sm、shadow-md（subtle elevation）
- **动画：** transition-all duration-200（流畅但克制）
- **间距：** 基于 Tailwind spacing scale（4px 基数）

**shadcn/ui 主题定制（tailwind.config.ts）：**

```typescript
theme: {
  extend: {
    colors: {
      primary: colors.blue[600],
      accent: colors.emerald[500],
      // ... 自定义品牌色
    },
    borderRadius: {
      lg: '0.5rem',
      md: '0.375rem',
    }
  }
}
```

**品牌元素：**

- **Logo：** 简洁的网络节点图 + "Trustless" 文字（强调去中心化）
- **Slogan：** "Speak Freely, Trust Collectively"
- **视觉识别：** 透明度徽章、去中心化网络图案

## Target Device and Platforms（目标设备和平台）

**MVP 阶段：Web Responsive**

**支持的设备：**

- **桌面浏览器：**
  - Chrome/Brave 90+（优先级 1，MetaMask 支持最好）
  - Firefox 88+（优先级 2）
  - Safari 14+（优先级 3，WalletConnect 支持）
  - 分辨率：1920x1080、1366x768、1440x900

- **移动浏览器：**
  - iOS Safari 14+（iPhone 6s 及以上）
  - Android Chrome 90+
  - 分辨率：375x667（iPhone SE）、390x844（iPhone 12+）、360x800（Android）

**响应式断点（Tailwind 默认）：**

```
sm: 640px   (小型设备)
md: 768px   (平板)
lg: 1024px  (桌面)
xl: 1280px  (大屏桌面)
2xl: 1536px (超大屏)
```

**Phase 2 扩展：**

- 原生移动 App（React Native，12-18 个月）
- 桌面应用（Electron，可选）

**技术要求：**

- PWA（Progressive Web App）支持（可添加到主屏幕）
- 离线功能（缓存关键数据，无网络时可浏览已加载内容）
- Web Push API（浏览器通知）

---
