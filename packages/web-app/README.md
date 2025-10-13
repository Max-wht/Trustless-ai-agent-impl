# @trustless/web-app

Next.js frontend application for Trustless SocialFi platform.

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Env

在本地创建 `.env.local`：

```bash
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
EOF
```

**环境变量说明：**

- `NEXT_PUBLIC_API_URL`: 后端 API 地址（默认 `http://localhost:3001`）
- `NEXT_PUBLIC_ALCHEMY_API_KEY`: Alchemy RPC API Key（从 [Alchemy](https://www.alchemy.com/) 获取）
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect Project ID（从 [WalletConnect Cloud](https://cloud.walletconnect.com/) 获取）

### Tech Stack

- Next.js 14（App Router）
- TypeScript（严格模式，monorepo 继承）
- Tailwind CSS 3 + tailwindcss-animate
- shadcn/ui（Button、Card）
- next/font（Inter、JetBrains Mono）
- RainbowKit + Wagmi（钱包连接）
- Arbitrum Sepolia（测试网）

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## Lint

```bash
pnpm lint
```
