export type SpaceType = 'Sala' | 'Laboratório' | 'Biblioteca' | 'Sala de estudos' | 'Auditório';

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
  usuarioNome: string;
  espacoId: number;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  status: "reservada" | "confirmada" | "cancelada";
  checkIn: boolean;
  criadoEm: string;
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
