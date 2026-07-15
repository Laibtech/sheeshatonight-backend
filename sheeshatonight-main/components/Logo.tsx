'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizes = {
    sm: { img: 'h-6' },
    md: { img: 'h-9' },
    lg: { img: 'h-14' },
    xl: { img: 'h-20' },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <Link href="/" className={`inline-flex items-center group cursor-pointer ${className}`}>
      <img
        src="/logo.png"
        alt="SheeshaTonight"
        className={`${currentSize.img} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </Link>
  );
};
