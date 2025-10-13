'use client';

import { useAccount } from 'wagmi';
import { Navigation } from '@/components/Navigation';
import { PostCard, PostCardProps } from '@/components/PostCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for placeholder posts
const mockPosts: PostCardProps[] = [
  {
    id: '1',
    author: {
      username: 'alice.eth',
      walletAddress: '0x1111111111111111111111111111111111111111',
    },
    content:
      'Welcome to Trustless SocialFi! 🎉\n\nThis is a decentralized content moderation platform powered by blockchain and AI agents.',
    likesCount: 42,
    commentsCount: 8,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    author: {
      username: 'bob.eth',
      walletAddress: '0x2222222222222222222222222222222222222222',
    },
    content:
      'Just deployed my first smart contract on Arbitrum! The future of social media is decentralized. 🚀',
    likesCount: 28,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isLiked: true,
  },
  {
    id: '3',
    author: {
      username: null,
      walletAddress: '0x3333333333333333333333333333333333333333',
    },
    content:
      'Exploring the possibilities of on-chain governance and community-driven content moderation. This platform is really interesting!',
    likesCount: 15,
    commentsCount: 3,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function FeedPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content - Three Column Layout */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 p-4 pt-16 lg:grid-cols-12 lg:pt-6 pb-20 lg:pb-6">
            {/* Main Feed Column */}
            <main className="lg:col-span-7 xl:col-span-6">
              <div className="space-y-4">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Welcome to Your Feed</CardTitle>
                    <CardDescription className="text-blue-100">
                      {isConnected
                        ? 'Here you will see posts from people you follow'
                        : 'Connect your wallet to start exploring'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-50">
                      This is a placeholder timeline. Real posts will appear here once you start
                      following other users.
                    </p>
                  </CardContent>
                </Card>

                {/* Connection Status */}
                {!isConnected && (
                  <Card className="border-yellow-300 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔒</span>
                        <div>
                          <p className="font-semibold text-sm text-yellow-900">
                            Connect Your Wallet
                          </p>
                          <p className="text-xs text-yellow-700">
                            Please connect your wallet to view and interact with posts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mock Posts */}
                {isConnected ? (
                  mockPosts.map((post) => <PostCard key={post.id} {...post} />)
                ) : (
                  // Show skeleton when not connected
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </main>

            {/* Right Sidebar - Hidden on mobile */}
            <aside className="hidden lg:col-span-5 lg:block xl:col-span-4 xl:col-start-9">
              <div className="sticky top-6 space-y-4">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition cursor-pointer">
                        <p className="text-sm font-semibold">#Web3</p>
                        <p className="text-xs text-gray-500">1,234 posts</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition cursor-pointer">
                        <p className="text-sm font-semibold">#Decentralization</p>
                        <p className="text-xs text-gray-500">892 posts</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition cursor-pointer">
                        <p className="text-sm font-semibold">#Arbitrum</p>
                        <p className="text-xs text-gray-500">567 posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Who to Follow */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Who to Follow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['vitalik.eth', 'satoshi.eth', 'crypto.eth'].map((username) => (
                        <div key={username} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600" />
                            <span className="text-sm font-medium">{username}</span>
                          </div>
                          <button className="rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white hover:bg-blue-700 transition">
                            Follow
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500">
                      © 2025 Trustless SocialFi
                      <br />
                      Decentralized content moderation platform
                    </p>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
