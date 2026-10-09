-- Migration 001: Reset e criação completa do banco de dados CardiAjuda
-- Execute este arquivo no SQL Editor do Supabase

-- 1. DROP de todas as tabelas, policies, funções e triggers do schema public
DROP TABLE IF EXISTS assinaturas CASCADE;
DROP TABLE IF EXISTS planos CASCADE;
DROP TABLE IF EXISTS cardapio_semanal CASCADE;
DROP TABLE IF EXISTS lembretes CASCADE;
DROP TABLE IF EXISTS pendencias CASCADE;
DROP TABLE IF EXISTS alertas CASCADE;
DROP TABLE IF EXISTS medicoes CASCADE;
DROP TABLE IF EXISTS triagens CASCADE;
DROP TABLE IF EXISTS consultas CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- 2. Criação das tabelas

-- Tabela profiles (ligada a auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('paciente', 'medico')),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela pacientes
CREATE TABLE pacientes (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  cpf TEXT UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  idade INTEGER NOT NULL,
  tipo_sanguineo TEXT NOT NULL,
  altura NUMERIC(5,2) NOT NULL,
  genero TEXT NOT NULL,
  doencas_cronicas TEXT[] DEFAULT '{}',
  plano TEXT
);

-- Tabela medicos
CREATE TABLE medicos (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  crm TEXT UNIQUE NOT NULL,
  especialidade TEXT NOT NULL,
  formacao TEXT NOT NULL,
  genero TEXT NOT NULL,
  avaliacao NUMERIC(2,1) DEFAULT 0.0,
  consultas_feitas INTEGER DEFAULT 0
);

-- Tabela consultas
CREATE TABLE consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  medico_id UUID REFERENCES medicos(id) ON DELETE SET NULL,
  nome_paciente TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  profissional TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela triagens
CREATE TABLE triagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  medico_id UUID REFERENCES medicos(id) ON DELETE CASCADE NOT NULL,
  nome_paciente TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  profissional TEXT NOT NULL,
  queixa_principal TEXT NOT NULL,
  classificacao TEXT NOT NULL CHECK (classificacao IN ('verde', 'amarela', 'vermelha')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela medicoes
CREATE TABLE medicoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  sistolica INTEGER NOT NULL,
  diastolica INTEGER NOT NULL,
  glicemia INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('normal', 'atencao', 'alerta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela alertas
CREATE TABLE alertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  medico_id UUID REFERENCES medicos(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('alerta', 'pendente', 'em_dia')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela pendencias
CREATE TABLE pendencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medico_id UUID REFERENCES medicos(id) ON DELETE CASCADE NOT NULL,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela lembretes
CREATE TABLE lembretes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  horario TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela cardapio_semanal
CREATE TABLE cardapio_semanal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_semana TEXT NOT NULL,
  refeicao TEXT NOT NULL,
  descricao TEXT NOT NULL
);

-- Tabela planos
CREATE TABLE planos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL
);

-- Tabela assinaturas
CREATE TABLE assinaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  plano_id UUID REFERENCES planos(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Trigger para criar profiles/pacientes/medicos automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar profile
  INSERT INTO profiles (id, role, nome, email, telefone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'nome',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'telefone', '')
  );

  -- Criar paciente ou médico dependendo do role
  IF NEW.raw_user_meta_data->>'role' = 'paciente' THEN
    INSERT INTO pacientes (id, cpf, data_nascimento, idade, tipo_sanguineo, altura, genero, doencas_cronicas)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'cpf',
      NEW.raw_user_meta_data->>'data_nascimento',
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, (NEW.raw_user_meta_data->>'data_nascimento')::DATE))::INTEGER,
      COALESCE(NEW.raw_user_meta_data->>'tipo_sanguineo', 'O+'),
      COALESCE((NEW.raw_user_meta_data->>'altura')::NUMERIC, 170),
      COALESCE(NEW.raw_user_meta_data->>'genero', 'Não informado'),
      COALESCE(NEW.raw_user_meta_data->>'doencas_cronicas', '{}')
    );
  ELSIF NEW.raw_user_meta_data->>'role' = 'medico' THEN
    INSERT INTO medicos (id, crm, especialidade, formacao, genero)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'crm',
      NEW.raw_user_meta_data->>'especialidade',
      NEW.raw_user_meta_data->>'formacao',
      COALESCE(NEW.raw_user_meta_data->>'genero', 'Não informado')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE triagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardapio_semanal ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Usuários podem ver seu próprio profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies para pacientes
CREATE POLICY "Pacientes podem ver seus próprios dados"
  ON pacientes FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Pacientes podem atualizar seus próprios dados"
  ON pacientes FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Médicos podem ver dados de pacientes"
  ON pacientes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- Policies para medicos
