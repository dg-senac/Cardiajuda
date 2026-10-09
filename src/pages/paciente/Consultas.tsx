import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Consulta } from '../../types';

export const PacienteConsultas = () => {
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
        .order('data', { ascending: true });

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
    <div className="min-h-screen bg-cor-fundo pb-20 bg-gradient-to-b from-cor-fundo to-cor-fundo-rosa/30">
      <Header title="Consultas" />
      
      <div className="max-w-md mx-auto p-4 fade-in">
        <Card variant="light" className="mb-6 hover">
          <div className="text-center">
            <p className="text-4xl font-bold text-cor-primaria">{consultas.length}</p>
            <p className="text-sm text-cor-texto">Consultas</p>
          </div>
        </Card>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => navigate('/paciente/nova-consulta')}
            className="w-full bg-cor-primaria text-white rounded-full py-3 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Nova Consulta
          </button>
          <button
            onClick={() => navigate('/paciente/historico-consultas')}
            className="w-full bg-white border-2 border-cor-primaria text-cor-primaria rounded-full py-3 font-semibold hover:bg-cor-fundo-rosa transition-all"
          >
            Ver Histórico
          </button>
        </div>
      </div>

      <BottomNav
        items={[
          { label: 'Início', path: '/paciente/inicio', icon: '🏠' },
          { label: 'Consulta', path: '/paciente/consultas', icon: '📅' },
          { label: 'Saúde', path: '/paciente/saude', icon: '❤️' },
          { label: 'Médicos', path: '/paciente/medicos', icon: '👨‍⚕️' },
        ]}
      />
    </div>
  );
};
