'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ActionButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ActionButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
}: ActionButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/80 text-white glow-effect',
    secondary: 'bg-bg-surface hover:bg-bg-surface/80 text-text-primary neon-border',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && disabledClasses,
        className
      )}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      <span>{children}</span>
    </motion.button>
  );
}
