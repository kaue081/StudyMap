import {
  StudySpace,
  Event,
  UserAccount,
  RoleVerificationToken,
  MonitorDestinationSchedule,
  SpaceNotice
} from "../types";

export const defaultSpaces: StudySpace[] = [
  {
    id: 1,
    nome: "Biblioteca Central — Salão Silencioso",
    salaIdentificacao: "Bloco A — Térreo — Salão 1",
    bloco: "Bloco A",
    andar: "Térreo",
    tipo: "Biblioteca",
    localizacao: "Bloco A — Térreo — Salão 1",
    capacidade: 50,
    ocupacao: 2, // 2 alunos cadastrados com reserva ativa (Caua e Charles)
    descricao: "Espaço amplo destinado ao estudo individual e com foco total em concentração.",
    perfilAmbiente: "Silencioso",
    horarioFuncionamento: "07:30 às 22:00",
    regras: [
      "Manter silêncio absoluto",
      "Não consumir alimentos ou bebidas (apenas garrafa de água)",
      "Realizar check-in até 15 minutos após o horário",
      "Manter mesas e cadeiras organizadas"
    ],
    materiais: [
      "Livros do acervo",
      "Wi-Fi de alta velocidade",
      "Tomadas individuais",
      "Luminárias de mesa",
      "Mesas amplas de estudo"
    ],
    professorResponsavel: "Prof. Helena Santos",
    horarioProfessor: "14:00 às 18:00",
    monitorDisponivel: true,
    nomeMonitor: "Lucas Andrade",
    horarioMonitor: "09:00 às 17:00"
  },
  {
    id: 2,
    nome: "Laboratório de Informática 2",
    salaIdentificacao: "Bloco B — 2º andar — Sala 204",
    bloco: "Bloco B",
    andar: "2º Andar",
    tipo: "Laboratório",
    localizacao: "Bloco B — 2º andar — Sala 204",
    capacidade: 30,
    ocupacao: 1, // 1 aluno cadastrado com reserva ativa (Emanuel)
    descricao: "Laboratório equipado com desktops modernos para desenvolvimento e estudos técnicos.",
    perfilAmbiente: "Moderado",
    horarioFuncionamento: "08:00 às 21:30",
    regras: [
      "Proibido instalar programas externos sem autorização",
      "Proibido consumo de alimentos ou líquidos próximos aos teclados",
      "Desligar computadores após o uso",
      "Realizar check-in obrigatório"
    ],
    materiais: [
      "30 Computadores Core i7",
      "Acesso à internet cabeada e Wi-Fi",
      "Ar-condicionado",
      "Projetor multimídia",
      "Quadro branco e pilotos"
    ],
    professorResponsavel: "Prof. Carlos Henrique",
    horarioProfessor: "13:30 às 17:30",
    monitorDisponivel: true,
    nomeMonitor: "João Silva",
    horarioMonitor: "13:00 às 18:00"
  },
  {
    id: 3,
    nome: "Sala de Estudos 203 (Lotada para Testes)",
    salaIdentificacao: "Bloco B — 2º andar — Sala 203",
    bloco: "Bloco B",
    andar: "2º Andar",
    tipo: "Sala",
    localizacao: "Bloco B — 2º andar — Sala 203",
    capacidade: 2,
    ocupacao: 2, // 2 alunos cadastrados com reserva ativa (Juliana e Thiago) - lotada para testes de fila de espera
    descricao: "Sala de estudos climatizada para grupos de alunos e debates acadêmicos.",
    perfilAmbiente: "Moderado",
    horarioFuncionamento: "08:00 às 22:00",
    regras: [
      "Respeitar o limite de 20 pessoas no ambiente",
      "Evitar ruídos excessivos para não perturbar salas vizinhas",
      "Realizar check-in presencial no início do período"
    ],
    materiais: [
      "Mesas modulares",
      "Quadro branco",
      "Pilotos e apagadores",
      "Wi-Fi",
      "Folhas para impressão"
    ],
    professorResponsavel: "Prof. Roberto Mendes",
    horarioProfessor: "15:00 às 19:00",
    monitorDisponivel: false
  },
  {
    id: 4,
    nome: "Sala de Estudos em Grupo Alpha",
    salaIdentificacao: "Bloco C — 1º andar — Sala 108",
    bloco: "Bloco C",
    andar: "1º Andar",
    tipo: "Sala de estudos",
    localizacao: "Bloco C — 1º andar — Sala 108",
    capacidade: 8,
    ocupacao: 0,
    descricao: "Espaço com isolamento acústico dedicado à elaboração de trabalhos em equipe e apresentações.",
    perfilAmbiente: "Trabalho em Equipe",
    horarioFuncionamento: "07:30 às 22:00",
    regras: [
      "Manter a porta fechada durante discussões",
      "Permitido diálogo em tom moderado",
      "Limpar a lousa ao término"
    ],
    materiais: [
      "Smart TV 55 pol para espelhamento",
      "Quadro de vidro magnético",
      "Marcadores coloridos",
      "Tomadas USB e 110/220V",
      "Wi-Fi 6"
    ],
    monitorDisponivel: false
  },
  {
    id: 5,
    nome: "Auditório Central",
    salaIdentificacao: "Prédio Central — Térreo",
    bloco: "Prédio Central",
    andar: "Térreo",
    tipo: "Auditório",
    localizacao: "Prédio Central — Térreo",
    capacidade: 120,
    ocupacao: 1, // 1 aluno cadastrado com reserva ativa (Pedro)
    descricao: "Grande auditório projetado para palestras, seminários, workshops e defesas de TCC.",
    perfilAmbiente: "Moderado",
    horarioFuncionamento: "08:00 às 22:00",
    regras: [
      "Uso mediante agendamento prévio",
      "Proibido colar cartazes nos painéis acústicos",
      "Não consumir alimentos ou bebidas na plateia"
    ],
    materiais: [
      "Sistema de som surround e microfones sem fio",
      "Projetor Laser 4K",
      "Palco com tribuna",
      "Ar-condicionado central",
      "Wi-Fi de alta densidade"
    ],
    professorResponsavel: "Profa. Mariana Albuquerque",
    horarioProfessor: "09:00 às 13:00",
    monitorDisponivel: true,
    nomeMonitor: "Beatriz Lima",
    horarioMonitor: "14:00 às 20:00"
  },
  {
    id: 6,
    nome: "Biblioteca Setorial de Ciências Exatas",
    salaIdentificacao: "Bloco A — 2º andar — Sala 210",
    bloco: "Bloco A",
    andar: "2º Andar",
    tipo: "Biblioteca",
    localizacao: "Bloco A — 2º andar — Sala 210",
    capacidade: 35,
    ocupacao: 0,
    descricao: "Acervo especializado em tecnologia, física e matemática com cabines individuais de estudo.",
    perfilAmbiente: "Silencioso",
    horarioFuncionamento: "08:00 às 20:00",
    regras: [
      "Ambiente de estudo 100% individual",
      "Celulares no modo silencioso",
      "Guardar livros nas prateleiras de retorno"
    ],
    materiais: [
      "Notebooks para consulta local",
      "Cabines individuais com iluminação LED",
      "Wi-Fi rápido",
      "Folhas para anotações e impressão"
    ],
    professorResponsavel: "Prof. Daniel Viana",
    horarioProfessor: "10:00 às 12:00",
    monitorDisponivel: false
  }
];

