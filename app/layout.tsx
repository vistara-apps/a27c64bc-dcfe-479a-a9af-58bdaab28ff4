import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FairPlay Draws - Transparent Blockchain Lottery',
  description: 'Your Transparent & Interactive Blockchain Lottery on Base',
  keywords: ['lottery', 'blockchain', 'Base', 'NFT', 'fair', 'transparent'],
  openGraph: {
    title: 'FairPlay Draws',
    description: 'Your Transparent & Interactive Blockchain Lottery',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
