'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, Trophy, Clock } from 'lucide-react';
import { TicketCard } from './TicketCard';
import { Ticket } from '../lib/types';

export function UserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'winners'>('all');

  // Mock data - in real app, this would come from blockchain/API
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        ticketId: '1',
        drawId: '1',
        ownerAddress: '0x123...',
        ticketNumber: 42,
        isWinner: false,
        purchaseTimestamp: Date.now() - 86400000,
        nftContractAddress: '0xabc...',
        tokenId: '1',
      },
      {
        ticketId: '2',
        drawId: '1',
        ownerAddress: '0x123...',
        ticketNumber: 156,
        isWinner: true,
        purchaseTimestamp: Date.now() - 172800000,
        nftContractAddress: '0xabc...',
        tokenId: '2',
      },
      {
        ticketId: '3',
        drawId: '2',
        ownerAddress: '0x123...',
        ticketNumber: 89,
        isWinner: false,
        purchaseTimestamp: Date.now() - 3600000,
        nftContractAddress: '0xabc...',
        tokenId: '3',
      },
    ];
    setTickets(mockTickets);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'active') return !ticket.isWinner;
    if (filter === 'winners') return ticket.isWinner;
    return true;
  });

  const stats = {
    total: tickets.length,
    winners: tickets.filter(t => t.isWinner).length,
    active: tickets.filter(t => !t.isWinner).length,
  };

  return (
    <div className="bg-bg-surface rounded-xl p-6 neon-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary flex items-center space-x-2">
          <TicketIcon className="w-5 h-5" />
          <span>My Tickets</span>
        </h3>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-text-secondary">Total: {stats.total}</span>
          <span className="text-accent">Winners: {stats.winners}</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 mb-6 bg-bg-secondary rounded-lg p-1">
        {[
          { key: 'all', label: 'All', icon: TicketIcon },
          { key: 'active', label: 'Active', icon: Clock },
          { key: 'winners', label: 'Winners', icon: Trophy },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200
              ${filter === key 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tickets grid */}
      {filteredTickets.length > 0 ? (
        <div className="space-y-3">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.ticketId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TicketCard
                ticket={ticket}
                variant={ticket.isWinner ? 'winner' : 'default'}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <TicketIcon className="w-12 h-12 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">
            {filter === 'all' 
              ? 'No tickets yet. Purchase your first ticket above!'
              : `No ${filter} tickets found.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
