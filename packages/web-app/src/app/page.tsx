'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRegistration } from '@/hooks/useUserRegistration';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { isLoading, isRegistered, error, hasChecked, register } = useUserRegistration();

  // Auto-register when wallet connects
  useEffect(() => {
    // 只在首次检查完成、用户未注册、没有错误的情况下自动注册
    // hasChecked 确保我们已经检查过注册状态
    // !error 防止在用户拒绝签名后重复请求
    if (isConnected && hasChecked && !isRegistered && !isLoading && !error) {
      register();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, hasChecked, isRegistered, isLoading, error]);

  // Auto-redirect to feed when wallet is connected and user is registered
  useEffect(() => {
    if (isConnected && isRegistered) {
      router.push('/feed');
    }
  }, [isConnected, isRegistered, router]);

  return (
    <main className="min-h-screen">
      {/* Header with wallet connection */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Trustless SocialFi</h2>
          </div>
          <ConnectButton />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to Trustless SocialFi
          </h1>
          <p className="mt-4 text-lg text-gray-600 md:text-xl">Speak Freely, Trust Collectively</p>
        </div>

        {/* Registration Status */}
        {isLoading && (
          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">🔄 正在注册您的账户，请稍候...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">❌ 注册失败: {error}</p>
            <Button onClick={() => register()} variant="outline" size="sm" className="mt-2">
              重试
            </Button>
          </div>
        )}

        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>去中心化内容平台</CardTitle>
              <CardDescription>通过链上治理与多代理共识实现可信审核</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={!isConnected || !isRegistered}
                onClick={() => isConnected && isRegistered && router.push('/feed')}
              >
                {!isConnected ? '请先连接钱包' : !isRegistered ? '注册中...' : '开始体验'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>开放协议</CardTitle>
              <CardDescription>兼容 IPFS / DAO / EVM 扩展</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                查看文档
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
