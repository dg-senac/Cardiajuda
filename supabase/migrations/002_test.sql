-- Migration de teste para verificar se as tabelas básicas existem
-- Execute este SQL no SQL Editor do Supabase

-- Verificar se tabela profiles existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Se não retornar nada, execute o 001_reset.sql completo

-- Se retornar 'profiles', verifique as outras tabelas:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'pacientes', 'medicos', 'consultas', 'triagens', 'medicoes')
ORDER BY table_name;
