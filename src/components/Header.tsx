import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export const Header = ({ showBack = false, title }: HeaderProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <header className="bg-cor-fundo-rosa-2 p-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)} 
            className="text-cor-primaria text-2xl font-bold hover:text-cor-primaria-hover transition-colors"
          >
            ←
          </button>
        ) : (
          <div className="w-8" />
        )}
        
        <div className="flex-1 flex justify-center">
          {title ? (
            <h1 className="text-xl font-bold text-cor-primaria">{title}</h1>
          ) : (
            <Logo />
          )}
        </div>

        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-cor-primaria object-cover shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-cor-primaria border-2 border-cor-primaria flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {profile?.nome?.charAt(0) || 'U'}
          </div>
        )}
      </div>
    </header>
  );
};
