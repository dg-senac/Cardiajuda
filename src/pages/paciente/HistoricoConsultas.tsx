import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { Consulta } from '../../types';
import { formatDate } from '../../utils/validations';

export const HistoricoConsultas = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('consultas')
        .select('*')
        .eq('paciente_id', user.id)
        .order('data', { ascending: false });

      if (error) throw error;
      setConsultas(data || []);
    } catch (error) {
      console.error('Error fetching consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cor-fundo flex items-center justify-center">
        <p className="text-cor-primaria font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cor-fundo">
      <Header showBack title="Histórico de Consultas" />
      
      <div className="max-w-md mx-auto p-4">
        {consultas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cor-texto mb-4">Sem consultas salvas...</p>
            <Button onClick={() => navigate('/paciente/nova-consulta')} className="w-full">
              Nova Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {consultas.map((consulta) => (
              <Card key={consulta.id} variant="light">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-cor-primaria">{consulta.especialidade}</p>
                    <p className="text-sm text-cor-texto">{consulta.profissional}</p>
                    <p className="text-sm text-cor-texto">{formatDate(consulta.data)} às {consulta.horario}</p>
                    <p className="text-sm text-cor-texto mt-1">{consulta.motivo}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      consulta.status === 'realizada'
                        ? 'bg-status-normal text-white'
                        : consulta.status === 'cancelada'
                        ? 'bg-status-alerta text-white'
                        : 'bg-status-atencao text-white'
                    }`}
                  >
                    {consulta.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button onClick={() => navigate('/paciente/nova-consulta')} className="w-full">
            Nova Consulta
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)} className="w-full">
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};
