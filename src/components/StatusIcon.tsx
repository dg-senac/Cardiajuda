import { StatusMedicao, ClassificacaoTriagem, StatusAlerta } from '../types';

interface StatusIconProps {
  status: StatusMedicao | ClassificacaoTriagem | StatusAlerta;
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  const getStatusConfig = () => {
    if (status === 'normal' || status === 'verde' || status === 'em_dia') {
      return { icon: '✓', color: 'bg-status-normal' };
    }
    if (status === 'atencao' || status === 'amarela' || status === 'pendente') {
      return { icon: '⚠', color: 'bg-status-atencao' };
    }
    if (status === 'alerta' || status === 'vermelha' || status === 'alerta') {
      return { icon: '!', color: 'bg-status-alerta' };
    }
    return { icon: '?', color: 'bg-gray-400' };
  };

  const { icon, color } = getStatusConfig();

  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold`}>
      {icon}
    </div>
  );
};
