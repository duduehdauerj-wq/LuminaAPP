import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 tracking-wide";
  
  const variants = {
    primary: `
      bg-gradient-to-br from-gray-800 to-black text-white 
      dark:from-white dark:to-gray-200 dark:text-black 
      shadow-lg shadow-black/10 dark:shadow-white/5
      hover:shadow-xl hover:brightness-110
      border border-transparent
    `,
    secondary: `
      bg-white/70 dark:bg-gray-800/70 
      text-gray-800 dark:text-white 
      border border-white/40 dark:border-white/10 
      backdrop-blur-md shadow-sm
      hover:bg-white/90 dark:hover:bg-gray-700/90
    `,
    ghost: `
      text-gray-600 dark:text-gray-400 
      hover:text-gray-900 dark:hover:text-white 
      hover:bg-black/5 dark:hover:bg-white/5
    `
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};