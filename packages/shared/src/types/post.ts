/**
 * Post type definitions
 */

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Post {
  id: string;
  userId: string;
  content: string;
  ipfsHash?: string | null;
  status: PostStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PostWithUser extends Post {
  user: {
    id: string;
    walletAddress: string;
    username?: string | null;
  };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export interface CreatePostRequest {
  content: string;
  ipfsHash?: string;
}

export interface UpdatePostRequest {
  content?: string;
  status?: PostStatus;
}

export interface PostResponse {
  success: boolean;
  post: Post;
}

export interface PostListResponse {
  success: boolean;
  posts: PostWithUser[];
  total: number;
  page: number;
  pageSize: number;
}
