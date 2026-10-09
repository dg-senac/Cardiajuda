# CardiAjuda

App mobile-first para acompanhamento de saúde cardiovascular, conectando pacientes e médicos.

## Stack

- React + Vite + TypeScript
- React Router
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Recharts (gráficos)
- React Hot Toast (notificações)

## Instalação

1. Clone o repositório e navegue até a pasta:
```bash
cd Cardiajuda
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

## Configuração do Banco de Dados

1. Acesse o SQL Editor do Supabase (https://supabase.com/dashboard/project/seu-projeto/sql)
2. Copie todo o conteúdo do arquivo `supabase/migrations/001_reset.sql`
3. Cole no SQL Editor e execute (clique em "Run")
4. Isso irá:
   - Remover todas as tabelas antigas
   - Criar todas as tabelas necessárias
   - Configurar RLS (Row Level Security)
   - Criar trigger automático para profiles/pacientes/medicos
   - Inserir dados de seed (planos, cardápio)

**IMPORTANTE**: O arquivo SQL deve ser executado inteiro de uma vez no SQL Editor do Supabase. Não execute parcialmente.

## Configuração do Google OAuth (Opcional)

1. No dashboard do Supabase, vá em Authentication > Providers
2. Habilite o Google provider
3. Configure as credenciais do OAuth (Google Cloud Console)
4. Adicione o callback URL do seu app (em desenvolvimento: http://localhost:5173/auth/callback)

## Executar o projeto

```bash
npm run dev
```

O app estará disponível em http://localhost:5173

## Build para produção

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── hooks/          # Hooks customizados
├── lib/            # Configurações (Supabase, etc)
├── types/          # Tipos TypeScript
└── main.tsx        # Entry point
```

## Funcionalidades

### Paciente
- Login/Cadastro (e-mail, CPF, senha)
- Dashboard com lembretes e informações diárias
- Agendamento de consultas
- Registro de pressão arterial e glicemia
- Visualização de cardápio semanal
- Planos e assinaturas
- Perfil editável

### Médico
- Login/Cadastro (e-mail, CRM, senha)
- Dashboard com contadores de triagens e consultas
- Realização de triagens
- Agendamento de consultas
- Busca e listagem de pacientes
- Visualização de histórico com gráficos
- Sistema de alertas e pendências
- Perfil editável

## Regras de Negócio

- Classificação da pressão:
  - Normal: sistólica <130 e diastólica <85
  - Atenção: 130–139 ou 85–89
  - Alerta: ≥140 ou ≥90

- Classificação da glicemia (jejum):
  - Alerta: <70 (hipoglicemia)
  - Normal: 70–99
  - Atenção: 100–125
  - Alerta: ≥126

- Status final da medição = pior entre pressão e glicemia
- Medições com status "atencao" ou "alerta" geram alertas automáticos
- Triagem vermelha também gera alerta
