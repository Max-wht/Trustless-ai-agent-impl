import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as fs from 'fs';
import * as path from 'path';

// Load ABI dynamically
const UserRegistryABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abis/UserRegistry.json'), 'utf-8')
);

// Contract address (from deployments.json)
export const USER_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const;

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

// Public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://localhost:8545'),
});

// Wallet client for writing to blockchain (using Anvil default account)
const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
);

export const walletClient = createWalletClient({
  account,
  chain: anvil,
  transport: http('http://localhost:8545'),
});

// Type-safe contract interface
export const userRegistryContract = {
  address: USER_REGISTRY_ADDRESS,
  abi: UserRegistryABI,
} as const;

/**
 * Call registerUser on the UserRegistry contract
 */
export async function registerUserOnChain(
  userAddress: `0x${string}`,
  username: string = '',
  bio: string = ''
): Promise<`0x${string}`> {
  const hash = await walletClient.writeContract({
    ...userRegistryContract,
    functionName: 'registerUser',
    args: [username, bio],
    account: userAddress,
  });

  // Wait for transaction to be mined
  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}

/**
 * Check if a user is registered on-chain
 */
export async function isUserRegisteredOnChain(userAddress: `0x${string}`): Promise<boolean> {
  const isRegistered = await publicClient.readContract({
    ...userRegistryContract,
    functionName: 'isRegistered',
    args: [userAddress],
  });

  return isRegistered as boolean;
}

/**
 * Get user profile from chain
 */
export async function getUserProfileFromChain(userAddress: `0x${string}`) {
  const profile = await publicClient.readContract({
    ...userRegistryContract,
    functionName: 'getUserProfile',
    args: [userAddress],
  });

  return profile;
}
