import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Medico } from '../../types';

export const Medicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      const { data, error } = await supabase
        .from('medicos')
        .select('*')
        .order('avaliacao', { ascending: false });

      if (error) throw error;
      setMedicos(data || []);
    } catch (error) {
      console.error('Error fetching medicos:', error);
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
      <Header title="Médicos" />
      
      <div className="max-w-md mx-auto p-4">
        {medicos.length === 0 ? (
          <p className="text-center text-cor-texto">Nenhum médico cadastrado</p>
        ) : (
          <div className="space-y-3">
            {medicos.map((medico) => (
              <Card
                key={medico.id}
                variant="light"
                onClick={() => setSelectedMedico(medico)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {medico.avatar_url ? (
                    <img
                      src={medico.avatar_url}
                      alt={medico.nome}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cor-primaria"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cor-primaria flex items-center justify-center text-white font-bold">
                      {medico.nome.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-cor-primaria">{medico.nome}</p>
                    <p className="text-sm text-cor-texto">{medico.especialidade}</p>
                    <p className="text-sm text-cor-texto">⭐ {medico.avaliacao.toFixed(1)}</p>
                  </div>
                  <span className="text-cor-primaria text-2xl">→</span>
                </div>
              </Card>
            ))}
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

      {/* Modal Detalhes do Médico */}
      {selectedMedico && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              {selectedMedico.avatar_url ? (
                <img
                  src={selectedMedico.avatar_url}
                  alt={selectedMedico.nome}
                  className="w-20 h-20 rounded-full object-cover border-2 border-cor-primaria"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-cor-primaria flex items-center justify-center text-white text-2xl font-bold">
                  {selectedMedico.nome.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-cor-primaria">{selectedMedico.nome}</h3>
                <p className="text-sm text-cor-texto">{selectedMedico.especialidade}</p>
                <p className="text-sm text-cor-texto">⭐ {selectedMedico.avaliacao.toFixed(1)}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-cor-texto">
                <span className="font-semibold">CRM:</span> {selectedMedico.crm}
              </p>
              <p className="text-sm text-cor-texto">
                <span className="font-semibold">Formação:</span> {selectedMedico.formacao}
              </p>
              <p className="text-sm text-cor-texto">
                <span className="font-semibold">Consultas feitas:</span> {selectedMedico.consultas_feitas}
              </p>
              <p className="text-sm text-cor-texto">
                <span className="font-semibold">Gênero:</span> {selectedMedico.genero}
              </p>
            </div>

            <button
              onClick={() => setSelectedMedico(null)}
              className="w-full bg-cor-primaria text-white rounded-full py-3 font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