CREATE POLICY "Médicos podem ver seus próprios dados"
  ON medicos FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Médicos podem atualizar seus próprios dados"
  ON medicos FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Todos podem ver dados de médicos"
  ON medicos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies para consultas
CREATE POLICY "Pacientes podem ver suas consultas"
  ON consultas FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem criar consultas"
  ON consultas FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Médicos podem ver todas as consultas"
  ON consultas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

CREATE POLICY "Médicos podem criar consultas"
  ON consultas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- Policies para triagens
CREATE POLICY "Pacientes podem ver suas triagens"
  ON triagens FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Médicos podem ver todas as triagens"
  ON triagens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

CREATE POLICY "Médicos podem criar triagens"
  ON triagens FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- Policies para medicoes
CREATE POLICY "Pacientes podem ver suas medições"
  ON medicoes FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem criar medições"
  ON medicoes FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Médicos podem ver todas as medições"
  ON medicoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- Policies para alertas
CREATE POLICY "Pacientes podem ver seus alertas"
  ON alertas FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Médicos podem ver alertas de seus pacientes"
  ON alertas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

CREATE POLICY "Médicos podem criar alertas"
  ON alertas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- Policies para pendencias
CREATE POLICY "Médicos podem ver suas pendências"
  ON pendencias FOR SELECT
  USING (auth.uid() = medico_id);

CREATE POLICY "Médicos podem criar pendências"
  ON pendencias FOR INSERT
  WITH CHECK (auth.uid() = medico_id);

CREATE POLICY "Médicos podem atualizar pendências"
  ON pendencias FOR UPDATE
  USING (auth.uid() = medico_id);

-- Policies para lembretes
CREATE POLICY "Pacientes podem ver seus lembretes"
  ON lembretes FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem criar lembretes"
  ON lembretes FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem atualizar seus lembretes"
  ON lembretes FOR UPDATE
  USING (auth.uid() = paciente_id);

-- Policies para cardapio_semanal (leitura pública autenticada)
CREATE POLICY "Usuários autenticados podem ver cardápio"
  ON cardapio_semanal FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies para planos (leitura pública autenticada)
CREATE POLICY "Usuários autenticados podem ver planos"
  ON planos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies para assinaturas
CREATE POLICY "Pacientes podem ver suas assinaturas"
  ON assinaturas FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem criar assinaturas"
  ON assinaturas FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Pacientes podem atualizar suas assinaturas"
  ON assinaturas FOR UPDATE
  USING (auth.uid() = paciente_id);

-- 5. Seed data

-- Planos
INSERT INTO planos (nome, descricao, preco) VALUES
  ('Básico', 'Acesso a cardápio semanal e lembretes básicos', 0.00),
  ('Premium', 'Cardápio semanal, lembretes personalizados e histórico completo', 29.90),
  ('Família', 'Tudo do Premium + até 3 membros da família', 79.90);

-- Cardápio semanal
INSERT INTO cardapio_semanal (dia_semana, refeicao, descricao) VALUES
  ('Segunda-feira', 'Café da manhã', 'Pão integral, fruta e iogurte natural'),
  ('Segunda-feira', 'Almoço', 'Arroz integral, feijão, frango grelhado e salada'),
  ('Segunda-feira', 'Jantar', 'Sopa de legumes com frango'),
  ('Terça-feira', 'Café da manhã', 'Aveia com banana e mel'),
  ('Terça-feira', 'Almoço', 'Macarrão integral com molho de tomate e carne moída magra'),
  ('Terça-feira', 'Jantar', 'Omelete de legumes'),
  ('Quarta-feira', 'Café da manhã', 'Tapioca com queijo e fruta'),
  ('Quarta-feira', 'Almoço', 'Peixe grelhado, arroz e brócolis'),
  ('Quarta-feira', 'Jantar', 'Salada de atum com grão de bico'),
  ('Quinta-feira', 'Café da manhã', 'Smoothie de frutas'),
  ('Quinta-feira', 'Almoço', 'Carne assada, purê de batata e cenoura'),
  ('Quinta-feira', 'Jantar', 'Salmão grelhado com aspargos'),
  ('Sexta-feira', 'Café da manhã', 'Pão de queijo com café'),
  ('Sexta-feira', 'Almoço', 'Frango à milanesa, arroz e vagem'),
  ('Sexta-feira', 'Jantar', 'Wrap de frango com salada'),
  ('Sábado', 'Café da manhã', 'Waffle integral com frutas'),
  ('Sábado', 'Almoço', 'Churrasco de carne magra com salada'),
  ('Sábado', 'Jantar', 'Pizza integral (moderada)'),
  ('Domingo', 'Café da manhã', 'Panqueca de banana'),
  ('Domingo', 'Almoço', 'Lasanha de berinjela com carne magra'),
  ('Domingo', 'Jantar', 'Sopa de abóbora com grão de bico');
