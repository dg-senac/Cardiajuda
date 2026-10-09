import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { CardapioSemanal, Assinatura, Lembrete } from '../../types';


export const PacienteInicio = () => {
  const [cardapio, setCardapio] = useState<CardapioSemanal[]>([]);
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDailyInfo, setShowDailyInfo] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const [cardapioData, assinaturaData, lembretesData] = await Promise.all([
        supabase.from('cardapio_semanal').select('*'),
        supabase.from('assinaturas').select('*').eq('paciente_id', user.id).single(),
        supabase.from('lembretes').select('*').eq('paciente_id', user.id).eq('ativo', true),
      ]);

      if (cardapioData.data) setCardapio(cardapioData.data);
      if (assinaturaData.data) setAssinatura(assinaturaData.data);
      if (lembretesData.data) setLembretes(lembretesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayCardapio = cardapio.filter(c => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = days[new Date().getDay()];
    return c.dia_semana === today;
  });

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
          Bem-Vindo, Paciente
        </h2>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => setShowReminders(true)}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            📋 Lembretes Diários ({lembretes.length})
          </button>
          <button
            onClick={() => setShowDailyInfo(true)}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            📊 Informações Diárias
          </button>
        </div>

        <div className="space-y-4">
          <Card variant="primary" className="flex justify-between items-center hover" onClick={() => {}}>
            <div>
              <h3 className="font-bold text-lg">Cardápio Semanal</h3>
              <p className="text-sm opacity-90">Veja as refeições da semana</p>
            </div>
            <span className="text-2xl">→</span>
          </Card>

          <Card variant="primary" className="flex justify-between items-center hover" onClick={() => {}}>
            <div>
              <h3 className="font-bold text-lg">Histórico de Consultas</h3>
              <p className="text-sm opacity-90">Acompanhe suas consultas</p>
            </div>
            <span className="text-2xl">→</span>
          </Card>

          <Card variant="primary" className="flex justify-between items-center hover" onClick={() => {}}>
            <div>
              <h3 className="font-bold text-lg">Planos e Assinaturas</h3>
              <p className="text-sm opacity-90">
                {assinatura ? `Plano: ${assinatura.status}` : 'Nenhuma assinatura ativa'}
              </p>
            </div>
            <span className="text-2xl">→</span>
          </Card>
        </div>

        {todayCardapio.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-cor-primaria mb-3">Cardápio de Hoje</h3>
            <div className="space-y-2">
              {todayCardapio.map((item) => (
                <Card key={item.id} variant="light">
                  <p className="font-semibold text-cor-primaria">{item.refeicao}</p>
                  <p className="text-sm text-cor-texto">{item.descricao}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav
        items={[
          { label: 'Início', path: '/paciente/inicio', icon: '🏠' },
          { label: 'Consulta', path: '/paciente/consultas', icon: '📅' },
          { label: 'Saúde', path: '/paciente/saude', icon: '❤️' },
          { label: 'Médicos', path: '/paciente/medicos', icon: '👨‍⚕️' },
        ]}
      />

      {/* Modal Lembretes */}
      {showReminders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-cor-primaria mb-4">Lembretes Diários</h3>
            {lembretes.length === 0 ? (
              <p className="text-cor-texto">Nenhum lembrete ativo</p>
            ) : (
              <div className="space-y-3">
                {lembretes.map((lembrete) => (
                  <div key={lembrete.id} className="bg-cor-fundo-rosa rounded-xl p-3">
                    <p className="font-semibold text-cor-primaria">{lembrete.texto}</p>
                    <p className="text-sm text-cor-texto">⏰ {lembrete.horario}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowReminders(false)}
              className="mt-4 w-full bg-cor-primaria text-white rounded-full py-3 font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Informações Diárias */}
      {showDailyInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-cor-primaria mb-4">Informações Diárias</h3>
            <div className="space-y-3">
              <div className="bg-cor-fundo-rosa rounded-xl p-3">
                <p className="font-semibold text-cor-primaria">💧 Hidratação</p>
                <p className="text-sm text-cor-texto">Beba pelo menos 2L de água por dia</p>
              </div>
              <div className="bg-cor-fundo-rosa rounded-xl p-3">
                <p className="font-semibold text-cor-primaria">🚶 Atividade Física</p>
                <p className="text-sm text-cor-texto">30 minutos de caminhada recomendados</p>
              </div>
              <div className="bg-cor-fundo-rosa rounded-xl p-3">
                <p className="font-semibold text-cor-primaria">😴 Sono</p>
                <p className="text-sm text-cor-texto">Dormir 7-8 horas por noite</p>
              </div>
            </div>
            <button
              onClick={() => setShowDailyInfo(false)}
              className="mt-4 w-full bg-cor-primaria text-white rounded-full py-3 font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
