# Environment Variables Setup Guide

## Web App (.env.local)

Create `packages/web-app/.env.local` with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# Contract Addresses (update after deployment)
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_HEALTH_CHECK_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Alchemy API Key (optional, for production RPC)
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key_here
```

## Agent Service (.env)

Create `packages/agent-service/.env` with the following variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trustless_dev

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3001
NODE_ENV=development

# Blockchain
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# JWT
JWT_SECRET=your_secret_key_min_32_characters_long

# IPFS (optional for now)
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

## Vercel Environment Variables

When deploying to Vercel, configure these variables in the Vercel dashboard:

### Production

- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_CHAIN_ID` - 42161 (Arbitrum One)
- `NEXT_PUBLIC_RPC_URL` - Arbitrum RPC URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Your project ID
- Contract addresses (production deployments)

### Preview/Staging

- `NEXT_PUBLIC_API_URL` - Staging API URL
- `NEXT_PUBLIC_CHAIN_ID` - 421614 (Arbitrum Sepolia)
- `NEXT_PUBLIC_RPC_URL` - Arbitrum Sepolia RPC URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Your project ID
- Contract addresses (testnet deployments)

## GitHub Secrets

Configure these secrets in GitHub Settings → Secrets and variables → Actions:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `AWS_ACCESS_KEY_ID` - For backend deployment (future)
- `AWS_SECRET_ACCESS_KEY` - For backend deployment (future)
