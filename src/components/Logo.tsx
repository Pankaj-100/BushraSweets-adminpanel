import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
}

export function Logo({ className = '', size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const logoSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textColor = variant === 'light' ? 'text-background' : 'text-primary';
  const subtextColor = variant === 'light' ? 'text-background/80' : 'text-muted-foreground';

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Logo SVG */}
      <motion.div 
        className={`${sizeClasses[size]} flex items-center justify-center`}
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <motion.svg
          className={logoSize[size]}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 1, -1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Ornate circular border inspired by Islamic patterns */}
          <motion.circle
            cx="50" cy="50" r="45"
            stroke={variant === 'light' ? '#fefdf9' : '#4a7c59'}
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50px 50px' }}
          />
          
          {/* Central dessert bowl with elegant curves */}
          <motion.path
            d="M20 40 C20 35, 25 30, 35 30 L65 30 C75 30, 80 35, 80 40 C80 45, 75 60, 50 65 C25 60, 20 45, 20 40 Z"
            fill={variant === 'light' ? '#fefdf9' : '#4a7c59'}
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Decorative swirls representing the richness of desserts */}
          <motion.path
            d="M35 42 Q40 38, 45 42 Q50 46, 55 42 Q60 38, 65 42"
            stroke={variant === 'light' ? '#4a7c59' : '#fefdf9'}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Traditional paisley motifs */}
          <motion.path
            d="M30 50 Q28 48, 30 46 Q32 48, 30 50"
            fill={variant === 'light' ? '#4a7c59' : '#fdeaa7'}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.path
            d="M70 50 Q68 48, 70 46 Q72 48, 70 50"
            fill={variant === 'light' ? '#4a7c59' : '#fdeaa7'}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          
          {/* Steam wisps suggesting warmth and freshness */}
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M42 28 Q43 25, 44 28 Q45 31, 46 28"
              stroke={variant === 'light' ? '#fefdf9' : '#4a7c59'}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M50 25 Q51 22, 52 25 Q53 28, 54 25"
              stroke={variant === 'light' ? '#fefdf9' : '#4a7c59'}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M58 28 Q59 25, 60 28 Q61 31, 62 28"
              stroke={variant === 'light' ? '#fefdf9' : '#4a7c59'}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </motion.g>
          
          {/* Saffron strands - representing premium ingredients */}
          <motion.g
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="40" y1="55" x2="42" y2="53" stroke={variant === 'light' ? '#f5e6b8' : '#fdeaa7'} strokeWidth="1" />
            <line x1="50" y1="57" x2="52" y2="55" stroke={variant === 'light' ? '#f5e6b8' : '#fdeaa7'} strokeWidth="1" />
            <line x1="60" y1="55" x2="58" y2="53" stroke={variant === 'light' ? '#f5e6b8' : '#fdeaa7'} strokeWidth="1" />
          </motion.g>
          
          {/* Decorative corner flourishes */}
          <motion.path
            d="M15 15 Q20 10, 25 15 Q20 20, 15 15"
            fill={variant === 'light' ? '#fdeaa7' : '#f5e6b8'}
            opacity="0.6"
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.path
            d="M85 15 Q80 10, 75 15 Q80 20, 85 15"
            fill={variant === 'light' ? '#fdeaa7' : '#f5e6b8'}
            opacity="0.6"
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </motion.svg>
      </motion.div>
      
      {/* Brand Text */}
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span 
          className={`font-parisienne text-xl leading-none ${textColor}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Bano's
        </motion.span>
        <motion.span 
          className={`text-xs ${subtextColor} leading-none tracking-widest`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          SWEETS
        </motion.span>
      </motion.div>
    </motion.div>
  );
}