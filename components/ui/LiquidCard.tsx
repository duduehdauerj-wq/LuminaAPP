import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LiquidCard: React.FC<Props> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        liquid-glass
        rounded-[2rem] p-6
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer active:scale-[0.98] hover:brightness-105' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};