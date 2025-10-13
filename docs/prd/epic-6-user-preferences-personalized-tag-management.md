# Epic 6: User Preferences & Personalized Tag Management

## Epic Goal

实现用户偏好的 IPFS 去中心化存储和个性化 Tag 管理系统。用户行为数据（点赞、评论、关注）加密后存储在 IPFS，系统自动生成个性化 Tag（如："DeFi 爱好者"、"政治评论关注者"），用户可在"我的偏好"页面查看、编辑、删除、合并 Tag。支持多钱包关联、跨设备同步、隐私模式。此 Epic 为 Phase 2 的个性化推荐系统奠定数据基础，同时展示"数据主权 + 算法透明"的核心价值。

## Story 6.1: 用户偏好数据加密与 IPFS 存储

As a **后端开发者**,  
I want **实现用户偏好数据的 IPFS 加密存储服务，使用用户钱包签名派生的 AES-256 密钥加密，双 Pinning 备份**,  
so that **用户偏好数据去中心化存储，用户完全控制数据，跨设备同步，隐私得到保护**。

### Acceptance Criteria

1. 在 `src/services/preferences.ts` 创建偏好管理服务
2. 定义偏好数据结构（TypeScript interface）：
   ```typescript
   interface UserPreferences {
     tags: PersonalizedTag[];
     behaviorData: {
       likedPosts: string[];
       commentedPosts: string[];
       followedUsers: string[];
     };
     privacy: {
       mode: 'public' | 'private';
       allowTagGeneration: boolean;
     };
     metadata: {
       version: string;
       lastUpdated: number;
     };
   }
   ```
3. 实现函数 `encryptPreferences(data: UserPreferences, userSignature: string)`：
   - 使用 EIP-712 签名派生 AES-256 密钥
   - 加密偏好数据（crypto-js）
   - 返回加密的 Buffer
4. 实现函数 `decryptPreferences(encryptedData: Buffer, userSignature: string)`：
   - 派生相同密钥
   - 解密数据
   - 返回 UserPreferences 对象
5. 实现 API 端点 `POST /preferences/upload`：
   - 接收 `{ preferences: UserPreferences, signature: string }`
   - 加密数据
   - 并行上传到 Pinata 和 Web3.Storage
   - 返回 IPFS 哈希
6. 实现 API 端点 `GET /preferences/:ipfsHash`：
   - 从 IPFS 下载加密数据
   - 返回给前端（前端负责解密）
7. 在 `UserRegistry.sol` 添加：mapping `userPreferencesHash[address] = string`（存储 IPFS 哈希）
8. 实现函数 `updatePreferencesHash(string memory ipfsHash)`：用户更新偏好哈希
9. 测试：加密 → 上传 IPFS → 下载 → 解密，数据一致
10. 测试：上传延迟 < 5 秒
11. 文件大小限制：< 100 KB

## Story 6.2: 个性化 Tag 自动生成服务

As a **后端开发者**,  
I want **开发 Tag 生成服务，分析用户行为（点赞的内容主题、关注的用户类型），自动生成个性化 Tag（名称、权重、来源说明）**,  
so that **用户可以直观了解自己的兴趣偏好，为 Phase 2 的推荐系统提供数据基础**。

### Acceptance Criteria

1. 在 `src/services/tagGenerator.ts` 创建 Tag 生成服务
2. 定义 Tag 接口：
   ```typescript
   interface PersonalizedTag {
     id: string;
     name: string;
     weight: number; // 0-100
     source: string; // 生成来源说明
     generatedAt: number;
   }
   ```
3. 实现函数 `generateTagsFromBehavior(userId: string)`：
   - 读取用户最近 3 个月的行为数据（点赞、评论、关注）
   - 分析点赞内容的主题（使用简单的关键词提取）
   - 分析关注用户的类型（查看他们的简介关键词）
   - 生成 Tag 列表（最多 20 个）
4. Tag 生成规则（示例）：
   - 点赞 > 10 条 DeFi 相关内容 → 生成 Tag "DeFi 爱好者"，权重 = 点赞数 / 总点赞数 × 100
   - 关注 > 5 个政治评论员 → 生成 Tag "政治评论关注者"
   - 点赞 > 5 条 NFT 内容 → 生成 Tag "NFT 收藏者"
5. 实现 API 端点 `POST /preferences/generate-tags`：
   - 接收 `{ userId: string }`
   - 调用 `generateTagsFromBehavior()`
   - 返回生成的 Tag 列表
