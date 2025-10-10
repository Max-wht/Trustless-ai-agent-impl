# Epic 3: Content Publishing & IPFS Storage

## Epic Goal

实现用户内容发布和去中心化存储功能。用户可以发布文本帖子（≤ 280 字符），内容存储在 IPFS，哈希值记录在智能合约。实现时间线展示（查看关注用户的内容）和基础社交互动（关注、点赞、评论）。**注意：此 Epic 暂时跳过 Agent 审核流程**（Epic 4 添加），所有内容直接发布，以便快速验证社交功能和 IPFS 集成。此 Epic 完成后，平台具备完整的社交媒体基础功能。

## Story 3.1: 内容发布智能合约（ContentRegistry）

As a **智能合约开发者**,  
I want **开发内容注册合约（ContentRegistry），记录所有发布内容的 IPFS 哈希、作者、时间戳**,  
so that **内容元数据存储在链上，确保防篡改和永久可追溯，为后续审核系统提供数据基础**。

### Acceptance Criteria

1. 创建合约 `src/ContentRegistry.sol`
2. 定义 enum ContentStatus { Pending, Approved, Rejected }
3. 定义 struct Content：uint256 id、address author、string ipfsHash、uint256 createdAt、uint256 likesCount、uint256 commentsCount、ContentStatus status
4. 实现函数 `publishContent(string memory ipfsHash)`：创建 Content 记录，status 设为 Approved（暂时直接通过），触发事件 `ContentPublished`
5. 实现函数 `getContent(uint256 contentId)` 返回内容信息
6. 实现函数 `getUserContents(address author)` 返回用户的所有内容 ID
7. 实现函数 `incrementLikes(uint256 contentId)` 和 `incrementComments(uint256 contentId)`
8. 编写完整测试 `test/ContentRegistry.t.sol`，覆盖率 > 90%
9. 运行 `forge test` 所有测试通过
10. 部署到本地 Anvil
11. 在 `packages/shared/src/constants/contracts.ts` 添加 ContentRegistry 地址

## Story 3.2: 后端 IPFS 内容上传服务

As a **后端开发者**,  
I want **实现 IPFS 内容上传服务，接收文本内容，上传到 Pinata 和 Web3.Storage（双备份），返回 IPFS 哈希**,  
so that **用户发布的内容可以存储在去中心化网络，确保永久可访问和防审查**。

### Acceptance Criteria

1. 安装依赖：`@pinata/sdk`、`web3.storage`
2. 配置环境变量：`PINATA_API_KEY`、`PINATA_SECRET_KEY`、`WEB3_STORAGE_TOKEN`
3. 在 `src/lib/ipfs.ts` 创建 IPFS 服务：`uploadToPinata`、`uploadToWeb3Storage`、`uploadContent`（并行上传到两个服务）
4. 实现 API 端点 `POST /ipfs/upload`：接收 `{ content: string }`、调用 `uploadContent()`、返回 IPFS 哈希和 URL
5. 实现 API 端点 `GET /ipfs/:hash`：从 Pinata 或 Web3.Storage 检索内容、缓存到 Redis（TTL 1 小时）
6. 实现内容验证：长度 ≤ 280 字符、内容不为空、过滤恶意字符（XSS 防护）
7. 测试：上传一段文本，返回 IPFS 哈希
8. 测试：使用返回的哈希调用 `GET /ipfs/:hash`，返回原始内容
9. 测试：上传延迟 < 10 秒（P95）
10. 错误处理：Pinata 或 Web3.Storage 故障，至少一个成功即可
11. 在 `README.md` 记录 IPFS API 使用方法

## Story 3.3: 内容发布前端界面与流程

As a **用户**,  
I want **在时间线页面点击"发布"按钮，弹出发帖界面，输入内容（≤ 280 字符），点击发布后内容上传到 IPFS 并记录到区块链**,  
so that **我可以在平台上发表想法，内容存储在去中心化网络，永久可访问**。

### Acceptance Criteria

