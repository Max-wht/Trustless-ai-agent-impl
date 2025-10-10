# Story 6.1: 用户偏好数据加密与 IPFS 存储

**Epic**: Epic 6 - User Preferences & Personalized Tag Management  
**Priority**: P1 - High  
**Story Points**: 13

---

## User Story

**As a** 后端开发者  
**I want** 实现用户偏好数据的 IPFS 加密存储服务，使用用户钱包签名派生的 AES-256 密钥加密  
**So that** 用户偏好数据去中心化存储，用户完全控制数据，跨设备同步

---

## Acceptance Criteria

1. ✅ 在 `src/services/preferences.ts` 创建偏好管理服务

2. ✅ 定义偏好数据结构（UserPreferences interface）

3. ✅ 实现函数 `encryptPreferences(data, userSignature)`：使用 EIP-712 签名派生 AES-256 密钥

4. ✅ 实现函数 `decryptPreferences(encryptedData, userSignature)`

5. ✅ 实现 API `POST /preferences/upload`：加密 → 上传 IPFS（双 Pinning）

6. ✅ 实现 API `GET /preferences/:ipfsHash`

7. ✅ 在 `UserRegistry.sol` 添加：mapping `userPreferencesHash[address]`

8. ✅ 实现函数 `updatePreferencesHash(string memory ipfsHash)`

9. ✅ 测试：加密 → 上传 → 下载 → 解密，数据一致

10. ✅ 测试：上传延迟 < 5 秒

11. ✅ 文件大小限制：< 100 KB

---

## Technical Notes

**加密密钥派生:** EIP-712 签名 → PBKDF2 → AES-256 key

**依赖**: Story 1.6 (UserRegistry), Story 3.2 (IPFS)

---

**Story Status**: ✅ Ready

