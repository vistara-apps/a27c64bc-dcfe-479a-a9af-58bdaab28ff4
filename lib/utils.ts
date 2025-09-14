import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toFixed(4);
}

export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function calculateBulkDiscount(ticketCount: number): number {
  if (ticketCount >= 10) return 0.15; // 15% discount
  if (ticketCount >= 5) return 0.10;  // 10% discount
  return 0;
}
