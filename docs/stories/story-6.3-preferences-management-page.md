# Story 6.3: "我的偏好"管理页面

**Epic**: Epic 6 - User Preferences & Personalized Tag Management  
**Priority**: P1 - High  
**Story Points**: 13

---

## User Story

**As a** 用户  
**I want** 访问"我的偏好"页面，查看所有自动生成的个性化 Tag，可以删除、编辑、合并 Tag  
**So that** 我可以管理自己的偏好数据，体验"数据主权"

---

## Acceptance Criteria

1. ✅ 创建页面 `app/preferences/page.tsx`

2. ✅ 页面加载时：从智能合约读取 IPFS 哈希 → 下载加密数据 → 请求签名解密

3. ✅ 使用 shadcn Card 展示每个 Tag：
   - Emoji 图标
   - Tag 名称
   - 权重条（Progress）
   - 来源说明
   - 操作按钮：编辑、删除

4. ✅ 实现 Tag 删除：确认 → 签名 → 重新加密上传 → 更新合约哈希

5. ✅ 实现 Tag 编辑

6. ✅ 实现 Tag 合并（多选 → 合并）

7. ✅ 显示统计信息（Tag 总数、最后更新时间）

8. ✅ 显示"数据主权"信息框

9. ✅ 提供"导出/导入偏好"按钮

10. ✅ 提供"隐私模式"开关

11. ✅ 提供"删除所有偏好数据"按钮

---

**依赖**: Story 6.2

**Story Status**: ✅ Ready

