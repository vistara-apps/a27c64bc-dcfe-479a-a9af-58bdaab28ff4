'use client';

import { WalletConnectButton } from './WalletConnectButton';

export function Header() {
  return (
    <header className="py-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold gradient-text">
            FairPlay Draws
          </h1>
          <p className="text-text-secondary text-sm">
            Your Transparent & Interactive Blockchain Lottery
          </p>
        </div>
        <WalletConnectButton />
      </div>
    </header>
  );
}
