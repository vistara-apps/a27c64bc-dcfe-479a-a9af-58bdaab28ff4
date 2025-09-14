'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, TICKET_PRICE } from '../constants';
import { Draw, Ticket } from '../types';

const LOTTERY_ABI = [
  {
    inputs: [{ name: 'drawId', type: 'uint256' }],
    name: 'getDraw',
    outputs: [
      {
        components: [
          { name: 'drawId', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'ticketPrice', type: 'uint256' },
          { name: 'prizePool', type: 'uint256' },
          { name: 'totalTickets', type: 'uint256' },
          { name: 'winningTicketId', type: 'uint256' },
          { name: 'randomSeed', type: 'bytes32' },
          { name: 'blockHash', type: 'bytes32' },
          { name: 'status', type: 'uint8' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'drawId', type: 'uint256' },
      { name: 'quantity', type: 'uint256' }
    ],
    name: 'purchaseTickets',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserTickets',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'ticketId', type: 'uint256' }],
    name: 'getTicket',
    outputs: [
      {
        components: [
          { name: 'ticketId', type: 'uint256' },
          { name: 'drawId', type: 'uint256' },
          { name: 'owner', type: 'address' },
          { name: 'ticketNumber', type: 'uint256' },
          { name: 'isWinner', type: 'bool' },
          { name: 'purchaseTime', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export function useCurrentDraw() {
  const [currentDrawId, setCurrentDrawId] = useState<bigint>(1n);

  const { data: drawData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getDraw',
    args: [currentDrawId],
  });

  const draw: Draw | null = drawData ? {
    drawId: drawData.drawId.toString(),
    drawTimestamp: Number(drawData.endTime) * 1000,
    winningTicketId: drawData.winningTicketId.toString(),
    randomSeed: drawData.randomSeed,
    blockHash: drawData.blockHash,
    status: drawData.status === 0 ? 'upcoming' :
            drawData.status === 1 ? 'active' :
            drawData.status === 2 ? 'completed' : 'upcoming',
    prizePool: (Number(drawData.prizePool) / 1e18).toFixed(4),
    ticketPrice: (Number(drawData.ticketPrice) / 1e18).toFixed(4),
    totalTickets: Number(drawData.totalTickets),
  } : null;

  return { draw, isLoading, error };
}

export function useUserTickets(userAddress?: `0x${string}`) {
  const { data: ticketIds, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getUserTickets',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (ticketIds && ticketIds.length > 0) {
      // In a real implementation, you'd fetch each ticket's details
      // For now, we'll create mock data
      const mockTickets: Ticket[] = ticketIds.map((id, index) => ({
        ticketId: id.toString(),
        drawId: '1',
        ownerAddress: userAddress || '0x0',
        ticketNumber: 100 + index,
        isWinner: Math.random() > 0.8,
        nftContractAddress: CONTRACT_ADDRESSES.NFT_TICKETS,
        tokenId: id.toString(),
        purchaseTimestamp: Date.now() - Math.random() * 86400000,
      }));
      setTickets(mockTickets);
    }
  }, [ticketIds, userAddress]);

  return { tickets, isLoading, error };
}

export function usePurchaseTickets() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const purchaseTickets = (drawId: number, quantity: number) => {
    const value = BigInt(quantity) * BigInt(TICKET_PRICE.replace('.', '')) * BigInt(1e14); // Convert to wei

    writeContract({
      address: CONTRACT_ADDRESSES.LOTTERY as `0x${string}`,
      abi: LOTTERY_ABI,
      functionName: 'purchaseTickets',
      args: [BigInt(drawId), BigInt(quantity)],
      value,
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    purchaseTickets,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useTicketDetails(ticketId: string) {
  const { data: ticketData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getTicket',
    args: [BigInt(ticketId)],
  });

  const ticket: Ticket | null = ticketData ? {
    ticketId: ticketData.ticketId.toString(),
    drawId: ticketData.drawId.toString(),
    ownerAddress: ticketData.owner,
    ticketNumber: Number(ticketData.ticketNumber),
    isWinner: ticketData.isWinner,
    purchaseTimestamp: Number(ticketData.purchaseTime) * 1000,
  } : null;

  return { ticket, isLoading, error };
}

