import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'light';
  onClick?: () => void;
  hover?: boolean;
}

export const Card = ({ children, className = '', variant = 'primary', onClick, hover = false }: CardProps) => {
  const variants = {
    primary: 'bg-cor-primaria text-white shadow-card',
    light: 'bg-cor-fundo-rosa border-2 border-cor-primaria shadow-card',
  };

  return (
    <div
      className={`rounded-2xl p-4 ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${hover ? 'shadow-card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
