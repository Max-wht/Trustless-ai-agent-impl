# Story 3.3: 内容发布前端界面与流程

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P0 - Critical  
**Story Points**: 8  
**Status**: Ready for Development

---

## User Story

**As a** 用户  
**I want** 在时间线页面点击"发布"按钮，弹出发帖界面，输入内容（≤ 280 字符），点击发布后内容上传到 IPFS 并记录到区块链  
**So that** 我可以在平台上发表想法，内容存储在去中心化网络，永久可访问

---

## Acceptance Criteria

1. ✅ 在时间线页面添加"发布"浮动按钮（fixed position，右下角，shadcn Button）

2. ✅ 点击后打开 shadcn Dialog（发帖弹窗）

3. ✅ 弹窗内容：
   - Textarea 输入框（自动聚焦）
   - 字符计数器（"125/280"）
   - "发布"和"取消"按钮

4. ✅ 超过 280 字符，计数器变红，禁用发布按钮

5. ✅ 实现发布流程（React Hook Form）：
   - 调用后端 `POST /ipfs/upload` → 获得 IPFS 哈希
   - 调用智能合约 `ContentRegistry.publishContent(ipfsHash)`

6. ✅ 显示发布进度（shadcn Progress）：
   - "正在上传到 IPFS..."
   - "正在提交到区块链..."
   - "等待交易确认..."

7. ✅ 发布成功后：显示成功 Toast、关闭弹窗、刷新时间线

8. ✅ 发布失败后：显示错误信息、保留用户输入内容

9. ✅ 快捷键：Ctrl/Cmd + Enter 快速发布

10. ✅ 移动端：全屏 Modal

11. ✅ 整个发布流程 < 30 秒

---

## Technical Notes

**注意:** Epic 3 阶段内容直接 Approved，无审核流程。Epic 4 将添加审核。

**依赖 / Dependencies**: Story 3.1, 3.2, 1.10

---

**Story Status**: ✅ Ready for Development
