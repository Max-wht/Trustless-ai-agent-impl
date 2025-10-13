import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';
import { http } from 'viem';
import { defineChain } from 'viem';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

// 定义 Anvil 本地链（Chain ID: 31337）
export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
});

export const config = getDefaultConfig({
  appName: 'Trustless SocialFi',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [anvil, arbitrumSepolia],
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'),
    [arbitrumSepolia.id]: http(
      alchemyApiKey ? `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : undefined
    ),
  },
  ssr: true,
});
