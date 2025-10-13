# Story 3.1: 内容发布智能合约（ContentRegistry）

**Epic**: Epic 3 - Content Publishing & IPFS Storage  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 智能合约开发者  
**I want** 开发内容注册合约（ContentRegistry），记录所有发布内容的 IPFS 哈希、作者、时间戳  
**So that** 内容元数据存储在链上，确保防篡改和永久可追溯，为后续审核系统提供数据基础

---

## Acceptance Criteria

1. ✅ 创建合约 `src/ContentRegistry.sol`

2. ✅ 定义 enum ContentStatus { Pending, Approved, Rejected }

3. ✅ 定义 struct Content：
   - uint256 id
   - address author
   - string ipfsHash
   - uint256 createdAt
   - uint256 likesCount
   - uint256 commentsCount
   - ContentStatus status

4. ✅ 实现函数 `publishContent(string memory ipfsHash)`：
   - 创建 Content 记录，status 设为 Approved（暂时直接通过）
   - 触发事件 `ContentPublished`

5. ✅ 实现函数 `getContent(uint256 contentId)` 返回内容信息

6. ✅ 实现函数 `getUserContents(address author)` 返回用户的所有内容 ID

7. ✅ 实现函数 `incrementLikes(uint256 contentId)` 和 `incrementComments(uint256 contentId)`

8. ✅ 编写完整测试 `test/ContentRegistry.t.sol`，覆盖率 > 90%

9. ✅ 运行 `forge test` 所有测试通过

10. ✅ 部署到本地 Anvil

11. ✅ 在 `packages/shared/src/constants/contracts.ts` 添加 ContentRegistry 地址

---

## Technical Notes

**注意:** Epic 3 暂时跳过审核流程，所有内容直接 Approved。Epic 4 将修改为 Pending 状态。

**依赖 / Dependencies**: Story 1.2 (Foundry)

---

**Story Status**: ✅ Ready for Development
