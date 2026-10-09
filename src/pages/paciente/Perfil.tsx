import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { BottomNav } from '../../components/BottomNav';
import { supabase } from '../../lib/supabase';
import { Paciente } from '../../types';
import toast from 'react-hot-toast';

export const Perfil = () => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo_sanguineo: '',
    altura: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSection, setShowSection] = useState<string | null>(null);

  useEffect(() => {
    fetchPaciente();
  }, []);

  const fetchPaciente = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setPaciente(data);
      setFormData({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        tipo_sanguineo: data.tipo_sanguineo,
        altura: data.altura.toString(),
      });
    } catch (error) {
      console.error('Error fetching paciente:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      const { error: pacienteError } = await supabase
        .from('pacientes')
        .update({
          tipo_sanguineo: formData.tipo_sanguineo,
          altura: parseFloat(formData.altura),
        })
        .eq('id', user.id);

      if (pacienteError) throw pacienteError;

      toast.success('Perfil atualizado com sucesso!');
      fetchPaciente();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!paciente) {
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
          {paciente.avatar_url ? (
            <img
              src={paciente.avatar_url}
              alt={paciente.nome}
              className="w-20 h-20 rounded-full object-cover border-2 border-cor-primaria"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-cor-primaria flex items-center justify-center text-white text-2xl font-bold">
              {paciente.nome.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-cor-primaria">{paciente.nome}</h2>
            <p className="text-sm text-cor-texto">{paciente.email}</p>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-cor-texto">Tipo Sanguíneo</label>
            <select
              name="tipo_sanguineo"
              value={formData.tipo_sanguineo}
              onChange={handleChange}
              className="w-full bg-cor-fundo-rosa border-2 border-cor-borda-input rounded-xl px-4 py-3 text-cor-texto shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <Input
            label="Altura (cm)"
            type="number"
            name="altura"
            value={formData.altura}
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
            onClick={() => setShowSection('agendamento')}
            className="w-full bg-cor-primaria text-white rounded-2xl p-4 font-semibold hover:bg-cor-primaria-hover transition-all"
          >
            Agendamento
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
          { label: 'Início', path: '/paciente/inicio', icon: '🏠' },
          { label: 'Consulta', path: '/paciente/consultas', icon: '📅' },
          { label: 'Saúde', path: '/paciente/saude', icon: '❤️' },
          { label: 'Médicos', path: '/paciente/medicos', icon: '👨‍⚕️' },
        ]}
      />

      {/* Modal Sections */}
      {showSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-cor-primaria mb-4 capitalize">
              {showSection.replace('-', ' ')}
            </h3>
            <p className="text-cor-texto mb-4">
              {showSection === 'dados' && 'Informações detalhadas dos seus dados pessoais.'}
              {showSection === 'agendamento' && 'Gerencie seus agendamentos de consultas.'}
              {showSection === 'exames' && 'Visualize seus exames e resultados.'}
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
