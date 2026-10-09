import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export const SetupInstructions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cor-fundo via-cor-fundo-rosa/50 to-cor-fundo-rosa flex items-center justify-center p-4">
      <div className="w-full max-w-2xl fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-cor-primaria/20">
          <Logo />
          
          <h2 className="text-2xl font-bold text-cor-primaria mb-6 text-center">
            ⚠️ Configuração do Banco de Dados Necessária
          </h2>

          <div className="bg-status-alerta/10 border-2 border-status-alerta rounded-xl p-4 mb-6">
            <p className="text-status-alerta font-bold mb-2">
              O banco de dados Supabase não está configurado!
            </p>
            <p className="text-cor-texto text-sm">
              Para usar o CardiAjuda, você precisa executar o SQL de migração no Supabase.
            </p>
            <p className="text-cor-texto text-sm mt-2">
              <strong>Erro atual:</strong> "Database error saving new user" - Isso indica que o Supabase Auth está com problema, provavelmente porque o SQL não foi executado completamente.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-cor-primaria">Passo a Passo:</h3>
            
            <div className="bg-cor-fundo-rosa rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-cor-primaria text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div>
                  <p className="font-semibold text-cor-primaria">Acesse o SQL Editor</p>
                  <p className="text-sm text-cor-texto">
                    <a 
                      href="https://supabase.com/dashboard/project/wogpnfjpcngwjfocmpvy/sql" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cor-link underline hover:text-cor-primaria-hover"
                    >
                      Clique aqui para abrir o SQL Editor
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cor-fundo-rosa rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-cor-primaria text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <p className="font-semibold text-cor-primaria">Copie o SQL</p>
                  <p className="text-sm text-cor-texto">
                    Abra o arquivo <code className="bg-white px-2 py-1 rounded">supabase/migrations/001_reset.sql</code> no seu projeto e copie todo o conteúdo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cor-fundo-rosa rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-cor-primaria text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <p className="font-semibold text-cor-primaria">Cole e Execute</p>
                  <p className="text-sm text-cor-texto">
                    Cole o SQL no editor e clique no botão <strong>"Run"</strong>. Execute o arquivo INTEIRO de uma vez.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cor-fundo-rosa rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="bg-cor-primaria text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</span>
                <div>
                  <p className="font-semibold text-cor-primaria">Recarregue a página</p>
                  <p className="text-sm text-cor-texto">
                    Após executar o SQL, recarregue esta página e tente o cadastro novamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cor-fundo-rosa/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-cor-texto">
              <strong>O que o SQL faz?</strong>
            </p>
            <ul className="text-sm text-cor-texto mt-2 space-y-1 list-disc list-inside">
              <li>Cria todas as tabelas necessárias (profiles, pacientes, medicos, etc.)</li>
              <li>Configura o trigger automático para criar profiles após cadastro</li>
              <li>Configura as permissões de segurança (RLS)</li>
              <li>Insere dados de exemplo (planos, cardápio semanal)</li>
            </ul>
          </div>

          <div className="bg-status-atencao/10 border-2 border-status-atencao rounded-xl p-4 mb-6">
            <p className="text-status-atencao font-bold mb-2">
              Solução Alternativa
            </p>
            <p className="text-cor-texto text-sm">
              Se você executou o SQL e ainda está com erro, pode ser que o trigger antigo ainda está ativo. Execute este SQL para remover o trigger problemático:
            </p>
            <pre className="bg-white p-3 rounded-lg text-xs mt-2 overflow-x-auto">
              DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            </pre>
          </div>

          <div className="bg-status-normal/10 border-2 border-status-normal rounded-xl p-4 mb-6">
            <p className="text-status-normal font-bold mb-2">
              Erro: "new row violates row-level security policy"?
            </p>
            <p className="text-cor-texto text-sm">
              Se aparecer este erro, execute o SQL <code className="bg-white px-2 py-1 rounded">004_fix_rls.sql</code> para corrigir as políticas de segurança (RLS).
            </p>
          </div>

          <Button onClick={() => navigate('/login')} className="w-full">
            Entendi, Vou para o Login
          </Button>
        </div>
      </div>
    </div>
  );
};
