# Story 1.5: RainbowKit 钱包连接集成

**Epic**: Epic 1 - Foundation & Core Infrastructure  
**Priority**: P0 - Critical  
**Story Points**: 5  
**Status**: Ready for Development

---

## User Story

**As a** 用户 / User  
**I want** 在欢迎页面点击"连接钱包"按钮，选择 MetaMask 或 WalletConnect，成功连接后显示我的钱包地址  
**So that** 我可以使用 Web3 身份登录 Trustless SocialFi，无需传统的用户名/密码

---

## Acceptance Criteria

1. ✅ 安装依赖：`wagmi`、`viem`、`@rainbow-me/rainbowkit`

2. ✅ 在 `app/providers.tsx` 创建 Wagmi + RainbowKit Providers：
   - 配置 Arbitrum Sepolia 链
   - 配置 Alchemy RPC
   - 配置支持的钱包（MetaMask、WalletConnect、Coinbase Wallet）

3. ✅ 在 `app/layout.tsx` 包裹 Providers

4. ✅ 在欢迎页面添加 RainbowKit `ConnectButton`

5. ✅ 点击"连接钱包"后，弹出钱包选择界面（RainbowKit Modal）

6. ✅ 选择 MetaMask，触发 MetaMask 弹窗，连接成功后：
   - Button 显示钱包地址（缩写格式：0x1234...5678）
   - 点击地址弹出 Account Modal（显示余额、断开连接按钮）

7. ✅ 刷新页面后，钱包状态保持（自动重连）

8. ✅ 断开钱包后，Button 恢复"连接钱包"状态

9. ✅ 在移动端测试 WalletConnect（扫码连接）成功

10. ✅ 配置 RainbowKit 主题（匹配 Trustless SocialFi 品牌色）

11. ✅ 钱包连接成功率 > 95%（测试 20 次连接）

---

## Technical Notes

**RainbowKit 主题配置:**

```typescript
import { darkTheme } from '@rainbow-me/rainbowkit';

<RainbowKitProvider
  theme={darkTheme({
    accentColor: '#2563EB',
    borderRadius: 'medium',
  })}
>
```

**依赖 / Dependencies**: Story 1.4 (Next.js 应用)  
**阻塞 / Blocks**: Story 1.6（用户注册需要钱包连接）

---

**Story Status**: ✅ Completed & Verified

**验证报告**: [查看详细验证报告](./story-1.5-verification-report.md)
