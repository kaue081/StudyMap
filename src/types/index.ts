export type SpaceType = 'Sala' | 'Laboratório' | 'Biblioteca' | 'Sala de estudos' | 'Auditório';

export type UserRole = 'aluno' | 'monitor' | 'admin';

export type UserSearchField = 'todos' | 'matricula' | 'nome' | 'email';

export interface UserAccount {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: UserRole;
  matricula?: string;
  token?: string;
  espacoMonitoriaId?: number;
  espacoMonitoria?: string;
  criadoEm: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RoleVerificationToken {
  codigo: string;
  perfilDestino: 'monitor' | 'admin';
  descricao: string;
  criadoPor: string;
  usadoPorEmail?: string;
  usadoEm?: string;
}

export interface AlunoRegistrationInput {
  nome: string;
  matricula: string;
  email: string;
  senha: string;
}

export interface StudySpace {
  id: number;
  nome: string;
  salaIdentificacao: string;
  bloco: string;
  andar: string;
  tipo: SpaceType;
  localizacao: string;
  capacidade: number;
  ocupacao: number;
  descricao: string;
  perfilAmbiente: 'Silencioso' | 'Moderado' | 'Trabalho em Equipe';
  horarioFuncionamento: string;
  regras: string[];
  materiais: string[];
  professorResponsavel?: string;
  horarioProfessor?: string;
  monitorDisponivel: boolean;
  nomeMonitor?: string;
  horarioMonitor?: string;
}

export interface Reservation {
  id: number;
  usuarioId?: number;
  usuarioEmail?: string;
  usuarioNome: string;
  espacoId: number;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  status: "reservada" | "confirmada" | "cancelada";
  checkIn: boolean;
  motivoCancelamento?: string;
  canceladoEm?: string;
  criadoEm: string;
}

export interface CancellationNotice {
  id: number;
  reservationId: number;
  espacoId: number;
  espacoNome: string;
  usuarioId?: number;
  usuarioNome: string;
  usuarioEmail?: string;
  dataReserva: string;
  horarioInicio: string;
  horarioFim: string;
  mensagem: string;
  enviadoEm: string;
}

export interface MonitorDestinationSchedule {
  id: number;
  monitorId: number;
  monitorNome: string;
  monitorEmail: string;
  espacoId: number;
  espacoNome: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  tipoAtividade?: "ajudar" | "estudar";
  status: "agendado" | "ausencia_informada";
  motivoAusencia?: string;
  criadoEm: string;
}

export interface MonitorAbsenceNotice {
  id: number;
  scheduleId?: number;
  monitorId: number;
  monitorNome: string;
  monitorEmail: string;
  espacoId: number;
  espacoNome: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  motivo: string;
  enviadoEm: string;
}

export type SpaceNoticePriority = "informativo" | "atencao" | "urgente";

export interface SpaceNotice {
  id: number;
  espacoId: number;
  espacoNome: string;
  titulo: string;
  mensagem: string;
  prioridade: SpaceNoticePriority;
  autorNome: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Event {
  id: number;
  espacoId: number;
  nome: string;
  descricao: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
}

export interface WaitlistEntry {
  id: number;
  espacoId: number;
  usuarioId?: number;
  usuarioEmail?: string;
  nomeAluno: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  posicao: number;
  criadoEm: string;
}

export interface RecommendationCriteria {
  data: string;
  horarioInicio: string;
  horarioFim: string;
  preferenciaSilencio: boolean;
  precisaComputador: boolean;
  precisaMonitor: boolean;
  precisaProfessor: boolean;
  tipoEspaco?: string;
}
