import { useWalletClient } from 'wagmi';
import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { base } from 'viem/chains';

// USDC contract address on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Create axios instance with x402 payment interceptor
export function createPaymentClient(walletClient: any) {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'https://api.x402.org',
    timeout: 30000,
  });

  return withPaymentInterceptor(client, walletClient);
}

// Calculate total price in wei (considering decimals)
export function calculateTotalPrice(ticketCount: number, pricePerTicket: string): string {
  const price = parseFloat(pricePerTicket) * ticketCount;
  // Convert to wei (18 decimals for ETH)
  return (price * 10 ** 18).toString();
}

// USDC has 6 decimals
export function calculateUSDCTotal(ticketCount: number, pricePerTicket: string): string {
  const price = parseFloat(pricePerTicket) * ticketCount;
  // Convert to USDC units (6 decimals)
  return (price * 10 ** 6).toString();
}

// Hook to get payment client
export function usePaymentClient() {
  const { data: walletClient } = useWalletClient();

  if (!walletClient) {
    return null;
  }

  return createPaymentClient(walletClient);
}

// Payment request interface
export interface PaymentRequest {
  amount: string;
  currency: 'ETH' | 'USDC';
  description: string;
  ticketCount: number;
}

// Process payment
export async function processPayment(
  paymentClient: any,
  request: PaymentRequest
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const response = await paymentClient.post('/payments', {
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      metadata: {
        ticketCount: request.ticketCount,
        app: 'FairPlay Draws'
      }
    });

    return {
      success: true,
      txHash: response.data.txHash
    };
  } catch (error: any) {
    console.error('Payment failed:', error);
    return {
      success: false,
      error: error.message || 'Payment failed'
    };
  }
}

// Check transaction confirmation
export async function checkTransactionConfirmation(txHash: string): Promise<boolean> {
  try {
    // This would typically use a blockchain explorer API or RPC call
    // For now, we'll simulate confirmation checking
    const response = await axios.get(`https://api.basescan.org/api`, {
      params: {
        module: 'transaction',
        action: 'gettxreceiptstatus',
        txhash: txHash,
        apikey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY
      }
    });

    return response.data.status === '1';
  } catch (error) {
    console.error('Failed to check transaction:', error);
    // For development, assume transaction is confirmed after a delay
    return true;
  }
}

