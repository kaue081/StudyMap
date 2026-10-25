"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserAccount,
  UserRole,
  RoleVerificationToken,
  StudySpace,
  SpaceType,
  SpaceNotice,
  SpaceNoticePriority,
  Reservation,
  WaitlistEntry,
  Event,
  MonitorDestinationSchedule,
  MonitorAbsenceNotice,
  CancellationNotice
} from "../types";
import { ReactAlertBanner } from "./ReactAlert";
import {
  KeyRound,
  UserPlus,
  Building2,
  Megaphone,
  Calendar,
  Users,
  Layers,
  Search,
  Pencil,
  Trash2,
  PlusCircle,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Package,
  ShieldCheck,
  Clock,
  AlertTriangle
} from "lucide-react";

type CreateTabId = "aluno" | "token" | "lugar" | "aviso" | "evento";
type DataTabId =
  | "todos"
  | "usuarios"
  | "tokens"
  | "lugares"
  | "avisos"
  | "reservas"
  | "fila"
  | "eventos"
  | "monitoria";

type DeleteTarget =
  | { kind: "user"; id: number; label: string }
  | { kind: "token"; codigo: string; label: string }
  | { kind: "space"; id: number; label: string }
  | { kind: "notice"; id: number; label: string }
  | { kind: "reservation"; id: number; label: string }
  | { kind: "waitlist"; id: number; label: string }
  | { kind: "event"; id: number; label: string }
  | { kind: "schedule"; id: number; label: string }
  | { kind: "absence"; id: number; label: string }
  | { kind: "cancellation"; id: number; label: string };

interface AdminPanelSectionProps {
  currentUser: UserAccount;
  users: UserAccount[];
  roleTokens: RoleVerificationToken[];
  spaces: StudySpace[];
  spaceNotices: SpaceNotice[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  events: Event[];
  monitorSchedules: MonitorDestinationSchedule[];
  monitorAbsences: MonitorAbsenceNotice[];
  cancellations: CancellationNotice[];
  onCreateUser: (input: {
    nome: string;
    matricula: string;
    email: string;
    senha: string;
    perfil?: UserRole;
    token?: string;
    espacoMonitoriaId?: number;
    espacoMonitoria?: string;
  }) => { success: boolean; message: string };
  onUpdateUser: (
    userId: number,
    updates: {
      nome: string;
      email: string;
      senha: string;
      perfil: UserRole;
      matricula?: string;
      token?: string;
      espacoMonitoriaId?: number;
      espacoMonitoria?: string;
    }
  ) => { success: boolean; message: string };
  onDeleteUser: (userId: number) => { success: boolean; message: string };
  onGenerateToken: (input: {
    codigo?: string;
    perfilDestino: "monitor" | "admin";
    descricao: string;
    criadoPor?: string;
  }) => { success: boolean; message: string; token?: RoleVerificationToken };
  onUpdateToken: (
    originalCodigo: string,
    updates: {
      codigo: string;
      perfilDestino: "monitor" | "admin";
      descricao: string;
      liberarVinculo?: boolean;
    }
  ) => { success: boolean; message: string };
  onDeleteToken: (codigo: string) => { success: boolean; message: string };
  onCreateSpace: (input: Omit<StudySpace, "id">) => {
    success: boolean;
    message: string;
  };
  onUpdateSpace: (
    spaceId: number,
    updates: Partial<Omit<StudySpace, "id">>
  ) => { success: boolean; message: string };
  onDeleteSpace: (spaceId: number) => { success: boolean; message: string };
  onCreateSpaceNotice: (input: {
    espacoId: number;
    titulo: string;
    mensagem: string;
    prioridade: SpaceNoticePriority;
    autorNome: string;
    ativo?: boolean;
  }) => { success: boolean; message: string };
  onUpdateSpaceNotice: (
    noticeId: number,
    updates: {
      espacoId: number;
      titulo: string;
      mensagem: string;
      prioridade: SpaceNoticePriority;
      ativo: boolean;
    }
  ) => { success: boolean; message: string };
  onDeleteSpaceNotice: (noticeId: number) => {
    success: boolean;
    message: string;
  };
  onUpdateReservation: (
    reservationId: number,
    updates: {
      usuarioNome: string;
      usuarioEmail?: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: "reservada" | "confirmada" | "cancelada";
      checkIn: boolean;
      motivoCancelamento?: string;
    }
  ) => { success: boolean; message: string };
  onDeleteReservation: (reservationId: number) => {
    success: boolean;
    message: string;
  };
  onUpdateWaitlistEntry: (
    entryId: number,
    updates: {
      nomeAluno: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      posicao: number;
    }
  ) => { success: boolean; message: string };
  onDeleteWaitlistEntry: (entryId: number) => {
    success: boolean;
    message: string;
  };
  onCreateEvent: (input: Omit<Event, "id">) => {
    success: boolean;
    message: string;
  };
  onUpdateEvent: (
    eventId: number,
    updates: Omit<Event, "id">
  ) => { success: boolean; message: string };
  onDeleteEvent: (eventId: number) => { success: boolean; message: string };
  onUpdateMonitorSchedule: (
    scheduleId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: "agendado" | "ausencia_informada";
      motivoAusencia?: string;
    }
  ) => { success: boolean; message: string };
  onDeleteMonitorSchedule: (scheduleId: number) => {
    success: boolean;
    message: string;
  };
  onUpdateMonitorAbsence: (
    absenceId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      motivo: string;
    }
  ) => { success: boolean; message: string };
  onDeleteMonitorAbsence: (absenceId: number) => {
    success: boolean;
    message: string;
  };
  onUpdateCancellationNotice: (
    noticeId: number,
    updates: {
      mensagem: string;
      dataReserva: string;
      horarioInicio: string;
      horarioFim: string;
    }
  ) => { success: boolean; message: string };
  onDeleteCancellationNotice: (noticeId: number) => {
    success: boolean;
    message: string;
  };
}

