'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Blockies from 'react-blockies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  walletAddress: string;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const { address: connectedAddress } = useAccount();
  const profileAddress = params.address as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = connectedAddress?.toLowerCase() === profileAddress?.toLowerCase();

  // Fetch user data
  useEffect(() => {
    if (!profileAddress) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/users/${profileAddress}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('用户不存在');
          } else {
            setError('加载用户信息失败');
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [profileAddress]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <a href="/" className="text-xl font-bold hover:text-blue-600">
              Trustless SocialFi
            </a>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Profile Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Error State - 404 */}
        {!isLoading && error && (
          <Card className="mx-auto max-w-2xl">
            <CardContent className="py-12 text-center">
              <div className="mb-4 text-6xl">😕</div>
              <h2 className="mb-2 text-2xl font-bold">用户未找到</h2>
              <p className="mb-6 text-gray-600">{error}</p>
              <Button onClick={() => (window.location.href = '/')}>返回首页</Button>
            </CardContent>
          </Card>
        )}

        {/* User Profile */}
        {!isLoading && !error && user && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                  {/* Avatar */}
                  <Avatar className="h-24 w-24">
                    <AvatarFallback>
                      <Blockies
                        seed={user.walletAddress.toLowerCase()}
                        size={10}
                        scale={8}
                        className="rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="mb-2 text-3xl font-bold">{user.username || '匿名用户'}</h1>
                    <p className="mb-2 font-mono text-sm text-gray-500">{user.walletAddress}</p>
                    {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}

                    {/* Stats */}
                    <div className="mt-4 flex flex-wrap justify-center gap-6 md:justify-start">
                      <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-500">关注</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-500">粉丝</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-500">信誉评分</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                      {isOwnProfile ? (
                        <Button variant="default" disabled>
                          编辑个人资料（即将推出）
                        </Button>
                      ) : (
                        <Button variant="default" disabled>
                          关注（Epic 3 实现）
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Cards - Responsive Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle>账户详情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">注册时间</h3>
                    <p className="mt-1 text-base">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">最后更新</h3>
                    <p className="mt-1 text-base">{formatDate(user.updatedAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">用户 ID</h3>
                    <p className="mt-1 font-mono text-sm">{user.id}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>活动统计</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">发布内容</h3>
                    <p className="mt-1 text-base">0 篇（Epic 3 实现）</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">审核参与</h3>
                    <p className="mt-1 text-base">0 次（Epic 4 实现）</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">DAO 投票</h3>
                    <p className="mt-1 text-base">0 次（Epic 7 实现）</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success Message for Own Profile */}
            {isOwnProfile && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="py-4">
                  <p className="text-center text-sm text-green-800">
                    ✅ 注册成功！这是您的个人主页。
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
