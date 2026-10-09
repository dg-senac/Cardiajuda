import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Consulta, Triagem } from '../../types';

export const MedicoInicio = () => {
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
    <div className="min-h-screen bg-cor-fundo pb-20 bg-gradient-to-b from-cor-fundo to-cor-fundo-rosa/30">
      <Header />
      
      <div className="max-w-md mx-auto p-4 fade-in">
        <h2 className="text-2xl font-bold text-cor-primaria mb-6">
          Bem-Vindo, Médico
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card variant="light" className="hover">
            <div className="text-center">
              <p className="text-4xl font-bold text-cor-primaria">{triagens.length}</p>
              <p className="text-sm text-cor-texto">Triagens</p>
            </div>
          </Card>
          <Card variant="light" className="hover">
            <div className="text-center">
              <p className="text-4xl font-bold text-cor-primaria">{consultas.length}</p>
              <p className="text-sm text-cor-texto">Consultas</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all text-left shadow-md hover:shadow-lg transform hover:-translate-y-1">
            🏥 Atendimento de Triagem
          </button>
          <button className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all text-left shadow-md hover:shadow-lg transform hover:-translate-y-1">
            📅 Nova Consulta
          </button>
          <button className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all text-left shadow-md hover:shadow-lg transform hover:-translate-y-1">
            📋 Ver Histórico
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
