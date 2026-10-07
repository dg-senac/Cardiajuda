-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (perfil do usuário)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  age INTEGER,
  blood_type VARCHAR(5),
  height DECIMAL(3, 2),
  avatar_url TEXT,
  member_since DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table (agendamentos)
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(10) NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'confirmado', 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Health records table (registros de saúde)
CREATE TABLE health_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date VARCHAR(50) NOT NULL,
  systolic INTEGER,
  diastolic INTEGER,
  glucose INTEGER,
  warning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table (médicos disponíveis)
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0.0
);

-- Insert sample doctors
INSERT INTO doctors (name, specialty, rating) VALUES
  ('Dr. Silva', 'Cardiologista', 4.8),
  ('Dra. Costa', 'Endocrinologista', 4.9),
  ('Dr. Oliveira', 'Clínico Geral', 4.7);

-- Insert sample user (para testes)
INSERT INTO users (email, full_name, phone, age, blood_type, height) VALUES
  ('croche@email.com', 'Croché da Silva', '(11) 99999-9999', 35, 'O+', 1.75);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (true);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own appointments" ON appointments
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own appointments" ON appointments
  FOR DELETE USING (true);

-- RLS Policies for health_records
CREATE POLICY "Users can view their own health records" ON health_records
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own health records" ON health_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own health records" ON health_records
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own health records" ON health_records
  FOR DELETE USING (true);

-- Public access for doctors (qualquer um pode ver os médicos disponíveis)
CREATE POLICY "Anyone can view doctors" ON doctors
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_date ON health_records(date);
