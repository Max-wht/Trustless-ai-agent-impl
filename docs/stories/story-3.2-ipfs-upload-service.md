# Story 3.2: 后端 IPFS 内容上传服务

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 后端开发者  
**I want** 实现 IPFS 内容上传服务，接收文本内容，上传到 Pinata 和 Web3.Storage（双备份），返回 IPFS 哈希  
**So that** 用户发布的内容可以存储在去中心化网络，确保永久可访问和防审查

---

## Acceptance Criteria

1. ✅ 安装依赖：`@pinata/sdk`、`web3.storage`

2. ✅ 配置环境变量：`PINATA_API_KEY`、`PINATA_SECRET_KEY`、`WEB3_STORAGE_TOKEN`

3. ✅ 在 `src/lib/ipfs.ts` 创建 IPFS 服务：
   - `uploadToPinata`
   - `uploadToWeb3Storage`
   - `uploadContent`（并行上传到两个服务）

4. ✅ 实现 API 端点 `POST /ipfs/upload`：
   - 接收 `{ content: string }`
   - 调用 `uploadContent()`
   - 返回 IPFS 哈希和 URL

5. ✅ 实现 API 端点 `GET /ipfs/:hash`：
   - 从 Pinata 或 Web3.Storage 检索内容
   - 缓存到 Redis（TTL 1 小时）

6. ✅ 实现内容验证：
   - 长度 ≤ 5000 字符
   - 内容不为空
   - 过滤恶意字符（XSS 防护）

7. ✅ 测试：上传一段文本，返回 IPFS 哈希

8. ✅ 测试：使用返回的哈希调用 `GET /ipfs/:hash`，返回原始内容

9. ✅ 测试：上传延迟 < 10 秒（P95）

10. ✅ 错误处理：Pinata 或 Web3.Storage 故障，至少一个成功即可

11. ✅ 在 `README.md` 记录 IPFS API 使用方法

---

## Technical Notes

**双 Pinning 策略:**
- Primary: Pinata (快速，付费可靠)
- Backup: Web3.Storage (免费，Filecoin 支持)
- 至少一个成功即返回

**依赖 / Dependencies**: Story 1.3 (后端框架)

---

**Story Status**: ✅ Ready for Development

