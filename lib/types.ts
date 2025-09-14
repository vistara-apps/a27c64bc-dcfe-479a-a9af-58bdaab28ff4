export interface User {
  walletAddress: string;
  totalTicketsPurchased: number;
  totalWinnings: number;
}

export interface Draw {
  drawId: string;
  drawTimestamp: number;
  winningTicketId?: string;
  randomSeed?: string;
  blockHash?: string;
  status: 'upcoming' | 'active' | 'completed';
  prizePool: string;
  ticketPrice: string;
  totalTickets: number;
}

export interface Ticket {
  ticketId: string;
  drawId: string;
  ownerAddress: string;
  ticketNumber: number;
  isWinner: boolean;
  nftContractAddress?: string;
  tokenId?: string;
  purchaseTimestamp: number;
}

export interface DrawAnimationState {
  status: 'idle' | 'loading' | 'playing' | 'complete';
  winningNumber?: number;
  duration: number;
}
