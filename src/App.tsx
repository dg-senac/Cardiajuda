import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { CadastroPaciente } from './pages/CadastroPaciente';
import { CadastroMedico } from './pages/CadastroMedico';
import { SetupInstructions } from './pages/SetupInstructions';
import { PacienteInicio } from './pages/paciente/Inicio';
import { PacienteConsultas } from './pages/paciente/Consultas';
import { HistoricoConsultas } from './pages/paciente/HistoricoConsultas';
import { NovaConsulta } from './pages/paciente/NovaConsulta';
import { Saude } from './pages/paciente/Saude';
import { Medicos } from './pages/paciente/Medicos';
import { Perfil } from './pages/paciente/Perfil';
import { MedicoInicio } from './pages/medico/Inicio';
import { MedicoConsultas } from './pages/medico/Consultas';
import { MedicoHistorico } from './pages/medico/Historico';
import { NovaConsultaMedico } from './pages/medico/NovaConsultaMedico';
import { NovaTriagem } from './pages/medico/NovaTriagem';
import { MedicoPacientes } from './pages/medico/Pacientes';
import { DetalhePaciente } from './pages/medico/DetalhePaciente';
import { MedicoAlertas } from './pages/medico/Alertas';
import { MedicoPerfil } from './pages/medico/Perfil';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'paciente' | 'medico' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-cor-fundo flex items-center justify-center"><p className="text-cor-primaria font-semibold">Carregando...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se profile não foi encontrado (trigger pode não ter executado), redirecionar para instruções
  if (!profile) {
    return <Navigate to="/setup" replace />;
  }

  if (profile.role !== allowedRole) {
    return <Navigate to={profile.role === 'paciente' ? '/paciente/inicio' : '/medico/inicio'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
          <Route path="/cadastro-medico" element={<CadastroMedico />} />
          <Route path="/setup" element={<SetupInstructions />} />

          {/* Paciente Routes */}
          <Route
            path="/paciente/inicio"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PacienteInicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/consultas"
            element={
              <ProtectedRoute allowedRole="paciente">
                <PacienteConsultas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/historico-consultas"
            element={
              <ProtectedRoute allowedRole="paciente">
                <HistoricoConsultas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/nova-consulta"
            element={
              <ProtectedRoute allowedRole="paciente">
                <NovaConsulta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/saude"
            element={
              <ProtectedRoute allowedRole="paciente">
                <Saude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/medicos"
            element={
              <ProtectedRoute allowedRole="paciente">
                <Medicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paciente/perfil"
            element={
              <ProtectedRoute allowedRole="paciente">
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Médico Routes */}
          <Route
            path="/medico/inicio"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoInicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/consultas"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoConsultas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/historico"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoHistorico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/nova-consulta"
            element={
              <ProtectedRoute allowedRole="medico">
                <NovaConsultaMedico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/nova-triagem"
            element={
              <ProtectedRoute allowedRole="medico">
                <NovaTriagem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/pacientes"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoPacientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/paciente/:id"
            element={
              <ProtectedRoute allowedRole="medico">
                <DetalhePaciente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/alertas"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoAlertas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/perfil"
            element={
              <ProtectedRoute allowedRole="medico">
                <MedicoPerfil />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
