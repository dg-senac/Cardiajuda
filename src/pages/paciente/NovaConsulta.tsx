import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

import toast from 'react-hot-toast';

export const NovaConsulta = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome_paciente: '',
    data: '',
    horario: '',
    profissional: '',
    especialidade: '',
    motivo: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
          .from('pacientes')
          .select('nome')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setFormData({ ...formData, nome_paciente: data.nome });
      } catch (error) {
        console.error('Error fetching paciente:', error);
      }
    };
    fetchPaciente();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuário não autenticado');

      // Validar data não pode ser no passado
      const selectedDate = new Date(formData.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('A data não pode ser no passado');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('consultas').insert({
        paciente_id: user.id,
        nome_paciente: formData.nome_paciente,
        data: formData.data,
        horario: formData.horario,
        profissional: formData.profissional,
        especialidade: formData.especialidade,
        motivo: formData.motivo,
        status: 'agendada',
      });

      if (error) throw error;

      toast.success('Consulta agendada com sucesso!');
      navigate('/paciente/consultas');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao agendar consulta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cor-fundo">
      <Header showBack title="Nova Consulta" />
      
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Paciente"
            type="text"
            name="nome_paciente"
            value={formData.nome_paciente}
            onChange={handleChange}
            disabled
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
            label="Especialidade"
            type="text"
            name="especialidade"
            value={formData.especialidade}
            onChange={handleChange}
            placeholder="Ex: Cardiologia"
            required
          />
          <Input
            label="Motivo"
            type="text"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Descreva o motivo da consulta"
            required
          />

          <div className="space-y-3 pt-4">
            <Button type="submit" loading={loading} className="w-full">
              Salvar Consulta
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