const today = new Date().toISOString().split('T')[0];

export const defaultEvents: Event[] = [
  {
    id: 1,
    espacoId: 2, // Laboratório 2
    nome: "Workshop: Introdução ao Next.js e React",
    descricao: "Capacitação prática para alunos de informática.",
    data: today,
    horarioInicio: "14:00",
    horarioFim: "16:00"
  },
  {
    id: 2,
    espacoId: 5, // Auditório Central
    nome: "Seminário de Engenharia de Software",
    descricao: "Painel com convidados de tecnologia e inovação.",
    data: today,
    horarioInicio: "19:00",
    horarioFim: "21:30"
  }
];

export const defaultUsers: UserAccount[] = [
  // Alunos (Perfil padrão ao realizar cadastro)
  {
    id: 1,
    nome: "Caua Henrique Pinto de Lima",
    matricula: "20261001",
    email: "caua.lima@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-09-28T08:00:00.000Z"
  },
  {
    id: 2,
    nome: "Charles Kaue Barbosa da Silva",
    matricula: "20261002",
    email: "charles.kaue@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-09-28T08:05:00.000Z"
  },
  {
    id: 3,
    nome: "Emanuel da Silva Correia",
    matricula: "20261003",
    email: "emanuel.correia@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-09-28T08:10:00.000Z"
  },
  {
    id: 4,
    nome: "Pedro Inacio Monteiro Silva",
    matricula: "20261004",
    email: "pedro.monteiro@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-09-28T08:15:00.000Z"
  },
  {
    id: 5,
    nome: "Maria Eduarda Oliveira",
    matricula: "20261005",
    email: "maria.eduarda@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-10-01T10:00:00.000Z"
  },
  {
    id: 11,
    nome: "Juliana Rocha",
    matricula: "20261011",
    email: "juliana.rocha@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-10-02T09:00:00.000Z"
  },
  {
    id: 12,
    nome: "Thiago Mendes",
    matricula: "20261012",
    email: "thiago.mendes@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-10-02T09:15:00.000Z"
  },
  {
    id: 13,
    nome: "João Pedro Silveira",
    matricula: "20261013",
    email: "joao.pedro@studymap.edu.br",
    senha: "Aluno@123",
    perfil: "aluno",
    criadoEm: "2026-10-02T09:30:00.000Z"
  },

  // Monitores
  {
    id: 6,
    nome: "Lucas Andrade",
    matricula: "20262001",
    token: "MON-2026-101",
    email: "lucas.andrade@studymap.edu.br",
    senha: "Monitor@123",
    perfil: "monitor",
    espacoMonitoriaId: 1,
    espacoMonitoria: "Biblioteca Central — Salão Silencioso",
    criadoEm: "2026-09-28T09:00:00.000Z"
  },
  {
    id: 7,
    nome: "João Silva",
    matricula: "20262002",
    token: "MON-2026-102",
    email: "joao.silva@studymap.edu.br",
    senha: "Monitor@123",
    perfil: "monitor",
    espacoMonitoriaId: 2,
    espacoMonitoria: "Laboratório de Informática 2",
    criadoEm: "2026-09-28T09:10:00.000Z"
  },
  {
    id: 8,
    nome: "Beatriz Lima",
    matricula: "20262003",
    token: "MON-2026-103",
    email: "beatriz.lima@studymap.edu.br",
    senha: "Monitor@123",
    perfil: "monitor",
    espacoMonitoriaId: 5,
    espacoMonitoria: "Auditório Central",
    criadoEm: "2026-09-28T09:20:00.000Z"
  },

  // Administradores
  {
    id: 9,
    nome: "Coordenação Geral (Admin 1)",
    matricula: "ADM-0001",
    token: "ADM-2026-001",
    email: "admin@studymap.edu.br",
    senha: "Admin@123",
    perfil: "admin",
    criadoEm: "2026-09-28T07:30:00.000Z"
  },
  {
    id: 10,
    nome: "Profa. Helena Santos",
    matricula: "ADM-0002",
    token: "ADM-2026-002",
    email: "helena.admin@studymap.edu.br",
    senha: "Admin@123",
    perfil: "admin",
    criadoEm: "2026-09-28T07:45:00.000Z"
  }
];

