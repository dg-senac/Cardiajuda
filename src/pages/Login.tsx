import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateEmail } from '../utils/validations';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const Login = () => {
  const [role, setRole] = useState<'paciente' | 'medico'>('paciente');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let email = identifier;

      // Se for CPF ou CRM, buscar o email correspondente
      if (!validateEmail(identifier)) {
        const column = role === 'paciente' ? 'cpf' : 'crm';
        
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq(column, identifier)
          .single();

        if (error || !data) {
          toast.error(`${role === 'paciente' ? 'CPF' : 'CRM'} não encontrado`);
          setLoading(false);
          return;
        }

        email = data.email;
      }

      const { error } = await signIn(email, password);
      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      navigate(role === 'paciente' ? '/paciente/inicio' : '/medico/inicio');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Erro ao fazer login com Google');
    }
  };

  const handleAppleSignIn = () => {
    toast.error('Login com Apple em breve');
  };

  const handleForgotPassword = async () => {
    if (!identifier || !validateEmail(identifier)) {
      toast.error('Digite um e-mail válido para redefinir a senha');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(identifier);
    if (error) {
      toast.error('Erro ao enviar e-mail de redefinição');
    } else {
      toast.success('E-mail de redefinição enviado!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cor-fundo via-cor-fundo-rosa/50 to-cor-fundo-rosa flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-cor-primaria/20">
          <Logo />
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRole('paciente')}
              className={`flex-1 py-3 rounded-full font-bold transition-all shadow-md ${
                role === 'paciente' 
                  ? 'bg-cor-primaria text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                  : 'bg-cor-fundo-rosa text-cor-primaria hover:bg-cor-fundo-rosa-2'
              }`}
            >
              Paciente
            </button>
            <button
              onClick={() => setRole('medico')}
              className={`flex-1 py-3 rounded-full font-bold transition-all shadow-md ${
                role === 'medico' 
                  ? 'bg-cor-primaria text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                  : 'bg-cor-fundo-rosa text-cor-primaria hover:bg-cor-fundo-rosa-2'
              }`}
            >
              Médico
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={role === 'paciente' ? 'E-mail ou CPF' : 'E-mail ou CRM'}
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={role === 'paciente' ? 'Digite seu e-mail ou CPF' : 'Digite seu e-mail ou CRM'}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />

            <div className="flex justify-end items-center text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-cor-link underline font-semibold hover:text-cor-primaria-hover transition-colors"
              >
                Esqueci a senha?
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cor-primaria/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-cor-texto font-semibold">Ou entre com</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="flex-1 bg-white border-2 border-cor-primaria rounded-full py-3 font-bold text-cor-primaria hover:bg-cor-fundo-rosa hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">G</span>
                <span>Google</span>
              </button>
              <button
                onClick={handleAppleSignIn}
                className="flex-1 bg-white border-2 border-cor-primaria rounded-full py-3 font-bold text-cor-primaria hover:bg-cor-fundo-rosa hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">🍎</span>
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="bg-cor-fundo-rosa rounded-xl p-4 text-center">
              <p className="text-sm text-cor-texto mb-2">Não tem uma conta?</p>
              <Link 
                to="/cadastro-paciente" 
                className="inline-block bg-cor-primaria text-white px-6 py-2 rounded-full font-bold hover:bg-cor-primaria-hover transition-all shadow-md hover:shadow-lg"
              >
                Cadastre-se como Paciente
              </Link>
            </div>
            <div className="bg-cor-fundo-rosa rounded-xl p-4 text-center">
              <Link 
                to="/cadastro-medico" 
                className="inline-block bg-cor-primaria text-white px-6 py-2 rounded-full font-bold hover:bg-cor-primaria-hover transition-all shadow-md hover:shadow-lg"
              >
                Cadastre-se como Médico
              </Link>
            </div>
            <p className="text-sm text-cor-texto text-center mt-4">
              Precisa de ajuda? <span className="text-cor-link underline font-bold cursor-pointer hover:text-cor-primaria-hover transition-colors">Fale Conosco</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
