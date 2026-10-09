import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { StatusIcon } from '../../components/StatusIcon';
import { supabase } from '../../lib/supabase';
import { Paciente, Medicao } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDateTime } from '../../utils/validations';

export const DetalhePaciente = () => {
  const { id } = useParams<{ id: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (pacienteId: string) => {
    try {
      const [pacienteData, medicoesData] = await Promise.all([
        supabase.from('pacientes').select('*').eq('id', pacienteId).single(),
        supabase.from('medicoes').select('*').eq('paciente_id', pacienteId).order('created_at', { ascending: true }),
      ]);

      if (pacienteData.data) setPaciente(pacienteData.data);
      if (medicoesData.data) setMedicoes(medicoesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => {
    if (medicoes.length === 0) return 'Normal';
    const latest = medicoes[medicoes.length - 1];
    return latest.status === 'alerta' ? 'Alerta' : latest.status === 'atencao' ? 'Atenção' : 'Normal';
  };

  const chartData = medicoes.map((m) => ({
    date: new Date(m.created_at).toLocaleDateString('pt-BR'),
    sistolica: m.sistolica,
    diastolica: m.diastolica,
    glicemia: m.glicemia,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-cor-fundo flex items-center justify-center">
        <p className="text-cor-primaria font-semibold">Carregando...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-cor-fundo flex items-center justify-center">
        <p className="text-cor-texto">Paciente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cor-fundo">
      <Header showBack title="Relatório do Paciente" />
      
      <div className="max-w-md mx-auto p-4">
        <Card variant="light" className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            {paciente.avatar_url ? (
              <img
                src={paciente.avatar_url}
                alt={paciente.nome}
                className="w-16 h-16 rounded-full object-cover border-2 border-cor-primaria"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-cor-primaria flex items-center justify-center text-white text-xl font-bold">
                {paciente.nome.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-cor-primaria">{paciente.nome}</h3>
              <p className="text-sm text-cor-texto">Idade: {paciente.idade} anos</p>
              <p className="text-sm text-cor-texto">Tipo Sanguíneo: {paciente.tipo_sanguineo}</p>
              <p className="text-sm text-cor-texto">Altura: {paciente.altura} cm</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-cor-texto">
              <span className="font-semibold">Doenças Crônicas:</span>{' '}
              {paciente.doencas_cronicas.length > 0 ? paciente.doencas_cronicas.join(', ') : 'Nenhuma'}
            </p>
            <p className="text-sm text-cor-texto">
              <span className="font-semibold">Gênero:</span> {paciente.genero}
            </p>
          </div>
        </Card>

        <Card variant="light" className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-cor-primaria">Atenção Necessária</p>
              <p className="text-sm text-cor-texto">Status atual: {getStatus()}</p>
            </div>
            <StatusIcon status={getStatus().toLowerCase() as any} />
          </div>
        </Card>

        {medicoes.length > 0 && (
          <Card variant="light" className="mb-4">
            <h3 className="font-bold text-cor-primaria mb-3">Histórico de Medições</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sistolica" stroke="#8B008B" name="Sistólica" />
                <Line type="monotone" dataKey="diastolica" stroke="#4B0049" name="Diastólica" />
                <Line type="monotone" dataKey="glicemia" stroke="#F2A900" name="Glicemia" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-cor-primaria">Últimas Medições</h3>
          {medicoes.length === 0 ? (
            <p className="text-center text-cor-texto">Nenhuma medição registrada</p>
          ) : (
            medicoes.slice(-5).reverse().map((medicao) => (
              <Card key={medicao.id} variant="light">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-cor-texto">{formatDateTime(medicao.created_at)}</p>
                    <p className="font-bold text-cor-primaria">
                      PA: {medicao.sistolica}/{medicao.diastolica} mmHg
                    </p>
                    <p className="font-bold text-cor-primaria">
                      Glicemia: {medicao.glicemia} mg/dL
                    </p>
                  </div>
                  <StatusIcon status={medicao.status} />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
