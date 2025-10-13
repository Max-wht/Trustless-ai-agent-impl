'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { formatAddress, formatRelativeTime } from '@trustless/shared';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export interface PostCardProps {
  id: string;
  author: {
    username?: string | null;
    walletAddress: string;
  };
  content: string;
  likesCount: number;
  commentsCount?: number;
  createdAt: Date | string;
  isLiked?: boolean;
}

export function PostCard({
  author,
  content,
  likesCount,
  commentsCount = 0,
  createdAt,
  isLiked = false,
}: PostCardProps) {
  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        {/* Author Info */}
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">
                {author.username || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">{formatAddress(author.walletAddress)}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{formatRelativeTime(createdAt)}</span>
            </div>

            {/* Post Content */}
            <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap break-words">{content}</p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-6">
              <button
                className={`flex items-center gap-1.5 text-sm transition ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition">
                <MessageCircle className="h-4 w-4" />
                <span>{commentsCount}</span>
              </button>

              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500 transition">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
