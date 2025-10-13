'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Home, User, Settings } from 'lucide-react';

export function Navigation() {
  const { isConnected, address } = useAccount();

  return (
    <>
      {/* Desktop Navigation - Left Sidebar */}
      <nav className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white p-6 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold">Trustless</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            <Link
              href="/feed"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Feed</span>
            </Link>

            {isConnected && address && (
              <Link
                href={`/profile/${address}`}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
            )}

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          {/* Connect Button */}
          <div className="mt-auto">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
              T
            </div>
            <span className="font-bold">Trustless</span>
          </Link>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/feed"
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>

          {isConnected && address && (
            <Link
              href={`/profile/${address}`}
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600"
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          )}

          <Link
            href="/settings"
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
