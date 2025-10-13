import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

export const metadata: Metadata = {
  title: 'Trustless SocialFi',
  description: 'Decentralized content moderation platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
