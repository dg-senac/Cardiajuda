export type UserRole = 'paciente' | 'medico';

export type StatusMedicao = 'normal' | 'atencao' | 'alerta';
export type StatusConsulta = 'agendada' | 'realizada' | 'cancelada';
export type ClassificacaoTriagem = 'verde' | 'amarela' | 'vermelha';
export type StatusAlerta = 'alerta' | 'pendente' | 'em_dia';

export interface Profile {
  id: string;
  role: UserRole;
  nome: string;
  email: string;
  telefone: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Paciente extends Profile {
  cpf: string;
  data_nascimento: string;
  idade: number;
  tipo_sanguineo: string;
  altura: number;
  genero: string;
  doencas_cronicas: string[];
  plano: string | null;
}

export interface Medico extends Profile {
  crm: string;
  especialidade: string;
  formacao: string;
  genero: string;
  avaliacao: number;
  consultas_feitas: number;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  medico_id: string | null;
  nome_paciente: string;
  data: string;
  horario: string;
  profissional: string;
  especialidade: string;
  motivo: string;
  status: StatusConsulta;
  created_at: string;
}

export interface Triagem {
  id: string;
  paciente_id: string;
  medico_id: string;
  nome_paciente: string;
  data: string;
  horario: string;
  profissional: string;
  queixa_principal: string;
  classificacao: ClassificacaoTriagem;
  created_at: string;
}

export interface Medicao {
  id: string;
  paciente_id: string;
  sistolica: number;
  diastolica: number;
  glicemia: number;
  status: StatusMedicao;
  created_at: string;
}

export interface Alerta {
  id: string;
  paciente_id: string;
  medico_id: string | null;
  tipo: string;
  titulo: string;
  descricao: string;
  status: StatusAlerta;
  created_at: string;
}

export interface Pendencia {
  id: string;
  medico_id: string;
  paciente_id: string;
  titulo: string;
  concluida: boolean;
  created_at: string;
}

export interface Lembrete {
  id: string;
  paciente_id: string;
  texto: string;
  horario: string;
  ativo: boolean;
}

export interface CardapioSemanal {
  id: string;
  dia_semana: string;
  refeicao: string;
  descricao: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
}

export interface Assinatura {
  id: string;
  paciente_id: string;
  plano_id: string;
  status: string;
  created_at: string;
}
