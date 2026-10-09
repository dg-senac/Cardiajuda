import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Consulta, Triagem } from '../../types';

export const MedicoConsultas = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [triagens, setTriagens] = useState<Triagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [consultasData, triagensData] = await Promise.all([
        supabase.from('consultas').select('*').order('data', { ascending: true }),
        supabase.from('triagens').select('*').order('created_at', { ascending: false }),
      ]);

      if (consultasData.data) setConsultas(consultasData.data);
      if (triagensData.data) setTriagens(triagensData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className="min-h-screen bg-cor-fundo pb-20">
      <Header title="Consultas" />
      
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card variant="light">
            <div className="text-center">
              <p className="text-4xl font-bold text-cor-primaria">{triagens.length}</p>
              <p className="text-sm text-cor-texto">Triagens</p>
            </div>
          </Card>
          <Card variant="light">
            <div className="text-center">
              <p className="text-4xl font-bold text-cor-primaria">{consultas.length}</p>
              <p className="text-sm text-cor-texto">Consultas</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => navigate('/medico/nova-triagem')}
            className="w-full bg-cor-primaria text-white rounded-full py-3 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Nova Triagem
          </button>
          <button
            onClick={() => navigate('/medico/nova-consulta')}
            className="w-full bg-cor-primaria text-white rounded-full py-3 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Nova Consulta
          </button>
          <button
            onClick={() => navigate('/medico/historico')}
            className="w-full bg-white border-2 border-cor-primaria text-cor-primaria rounded-full py-3 font-semibold hover:bg-cor-fundo-rosa transition-all"
          >
            Ver Histórico
          </button>
        </div>
      </div>

      <BottomNav
        items={[
          { label: 'Início', path: '/medico/inicio', icon: '🏠' },
          { label: 'Consulta', path: '/medico/consultas', icon: '📅' },
          { label: 'Alertas', path: '/medico/alertas', icon: '🔔' },
          { label: 'Pacientes', path: '/medico/pacientes', icon: '👥' },
        ]}
      />
    </div>
  );
};
