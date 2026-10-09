import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const NovaTriagem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_paciente: '',
    data: '',
    horario: '',
    profissional: '',
    queixa_principal: '',
    classificacao: 'verde' as 'verde' | 'amarela' | 'vermelha',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar paciente pelo nome ou CPF
      const { data: pacienteData, error: pacienteError } = await supabase
        .from('pacientes')
        .select('id')
        .or(`nome.ilike.%${formData.nome_paciente}%,cpf.eq.${formData.nome_paciente}`)
        .single();

      if (pacienteError || !pacienteData) {
        toast.error('Paciente não encontrado');
        setLoading(false);
        return;
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('triagens').insert({
        paciente_id: pacienteData.id,
        medico_id: user.id,
        nome_paciente: formData.nome_paciente,
        data: formData.data,
        horario: formData.horario,
        profissional: formData.profissional,
        queixa_principal: formData.queixa_principal,
        classificacao: formData.classificacao,
      });

      if (error) throw error;

      // Criar alerta automático se triagem for vermelha
      if (formData.classificacao === 'vermelha') {
        await supabase.from('alertas').insert({
          paciente_id: pacienteData.id,
          medico_id: user.id,
          tipo: 'triagem',
          titulo: 'Triagem Vermelha',
          descricao: `Triagem classificada como vermelha: ${formData.queixa_principal}`,
          status: 'alerta',
        });
      }

      toast.success('Triagem salva com sucesso!');
      navigate('/medico/consultas');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar triagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cor-fundo">
      <Header showBack title="Nova Triagem" />
      
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Paciente"
            type="text"
            name="nome_paciente"
            value={formData.nome_paciente}
            onChange={handleChange}
            placeholder="Nome ou CPF do paciente"
            required
          />
          <Input
            label="Data"
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
          <Input
            label="Horário"
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
          />
          <Input
            label="Profissional"
            type="text"
            name="profissional"
            value={formData.profissional}
            onChange={handleChange}
            placeholder="Nome do profissional"
            required
          />
          <Input
            label="Queixa Principal"
            type="text"
            name="queixa_principal"
            value={formData.queixa_principal}
            onChange={handleChange}
            placeholder="Descreva a queixa principal"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-cor-texto">Classificação</label>
            <select
              name="classificacao"
              value={formData.classificacao}
              onChange={handleChange}
              className="w-full bg-cor-fundo-rosa border-2 border-cor-borda-input rounded-xl px-4 py-3 text-cor-texto shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="verde">Verde</option>
              <option value="amarela">Amarela</option>
              <option value="vermelha">Vermelha</option>
            </select>
          </div>

          <div className="space-y-3 pt-4">
            <Button type="submit" loading={loading} className="w-full">
              Salvar Triagem
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
