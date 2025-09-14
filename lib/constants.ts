export const TICKET_PRICE = '0.001'; // ETH
export const BULK_DISCOUNTS = {
  5: 0.10,  // 10% discount for 5+ tickets
  10: 0.15, // 15% discount for 10+ tickets
};

export const DRAW_DURATION = 30000; // 30 seconds
export const ANIMATION_DURATION = 5000; // 5 seconds

export const CONTRACT_ADDRESSES = {
  LOTTERY: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT || '',
  NFT_TICKETS: process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
};

export const NETWORK_CONFIG = {
  chainId: 8453, // Base mainnet
  name: 'Base',
  currency: 'ETH',
};
