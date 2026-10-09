import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { Consulta, Triagem } from '../../types';
import { formatDate } from '../../utils/validations';

export const MedicoHistorico = () => {
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
        supabase.from('consultas').select('*').order('data', { ascending: false }),
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
    <div className="min-h-screen bg-cor-fundo">
      <Header showBack title="Histórico" />
      
      <div className="max-w-md mx-auto p-4">
        <h3 className="text-lg font-bold text-cor-primaria mb-3">Triagens</h3>
        {triagens.length === 0 ? (
          <p className="text-center text-cor-texto mb-6">Nenhuma triagem registrada</p>
        ) : (
          <div className="space-y-3 mb-6">
            {triagens.map((triagem) => (
              <Card key={triagem.id} variant="light">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-cor-primaria">{triagem.nome_paciente}</p>
                    <p className="text-sm text-cor-texto">{formatDate(triagem.data)} às {triagem.horario}</p>
                    <p className="text-sm text-cor-texto">{triagem.queixa_principal}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      triagem.classificacao === 'verde'
                        ? 'bg-status-normal text-white'
                        : triagem.classificacao === 'amarela'
                        ? 'bg-status-atencao text-white'
                        : 'bg-status-alerta text-white'
                    }`}
                  >
                    {triagem.classificacao}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <h3 className="text-lg font-bold text-cor-primaria mb-3">Consultas</h3>
        {consultas.length === 0 ? (
          <p className="text-center text-cor-texto mb-6">Nenhuma consulta registrada</p>
        ) : (
          <div className="space-y-3 mb-6">
            {consultas.map((consulta) => (
              <Card key={consulta.id} variant="light">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-cor-primaria">{consulta.nome_paciente}</p>
                    <p className="text-sm text-cor-texto">{formatDate(consulta.data)} às {consulta.horario}</p>
                    <p className="text-sm text-cor-texto">{consulta.motivo}</p>
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

        <div className="space-y-3">
          <Button onClick={() => navigate('/medico/nova-triagem')} className="w-full">
            Nova Triagem
          </Button>
          <Button onClick={() => navigate('/medico/nova-consulta')} className="w-full">
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
