import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateCPF, validateEmail, validatePhone, calculateAge } from '../utils/validations';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const CadastroPaciente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    data_nascimento: '',
    tipo_sanguineo: 'O+',
    altura: '170',
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
      if (!validateCPF(formData.cpf)) {
        toast.error('CPF inválido');
        setLoading(false);
        return;
      }

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

      if (!formData.data_nascimento) {
        toast.error('Data de nascimento obrigatória');
        setLoading(false);
        return;
      }

      const idade = calculateAge(formData.data_nascimento);
      if (idade < 0 || idade > 120) {
        toast.error('Data de nascimento inválida');
        setLoading(false);
        return;
      }

      // Primeiro, verificar se as tabelas existem tentando uma query simples
      const { error: tablesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (tablesError) {
        console.error('Tabelas não existem:', tablesError);
        throw new Error('As tabelas do banco de dados não existem. Execute o SQL completo (001_reset.sql) no Supabase SQL Editor.');
      }

      // Verificar se e-mail já existe no auth
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });

      if (!checkError && existingUser.user) {
        throw new Error('Este e-mail já está cadastrado. Faça login.');
      }

      // Fazer signup sem confirmação de e-mail
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('User already registered')) {
          throw new Error('Este e-mail já está cadastrado. Faça login.');
        }
        throw new Error(`Erro no cadastro: ${error.message}`);
      }

      console.log('Signup successful, user:', data.user);

      // Criar profile manualmente após signup
      if (data.user) {
        console.log('Attempting to create profile...');
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role: 'paciente',
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error(`Erro ao criar profile: ${profileError.message}. Código: ${profileError.code}`);
        }

        console.log('Profile created successfully');

        // Criar paciente manualmente
        console.log('Attempting to create paciente...');
        const { error: pacienteError } = await supabase
          .from('pacientes')
          .insert({
            id: data.user.id,
            cpf: formData.cpf,
            data_nascimento: formData.data_nascimento,
            idade: idade,
            tipo_sanguineo: formData.tipo_sanguineo,
            altura: parseFloat(formData.altura),
            genero: formData.genero,
            doencas_cronicas: [],
          });

        if (pacienteError) {
          console.error('Error creating paciente:', pacienteError);
          throw new Error(`Erro ao criar paciente: ${pacienteError.message}. Código: ${pacienteError.code}`);
        }

        console.log('Paciente created successfully');
      }

      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      console.error('Full error:', error);
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
          
          <h2 className="text-2xl font-bold text-cor-primaria mb-6 text-center">Cadastro de Paciente</h2>

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
            label="CPF"
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
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
          <Input
            label="Data de Nascimento"
            type="date"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            required
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
            placeholder="170"
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
