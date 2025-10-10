# Story 1.4: 前端 Next.js 应用初始化（shadcn/ui + Tailwind）

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 前端开发者 / Frontend Developer  
**I want** 在 `packages/web-app/` 创建 Next.js 14 项目（App Router），配置 Tailwind CSS 和 shadcn/ui，实现欢迎页面  
**So that** 前端开发环境就绪，可以开始开发钱包连接、用户界面等功能

---

## Acceptance Criteria

1. ✅ 在 `packages/web-app/` 运行 `npx create-next-app@latest`，选择：

   - TypeScript ✅
   - Tailwind CSS ✅
   - App Router ✅

2. ✅ 配置 `tailwind.config.ts`：

   - 使用 shadcn/ui 推荐的配置
   - 添加自定义主题色（primary: blue-600、accent: emerald-500）

3. ✅ 初始化 shadcn/ui：`npx shadcn-ui@latest init`，选择 New York 风格

4. ✅ 添加第一个 shadcn 组件：`npx shadcn-ui@latest add button card`

5. ✅ 创建欢迎页面 `app/page.tsx`：

   - 显示 "Welcome to Trustless SocialFi" 标题
   - 项目 slogan: "Speak Freely, Trust Collectively"
   - 使用 shadcn Button 和 Card 组件
   - 响应式设计

6. ✅ 配置字体（next/font）：

   - Inter（标题和正文）
   - JetBrains Mono（代码/哈希）

7. ✅ 配置环境变量（`.env.local`）：`NEXT_PUBLIC_API_URL=http://localhost:3001`

8. ✅ 运行 `pnpm dev` 成功，应用启动在 http://localhost:3000

9. ✅ 在浏览器访问 http://localhost:3000，看到欢迎页面，样式正确

10. ✅ 测试响应式：在移动端（375px）和桌面端（1920px）显示正常

11. ✅ 配置 `next.config.js`：

    - 启用 TypeScript strict mode
    - 图片域名白名单（IPFS 网关）

12. ✅ 在 `packages/web-app/README.md` 记录启动命令和开发规范

---

## Technical Notes

**品牌色配置:**

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#2563EB',    // Blue-600
      accent: '#10B981',     // Emerald-500
    }
  }
}
```

**依赖 / Dependencies**: Story 1.1 (Monorepo)  
**阻塞 / Blocks**: Story 1.5, 1.7, 1.10（所有前端功能）

---

**Story Status**: ✅ Ready for Development
