import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        glass rounded-3xl p-6 transition-all duration-350
        hover:border-amber-500/25 hover:shadow-[0_4px_30px_rgba(245,158,11,0.06)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
