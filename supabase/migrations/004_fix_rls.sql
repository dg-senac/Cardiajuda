-- Fix RLS policies para permitir cadastro manual
-- Execute este SQL no SQL Editor do Supabase

-- DROP policies antigas
DROP POLICY IF EXISTS "Usuários podem ver seu próprio profile" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio profile" ON profiles;

-- Novas policies para profiles
CREATE POLICY "Usuários podem ver seu próprio profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Nova policy para permitir INSERT (necessário para cadastro manual)
CREATE POLICY "Usuários podem criar seu próprio profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- DROP policies antigas de pacientes
DROP POLICY IF EXISTS "Pacientes podem ver seus próprios dados" ON pacientes;
DROP POLICY IF EXISTS "Pacientes podem atualizar seus próprios dados" ON pacientes;
DROP POLICY IF EXISTS "Médicos podem ver dados de pacientes" ON pacientes;

-- Novas policies para pacientes
CREATE POLICY "Pacientes podem ver seus próprios dados"
  ON pacientes FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Pacientes podem atualizar seus próprios dados"
  ON pacientes FOR UPDATE
  USING (auth.uid() = id);

-- Nova policy para permitir INSERT em pacientes
CREATE POLICY "Pacientes podem criar seus próprios dados"
  ON pacientes FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Médicos podem ver dados de pacientes"
  ON pacientes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'medico'
    )
  );

-- DROP policies antigas de medicos
DROP POLICY IF EXISTS "Médicos podem ver seus próprios dados" ON medicos;
DROP POLICY IF EXISTS "Médicos podem atualizar seus próprios dados" ON medicos;
DROP POLICY IF EXISTS "Todos podem ver dados de médicos" ON medicos;

-- Novas policies para medicos
CREATE POLICY "Médicos podem ver seus próprios dados"
  ON medicos FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Médicos podem atualizar seus próprios dados"
  ON medicos FOR UPDATE
  USING (auth.uid() = id);

-- Nova policy para permitir INSERT em medicos
CREATE POLICY "Médicos podem criar seus próprios dados"
  ON medicos FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Todos podem ver dados de médicos"
  ON medicos FOR SELECT
  USING (auth.role() = 'authenticated');
