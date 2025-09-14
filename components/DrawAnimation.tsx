'use client';

import { motion } from 'framer-motion';
import { DrawAnimationState } from '../lib/types';

interface DrawAnimationProps {
  state: DrawAnimationState;
}

export function DrawAnimation({ state }: DrawAnimationProps) {
  const renderCircles = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-4 h-4 bg-blue-400 rounded-full"
        style={{
          top: '50%',
          left: '50%',
          transformOrigin: '0 0',
        }}
        animate={{
          rotate: state.status === 'playing' ? [0, 360] : 0,
          scale: state.status === 'playing' ? [1, 1.5, 1] : 1,
          opacity: state.status === 'playing' ? [0.5, 1, 0.5] : 0.7,
        }}
        transition={{
          duration: 2,
          repeat: state.status === 'playing' ? Infinity : 0,
          delay: i * 0.1,
          ease: 'easeInOut',
        }}
        initial={{
          x: Math.cos((i * 30) * Math.PI / 180) * 80,
          y: Math.sin((i * 30) * Math.PI / 180) * 80,
        }}
      />
    ));
  };

  const renderCenterOrb = () => (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      animate={{
        scale: state.status === 'playing' ? [1, 1.2, 1] : 1,
        rotate: state.status === 'playing' ? 360 : 0,
      }}
      transition={{
        duration: 3,
        repeat: state.status === 'playing' ? Infinity : 0,
        ease: 'linear',
      }}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full glow-effect flex items-center justify-center">
        {state.status === 'complete' && state.winningNumber && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white font-bold text-lg"
          >
            {state.winningNumber}
          </motion.span>
        )}
        {state.status === 'loading' && (
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
        animate={{
          rotate: state.status === 'playing' ? 360 : 0,
          scale: state.status === 'playing' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 4,
          repeat: state.status === 'playing' ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 border border-purple-400/40 rounded-full"
        animate={{
          rotate: state.status === 'playing' ? -360 : 0,
        }}
        transition={{
          duration: 3,
          repeat: state.status === 'playing' ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {renderCircles()}

      {/* Center orb */}
      {renderCenterOrb()}

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-400"
            style={{
              width: '1px',
              height: '100%',
              left: '50%',
              top: '0',
              transformOrigin: '0 50%',
              transform: `rotate(${i * 22.5}deg)`,
            }}
            animate={{
              opacity: state.status === 'playing' ? [0.2, 0.6, 0.2] : 0.2,
            }}
            transition={{
              duration: 2,
              repeat: state.status === 'playing' ? Infinity : 0,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
