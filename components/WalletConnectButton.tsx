'use client';

import { useOnchainKit } from '@coinbase/onchainkit';
import { Wallet } from 'lucide-react';
import { formatAddress } from '../lib/utils';

export function WalletConnectButton() {
  const { address } = useOnchainKit();

  if (address) {
    return (
      <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg neon-border">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          {formatAddress(address)}
        </span>
      </div>
    );
  }

  return (
    <button
      className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      onClick={() => {
        // Wallet connection will be implemented when wallet integration is ready
        console.log('Wallet connection clicked - implement wallet integration');
      }}
    >
      <Wallet className="w-4 h-4" />
      <span className="text-sm font-medium">Connect Wallet</span>
    </button>
  );
}
