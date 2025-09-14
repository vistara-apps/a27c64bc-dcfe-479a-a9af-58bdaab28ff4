'use client';

import { useState } from 'react';
import { useMiniKit } from '@worldcoin/minikit-react';
import { Wallet, Loader2 } from 'lucide-react';
import { formatAddress } from '../lib/utils';

export function WalletConnectButton() {
  const { context } = useMiniKit();
  const { user } = useAuthenticate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Connection logic will be handled by MiniKit
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (user?.address) {
    return (
      <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg neon-border">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          {formatAddress(user.address)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </button>
  );
}
