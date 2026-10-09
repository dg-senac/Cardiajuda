import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-cor-texto">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-cor-fundo-rosa border-2 border-cor-borda-input rounded-xl px-4 py-3 placeholder-cor-placeholder text-cor-texto shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
        {...props}
      />
      {error && <p className="text-status-alerta text-sm mt-1 font-semibold">{error}</p>}
    </div>
  );
};