export const defaultRoleTokens: RoleVerificationToken[] = [
  // Tokens livres disponibilizados pelo Admin 1 para elevar contas de Aluno para Monitor
  {
    codigo: "MON-2026-201",
    perfilDestino: "monitor",
    descricao: "Token de habilitação para novo Monitor (Plantão Biblioteca / Salas)",
    criadoPor: "Coordenação Geral (Admin 1)"
  },
  {
    codigo: "MON-2026-202",
    perfilDestino: "monitor",
    descricao: "Token de habilitação para novo Monitor (Plantão Laboratórios)",
    criadoPor: "Coordenação Geral (Admin 1)"
  },
  {
    codigo: "MON-2026-203",
    perfilDestino: "monitor",
    descricao: "Token de habilitação para novo Monitor (Plantão Geral)",
    criadoPor: "Coordenação Geral (Admin 1)"
  },

  // Tokens livres disponibilizados pelo Admin 1 para elevar contas de Aluno para Administrador
  {
    codigo: "ADM-2026-201",
    perfilDestino: "admin",
    descricao: "Token de habilitação para novo Administrador Escolar",
    criadoPor: "Coordenação Geral (Admin 1)"
  },
  {
    codigo: "ADM-2026-202",
    perfilDestino: "admin",
    descricao: "Token de habilitação para Coordenação de Espaços",
    criadoPor: "Coordenação Geral (Admin 1)"
  },

  // Tokens já vinculados aos monitores e administradores iniciais
  {
    codigo: "MON-2026-101",
    perfilDestino: "monitor",
    descricao: "Token vinculado a Lucas Andrade",
    criadoPor: "Coordenação Geral (Admin 1)",
    usadoPorEmail: "lucas.andrade@studymap.edu.br",
    usadoEm: "2026-09-28T09:00:00.000Z"
  },
  {
    codigo: "MON-2026-102",
    perfilDestino: "monitor",
    descricao: "Token vinculado a João Silva",
    criadoPor: "Coordenação Geral (Admin 1)",
    usadoPorEmail: "joao.silva@studymap.edu.br",
    usadoEm: "2026-09-28T09:10:00.000Z"
  },
  {
    codigo: "MON-2026-103",
    perfilDestino: "monitor",
    descricao: "Token vinculado a Beatriz Lima",
    criadoPor: "Coordenação Geral (Admin 1)",
    usadoPorEmail: "beatriz.lima@studymap.edu.br",
    usadoEm: "2026-09-28T09:20:00.000Z"
  },
  {
    codigo: "ADM-2026-001",
    perfilDestino: "admin",
    descricao: "Token vinculado à Coordenação Geral (Admin 1)",
    criadoPor: "Sistema Institucional",
    usadoPorEmail: "admin@studymap.edu.br",
    usadoEm: "2026-09-28T07:30:00.000Z"
  },
  {
    codigo: "ADM-2026-002",
    perfilDestino: "admin",
    descricao: "Token vinculado à Profa. Helena Santos",
    criadoPor: "Coordenação Geral (Admin 1)",
    usadoPorEmail: "helena.admin@studymap.edu.br",
    usadoEm: "2026-09-28T07:45:00.000Z"
  }
];

