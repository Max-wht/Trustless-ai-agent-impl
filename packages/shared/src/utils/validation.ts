/**
 * Validation utilities
 */

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns true if valid Ethereum address
 */
export function validateEthAddress(address: string): boolean {
  if (!address) return false;

  // Check if it starts with 0x
  if (!address.startsWith('0x')) return false;

  // Check if it's 42 characters long (0x + 40 hex chars)
  if (address.length !== 42) return false;

  // Check if all characters after 0x are valid hex
  const hexPart = address.slice(2);
  return /^[0-9a-fA-F]{40}$/.test(hexPart);
}

/**
 * Validate IPFS hash format (CIDv0 or CIDv1)
 * @param hash - IPFS hash to validate
 * @returns true if valid IPFS hash
 */
export function validateIPFSHash(hash: string): boolean {
  if (!hash) return false;

  // CIDv0: starts with Qm and is 46 characters
  if (hash.startsWith('Qm') && hash.length === 46) {
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
  }

  // CIDv1: starts with b or z and is longer
  if ((hash.startsWith('b') || hash.startsWith('z')) && hash.length > 46) {
    return /^[a-z0-9]+$/.test(hash);
  }

  return false;
}

/**
 * Validate username format
 * @param username - Username to validate
 * @returns true if valid username (alphanumeric, underscores, 3-20 chars)
 */
export function validateUsername(username: string): boolean {
  if (!username) return false;
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Validate post content
 * @param content - Post content to validate
 * @param maxLength - Maximum length (default: 500)
 * @returns true if valid content
 */
export function validatePostContent(content: string, maxLength: number = 500): boolean {
  if (!content || typeof content !== 'string') return false;
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength;
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}
