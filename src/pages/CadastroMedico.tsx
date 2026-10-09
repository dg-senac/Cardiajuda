import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateEmail, validatePhone } from '../utils/validations';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const CadastroMedico = () => {
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    formacao: '',
    telefone: '',
    email: '',
    senha: '',
    genero: 'Não informado',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!validateEmail(formData.email)) {
        toast.error('E-mail inválido');
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.telefone)) {
        toast.error('Telefone inválido');
        setLoading(false);
        return;
      }

      if (formData.senha.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }

      if (!formData.crm || formData.crm.length < 5) {
        toast.error('CRM inválido');
        setLoading(false);
        return;
      }

      // Cadastro sem metadata (para evitar erro do trigger)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (error) {
        // Se erro for 500, provavelmente é porque o SQL não foi executado
        if (error.status === 500) {
          throw new Error('Banco de dados não configurado. Execute o SQL no Supabase primeiro.');
        }
        throw error;
      }

      // Criar profile manualmente após signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role: 'medico',
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          if (profileError.code === '42P01') {
            throw new Error('Tabela profiles não existe. Execute o SQL no Supabase.');
          }
          // Continuar mesmo se profile falhar
        }

        // Criar médico manualmente
        const { error: medicoError } = await supabase
          .from('medicos')
          .insert({
            id: data.user.id,
            crm: formData.crm,
            especialidade: formData.especialidade,
            formacao: formData.formacao,
            genero: formData.genero,
            avaliacao: 0.0,
            consultas_feitas: 0,
          });

        if (medicoError) {
          console.error('Error creating medico:', medicoError);
          if (medicoError.code === '42P01') {
            throw new Error('Tabela medicos não existe. Execute o SQL no Supabase.');
          }
        }
      }

      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cor-fundo via-cor-fundo-rosa/50 to-cor-fundo-rosa flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-cor-primaria/20">
          <Logo />
          
          <h2 className="text-2xl font-bold text-cor-primaria mb-6 text-center">Cadastro de Médico</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            required
          />
          <Input
            label="CRM"
            type="text"
            name="crm"
            value={formData.crm}
            onChange={handleChange}
            placeholder="Digite seu CRM"
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
            label="Formação"
            type="text"
            name="formacao"
            value={formData.formacao}
            onChange={handleChange}
            placeholder="Ex: USP - 2015"
            required
          />
          <Input
            label="Telefone"
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            required
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-cor-texto">Gênero</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full bg-cor-fundo-rosa border-2 border-cor-borda-input rounded-xl px-4 py-3 text-cor-texto shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="Não informado">Não informado</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Cadastrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-cor-link underline font-semibold hover:text-cor-primaria-hover transition-colors">
            Já tem conta? Login
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};