export const defaultMonitorSchedules: MonitorDestinationSchedule[] = [
  {
    id: 501,
    monitorId: 6,
    monitorNome: "Lucas Andrade",
    monitorEmail: "lucas.andrade@studymap.edu.br",
    espacoId: 1,
    espacoNome: "Biblioteca Central — Salão Silencioso",
    data: today,
    horarioInicio: "09:00",
    horarioFim: "17:00",
    status: "agendado",
    criadoEm: "2026-10-25T08:00:00.000Z"
  },
  {
    id: 502,
    monitorId: 7,
    monitorNome: "João Silva",
    monitorEmail: "joao.silva@studymap.edu.br",
    espacoId: 2,
    espacoNome: "Laboratório de Informática 2",
    data: today,
    horarioInicio: "13:00",
    horarioFim: "18:00",
    status: "agendado",
    criadoEm: "2026-10-25T08:05:00.000Z"
  },
  {
    id: 503,
    monitorId: 8,
    monitorNome: "Beatriz Lima",
    monitorEmail: "beatriz.lima@studymap.edu.br",
    espacoId: 5,
    espacoNome: "Auditório Central",
    data: today,
    horarioInicio: "14:00",
    horarioFim: "20:00",
    status: "agendado",
    criadoEm: "2026-10-25T08:10:00.000Z"
  }
];

export const defaultSpaceNotices: SpaceNotice[] = [
  {
    id: 701,
    espacoId: 1,
    espacoNome: "Biblioteca Central — Salão Silencioso",
    titulo: "Horário estendido para semana de provas",
    mensagem: "As cabines de estudo contarão com tomadas extras revisadas e empréstimo local de luminárias.",
    prioridade: "informativo",
    autorNome: "Coordenação Geral (Admin 1)",
    ativo: true,
    criadoEm: "2026-10-25T09:00:00.000Z"
  },
  {
    id: 702,
    espacoId: 2,
    espacoNome: "Laboratório de Informática 2",
    titulo: "Preparação para Workshop vespertino",
    mensagem: "Entre 14h e 16h haverá Workshop de Next.js; demais horários seguem livres para reservas individuais.",
    prioridade: "atencao",
    autorNome: "Profa. Helena Santos",
    ativo: true,
    criadoEm: "2026-10-25T09:30:00.000Z"
  }
];

