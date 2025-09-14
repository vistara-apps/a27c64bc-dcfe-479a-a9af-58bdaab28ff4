'use client';

import { useState } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { useAuthenticate, useSmartWallet } from '@coinbase/onchainkit/minikit';
import { Wallet, Loader2, ExternalLink } from 'lucide-react';
import { formatAddress } from '../lib/utils';

export function WalletConnectButton() {
  const { context } = useMiniKit();
  const { user, authenticate, logout } = useAuthenticate();
  const { smartWallet } = useSmartWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await authenticate();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  if (user?.address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg neon-border">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {formatAddress(user.address)}
          </span>
          {smartWallet && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
              Smart Wallet
            </span>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm">Disconnect</span>
        </button>
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