1. 在时间线页面添加"发布"浮动按钮（fixed position，右下角，shadcn Button）
2. 点击后打开 shadcn Dialog（发帖弹窗）
3. 弹窗内容：Textarea 输入框（自动聚焦）、字符计数器（"125/280"）、"发布"和"取消"按钮
4. 超过 280 字符，计数器变红，禁用发布按钮
5. 实现发布流程（React Hook Form）：调用后端 `POST /ipfs/upload` → 获得 IPFS 哈希 → 调用智能合约 `ContentRegistry.publishContent(ipfsHash)`
6. 显示发布进度（shadcn Progress）："正在上传到 IPFS..." → "正在提交到区块链..." → "等待交易确认..."
7. 发布成功后：显示成功 Toast、关闭弹窗、刷新时间线
8. 发布失败后：显示错误信息、保留用户输入内容
9. 快捷键：Ctrl/Cmd + Enter 快速发布
10. 移动端：全屏 Modal
11. 整个发布流程 < 30 秒

## Story 3.4: 时间线内容展示（真实数据）

As a **用户**,  
I want **在时间线查看我关注用户的最新帖子（从 IPFS 加载内容），按时间倒序排列，支持无限滚动加载**,  
so that **我可以消费内容，了解社区动态**。

### Acceptance Criteria

1. 后端实现 API 端点 `GET /feed`：查询当前用户关注的用户列表、查询这些用户的最新内容、按时间倒序、支持分页、返回内容列表
2. 前端修改 `app/feed/page.tsx`：调用 `GET /feed`、遍历内容调用 `GET /ipfs/:hash` 获取文本、显示帖子卡片（头像、用户名、内容、时间、点赞/评论数）
3. 实现无限滚动（Intersection Observer）：滚动到底部自动加载下一页
4. 未关注任何人时，显示"发现"Feed
5. 实现下拉刷新（移动端）
6. 加载状态：显示 Skeleton 帖子卡片
7. 空状态：无内容时显示引导信息
8. 性能：加载 20 条内容 < 2 秒
9. IPFS 内容缓存
10. 错误处理：IPFS 加载失败显示占位

## Story 3.5: 关注功能（Follow/Unfollow）

As a **用户**,  
I want **在其他用户的个人主页点击"关注"按钮，关注成功后按钮变为"已关注"，我的关注列表增加该用户**,  
so that **我可以在时间线看到我关注用户的内容，建立社交关系**。

### Acceptance Criteria

1. 创建智能合约 `src/SocialGraph.sol`
2. 定义 mapping：`following[follower][following] = bool`
3. 实现函数：`follow(address userToFollow)`、`unfollow(address userToUnfollow)`、`isFollowing`、`getFollowing`、`getFollowers`
4. 检查：不能关注自己、不能重复关注
5. 触发事件 `Followed(address indexed follower, address indexed following)`
6. 编写测试 `test/SocialGraph.t.sol`，覆盖率 > 90%
7. 部署到本地 Anvil
8. 后端实现 API：`POST /users/:address/follow`、`DELETE /users/:address/follow`、`GET /users/:address/following`、`GET /users/:address/followers`
9. 前端在个人主页添加"关注"按钮：未关注显示"关注"、已关注显示"已关注"（hover 变"取消关注"）
10. 点击后调用合约交易，交易确认后更新 UI 和关注/粉丝数
11. 在个人主页显示关注/粉丝数（可点击查看列表）
12. 错误处理：交易失败、重复关注、关注自己

## Story 3.6: 点赞功能（Like/Unlike）

As a **用户**,  
I want **在时间线或个人主页点击帖子的"点赞"按钮，点赞成功后按钮高亮，点赞数 +1**,  
so that **我可以表达对内容的喜欢，帮助优质内容获得更多曝光**。

### Acceptance Criteria

1. 在 `SocialGraph.sol` 添加点赞功能：mapping `likes[contentId][user] = bool`、函数 `likeContent`、`unlikeContent`、`hasLiked`、`getLikesCount`
2. 点赞时调用 `ContentRegistry.incrementLikes(contentId)`
3. 编写测试，覆盖率 > 90%
4. 后端实现 API：`POST /posts/:id/like`、`DELETE /posts/:id/like`，同时更新数据库 Post 表的 likesCount
5. 前端在帖子卡片添加点赞按钮（Heart 图标 + 数字）：未点赞灰色空心、已点赞红色实心 + 动画
6. 点击后调用 API，乐观更新 UI
7. 使用 wagmi `useWriteContract` 提交交易
8. 点赞数实时更新
9. 移动端：Haptic Feedback
10. 测试：点赞 → 取消点赞 → 再点赞，状态和计数正确

