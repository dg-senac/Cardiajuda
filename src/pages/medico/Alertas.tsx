import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { StatusIcon } from '../../components/StatusIcon';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Alerta, Pendencia } from '../../types';

export const MedicoAlertas = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alertasData, pendenciasData] = await Promise.all([
        supabase.from('alertas').select('*').order('created_at', { ascending: false }),
        supabase.from('pendencias').select('*').order('created_at', { ascending: false }),
      ]);

      if (alertasData.data) setAlertas(alertasData.data);
      if (pendenciasData.data) setPendencias(pendenciasData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePendencia = async (pendenciaId: string, concluida: boolean) => {
    try {
      const { error } = await supabase
        .from('pendencias')
        .update({ concluida: !concluida })
        .eq('id', pendenciaId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating pendencia:', error);
    }
  };

  const alertaCount = alertas.filter((a) => a.status === 'alerta').length;
  const pendenciaCount = pendencias.filter((p) => !p.concluida).length;
  const emDiaCount = alertas.filter((a) => a.status === 'em_dia').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cor-fundo flex items-center justify-center">
        <p className="text-cor-primaria font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cor-fundo pb-20">
      <Header title="Alertas" />
      
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card variant="light">
            <div className="text-center">
              <p className="text-3xl font-bold text-status-alerta">{alertaCount}</p>
              <p className="text-xs text-cor-texto">Alertas</p>
            </div>
          </Card>
          <Card variant="light">
            <div className="text-center">
              <p className="text-3xl font-bold text-status-atencao">{pendenciaCount}</p>
              <p className="text-xs text-cor-texto">Pendências</p>
            </div>
          </Card>
          <Card variant="light">
            <div className="text-center">
              <p className="text-3xl font-bold text-status-normal">{emDiaCount}</p>
              <p className="text-xs text-cor-texto">Em dia</p>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-cor-primaria mb-3">Alertas Recentes</h3>
          {alertas.length === 0 ? (
            <p className="text-center text-cor-texto">Nenhum alerta</p>
          ) : (
            <div className="space-y-3">
              {(showAll ? alertas : alertas.slice(0, 3)).map((alerta) => (
                <Card key={alerta.id} variant="light">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-cor-primaria">{alerta.titulo}</p>
                      <p className="text-sm text-cor-texto">{alerta.descricao}</p>
                    </div>
                    <StatusIcon status={alerta.status} />
                  </div>
                </Card>
              ))}
              {alertas.length > 3 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full text-cor-link underline text-sm"
                >
                  Ver todas as notificações
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-cor-primaria mb-3">Pendências</h3>
          {pendencias.length === 0 ? (
            <p className="text-center text-cor-texto">Nenhuma pendência</p>
          ) : (
            <div className="space-y-3">
              {pendencias.map((pendencia) => (
                <Card key={pendencia.id} variant="light">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pendencia.concluida}
                      onChange={() => handleTogglePendencia(pendencia.id, pendencia.concluida)}
                      className="w-5 h-5 accent-cor-primaria"
                    />
                    <p className={`flex-1 ${pendencia.concluida ? 'line-through opacity-50' : ''}`}>
                      {pendencia.titulo}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
