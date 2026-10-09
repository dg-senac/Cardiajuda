import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { StatusIcon } from '../../components/StatusIcon';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Paciente, Medicao } from '../../types';

export const MedicoPacientes = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'todos' | 'pressao' | 'glicemia'>('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pacientesData, medicoesData] = await Promise.all([
        supabase.from('pacientes').select('*'),
        supabase.from('medicoes').select('*').order('created_at', { ascending: false }),
      ]);

      if (pacientesData.data) setPacientes(pacientesData.data);
      if (medicoesData.data) setMedicoes(medicoesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch =
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.cpf.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filter === 'todos') return true;

    const pacienteMedicoes = medicoes.filter((m) => m.paciente_id === paciente.id);
    const latestMedicao = pacienteMedicoes[0];

    if (!latestMedicao) return false;

    if (filter === 'pressao') {
      return latestMedicao.status === 'alerta' || latestMedicao.status === 'atencao';
    }

    if (filter === 'glicemia') {
      return latestMedicao.status === 'alerta' || latestMedicao.status === 'atencao';
    }

    return true;
  });

  const getLatestMedicao = (pacienteId: string) => {
    return medicoes.find((m) => m.paciente_id === pacienteId);
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
      <Header title="Pacientes" />
      
      <div className="max-w-md mx-auto p-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, CPF ou prontuário"
        />

        <div className="flex gap-2 my-4">
          <button
            onClick={() => setFilter('todos')}
            className={`flex-1 py-2 rounded-full font-semibold transition-all ${
              filter === 'todos' ? 'bg-cor-primaria text-white' : 'bg-cor-fundo-rosa text-cor-primaria'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pressao')}
            className={`flex-1 py-2 rounded-full font-semibold transition-all ${
              filter === 'pressao' ? 'bg-cor-primaria text-white' : 'bg-cor-fundo-rosa text-cor-primaria'
            }`}
          >
            Pressão
          </button>
          <button
            onClick={() => setFilter('glicemia')}
            className={`flex-1 py-2 rounded-full font-semibold transition-all ${
              filter === 'glicemia' ? 'bg-cor-primaria text-white' : 'bg-cor-fundo-rosa text-cor-primaria'
            }`}
          >
            Glicemia
          </button>
        </div>

        <div className="space-y-3">
          {filteredPacientes.length === 0 ? (
            <p className="text-center text-cor-texto">Nenhum paciente encontrado</p>
          ) : (
            filteredPacientes.map((paciente) => {
              const latestMedicao = getLatestMedicao(paciente.id);
              return (
                <Card
                  key={paciente.id}
                  variant="light"
                  onClick={() => navigate(`/medico/paciente/${paciente.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-cor-primaria">{paciente.nome}</p>
                      <p className="text-sm text-cor-texto">Idade: {paciente.idade} anos</p>
                      {latestMedicao && (
                        <>
                          <p className="text-sm text-cor-texto">
                            PA: {latestMedicao.sistolica}/{latestMedicao.diastolica} mmHg
                          </p>
                          <p className="text-sm text-cor-texto">
                            Glicemia: {latestMedicao.glicemia} mg/dL
                          </p>
                        </>
                      )}
                    </div>
                    {latestMedicao && <StatusIcon status={latestMedicao.status} />}
                  </div>
                  <button className="mt-2 text-cor-link underline text-sm">
                    Ver detalhes
                  </button>
                </Card>
              );
            })
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