export function AdminPanelSection({
  currentUser,
  users,
  roleTokens,
  spaces,
  spaceNotices,
  reservations,
  waitlist,
  events,
  monitorSchedules,
  monitorAbsences,
  cancellations,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onGenerateToken,
  onUpdateToken,
  onDeleteToken,
  onCreateSpace,
  onUpdateSpace,
  onDeleteSpace,
  onCreateSpaceNotice,
  onUpdateSpaceNotice,
  onDeleteSpaceNotice,
  onUpdateReservation,
  onDeleteReservation,
  onUpdateWaitlistEntry,
  onDeleteWaitlistEntry,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onUpdateMonitorSchedule,
  onDeleteMonitorSchedule,
  onUpdateMonitorAbsence,
  onDeleteMonitorAbsence,
  onUpdateCancellationNotice,
  onDeleteCancellationNotice
}: AdminPanelSectionProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Abas principais
  const [createTab, setCreateTab] = useState<CreateTabId>("aluno");
  const [dataTab, setDataTab] = useState<DataTabId>("todos");
  const [globalFilter, setGlobalFilter] = useState("");
  const [createFeedback, setCreateFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // =========================================================================
  // ESTADOS DE CRIAÇÃO (PASSO 4 - ITEM 1)
  // =========================================================================

  // 1A. Novo Cadastro de Aluno (ou usuário)
  const [newUserName, setNewUserName] = useState("");
  const [newUserMatricula, setNewUserMatricula] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // 1B. Gerar Token de Verificação de Monitor e Novos ADMs
  const [newTokenRole, setNewTokenRole] = useState<"monitor" | "admin">("monitor");
  const [newTokenCode, setNewTokenCode] = useState("");
  const [newTokenDesc, setNewTokenDesc] = useState(
    "Token institucional emitido pela Administração"
  );

  // 1C. Cadastrar Novo Lugar, Vagas Disponíveis e Materiais
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceBloco, setNewSpaceBloco] = useState("Bloco A");
  const [newSpaceAndar, setNewSpaceAndar] = useState("1º Andar");
  const [newSpaceSala, setNewSpaceSala] = useState("");
  const [newSpaceType, setNewSpaceType] = useState<SpaceType>("Sala de estudos");
  const [newSpaceAmbiente, setNewSpaceAmbiente] = useState<
    "Silencioso" | "Moderado" | "Trabalho em Equipe"
  >("Silencioso");
  const [newSpaceHorario, setNewSpaceHorario] = useState("08:00 às 22:00");
  const [newSpaceCapacidade, setNewSpaceCapacidade] = useState<number>(30);
  const [newSpaceVagasLivres, setNewSpaceVagasLivres] = useState<number>(30);
  const [newSpaceDescricao, setNewSpaceDescricao] = useState("");
  const [newSpaceMateriais, setNewSpaceMateriais] = useState(
    "Wi-Fi de alta velocidade, Tomadas individuais, Quadro branco, Pilotos"
  );
  const [newSpaceRegras, setNewSpaceRegras] = useState(
    "Manter organização do local; Realizar check-in até 10 min antes; Proibido alimentos"
  );
  const [newSpaceProfessor, setNewSpaceProfessor] = useState("");
  const [newSpaceHorarioProf, setNewSpaceHorarioProf] = useState("");

  // 1D. Avisos sobre os Locais
  const [noticeSpaceId, setNoticeSpaceId] = useState<number>(spaces[0]?.id || 1);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticePriority, setNoticePriority] = useState<SpaceNoticePriority>("informativo");
  const [noticeMessage, setNoticeMessage] = useState("");

  // 1E. Evento em Local
  const [eventSpaceId, setEventSpaceId] = useState<number>(spaces[0]?.id || 1);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<string>(todayStr);
  const [eventStart, setEventStart] = useState<string>("14:00");
  const [eventEnd, setEventEnd] = useState<string>("16:00");
  const [eventDesc, setEventDesc] = useState("");

  // =========================================================================
  // ESTADOS DE EDIÇÃO E REMOÇÃO (PASSO 4 - ITENS 3 E 4)
  // =========================================================================
  const [editingUser, setEditingUser] = useState<{
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: UserRole;
    matricula: string;
    token: string;
    espacoMonitoriaId: number;
  } | null>(null);

  const [editingToken, setEditingToken] = useState<{
    originalCodigo: string;
    codigo: string;
    perfilDestino: "monitor" | "admin";
    descricao: string;
    usadoPorEmail?: string;
    liberarVinculo: boolean;
  } | null>(null);

  const [editingSpace, setEditingSpace] = useState<{
    id: number;
    nome: string;
    bloco: string;
    andar: string;
    salaIdentificacao: string;
    tipo: SpaceType;
    perfilAmbiente: "Silencioso" | "Moderado" | "Trabalho em Equipe";
    horarioFuncionamento: string;
    capacidade: number;
    vagasDisponiveis: number;
    descricao: string;
    materiaisText: string;
    regrasText: string;
    professorResponsavel: string;
    horarioProfessor: string;
    monitorDisponivel: boolean;
    nomeMonitor: string;
    horarioMonitor: string;
  } | null>(null);

  const [editingNotice, setEditingNotice] = useState<{
    id: number;
    espacoId: number;
    titulo: string;
    mensagem: string;
    prioridade: SpaceNoticePriority;
    ativo: boolean;
  } | null>(null);

  const [editingReservation, setEditingReservation] = useState<{
    id: number;
    usuarioNome: string;
    usuarioEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    status: "reservada" | "confirmada" | "cancelada";
    checkIn: boolean;
    motivoCancelamento: string;
  } | null>(null);

  const [editingWaitlist, setEditingWaitlist] = useState<{
    id: number;
    nomeAluno: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    posicao: number;
  } | null>(null);

  const [editingEvent, setEditingEvent] = useState<{
    id: number;
    espacoId: number;
    nome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    descricao: string;
  } | null>(null);

  const [editingSchedule, setEditingSchedule] = useState<{
    id: number;
    monitorNome: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    status: "agendado" | "ausencia_informada";
    motivoAusencia: string;
  } | null>(null);

  const [editingAbsence, setEditingAbsence] = useState<{
    id: number;
    monitorNome: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    motivo: string;
  } | null>(null);

  const [editingCancellation, setEditingCancellation] = useState<{
    id: number;
    usuarioNome: string;
    dataReserva: string;
    horarioInicio: string;
    horarioFim: string;
    mensagem: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const matchesSearch = (values: (string | number | undefined)[]) => {
    if (!globalFilter.trim()) return true;
    const q = globalFilter.trim().toLowerCase();
    return values.some((val) =>
      val !== undefined && String(val).toLowerCase().includes(q)
    );
  };

  const getSpaceName = (id: number) =>
    spaces.find((s) => s.id === id)?.nome || `Espaço #${id}`;

  // =========================================================================
  // HANDLERS DE CRIAÇÃO
  // =========================================================================
  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);
    const res = onCreateUser({
      nome: newUserName,
      matricula: newUserMatricula,
      email: newUserEmail,
      senha: newUserPassword,
      perfil: "aluno"
    });
    setCreateFeedback({
      type: res.success ? "success" : "error",
      message: res.message
    });
    if (res.success) {
      setNewUserName("");
      setNewUserMatricula("");
      setNewUserEmail("");
      setNewUserPassword("");
    }
  };

  const buildSuggestedTokenCode = (role: "monitor" | "admin") => {
    const prefix = role === "admin" ? "ADM" : "MON";
    const year = new Date().getFullYear();
    let num = 301 + roleTokens.length;
    while (
      roleTokens.some(
        (t) => t.codigo.toUpperCase() === `${prefix}-${year}-${num}`
      )
    ) {
      num += 1;
    }
    return `${prefix}-${year}-${num}`;
  };

  const handleGenerateTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);
    const res = onGenerateToken({
      codigo: newTokenCode,
      perfilDestino: newTokenRole,
      descricao: newTokenDesc,
      criadoPor: currentUser.nome
    });
    setCreateFeedback({
      type: res.success ? "success" : "error",
      message: res.message
    });
    if (res.success) {
      setNewTokenCode("");
    }
  };

  const handleCreateSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);

    const cap = Math.max(1, Number(newSpaceCapacidade) || 1);
    const livres = Math.min(cap, Math.max(0, Number(newSpaceVagasLivres) || 0));
    const ocupacaoCalculada = Math.max(0, cap - livres);
    const salaId =
      newSpaceSala.trim() || `${newSpaceBloco.trim()} — ${newSpaceAndar.trim()}`;

    const res = onCreateSpace({
      nome: newSpaceName,
      bloco: newSpaceBloco,
      andar: newSpaceAndar,
      salaIdentificacao: salaId,
      localizacao: salaId,
      tipo: newSpaceType,
      perfilAmbiente: newSpaceAmbiente,
      horarioFuncionamento: newSpaceHorario,
      capacidade: cap,
      ocupacao: ocupacaoCalculada,
      descricao: newSpaceDescricao,
      materiais: newSpaceMateriais
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      regras: newSpaceRegras
        .split(";")
        .flatMap((part) => part.split("\n"))
        .map((r) => r.trim())
        .filter(Boolean),
      professorResponsavel: newSpaceProfessor.trim() || undefined,
      horarioProfessor: newSpaceHorarioProf.trim() || undefined,
      monitorDisponivel: false
    });

    setCreateFeedback({
      type: res.success ? "success" : "error",
      message: res.message
    });

    if (res.success) {
      setNewSpaceName("");
      setNewSpaceSala("");
      setNewSpaceDescricao("");
      setNewSpaceCapacidade(30);
      setNewSpaceVagasLivres(30);
    }
  };

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);
    const res = onCreateSpaceNotice({
      espacoId: noticeSpaceId,
      titulo: noticeTitle,
      mensagem: noticeMessage,
      prioridade: noticePriority,
      autorNome: currentUser.nome,
      ativo: true
    });
    setCreateFeedback({
      type: res.success ? "success" : "error",
      message: res.message
    });
    if (res.success) {
      setNoticeTitle("");
      setNoticeMessage("");
    }
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);
    const res = onCreateEvent({
      espacoId: eventSpaceId,
      nome: eventName,
      data: eventDate,
      horarioInicio: eventStart,
      horarioFim: eventEnd,
      descricao: eventDesc
    });
    setCreateFeedback({
      type: res.success ? "success" : "error",
      message: res.message
    });
    if (res.success) {
      setEventName("");
      setEventDesc("");
    }
  };

  // =========================================================================
  // CONFIRMAÇÃO DE REMOÇÃO (ITEM 4)
  // =========================================================================
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    switch (deleteTarget.kind) {
      case "user":
        onDeleteUser(deleteTarget.id);
        break;
      case "token":
        onDeleteToken(deleteTarget.codigo);
        break;
      case "space":
        onDeleteSpace(deleteTarget.id);
        break;
      case "notice":
        onDeleteSpaceNotice(deleteTarget.id);
        break;
      case "reservation":
        onDeleteReservation(deleteTarget.id);
        break;
      case "waitlist":
        onDeleteWaitlistEntry(deleteTarget.id);
        break;
      case "event":
        onDeleteEvent(deleteTarget.id);
        break;
      case "schedule":
        onDeleteMonitorSchedule(deleteTarget.id);
        break;
      case "absence":
        onDeleteMonitorAbsence(deleteTarget.id);
        break;
      case "cancellation":
        onDeleteCancellationNotice(deleteTarget.id);
        break;
    }
    setDeleteTarget(null);
  };

  // Listas filtradas pela busca unificada
  const filteredUsers = users.filter((u) =>
    matchesSearch([u.nome, u.email, u.matricula, u.perfil, u.token, u.espacoMonitoria])
  );
  const filteredTokens = roleTokens.filter((t) =>
    matchesSearch([t.codigo, t.perfilDestino, t.descricao, t.criadoPor, t.usadoPorEmail])
  );
  const filteredSpaces = spaces.filter((s) =>
    matchesSearch([
      s.nome,
      s.bloco,
      s.salaIdentificacao,
      s.tipo,
      s.materiais.join(" "),
      s.professorResponsavel,
      s.nomeMonitor
    ])
  );
  const filteredNotices = spaceNotices.filter((n) =>
    matchesSearch([n.espacoNome, n.titulo, n.mensagem, n.prioridade, n.autorNome])
  );
  const filteredReservations = reservations.filter((r) =>
    matchesSearch([
      r.usuarioNome,
      r.usuarioEmail,
      getSpaceName(r.espacoId),
      r.data,
      r.status
    ])
  );
  const filteredWaitlist = waitlist.filter((w) =>
    matchesSearch([w.nomeAluno, getSpaceName(w.espacoId), w.data, w.posicao])
  );
  const filteredEvents = events.filter((ev) =>
    matchesSearch([ev.nome, ev.descricao, getSpaceName(ev.espacoId), ev.data])
  );
  const filteredSchedules = monitorSchedules.filter((ms) =>
    matchesSearch([ms.monitorNome, ms.monitorEmail, ms.espacoNome, ms.data, ms.status])
  );
  const filteredAbsences = monitorAbsences.filter((ma) =>
    matchesSearch([ma.monitorNome, ma.espacoNome, ma.data, ma.motivo])
  );
  const filteredCancellations = cancellations.filter((c) =>
    matchesSearch([c.usuarioNome, c.espacoNome, c.dataReserva, c.mensagem])
  );

  const totalSystemRecords =
    users.length +
    roleTokens.length +
    spaces.length +
    spaceNotices.length +
    reservations.length +
    waitlist.length +
    events.length +
    monitorSchedules.length +
    monitorAbsences.length +
    cancellations.length;

  const showSection = (section: Exclude<DataTabId, "todos">) =>
    dataTab === "todos" || dataTab === section;

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* Cabeçalho Institucional do Painel do Administrador */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-500/30 shadow-2xl space-y-5 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="p-3 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 shrink-0">
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Painel Geral do Administrador
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Controle Total (CRUD)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                Cadastre novos alunos, gere tokens de Monitor e novos ADMs, crie lugares com vagas e materiais, publique avisos sobre os locais e liste, atualize ou remova todos os dados do sistema.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-950/40 text-purple-200 border border-purple-500/30">
              {totalSystemRecords} registros no sistema
            </span>
            <Link
              href="/configuracoes"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
            >
              Minha Conta
            </Link>
          </div>
        </div>

        {/* Grade Resumo Clicável de Todas as Entidades do Sistema */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
          {[
            { id: "usuarios" as const, label: "Usuários", count: users.length },
            { id: "tokens" as const, label: "Tokens", count: roleTokens.length },
            { id: "lugares" as const, label: "Lugares", count: spaces.length },
            { id: "avisos" as const, label: "Avisos Locais", count: spaceNotices.length },
            { id: "reservas" as const, label: "Reservas", count: reservations.length },
            { id: "fila" as const, label: "Fila Espera", count: waitlist.length },
            { id: "eventos" as const, label: "Eventos", count: events.length },
            {
              id: "monitoria" as const,
              label: "Escalas/Logs",
              count:
                monitorSchedules.length +
                monitorAbsences.length +
                cancellations.length
            }
          ].map((stat) => (
            <button
              key={stat.id}
              type="button"
              onClick={() => setDataTab(stat.id)}
              className={`p-3 rounded-2xl border text-left transition min-w-0 ${
                dataTab === stat.id
                  ? "bg-purple-600/25 border-purple-500/50 text-white"
                  : "bg-zinc-900/70 border-white/5 hover:border-zinc-700 text-zinc-300"
              }`}
            >
              <span className="text-[11px] text-zinc-400 block truncate">
                {stat.label}
              </span>
              <strong className="text-lg font-black text-white block mt-0.5">
                {stat.count}
              </strong>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SEÇÃO 1: CENTRAL DE CRIAÇÃO DO ADMINISTRADOR (PASSO 4 - ITEM 1)       */}
      {/* ===================================================================== */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-indigo-500/25 shadow-2xl space-y-5 min-w-0">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>1. Central de Criação Administrativa</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Selecione o recurso que deseja cadastrar no sistema (todos salvos com criptografia no LocalStorage):
          </p>
        </div>

        {/* Seletores de Aba de Criação */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
          {[
            { id: "aluno" as const, label: "Novo Cadastro de Aluno", icon: UserPlus },
            {
              id: "token" as const,
              label: "Gerar Token (Monitor / ADM)",
              icon: KeyRound
            },
            {
              id: "lugar" as const,
              label: "Novo Lugar, Vagas & Materiais",
              icon: Building2
            },
            { id: "aviso" as const, label: "Aviso sobre Local", icon: Megaphone },
            { id: "evento" as const, label: "Novo Evento em Local", icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = createTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCreateTab(tab.id);
                  setCreateFeedback(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition border ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25"
                    : "bg-zinc-900/70 text-zinc-300 border-white/5 hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {createFeedback && (
          <ReactAlertBanner
            variant={createFeedback.type}
            title={
              createFeedback.type === "success"
                ? "Cadastro Realizado"
                : "Atenção na Validação"
            }
            message={createFeedback.message}
            onClose={() => setCreateFeedback(null)}
          />
        )}

        {/* FORM 1A: Novo Cadastro de Aluno */}
        {createTab === "aluno" && (
          <form onSubmit={handleCreateStudentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome Completo do Aluno
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Ana Beatriz Rocha"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Número da Matrícula (única)
                </label>
                <input
                  type="text"
                  required
                  value={newUserMatricula}
                  onChange={(e) => setNewUserMatricula(e.target.value)}
                  placeholder="Ex: 20261099"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  E-mail Institucional (deve ser diferente dos demais)
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Ex: ana.rocha@studymap.edu.br"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Senha Inicial (mín. 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Ex: Aluno@123"
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 pl-3.5 pr-10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                  >
                    {showNewUserPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Cadastrar Novo Aluno</span>
            </button>
          </form>
        )}

        {/* FORM 1B: Gerar Token de Verificação de Monitor e Novos ADMs */}
        {createTab === "token" && (
          <form onSubmit={handleGenerateTokenSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Perfil de Destino do Token
                </label>
                <select
                  value={newTokenRole}
                  onChange={(e) =>
                    setNewTokenRole(e.target.value as "monitor" | "admin")
                  }
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="monitor">Novo Monitor (MON-...)</option>
                  <option value="admin">Novo Administrador (ADM-...)</option>
                </select>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Código do Token (deixe em branco para gerar automaticamente)
                </label>
                <div className="flex flex-col min-[420px]:flex-row gap-2">
                  <input
                    type="text"
                    value={newTokenCode}
                    onChange={(e) => setNewTokenCode(e.target.value)}
                    placeholder={`Sugestão automática: ${buildSuggestedTokenCode(
                      newTokenRole
                    )}`}
                    className="flex-1 min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white font-mono uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewTokenCode(buildSuggestedTokenCode(newTokenRole))
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/35 text-purple-200 font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Sugerir Código</span>
                  </button>
                </div>
              </div>

              <div className="min-w-0 sm:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descrição / Finalidade do Token
                </label>
                <input
                  type="text"
                  required
                  value={newTokenDesc}
                  onChange={(e) => setNewTokenDesc(e.target.value)}
                  placeholder="Ex: Token de habilitação para Monitor do Bloco C"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Gerar Novo Token de Verificação</span>
            </button>
          </form>
        )}

        {/* FORM 1C: Cadastrar Novo Lugar, Vagas Disponíveis e Materiais */}
        {createTab === "lugar" && (
          <form onSubmit={handleCreateSpaceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome do Novo Lugar / Espaço
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Ex: Sala Multimídia de Projetos 301"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tipo do Espaço
                </label>
                <select
                  value={newSpaceType}
                  onChange={(e) => setNewSpaceType(e.target.value as SpaceType)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Biblioteca">Biblioteca</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Sala de estudos">Sala de estudos</option>
                  <option value="Sala">Sala</option>
                  <option value="Auditório">Auditório</option>
                </select>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Bloco / Prédio
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceBloco}
                  onChange={(e) => setNewSpaceBloco(e.target.value)}
                  placeholder="Ex: Bloco C"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Andar
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceAndar}
                  onChange={(e) => setNewSpaceAndar(e.target.value)}
                  placeholder="Ex: 3º Andar"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Identificação da Sala / Setor
                </label>
                <input
                  type="text"
                  value={newSpaceSala}
                  onChange={(e) => setNewSpaceSala(e.target.value)}
                  placeholder="Ex: Bloco C — 3º andar — Sala 301"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Capacidade Máxima Total
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newSpaceCapacidade}
                  onChange={(e) => {
                    const cap = Math.max(1, Number(e.target.value) || 1);
                    setNewSpaceCapacidade(cap);
                    if (newSpaceVagasLivres > cap) {
                      setNewSpaceVagasLivres(cap);
                    }
                  }}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                  Vagas Disponíveis Agora (0 a {newSpaceCapacidade})
                </label>
                <input
                  type="number"
                  min={0}
                  max={newSpaceCapacidade}
                  required
                  value={newSpaceVagasLivres}
                  onChange={(e) =>
                    setNewSpaceVagasLivres(
                      Math.min(
                        newSpaceCapacidade,
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    )
                  }
                  className="w-full min-w-0 bg-zinc-900/90 border border-emerald-500/40 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Perfil de Ambiente &amp; Horário
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newSpaceAmbiente}
                    onChange={(e) =>
                      setNewSpaceAmbiente(
                        e.target.value as
                          | "Silencioso"
                          | "Moderado"
                          | "Trabalho em Equipe"
                      )
                    }
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white"
                  >
                    <option value="Silencioso">Silencioso</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Trabalho em Equipe">Equipe</option>
                  </select>
                  <input
                    type="text"
                    value={newSpaceHorario}
                    onChange={(e) => setNewSpaceHorario(e.target.value)}
                    placeholder="08:00 às 22:00"
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-indigo-300 mb-1.5">
                  Materiais Disponíveis no Local (separe por vírgula)
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceMateriais}
                  onChange={(e) => setNewSpaceMateriais(e.target.value)}
                  placeholder="Ex: Notebooks, Projetor 4K, Quadro branco, Pilotos, Wi-Fi"
                  className="w-full min-w-0 bg-zinc-900/90 border border-indigo-500/40 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Regras de Utilização (separe por ponto e vírgula &quot;;&quot;)
                </label>
                <input
                  type="text"
                  value={newSpaceRegras}
                  onChange={(e) => setNewSpaceRegras(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Professor Responsável (Opcional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newSpaceProfessor}
                    onChange={(e) => setNewSpaceProfessor(e.target.value)}
                    placeholder="Nome Prof."
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newSpaceHorarioProf}
                    onChange={(e) => setNewSpaceHorarioProf(e.target.value)}
                    placeholder="14:00 às 18:00"
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descrição do Lugar
                </label>
                <textarea
                  rows={2}
                  value={newSpaceDescricao}
                  onChange={(e) => setNewSpaceDescricao(e.target.value)}
                  placeholder="Descreva a estrutura e finalidade pedagógica deste espaço..."
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Cadastrar Novo Lugar com Vagas e Materiais</span>
            </button>
          </form>
        )}

        {/* FORM 1D: Criar Aviso sobre os Locais */}
        {createTab === "aviso" && (
          <form onSubmit={handleCreateNoticeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Local de Estudo Alvo do Aviso
                </label>
                <select
                  value={noticeSpaceId}
                  onChange={(e) => setNoticeSpaceId(Number(e.target.value))}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} ({s.bloco})
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Prioridade do Aviso
                </label>
                <select
                  value={noticePriority}
                  onChange={(e) =>
                    setNoticePriority(e.target.value as SpaceNoticePriority)
                  }
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="informativo">Informativo</option>
                  <option value="atencao">Atenção</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="min-w-0 sm:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Título do Aviso sobre o Local
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ex: Manutenção de ar-condicionado concluída / Novos notebooks disponíveis"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="min-w-0 sm:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Mensagem Detalhada do Aviso
                </label>
                <textarea
                  required
                  rows={2}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Escreva a orientação que ficará visível para alunos e monitores nos cards e detalhes deste local..."
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>Publicar Aviso sobre o Local</span>
            </button>
          </form>
        )}

        {/* FORM 1E: Novo Evento em Local */}
        {createTab === "evento" && (
          <form onSubmit={handleCreateEventSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Espaço do Evento
                </label>
                <select
                  value={eventSpaceId}
                  onChange={(e) => setEventSpaceId(Number(e.target.value))}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white"
                >
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ex: Aulão Preparatório ENEM / Palestra"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Início
                </label>
                <input
                  type="time"
                  required
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Término
                </label>
                <input
                  type="time"
                  required
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Descrição do evento"
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Cadastrar Evento no Local</span>
            </button>
          </form>
        )}
      </div>

      {/* ===================================================================== */}
      {/* SEÇÃO 2: LISTA DE TODOS OS DADOS DO SISTEMA — ATUALIZAR E REMOVER     */}
      {/* ===================================================================== */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400 shrink-0" />
              <span>2. Lista Geral de Todos os Dados do Sistema (Atualizar &amp; Remover)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Visualize todos os registros armazenados no StudyMap, edite qualquer informação em tempo real ou remova dados obsoletos.
            </p>
          </div>

          <div className="relative w-full lg:w-80 min-w-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filtrar em todos os dados..."
              className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Abas de filtro da Lista Geral */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "todos" as const, label: `Todos os Dados (${totalSystemRecords})` },
            { id: "usuarios" as const, label: `Usuários (${filteredUsers.length})` },
            { id: "tokens" as const, label: `Tokens (${filteredTokens.length})` },
            {
              id: "lugares" as const,
              label: `Lugares, Vagas & Materiais (${filteredSpaces.length})`
            },
            {
              id: "avisos" as const,
              label: `Avisos dos Locais (${filteredNotices.length})`
            },
            {
              id: "reservas" as const,
              label: `Reservas (${filteredReservations.length})`
            },
            {
              id: "fila" as const,
              label: `Fila de Espera (${filteredWaitlist.length})`
            },
            { id: "eventos" as const, label: `Eventos (${filteredEvents.length})` },
            {
              id: "monitoria" as const,
              label: `Escalas & Logs (${
                filteredSchedules.length +
                filteredAbsences.length +
                filteredCancellations.length
              })`
            }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDataTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                dataTab === tab.id
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                  : "bg-zinc-900/70 text-zinc-300 border-white/5 hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2.1 USUÁRIOS */}
        {showSection("usuarios") && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Users className="w-4 h-4 shrink-0" />
              <span>Usuários Cadastrados ({filteredUsers.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm font-bold text-white wrap-break-word">
                        {u.nome}
                      </strong>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          u.perfil === "admin"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : u.perfil === "monitor"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                        }`}
                      >
                        {u.perfil}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 break-all">{u.email}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                      <span>Matrícula: {u.matricula || "—"}</span>
                      {u.token && <span>• Token: {u.token}</span>}
                      {u.espacoMonitoria && (
                        <span className="text-cyan-300 wrap-break-word">
                          • Local: {u.espacoMonitoria}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingUser({
                          id: u.id,
                          nome: u.nome,
                          email: u.email,
                          senha: u.senha,
                          perfil: u.perfil,
                          matricula: u.matricula || "",
                          token: u.token || "",
                          espacoMonitoriaId: u.espacoMonitoriaId || spaces[0]?.id || 1
                        })
                      }
                      className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      disabled={u.id === currentUser.id}
                      onClick={() =>
                        setDeleteTarget({
                          kind: "user",
                          id: u.id,
                          label: `Usuário ${u.nome} (${u.email})`
                        })
                      }
                      className="flex-1 bg-red-500/15 hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{u.id === currentUser.id ? "Sessão Atual" : "Remover"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.2 TOKENS DE VERIFICAÇÃO */}
        {showSection("tokens") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Tokens de Verificação de Monitor e Novos ADMs ({filteredTokens.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredTokens.map((t) => (
                <div
                  key={t.codigo}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm font-mono font-bold text-white break-all">
                        {t.codigo}
                      </strong>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          t.usadoPorEmail
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {t.usadoPorEmail ? "Em Uso" : "Disponível"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 wrap-break-word">{t.descricao}</p>
                    <p className="text-[11px] text-zinc-400 break-all">
                      Destino: <strong className="text-zinc-200">{t.perfilDestino}</strong>
                      {t.usadoPorEmail ? ` • Vinculado a: ${t.usadoPorEmail}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingToken({
                          originalCodigo: t.codigo,
                          codigo: t.codigo,
                          perfilDestino: t.perfilDestino,
                          descricao: t.descricao,
                          usadoPorEmail: t.usadoPorEmail,
                          liberarVinculo: false
                        })
                      }
                      className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "token",
                          codigo: t.codigo,
                          label: `Token ${t.codigo}`
                        })
                      }
                      className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.3 LUGARES, VAGAS DISPONÍVEIS E MATERIAIS */}
        {showSection("lugares") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Lugares Cadastrados, Vagas Disponíveis &amp; Materiais ({filteredSpaces.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSpaces.map((s) => {
                const livres = Math.max(0, s.capacidade - s.ocupacao);
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-white wrap-break-word">
                          {s.nome}
                        </strong>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          {livres}/{s.capacidade} vagas livres
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 wrap-break-word">
                        {s.salaIdentificacao} • {s.tipo} • {s.horarioFuncionamento}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.materiais.map((mat, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/60 wrap-break-word"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSpace({
                            id: s.id,
                            nome: s.nome,
                            bloco: s.bloco,
                            andar: s.andar,
                            salaIdentificacao: s.salaIdentificacao,
                            tipo: s.tipo,
                            perfilAmbiente: s.perfilAmbiente,
                            horarioFuncionamento: s.horarioFuncionamento,
                            capacidade: s.capacidade,
                            vagasDisponiveis: Math.max(0, s.capacidade - s.ocupacao),
                            descricao: s.descricao,
                            materiaisText: s.materiais.join(", "),
                            regrasText: s.regras.join("; "),
                            professorResponsavel: s.professorResponsavel || "",
                            horarioProfessor: s.horarioProfessor || "",
                            monitorDisponivel: s.monitorDisponivel,
                            nomeMonitor: s.nomeMonitor || "",
                            horarioMonitor: s.horarioMonitor || ""
                          })
                        }
                        className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                        <span>Atualizar Lugar / Vagas / Materiais</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "space",
                            id: s.id,
                            label: `Lugar "${s.nome}"`
                          })
                        }
                        className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2.4 AVISOS SOBRE OS LOCAIS */}
        {showSection("avisos") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>Avisos sobre os Locais ({filteredNotices.length})</span>
            </h4>
            {filteredNotices.length === 0 ? (
              <p className="text-xs text-zinc-500">Nenhum aviso cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredNotices.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-white wrap-break-word">
                          {n.titulo}
                        </strong>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                          {n.prioridade} • {n.ativo ? "Ativo" : "Oculto"}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 wrap-break-word">
                        Local: {n.espacoNome}
                      </p>
                      <p className="text-xs text-zinc-300 wrap-break-word">
                        {n.mensagem}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingNotice({
                            id: n.id,
                            espacoId: n.espacoId,
                            titulo: n.titulo,
                            mensagem: n.mensagem,
                            prioridade: n.prioridade,
                            ativo: n.ativo
                          })
                        }
                        className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                        <span>Atualizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "notice",
                            id: n.id,
                            label: `Aviso "${n.titulo}"`
                          })
                        }
                        className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2.5 RESERVAS */}
        {showSection("reservas") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Reservas &amp; Check-ins do Sistema ({filteredReservations.length})</span>
            </h4>
            {filteredReservations.length === 0 ? (
              <p className="text-xs text-zinc-500">Nenhuma reserva encontrada.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredReservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-white wrap-break-word">
                          {r.usuarioNome}
                        </strong>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          {r.status} {r.checkIn ? "• Check-in OK" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 wrap-break-word">
                        {getSpaceName(r.espacoId)}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {r.data} ({r.horarioInicio} às {r.horarioFim})
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingReservation({
                            id: r.id,
                            usuarioNome: r.usuarioNome,
                            usuarioEmail: r.usuarioEmail || "",
                            espacoId: r.espacoId,
                            data: r.data,
                            horarioInicio: r.horarioInicio,
                            horarioFim: r.horarioFim,
                            status: r.status,
                            checkIn: r.checkIn,
                            motivoCancelamento: r.motivoCancelamento || ""
                          })
                        }
                        className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                        <span>Atualizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "reservation",
                            id: r.id,
                            label: `Reserva de ${r.usuarioNome}`
                          })
                        }
                        className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2.6 FILA DE ESPERA */}
        {showSection("fila") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Fila de Espera ({filteredWaitlist.length})</span>
            </h4>
            {filteredWaitlist.length === 0 ? (
              <p className="text-xs text-zinc-500">Nenhum aluno na fila de espera.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredWaitlist.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-white wrap-break-word">
                          #{w.posicao}º — {w.nomeAluno}
                        </strong>
                        <span className="text-[11px] text-amber-300 font-semibold">
                          {w.data} ({w.horarioInicio}–{w.horarioFim})
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 wrap-break-word">
                        {getSpaceName(w.espacoId)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingWaitlist({
                            id: w.id,
                            nomeAluno: w.nomeAluno,
                            espacoId: w.espacoId,
                            data: w.data,
                            horarioInicio: w.horarioInicio,
                            horarioFim: w.horarioFim,
                            posicao: w.posicao
                          })
                        }
                        className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                        <span>Atualizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "waitlist",
                            id: w.id,
                            label: `Entrada de ${w.nomeAluno} na fila`
                          })
                        }
                        className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2.7 EVENTOS DOS ESPAÇOS */}
        {showSection("eventos") && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Eventos Programados nos Espaços ({filteredEvents.length})</span>
            </h4>
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-zinc-500">Nenhum evento cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <strong className="text-sm font-bold text-white block wrap-break-word">
                        {ev.nome}
                      </strong>
                      <p className="text-xs text-indigo-300 wrap-break-word">
                        {getSpaceName(ev.espacoId)} • {ev.data} ({ev.horarioInicio}–
                        {ev.horarioFim})
                      </p>
                      <p className="text-xs text-zinc-400 wrap-break-word">
                        {ev.descricao}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingEvent({
                            id: ev.id,
                            espacoId: ev.espacoId,
                            nome: ev.nome,
                            data: ev.data,
                            horarioInicio: ev.horarioInicio,
                            horarioFim: ev.horarioFim,
                            descricao: ev.descricao
                          })
                        }
                        className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                        <span>Atualizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "event",
                            id: ev.id,
                            label: `Evento "${ev.nome}"`
                          })
                        }
                        className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2.8 ESCALAS DE MONITORIA, AVISOS DE AUSÊNCIA & CANCELAMENTOS */}
        {showSection("monitoria") && (
          <div className="space-y-4 pt-2 border-t border-white/5">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Escalas de Monitoria ({filteredSchedules.length}), Ausências (
                {filteredAbsences.length}) &amp; Cancelamentos ({filteredCancellations.length})
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSchedules.map((ms) => (
                <div
                  key={`sched-${ms.id}`}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-cyan-500/20 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-xs sm:text-sm font-bold text-white wrap-break-word">
                        Escala: {ms.monitorNome}
                      </strong>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        {ms.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 wrap-break-word">{ms.espacoNome}</p>
                    <p className="text-[11px] text-zinc-400">
                      {ms.data} ({ms.horarioInicio} às {ms.horarioFim})
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingSchedule({
                          id: ms.id,
                          monitorNome: ms.monitorNome,
                          espacoId: ms.espacoId,
                          data: ms.data,
                          horarioInicio: ms.horarioInicio,
                          horarioFim: ms.horarioFim,
                          status: ms.status,
                          motivoAusencia: ms.motivoAusencia || ""
                        })
                      }
                      className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "schedule",
                          id: ms.id,
                          label: `Escala de ${ms.monitorNome}`
                        })
                      }
                      className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredAbsences.map((ma) => (
                <div
                  key={`abs-${ma.id}`}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-amber-500/20 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="space-y-1 min-w-0">
                    <strong className="text-xs sm:text-sm font-bold text-amber-200 block wrap-break-word">
                      Ausência Monitor: {ma.monitorNome}
                    </strong>
                    <p className="text-xs text-zinc-300 wrap-break-word">
                      {ma.espacoNome} • {ma.data} ({ma.horarioInicio}–{ma.horarioFim})
                    </p>
                    <p className="text-xs text-zinc-400 wrap-break-word">{ma.motivo}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingAbsence({
                          id: ma.id,
                          monitorNome: ma.monitorNome,
                          espacoId: ma.espacoId,
                          data: ma.data,
                          horarioInicio: ma.horarioInicio,
                          horarioFim: ma.horarioFim,
                          motivo: ma.motivo
                        })
                      }
                      className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "absence",
                          id: ma.id,
                          label: `Aviso de ausência de ${ma.monitorNome}`
                        })
                      }
                      className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredCancellations.map((c) => (
                <div
                  key={`canc-${c.id}`}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-red-500/20 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="space-y-1 min-w-0">
                    <strong className="text-xs sm:text-sm font-bold text-red-200 block wrap-break-word">
                      Cancelamento: {c.usuarioNome}
                    </strong>
                    <p className="text-xs text-zinc-300 wrap-break-word">
                      {c.espacoNome} • {c.dataReserva} ({c.horarioInicio}–{c.horarioFim})
                    </p>
                    <p className="text-xs text-zinc-400 wrap-break-word">{c.mensagem}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCancellation({
                          id: c.id,
                          usuarioNome: c.usuarioNome,
                          dataReserva: c.dataReserva,
                          horarioInicio: c.horarioInicio,
                          horarioFim: c.horarioFim,
                          mensagem: c.mensagem
                        })
                      }
                      className="flex-1 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 shrink-0" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "cancellation",
                          id: c.id,
                          label: `Registro de cancelamento de ${c.usuarioNome}`
                        })
                      }
                      className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAIS DE EDIÇÃO (PASSO 4 - ITEM 3) E REMOÇÃO (PASSO 4 - ITEM 4)      */}
      {/* ===================================================================== */}

      {/* Modal: Editar Usuário */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const sp = spaces.find((s) => s.id === editingUser.espacoMonitoriaId);
              const res = onUpdateUser(editingUser.id, {
                nome: editingUser.nome,
                email: editingUser.email,
                senha: editingUser.senha,
                perfil: editingUser.perfil,
                matricula: editingUser.matricula,
                token: editingUser.token,
                espacoMonitoriaId: editingUser.espacoMonitoriaId,
                espacoMonitoria: sp?.nome
              });
              if (res.success) setEditingUser(null);
            }}
            className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92dvh] overflow-y-auto my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Usuário</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={editingUser.nome}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, nome: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  E-mail (único)
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Senha</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={editingUser.senha}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, senha: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={editingUser.matricula}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, matricula: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Perfil</label>
                <select
                  value={editingUser.perfil}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      perfil: e.target.value as UserRole
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  <option value="aluno">Aluno</option>
                  <option value="monitor">Monitor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {editingUser.perfil !== "aluno" && (
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Token Vinculado
                  </label>
                  <input
                    type="text"
                    value={editingUser.token}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, token: e.target.value })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
              )}
              {editingUser.perfil === "monitor" && (
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Local Registrado da Monitoria
                  </label>
                  <select
                    value={editingUser.espacoMonitoriaId}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        espacoMonitoriaId: Number(e.target.value)
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                  >
                    {spaces.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Token */}
      {editingToken && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateToken(editingToken.originalCodigo, {
                codigo: editingToken.codigo,
                perfilDestino: editingToken.perfilDestino,
                descricao: editingToken.descricao,
                liberarVinculo: editingToken.liberarVinculo
              });
              if (res.success) setEditingToken(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Token</h3>
              <button
                type="button"
                onClick={() => setEditingToken(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Código</label>
                <input
                  type="text"
                  required
                  value={editingToken.codigo}
                  onChange={(e) =>
                    setEditingToken({ ...editingToken, codigo: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Perfil de Destino
                </label>
                <select
                  value={editingToken.perfilDestino}
                  onChange={(e) =>
                    setEditingToken({
                      ...editingToken,
                      perfilDestino: e.target.value as "monitor" | "admin"
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  <option value="monitor">Monitor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={editingToken.descricao}
                  onChange={(e) =>
                    setEditingToken({ ...editingToken, descricao: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              {editingToken.usadoPorEmail && (
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingToken.liberarVinculo}
                    onChange={(e) =>
                      setEditingToken({
                        ...editingToken,
                        liberarVinculo: e.target.checked
                      })
                    }
                  />
                  <span className="wrap-break-word">
                    Liberar vínculo atual ({editingToken.usadoPorEmail}) para novo uso
                  </span>
                </label>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingToken(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Token
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Lugar, Vagas Disponíveis e Materiais */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const cap = Math.max(1, Number(editingSpace.capacidade) || 1);
              const livres = Math.min(
                cap,
                Math.max(0, Number(editingSpace.vagasDisponiveis) || 0)
              );
              const res = onUpdateSpace(editingSpace.id, {
                nome: editingSpace.nome,
                bloco: editingSpace.bloco,
                andar: editingSpace.andar,
                salaIdentificacao: editingSpace.salaIdentificacao,
                localizacao: editingSpace.salaIdentificacao,
                tipo: editingSpace.tipo,
                perfilAmbiente: editingSpace.perfilAmbiente,
                horarioFuncionamento: editingSpace.horarioFuncionamento,
                capacidade: cap,
                ocupacao: Math.max(0, cap - livres),
                descricao: editingSpace.descricao,
                materiais: editingSpace.materiaisText
                  .split(",")
                  .map((m) => m.trim())
                  .filter(Boolean),
                regras: editingSpace.regrasText
                  .split(";")
                  .map((r) => r.trim())
                  .filter(Boolean),
                professorResponsavel:
                  editingSpace.professorResponsavel.trim() || undefined,
                horarioProfessor:
                  editingSpace.horarioProfessor.trim() || undefined,
                monitorDisponivel: editingSpace.monitorDisponivel,
                nomeMonitor: editingSpace.monitorDisponivel
                  ? editingSpace.nomeMonitor.trim() || undefined
                  : undefined,
                horarioMonitor: editingSpace.monitorDisponivel
                  ? editingSpace.horarioMonitor.trim() || undefined
                  : undefined
              });
              if (res.success) setEditingSpace(null);
            }}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92dvh] overflow-y-auto my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Atualizar Lugar, Vagas Disponíveis &amp; Materiais</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Nome do Espaço
                </label>
                <input
                  type="text"
                  required
                  value={editingSpace.nome}
                  onChange={(e) =>
                    setEditingSpace({ ...editingSpace, nome: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Capacidade Máxima
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={editingSpace.capacidade}
                  onChange={(e) => {
                    const cap = Math.max(1, Number(e.target.value) || 1);
                    setEditingSpace({
                      ...editingSpace,
                      capacidade: cap,
                      vagasDisponiveis: Math.min(editingSpace.vagasDisponiveis, cap)
                    });
                  }}
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-semibold mb-1">
                  Vagas Disponíveis Agora (0 a {editingSpace.capacidade})
                </label>
                <input
                  type="number"
                  min={0}
                  max={editingSpace.capacidade}
                  required
                  value={editingSpace.vagasDisponiveis}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      vagasDisponiveis: Math.min(
                        editingSpace.capacidade,
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-emerald-500/40 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Identificação da Sala
                </label>
                <input
                  type="text"
                  required
                  value={editingSpace.salaIdentificacao}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      salaIdentificacao: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  required
                  value={editingSpace.horarioFuncionamento}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      horarioFuncionamento: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-indigo-300 font-semibold mb-1">
                  Materiais Disponíveis (separe por vírgula)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingSpace.materiaisText}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      materiaisText: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-indigo-500/40 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Regras de Utilização (separe por &quot;;&quot;)
                </label>
                <textarea
                  rows={2}
                  value={editingSpace.regrasText}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      regrasText: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={editingSpace.descricao}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
                      descricao: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Atualizações do Lugar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Aviso sobre o Local */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateSpaceNotice(editingNotice.id, {
                espacoId: editingNotice.espacoId,
                titulo: editingNotice.titulo,
                mensagem: editingNotice.mensagem,
                prioridade: editingNotice.prioridade,
                ativo: editingNotice.ativo
              });
              if (res.success) setEditingNotice(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Aviso do Local</h3>
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Local</label>
                <select
                  value={editingNotice.espacoId}
                  onChange={(e) =>
                    setEditingNotice({
                      ...editingNotice,
                      espacoId: Number(e.target.value)
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  {spaces.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={editingNotice.titulo}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, titulo: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Prioridade
                </label>
                <select
                  value={editingNotice.prioridade}
                  onChange={(e) =>
                    setEditingNotice({
                      ...editingNotice,
                      prioridade: e.target.value as SpaceNoticePriority
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  <option value="informativo">Informativo</option>
                  <option value="atencao">Atenção</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Mensagem
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingNotice.mensagem}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, mensagem: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNotice.ativo}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, ativo: e.target.checked })
                  }
                />
                <span>Aviso ativo (visível nos cards e modal do local)</span>
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Aviso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Reserva */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateReservation(editingReservation.id, {
                usuarioNome: editingReservation.usuarioNome,
                usuarioEmail: editingReservation.usuarioEmail,
                espacoId: editingReservation.espacoId,
                data: editingReservation.data,
                horarioInicio: editingReservation.horarioInicio,
                horarioFim: editingReservation.horarioFim,
                status: editingReservation.status,
                checkIn: editingReservation.checkIn,
                motivoCancelamento: editingReservation.motivoCancelamento
              });
              if (res.success) setEditingReservation(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Reserva</h3>
              <button
                type="button"
                onClick={() => setEditingReservation(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Nome do Estudante
                </label>
                <input
                  type="text"
                  required
                  value={editingReservation.usuarioNome}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      usuarioNome: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Espaço</label>
                <select
                  value={editingReservation.espacoId}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      espacoId: Number(e.target.value)
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  {spaces.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={editingReservation.data}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        data: e.target.value
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Início</label>
                  <input
                    type="time"
                    required
                    value={editingReservation.horarioInicio}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        horarioInicio: e.target.value
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Fim</label>
                  <input
                    type="time"
                    required
                    value={editingReservation.horarioFim}
                    onChange={(e) =>
                      setEditingReservation({
                        ...editingReservation,
                        horarioFim: e.target.value
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Status</label>
                <select
                  value={editingReservation.status}
                  onChange={(e) => {
                    const st = e.target.value as
                      | "reservada"
                      | "confirmada"
                      | "cancelada";
                    setEditingReservation({
                      ...editingReservation,
                      status: st,
                      checkIn: st === "confirmada"
                    });
                  }}
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  <option value="reservada">Reservada (Aguardando Check-in)</option>
                  <option value="confirmada">Confirmada (Check-in Realizado)</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingReservation(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Reserva
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Fila de Espera */}
      {editingWaitlist && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateWaitlistEntry(editingWaitlist.id, {
                nomeAluno: editingWaitlist.nomeAluno,
                espacoId: editingWaitlist.espacoId,
                data: editingWaitlist.data,
                horarioInicio: editingWaitlist.horarioInicio,
                horarioFim: editingWaitlist.horarioFim,
                posicao: editingWaitlist.posicao
              });
              if (res.success) setEditingWaitlist(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Fila de Espera</h3>
              <button
                type="button"
                onClick={() => setEditingWaitlist(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Nome do Aluno
                </label>
                <input
                  type="text"
                  required
                  value={editingWaitlist.nomeAluno}
                  onChange={(e) =>
                    setEditingWaitlist({
                      ...editingWaitlist,
                      nomeAluno: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Espaço
                  </label>
                  <select
                    value={editingWaitlist.espacoId}
                    onChange={(e) =>
                      setEditingWaitlist({
                        ...editingWaitlist,
                        espacoId: Number(e.target.value)
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                  >
                    {spaces.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Posição
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingWaitlist.posicao}
                    onChange={(e) =>
                      setEditingWaitlist({
                        ...editingWaitlist,
                        posicao: Number(e.target.value) || 1
                      })
                    }
                    className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  required
                  value={editingWaitlist.data}
                  onChange={(e) =>
                    setEditingWaitlist({ ...editingWaitlist, data: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingWaitlist.horarioInicio}
                  onChange={(e) =>
                    setEditingWaitlist({
                      ...editingWaitlist,
                      horarioInicio: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingWaitlist.horarioFim}
                  onChange={(e) =>
                    setEditingWaitlist({
                      ...editingWaitlist,
                      horarioFim: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingWaitlist(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Fila
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Evento */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateEvent(editingEvent.id, {
                espacoId: editingEvent.espacoId,
                nome: editingEvent.nome,
                data: editingEvent.data,
                horarioInicio: editingEvent.horarioInicio,
                horarioFim: editingEvent.horarioFim,
                descricao: editingEvent.descricao
              });
              if (res.success) setEditingEvent(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Atualizar Evento</h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={editingEvent.nome}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, nome: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Espaço</label>
                <select
                  value={editingEvent.espacoId}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      espacoId: Number(e.target.value)
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                >
                  {spaces.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  required
                  value={editingEvent.data}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, data: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingEvent.horarioInicio}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      horarioInicio: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingEvent.horarioFim}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      horarioFim: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.descricao}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, descricao: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Evento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Escala de Monitoria */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateMonitorSchedule(editingSchedule.id, {
                espacoId: editingSchedule.espacoId,
                data: editingSchedule.data,
                horarioInicio: editingSchedule.horarioInicio,
                horarioFim: editingSchedule.horarioFim,
                status: editingSchedule.status,
                motivoAusencia: editingSchedule.motivoAusencia
              });
              if (res.success) setEditingSchedule(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                Atualizar Escala ({editingSchedule.monitorNome})
              </h3>
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <select
                value={editingSchedule.espacoId}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    espacoId: Number(e.target.value)
                  })
                }
                className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
              >
                {spaces.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.nome}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  required
                  value={editingSchedule.data}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, data: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingSchedule.horarioInicio}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      horarioInicio: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingSchedule.horarioFim}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      horarioFim: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
              </div>
              <select
                value={editingSchedule.status}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    status: e.target.value as "agendado" | "ausencia_informada"
                  })
                }
                className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
              >
                <option value="agendado">Agendado</option>
                <option value="ausencia_informada">Ausência Informada</option>
              </select>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Escala
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Aviso de Ausência de Monitor */}
      {editingAbsence && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateMonitorAbsence(editingAbsence.id, {
                espacoId: editingAbsence.espacoId,
                data: editingAbsence.data,
                horarioInicio: editingAbsence.horarioInicio,
                horarioFim: editingAbsence.horarioFim,
                motivo: editingAbsence.motivo
              });
              if (res.success) setEditingAbsence(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                Atualizar Ausência ({editingAbsence.monitorNome})
              </h3>
              <button
                type="button"
                onClick={() => setEditingAbsence(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <select
                value={editingAbsence.espacoId}
                onChange={(e) =>
                  setEditingAbsence({
                    ...editingAbsence,
                    espacoId: Number(e.target.value)
                  })
                }
                className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
              >
                {spaces.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.nome}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  required
                  value={editingAbsence.data}
                  onChange={(e) =>
                    setEditingAbsence({ ...editingAbsence, data: e.target.value })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingAbsence.horarioInicio}
                  onChange={(e) =>
                    setEditingAbsence({
                      ...editingAbsence,
                      horarioInicio: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingAbsence.horarioFim}
                  onChange={(e) =>
                    setEditingAbsence({
                      ...editingAbsence,
                      horarioFim: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
              </div>
              <textarea
                rows={2}
                required
                value={editingAbsence.motivo}
                onChange={(e) =>
                  setEditingAbsence({ ...editingAbsence, motivo: e.target.value })
                }
                className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAbsence(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Aviso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Registro de Cancelamento */}
      {editingCancellation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onUpdateCancellationNotice(editingCancellation.id, {
                mensagem: editingCancellation.mensagem,
                dataReserva: editingCancellation.dataReserva,
                horarioInicio: editingCancellation.horarioInicio,
                horarioFim: editingCancellation.horarioFim
              });
              if (res.success) setEditingCancellation(null);
            }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                Atualizar Cancelamento ({editingCancellation.usuarioNome})
              </h3>
              <button
                type="button"
                onClick={() => setEditingCancellation(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  required
                  value={editingCancellation.dataReserva}
                  onChange={(e) =>
                    setEditingCancellation({
                      ...editingCancellation,
                      dataReserva: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingCancellation.horarioInicio}
                  onChange={(e) =>
                    setEditingCancellation({
                      ...editingCancellation,
                      horarioInicio: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
                <input
                  type="time"
                  required
                  value={editingCancellation.horarioFim}
                  onChange={(e) =>
                    setEditingCancellation({
                      ...editingCancellation,
                      horarioFim: e.target.value
                    })
                  }
                  className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white"
                />
              </div>
              <textarea
                rows={3}
                required
                value={editingCancellation.mensagem}
                onChange={(e) =>
                  setEditingCancellation({
                    ...editingCancellation,
                    mensagem: e.target.value
                  })
                }
                className="w-full min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCancellation(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Confirmação de Remoção (Passo 4 - Item 4) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-red-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 min-w-0">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Confirmar Remoção de Dados
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed wrap-break-word">
                  Deseja realmente remover{" "}
                  <strong className="text-white">{deleteTarget.label}</strong> do
                  sistema?
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full sm:w-1/2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full sm:w-1/2 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Remover Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

