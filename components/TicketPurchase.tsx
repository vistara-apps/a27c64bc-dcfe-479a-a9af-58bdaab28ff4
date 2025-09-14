'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { Modal } from './Modal';
import { TICKET_PRICE, BULK_DISCOUNTS } from '../lib/constants';
import { calculateBulkDiscount, formatEther } from '../lib/utils';
import { usePaymentClient, processPayment, checkTransactionConfirmation, calculateUSDCTotal } from '../lib/payment';
import { useAccount } from 'wagmi';

export function TicketPurchase() {
  const [ticketCount, setTicketCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { address, isConnected } = useAccount();
  const paymentClient = usePaymentClient();

  const basePrice = parseFloat(TICKET_PRICE) * ticketCount;
  const discount = calculateBulkDiscount(ticketCount);
  const finalPrice = basePrice * (1 - discount);

  const handlePurchase = async () => {
    if (!paymentClient || !isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setIsPurchasing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Calculate USDC amount (x402 uses USDC for payments)
      const usdcAmount = calculateUSDCTotal(ticketCount, TICKET_PRICE);

      const paymentRequest = {
        amount: usdcAmount,
        currency: 'USDC' as const,
        description: `Purchase ${ticketCount} lottery ticket${ticketCount > 1 ? 's' : ''} for FairPlay Draws`,
        ticketCount
      };

      const result = await processPayment(paymentClient, paymentRequest);

      if (result.success && result.txHash) {
        setPaymentStatus('confirming');

        // Check transaction confirmation
        const isConfirmed = await checkTransactionConfirmation(result.txHash);

        if (isConfirmed) {
          setPaymentStatus('success');
          setTimeout(() => {
            setIsModalOpen(false);
            setTicketCount(1);
            setPaymentStatus('idle');
          }, 2000);
        } else {
          setPaymentStatus('error');
          setErrorMessage('Transaction confirmation failed. Please check your wallet.');
        }
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Purchase failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  const incrementTickets = () => {
    setTicketCount(prev => Math.min(prev + 1, 50));
  };

  const decrementTickets = () => {
    setTicketCount(prev => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="bg-surface rounded-xl p-6 neon-border">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Purchase Tickets
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Ticket Price:</span>
            <span className="text-text-primary font-semibold">
              {TICKET_PRICE} ETH
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Quantity:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementTickets}
                className="w-8 h-8 rounded-full bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-text-primary w-8 text-center">
                {ticketCount}
              </span>
              <button
                onClick={incrementTickets}
                className="w-8 h-8 rounded-full bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-accent font-medium">
                  Bulk Discount ({Math.round(discount * 100)}% off):
                </span>
                <span className="text-accent font-bold">
                  -{formatEther(basePrice - finalPrice)} ETH
                </span>
              </div>
            </motion.div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-text-primary font-semibold">Total:</span>
              <span className="text-accent font-bold">
                {formatEther(finalPrice)} ETH
              </span>
            </div>
          </div>

          <ActionButton
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="w-full"
            disabled={!isConnected}
          >
            <ShoppingCart className="w-5 h-5" />
            {isConnected ? `Buy ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}` : 'Connect Wallet to Buy'}
          </ActionButton>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPurchasing && setIsModalOpen(false)}
        title="Confirm Purchase"
      >
        <div className="space-y-4">
          <div className="bg-bg rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Tickets:</span>
              <span className="text-text-primary">{ticketCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Price per ticket:</span>
              <span className="text-text-primary">{TICKET_PRICE} ETH</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount ({Math.round(discount * 100)}%):</span>
                <span>-{formatEther(basePrice - finalPrice)} ETH</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-text-primary">Total:</span>
                <span className="text-accent">{formatEther(finalPrice)} ETH</span>
              </div>
            </div>
          </div>

          {!isConnected && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-400 text-sm">Please connect your wallet to make a purchase</span>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-400 text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-400 text-sm">Processing payment...</span>
              </div>
            </div>
          )}

          {paymentStatus === 'confirming' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-400 text-sm">Confirming transaction...</span>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-400 text-sm">Payment successful! Tickets will be minted shortly.</span>
              </div>
            </div>
          )}

          <p className="text-text-secondary text-sm">
            Your tickets will be minted as NFTs and sent to your wallet after purchase confirmation.
          </p>

          <div className="flex space-x-3">
            <ActionButton
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={isPurchasing}
            >
              Cancel
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handlePurchase}
              loading={isPurchasing}
              className="flex-1"
              disabled={!isConnected || paymentStatus === 'success'}
            >
              {paymentStatus === 'processing' ? 'Processing...' :
               paymentStatus === 'confirming' ? 'Confirming...' :
               paymentStatus === 'success' ? 'Success!' :
               'Confirm Purchase'}
            </ActionButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