6. 实现定时任务（Bull）：每周为所有活跃用户生成 Tag
7. 测试：用户点赞 15 条 DeFi 内容 → 生成"DeFi 爱好者" Tag，权重 75
8. 测试：Tag 生成响应 < 3 秒
9. 测试：生成的 Tag 准确性（人工验证 10 个用户）
10. 在数据库记录 Tag 生成日志（用于优化算法）

## Story 6.3: "我的偏好"管理页面

As a **用户**,  
I want **访问"我的偏好"页面，查看所有自动生成的个性化 Tag（卡片形式，显示权重、来源、生成时间），可以删除、编辑、合并 Tag**,  
so that **我可以管理自己的偏好数据，删除不准确的 Tag，体验"数据主权"**。

### Acceptance Criteria

1. 创建页面 `app/preferences/page.tsx`
2. 页面加载时：
   - 从智能合约读取用户偏好 IPFS 哈希
   - 从 IPFS 下载加密数据
   - 请求用户签名以解密
   - 显示所有 Tag
3. 使用 shadcn Card 展示每个 Tag：
   - Emoji 图标（根据 Tag 类型自动选择）
   - Tag 名称（大字号）
   - 权重条（shadcn Progress，颜色根据权重变化）
   - 来源说明（"点赞了 42 条 DeFi 相关内容"）
   - 生成日期（相对时间）
   - 操作按钮：编辑、删除
4. 实现 Tag 删除：
   - 点击删除按钮 → 确认弹窗（shadcn Alert Dialog）
   - 用户确认 → 请求签名 → 从偏好数据中移除 Tag → 重新加密 → 上传 IPFS → 更新智能合约哈希
   - 显示 Toast："Tag 已删除"
   - 刷新页面显示更新后的 Tag 列表
5. 实现 Tag 编辑：
   - 点击编辑按钮 → 弹出 Dialog（输入框）
   - 用户修改 Tag 名称 → 保存 → 重新加密上传
6. 实现 Tag 合并：
   - 多选模式（Checkbox）
   - 选择 2+ 个 Tag → 点击"合并"按钮
   - 弹出 Dialog：输入合并后的 Tag 名称，权重 = sum(选中 Tag 的权重)
   - 保存后删除原 Tag，创建新 Tag
7. 显示统计信息：
   - Tag 总数
   - 最后更新时间
   - IPFS 哈希（可点击查看原始数据）
8. 显示"数据主权"信息框：
   - "您的数据加密存储在 IPFS"
   - "只有您能访问（通过钱包签名）"
   - "删除 Tag 不影响已发布的内容"
9. 提供"导出偏好"和"导入偏好"按钮（FR40）
10. 提供"隐私模式"开关（FR41）
11. 提供"删除所有偏好数据"按钮（需二次确认）

## Story 6.4: 多钱包关联与偏好聚合

As a **用户**,  
I want **关联多个钱包地址（主钱包 + 子钱包），系统聚合所有关联钱包的行为数据生成统一的 Tag**,  
so that **我在不同设备使用不同钱包时，偏好数据保持一致，不会分裂**。

### Acceptance Criteria

1. 在 `UserRegistry.sol` 添加多钱包关联功能
2. 定义 mapping：`linkedWallets[mainWallet] = address[]`（最多 5 个子钱包）
3. 实现函数 `linkWallet(address subWallet, bytes memory signature)`：
   - 验证 subWallet 的签名（证明拥有该钱包）
   - 添加到主钱包的关联列表
   - 触发事件 `WalletLinked(address indexed mainWallet, address indexed subWallet)`
4. 实现函数 `unlinkWallet(address subWallet)`
5. 实现函数 `getLinkedWallets(address mainWallet)` 返回所有关联钱包
6. 修改 Tag 生成逻辑：
   - 读取主钱包 + 所有子钱包的行为数据
   - 聚合生成统一的 Tag
7. 前端在"我的偏好"页面添加"关联钱包管理"区域：
   - 显示所有已关联的钱包（地址缩写 + 关联时间）
   - "添加钱包"按钮（弹出 Dialog，连接钱包 + 签名）
   - "移除"按钮（每个子钱包旁边）
8. 实现添加钱包流程：
   - 用户切换到子钱包（MetaMask 切换账户）
   - 点击"添加钱包"
   - 使用子钱包签名消息："Link to [主钱包地址]"
   - 调用智能合约 `linkWallet()`
9. 测试：用户有 2 个钱包，钱包 A 点赞 DeFi，钱包 B 点赞 NFT → 关联后生成两个 Tag
10. 显示关联钱包数量限制（最多 5 个）

---
