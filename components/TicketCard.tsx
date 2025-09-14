'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';
import { Ticket } from '../lib/types';
import { cn } from '../lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  variant?: 'default' | 'active' | 'winner';
  className?: string;
}

export function TicketCard({ 
  ticket, 
  variant = 'default', 
  className = '' 
}: TicketCardProps) {
  const variantClasses = {
    default: 'bg-bg-surface border-border',
    active: 'bg-primary/10 border-primary neon-border',
    winner: 'bg-accent/10 border-accent glow-effect',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-lg border p-4 transition-all duration-200',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              #{ticket.ticketNumber}
            </span>
          </div>
          <div>
            <p className="text-text-primary font-medium text-sm">
              Ticket #{ticket.ticketNumber}
            </p>
            <p className="text-text-secondary text-xs">
              Draw #{ticket.drawId}
            </p>
          </div>
        </div>

        {ticket.isWinner && (
          <div className="flex items-center space-x-1 text-accent">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold">WINNER</span>
          </div>
        )}

        {variant === 'active' && (
          <div className="flex items-center space-x-1 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Active</span>
          </div>
        )}
      </div>

      <div className="text-xs text-text-secondary">
        Purchased: {new Date(ticket.purchaseTimestamp).toLocaleDateString()}
      </div>

      {ticket.nftContractAddress && (
        <div className="mt-2 text-xs text-primary">
          NFT Token ID: {ticket.tokenId}
        </div>
      )}
    </motion.div>
  );
}
