import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Medico } from '../../types';
import toast from 'react-hot-toast';

export const MedicoPerfil = () => {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSection, setShowSection] = useState<string | null>(null);

  useEffect(() => {
    fetchMedico();
  }, []);

  const fetchMedico = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('medicos')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setMedico(data);
      setFormData({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      });
    } catch (error) {
      console.error('Error fetching medico:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
      fetchMedico();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!medico) {
    return (
      <div className="min-h-screen bg-cor-fundo flex items-center justify-center">
        <p className="text-cor-primaria font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cor-fundo pb-20">
      <Header title="Meu Perfil" />
      
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          {medico.avatar_url ? (
            <img
              src={medico.avatar_url}
              alt={medico.nome}
              className="w-20 h-20 rounded-full object-cover border-2 border-cor-primaria"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-cor-primaria flex items-center justify-center text-white text-2xl font-bold">
              {medico.nome.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-cor-primaria">{medico.nome}</h2>
            <p className="text-sm text-cor-texto">{medico.email}</p>
            <p className="text-sm text-cor-texto">⭐ {medico.avaliacao.toFixed(1)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Nome"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          <Input
            label="Telefone"
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />

          <Button onClick={handleSave} loading={loading} className="w-full">
            Salvar Alterações
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => setShowSection('dados')}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setShowSection('agenda')}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Agenda
          </button>
          <button
            onClick={() => setShowSection('exames')}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Exames e Resultados
          </button>
          <button
            onClick={() => setShowSection('alertas')}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Alertas de Saúde
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

      {/* Modal Sections */}
      {showSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-cor-primaria mb-4 capitalize">
              {showSection}
            </h3>
            <p className="text-cor-texto mb-4">
              {showSection === 'dados' && 'Informações detalhadas dos seus dados pessoais.'}
              {showSection === 'agenda' && 'Gerencie sua agenda de atendimentos.'}
              {showSection === 'exames' && 'Visualize exames e resultados de pacientes.'}
              {showSection === 'alertas' && 'Configure seus alertas de saúde.'}
            </p>
            <button
              onClick={() => setShowSection(null)}
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
