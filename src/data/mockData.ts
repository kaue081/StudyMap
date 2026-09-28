import { StudySpace, Event } from "../types";

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
    ocupacao: 18,
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
    professorResponsavel: "Profa. Helena Santos",
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
    ocupacao: 22,
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
    capacidade: 20,
    ocupacao: 20, // Lotada propositalmente para demonstrar a Fila de Espera conforme o escopo!
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
    ocupacao: 2,
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
    ocupacao: 15,
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
    ocupacao: 8,
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
