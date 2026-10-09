import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { StatusIcon } from '../../components/StatusIcon';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Medicao } from '../../types';
import { getMeasurementStatus, formatDateTime } from '../../utils/validations';
import toast from 'react-hot-toast';

export const Saude = () => {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [glicemia, setGlicemia] = useState('');
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicoes();
  }, []);

  const fetchMedicoes = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('medicoes')
        .select('*')
        .eq('paciente_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMedicoes(data || []);
    } catch (error) {
      console.error('Error fetching medicoes:', error);
    }
  };

  const handleClear = (field: 'sistolica' | 'diastolica' | 'glicemia') => {
    if (field === 'sistolica') setSistolica('');
    if (field === 'diastolica') setDiastolica('');
    if (field === 'glicemia') setGlicemia('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuário não autenticado');

      const sistolicaNum = parseInt(sistolica);
      const diastolicaNum = parseInt(diastolica);
      const glicemiaNum = parseInt(glicemia);

      if (isNaN(sistolicaNum) || isNaN(diastolicaNum) || isNaN(glicemiaNum)) {
        toast.error('Preencha todos os campos com valores válidos');
        setLoading(false);
        return;
      }

      const status = getMeasurementStatus(sistolicaNum, diastolicaNum, glicemiaNum);

      const { error } = await supabase.from('medicoes').insert({
        paciente_id: user.id,
        sistolica: sistolicaNum,
        diastolica: diastolicaNum,
        glicemia: glicemiaNum,
        status,
      });

      if (error) throw error;

      // Criar alerta automático se status for atenção ou alerta
      if (status === 'atencao' || status === 'alerta') {
        await supabase.from('alertas').insert({
          paciente_id: user.id,
          tipo: 'medição',
          titulo: `Medição com status: ${status}`,
          descricao: `Pressão: ${sistolicaNum}/${diastolicaNum} mmHg, Glicemia: ${glicemiaNum} mg/dL`,
          status: status === 'alerta' ? 'alerta' : 'pendente',
        });
      }

      toast.success('Medição salva com sucesso!');
      setSistolica('');
      setDiastolica('');
      setGlicemia('');
      fetchMedicoes();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar medição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cor-fundo pb-20 bg-gradient-to-b from-cor-fundo to-cor-fundo-rosa/30">
      <Header title="Saúde" />
      
      <div className="max-w-md mx-auto p-4 fade-in">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Card variant="light" className="hover">
            <h3 className="font-bold text-cor-primaria mb-3">Pressão Arterial (mmHg)</h3>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  label="Sistólica"
                  type="number"
                  value={sistolica}
                  onChange={(e) => setSistolica(e.target.value)}
                  placeholder="120"
                  required
                />
              </div>
              {sistolica && (
                <button
                  type="button"
                  onClick={() => handleClear('sistolica')}
                  className="text-status-alerta font-bold text-xl"
                >
                  X
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  label="Diastólica"
                  type="number"
                  value={diastolica}
                  onChange={(e) => setDiastolica(e.target.value)}
                  placeholder="80"
                  required
                />
              </div>
              {diastolica && (
                <button
                  type="button"
                  onClick={() => handleClear('diastolica')}
                  className="text-status-alerta font-bold text-xl"
                >
                  X
                </button>
              )}
            </div>
          </Card>

          <Card variant="light" className="hover">
            <h3 className="font-bold text-cor-primaria mb-3">Glicemia (mg/dL)</h3>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  label="Glicemia"
                  type="number"
                  value={glicemia}
                  onChange={(e) => setGlicemia(e.target.value)}
                  placeholder="90"
                  required
                />
              </div>
              {glicemia && (
                <button
                  type="button"
                  onClick={() => handleClear('glicemia')}
                  className="text-status-alerta font-bold text-xl"
                >
                  X
                </button>
              )}
            </div>
          </Card>

          <Button type="submit" loading={loading} className="w-full">
            Salvar Medição
          </Button>
        </form>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-cor-primaria">Últimos Registros</h3>
          <button className="text-cor-link underline text-sm">Histórico</button>
        </div>

        <div className="space-y-3">
          {medicoes.length === 0 ? (
            <p className="text-center text-cor-texto">Nenhuma medição registrada</p>
          ) : (
            medicoes.map((medicao) => (
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
