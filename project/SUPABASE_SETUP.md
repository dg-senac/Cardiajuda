# Configuração do Supabase

Este projeto foi integrado com Supabase para armazenamento de dados persistentes.

## 1. Criar projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Dê um nome ao projeto (ex: cardiajuda)
5. Defina uma senha de banco de dados
6. Escolha a região mais próxima
7. Aguarde o projeto ser criado

## 2. Configurar variáveis de ambiente

Após criar o projeto, você precisará das credenciais:

1. No painel do Supabase, vá em Settings > API
2. Copie `Project URL` e `anon public key`
3. Crie um arquivo `.env` na raiz do projeto:

```bash
EXPO_PUBLIC_SUPABASE_URL=seu_project_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Ou copie o arquivo `.env.example` e renomeie para `.env`:

```bash
cp .env.example .env
```

## 3. Executar o schema SQL

1. No painel do Supabase, vá em SQL Editor
2. Crie uma nova query
3. Copie o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e execute (Execute)

Isso criará as tabelas:
- `users` - Dados do perfil do usuário
- `appointments` - Agendamentos de consultas
- `health_records` - Registros de pressão e glicemia
- `doctors` - Lista de médicos disponíveis

## 4. Estrutura das tabelas

### users
- id (UUID)
- email (VARCHAR)
- full_name (VARCHAR)
- phone (VARCHAR)
- age (INTEGER)
- blood_type (VARCHAR)
- height (DECIMAL)
- avatar_url (TEXT)
- member_since (DATE)

### appointments
- id (UUID)
- user_id (UUID)
- date (VARCHAR)
- time (VARCHAR)
- doctor_name (VARCHAR)
- specialty (VARCHAR)
- status (VARCHAR)

### health_records
- id (UUID)
- user_id (UUID)
- date (VARCHAR)
- systolic (INTEGER)
- diastolic (INTEGER)
- glucose (INTEGER)
- warning (BOOLEAN)

### doctors
- id (SERIAL)
- name (VARCHAR)
- specialty (VARCHAR)
- rating (DECIMAL)

## 5. Segurança (RLS)

O schema já inclui políticas de Row Level Security (RLS) para garantir que:
- Usuários só possam ver seus próprios dados
- Usuários só possam modificar seus próprios registros
- A lista de médicos é pública para consulta

## 6. Testar a integração

1. Configure as variáveis de ambiente
2. Execute o schema SQL no Supabase
3. Execute o app:

```bash
npm start
```

O app agora buscará e salvará dados no Supabase em vez de usar dados locais.
