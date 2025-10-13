# Story 6.4: 多钱包关联与偏好聚合

**Epic**: Epic 6 - User Preferences & Personalized Tag Management  
**Priority**: P2 - Medium  
**Story Points**: 8

---

## User Story

**As a** 用户  
**I want** 关联多个钱包地址（主钱包 + 子钱包），系统聚合所有钱包的行为数据生成统一的 Tag  
**So that** 我在不同设备使用不同钱包时，偏好数据保持一致

---

## Acceptance Criteria

1. ✅ 在 `UserRegistry.sol` 添加多钱包关联功能
2. ✅ 定义 mapping：`linkedWallets[mainWallet] = address[]`（最多 5 个）
3. ✅ 实现 `linkWallet(address subWallet, bytes memory signature)`
4. ✅ 修改 Tag 生成：聚合所有关联钱包的行为数据
5. ✅ 前端添加"关联钱包管理"区域
6. ✅ 测试：2 个钱包关联后生成统一 Tag

**依赖**: Story 6.3

**Story Status**: ✅ Ready
