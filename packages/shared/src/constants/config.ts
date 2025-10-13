/**
 * Application configuration constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;

/**
 * Content Configuration
 */
export const CONTENT_CONFIG = {
  MAX_POST_LENGTH: 500,
  MAX_COMMENT_LENGTH: 280,
  MAX_BIO_LENGTH: 160,
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
} as const;

/**
 * Reputation Configuration
 */
export const REPUTATION_CONFIG = {
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  INITIAL_SCORE: 50,
  DECAY_RATE: 0.95, // 5% decay per week
} as const;

/**
 * Token Configuration
 */
export const TOKEN_CONFIG = {
  DECIMALS: 18,
  SYMBOL: 'TRUST',
  NAME: 'Trust Token',
  TOTAL_SUPPLY: '100000000', // 100 million
} as const;

/**
 * Agent Configuration
 */
export const AGENT_CONFIG = {
  MIN_STAKE_AMOUNT: '1000000000000000000', // 1 TRUST token in Wei
  SELECTION_COUNT: 5, // Number of agents selected for moderation
  MIN_CONFIDENCE: 0.7, // Minimum confidence score (70%)
  CONSENSUS_THRESHOLD: 0.6, // 60% agreement required
} as const;

/**
 * Time Constants (in milliseconds)
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Storage Keys (for localStorage/sessionStorage)
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'trustless_auth_token',
  WALLET_ADDRESS: 'trustless_wallet_address',
  USER_PREFERENCES: 'trustless_user_preferences',
  THEME: 'trustless_theme',
} as const;

/**
 * Regular Expressions
 */
export const REGEX = {
  ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  IPFS_HASH_V0: /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/,
  IPFS_HASH_V1: /^[a-z0-9]+$/,
} as const;
