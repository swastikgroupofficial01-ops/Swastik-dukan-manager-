import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, animate = true }) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      id={Math.random().toString(36).substr(2, 9)}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl p-4 card-shadow border border-slate-100 dark:border-slate-800",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
};
