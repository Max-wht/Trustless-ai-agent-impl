import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trustless SocialFi',
  description: 'Decentralized content moderation platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