## Story 3.7: 评论功能（Comment）

As a **用户**,  
I want **在帖子下方点击"评论"按钮，输入评论文本（≤ 280 字符），发布后评论显示在帖子下方**,  
so that **我可以与内容作者互动，参与讨论**。

### Acceptance Criteria

1. 扩展 Prisma schema：Comment 表（id、postId FK、authorId FK、content、ipfsHash、createdAt）
2. 评论上传到 IPFS，哈希存储在数据库
3. 后端实现 API：`POST /posts/:id/comments`（上传 IPFS、存数据库、调用 `ContentRegistry.incrementComments()`）、`GET /posts/:id/comments`（返回评论列表，分页）
4. 前端在帖子卡片添加"评论"按钮和评论数
5. 点击后展开评论区域（Collapsible）：现有评论列表（最多 3 条）、评论输入框、"发表评论"按钮
6. 发表评论流程：上传 IPFS → API 创建评论 → 合约交易 → 显示在列表
7. 评论显示：作者头像 + 用户名、文本、时间
8. 响应式：移动端评论输入框全屏 Modal
9. 加载状态：Skeleton
10. 空状态："成为第一个评论的人！"

## Story 3.8: 帖子详情页

As a **用户**,  
I want **点击帖子内容，打开帖子详情页，查看完整的帖子信息、所有评论、点赞用户列表**,  
so that **我可以深入查看帖子的完整上下文和社区讨论**。

### Acceptance Criteria

1. 创建页面 `app/posts/[id]/page.tsx`
2. 从 URL 参数获取帖子 ID
3. 调用后端 API `GET /posts/:id`，获取帖子详情
4. 页面布局：导航栏（返回按钮）、帖子完整内容、评论列表、评论输入框（固定底部）
5. 点赞按钮和评论按钮（功能同 Story 3.6、3.7）
6. 评论列表：每页 20 条、按时间正序、shadcn Pagination
7. 点击点赞数，弹出 Dialog 显示点赞用户列表
8. 分享功能：复制链接按钮
9. 响应式：移动端全屏
10. 加载状态：Skeleton
11. 错误处理：帖子不存在，显示 404

## Story 3.9: 发现 Feed（所有用户内容）

As a **新用户**（未关注任何人）,  
I want **在时间线查看"发现"Feed，显示所有用户的最新内容，帮助我发现感兴趣的创作者**,  
so that **我可以快速找到值得关注的用户，建立社交网络**。

### Acceptance Criteria

1. 修改时间线页面，添加 Tab 切换（shadcn Tabs）："关注" Tab、"发现" Tab
2. 后端实现 API `GET /posts/discover`：查询所有用户的最新内容、按时间倒序、支持分页
3. "发现" Tab 显示所有内容，格式同"关注" Feed
4. 默认显示"关注" Tab，未关注任何人时自动切换到"发现"
5. 实现内容去重（不显示自己的内容）
6. 性能：加载 20 条内容 < 2 秒
7. Tab 切换动画流畅
8. 移动端：Tab 在顶部固定
9. 记住用户的 Tab 选择（localStorage）

## Story 3.10: 用户搜索与关注推荐

As a **用户**,  
I want **搜索其他用户（通过地址或用户名），查看搜索结果，点击进入用户主页并关注**,  
so that **我可以找到感兴趣的创作者，扩展我的社交网络**。

### Acceptance Criteria

1. 在导航栏添加搜索框（shadcn Input + Command）
2. 后端实现 API `GET /users/search?q=query`：按用户名或地址搜索、模糊匹配、返回匹配用户列表（最多 10 个）
3. 前端实现搜索：输入 3 个字符后自动搜索（debounce 300ms）、显示结果下拉列表（shadcn Command）
4. 点击搜索结果，跳转到用户主页
5. 搜索框快捷键：Ctrl/Cmd + K
6. 移动端：搜索为单独页面
7. 搜索历史（localStorage，最多 10 个）
8. 空状态：无结果时显示"未找到匹配用户"
9. 加载状态：Loading 图标
10. 性能：搜索响应 < 500ms

---
