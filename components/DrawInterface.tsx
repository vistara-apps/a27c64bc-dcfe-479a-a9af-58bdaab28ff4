'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawAnimation } from './DrawAnimation';
import { ActionButton } from './ActionButton';
import { Draw, DrawAnimationState } from '../lib/types';
import { DRAW_DURATION } from '../lib/constants';

export function DrawInterface() {
  const [currentDraw, setCurrentDraw] = useState<Draw>({
    drawId: '1',
    drawTimestamp: Date.now() + 300000, // 5 minutes from now
    status: 'upcoming',
    prizePool: '1.5',
    ticketPrice: '0.001',
    totalTickets: 1500,
  });

  const [animationState, setAnimationState] = useState<DrawAnimationState>({
    status: 'idle',
    duration: DRAW_DURATION,
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, currentDraw.drawTimestamp - Date.now());
      setTimeRemaining(remaining);
      
      if (remaining === 0 && currentDraw.status === 'upcoming') {
        setCurrentDraw(prev => ({ ...prev, status: 'active' }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDraw.drawTimestamp, currentDraw.status]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartDraw = () => {
    setAnimationState({ status: 'loading', duration: DRAW_DURATION });
    setCurrentDraw(prev => ({ ...prev, status: 'active' }));
    
    setTimeout(() => {
      setAnimationState({ status: 'playing', duration: DRAW_DURATION });
    }, 1000);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * currentDraw.totalTickets) + 1;
      setAnimationState({ 
        status: 'complete', 
        duration: DRAW_DURATION,
        winningNumber 
      });
      setCurrentDraw(prev => ({ 
        ...prev, 
        status: 'completed',
        winningTicketId: winningNumber.toString()
      }));
    }, DRAW_DURATION);
  };

  return (
    <div className="bg-surface rounded-xl p-6 neon-border holographic-bg">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl font-semibold text-text-primary">
              Current Draw #{currentDraw.drawId}
            </h2>
            <p className="text-text-secondary text-sm">
              Prize Pool: {currentDraw.prizePool} ETH
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">
              {currentDraw.totalTickets}
            </div>
            <p className="text-text-secondary text-sm">Total Tickets</p>
          </div>
        </div>

        <DrawAnimation state={animationState} />

        <AnimatePresence mode="wait">
          {currentDraw.status === 'upcoming' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-text-secondary">Until next draw</p>
              </div>
            </motion.div>
          )}

          {currentDraw.status === 'active' && animationState.status === 'idle' && (
            <motion.div
              key="start-draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ActionButton
                variant="primary"
                onClick={handleStartDraw}
                className="w-full"
              >
                Start Draw
              </ActionButton>
            </motion.div>
          )}

          {currentDraw.status === 'completed' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  🎉 Draw Complete!
                </h3>
                <div className="text-2xl font-bold text-accent">
                  Winning Ticket: #{animationState.winningNumber}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
