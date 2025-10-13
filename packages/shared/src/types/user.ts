/**
 * User type definitions
 */

export interface User {
  id: string;
  walletAddress: `0x${string}`;
  username?: string | null;
  bio?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserProfile extends User {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  reputationScore?: number;
}

export interface CreateUserRequest {
  walletAddress: string;
  signature: string;
  username?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  username?: string;
  bio?: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
  txHash?: string;
}
