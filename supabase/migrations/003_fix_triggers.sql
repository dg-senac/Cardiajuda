-- SQL para remover triggers problemáticos e permitir cadastro manual
-- Execute isso no SQL Editor do Supabase se o cadastro estiver falhando

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função se existir
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Verificar se triggers foram removidos
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';
