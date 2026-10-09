import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  loading?: boolean;
}

export const Button = ({ variant = 'primary', children, loading, disabled, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-full h-11 transition-all duration-200 shadow-md';
  
  const variants = {
    primary: 'bg-cor-primaria text-white hover:bg-cor-primaria-hover hover:shadow-lg disabled:opacity-50 disabled:shadow-none',
    secondary: 'bg-white text-cor-primaria border-2 border-cor-primaria hover:bg-cor-fundo-rosa hover:shadow-md disabled:opacity-50 disabled:shadow-none',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};
