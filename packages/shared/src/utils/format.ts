/**
 * Formatting utilities
 */

/**
 * Format Ethereum address to shortened format
 * @example formatAddress("0x1234567890abcdef1234567890abcdef12345678") => "0x1234...5678"
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format token amount from Wei to human-readable format
 * @param amount - Amount in Wei (bigint or string)
 * @param decimals - Number of decimals (default: 18)
 */
export function formatTokenAmount(amount: bigint | string, decimals: number = 18): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const whole = amountBigInt / divisor;
  const remainder = amountBigInt % divisor;

  if (remainder === BigInt(0)) {
    return whole.toString();
  }

  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  return `${whole}.${trimmedRemainder}`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @example formatNumber(1234567) => "1.23M"
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)}M`;
  return `${(num / 1000000000).toFixed(2)}B`;
}
