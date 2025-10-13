/**
 * Contract addresses and ABIs
 */

export const CHAIN_IDS = {
  ANVIL_LOCAL: 31337,
  ARBITRUM_SEPOLIA: 421614,
  ARBITRUM_ONE: 42161,
} as const;

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];

/**
 * Contract addresses by chain ID
 */
export const CONTRACT_ADDRESSES: Record<
  ChainId,
  {
    UserRegistry?: `0x${string}`;
    HealthCheck?: `0x${string}`;
    TrustToken?: `0x${string}`;
    AgentRegistry?: `0x${string}`;
    ContentRegistry?: `0x${string}`;
  }
> = {
  // Anvil Local Development
  [CHAIN_IDS.ANVIL_LOCAL]: {
    UserRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    HealthCheck: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Arbitrum Sepolia Testnet
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: {
    // Add deployed contract addresses here
  },
  // Arbitrum One Mainnet
  [CHAIN_IDS.ARBITRUM_ONE]: {
    // Add deployed contract addresses here
  },
};

/**
 * Get contract address for current chain
 */
export function getContractAddress(
  chainId: ChainId,
  contractName: keyof (typeof CONTRACT_ADDRESSES)[ChainId]
): `0x${string}` | undefined {
  return CONTRACT_ADDRESSES[chainId]?.[contractName];
}

/**
 * Default chain ID (for development)
 */
export const DEFAULT_CHAIN_ID: ChainId = CHAIN_IDS.ANVIL_LOCAL;

/**
 * RPC URLs
 */
export const RPC_URLS: Record<ChainId, string> = {
  [CHAIN_IDS.ANVIL_LOCAL]: 'http://127.0.0.1:8545',
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: 'https://sepolia-rollup.arbitrum.io/rpc',
  [CHAIN_IDS.ARBITRUM_ONE]: 'https://arb1.arbitrum.io/rpc',
};
