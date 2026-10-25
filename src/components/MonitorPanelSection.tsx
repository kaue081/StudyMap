"use client";

import React, { useState } from "react";
import {
  StudySpace,
  Reservation,
  UserAccount,
  MonitorDestinationSchedule,
  MonitorAbsenceNotice
} from "../types";
import { ReactAlertBanner } from "./ReactAlert";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Send,
  XCircle,
  CheckCircle2,
  Hash,
  Mail,
  Building2,
  Search,
  X,
  UserCheck,
  BookmarkCheck
} from "lucide-react";

interface MonitorPanelSectionProps {
  currentUser: UserAccount;
  spaces: StudySpace[];
  reservations: Reservation[];
  users: UserAccount[];
  monitorSchedules: MonitorDestinationSchedule[];
  monitorAbsences: MonitorAbsenceNotice[];
  onScheduleDestination: (data: {
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    tipoAtividade?: "ajudar" | "estudar";
  }) => { success: boolean; message: string };
  onSendAbsenceNotice: (data: {
    scheduleId?: number;
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    motivo: string;
  }) => { success: boolean; message: string };
  onCancelStudentCheckIn: (
    reservationId: number,
    monitorNome: string,
    motivo?: string
  ) => { success: boolean; message: string };
  onUpdateRegisteredSpace: (
    espacoId: number,
    espacoNome: string
  ) => { success: boolean; message: string };
  onOpenReserveStudySpot: (space: StudySpace) => void;
}

const ABSENCE_REASON_PRESETS = [
  "Compromisso acadêmico / avaliação no mesmo horário do plantão.",
  "Imprevisto pessoal / saúde — impossibilidade de comparecer ao local de destino.",
  "Reunião convocada pela Coordenação Geral (Admin 1)."
];

const REVOKE_CHECKIN_PRESETS = [
  "Aluno ausente do posto de estudo após a realização do check-in.",
  "Saída antecipada comunicada ao monitor; liberando vaga para outro aluno reservar.",
  "Descumprimento das normas de utilização do espaço monitorado."
];

export function MonitorPanelSection({
  currentUser,
  spaces,
  reservations,
  users,
  monitorSchedules,
  monitorAbsences,
  onScheduleDestination,
  onSendAbsenceNotice,
  onCancelStudentCheckIn,
  onUpdateRegisteredSpace,
  onOpenReserveStudySpot
}: MonitorPanelSectionProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Resolver espaço registrado do monitor (por ID, por nome ou primeiro espaço)
  const resolvedRegisteredSpace =
    spaces.find((s) => s.id === currentUser.espacoMonitoriaId) ||
    spaces.find(
      (s) =>
        currentUser.espacoMonitoria &&
        s.nome.toLowerCase() === currentUser.espacoMonitoria.toLowerCase()
    ) ||
    spaces[0];

  // Filtro da lista de todos os locais do campus (Passo 3 - Lista de todos)
  const [spaceQuery, setSpaceQuery] = useState("");
  const [spaceTypeFilter, setSpaceTypeFilter] = useState("Todos");

  // Formulário 1: Agendar o local de destino (Passo 3 - Item 1)
  const [destSpaceId, setDestSpaceId] = useState<number>(
    resolvedRegisteredSpace?.id || 1
  );
  const [destDate, setDestDate] = useState<string>(todayStr);
  const [destStart, setDestStart] = useState<string>("09:00");
  const [destEnd, setDestEnd] = useState<string>("17:00");
  const [destTipoAtividade, setDestTipoAtividade] = useState<"ajudar" | "estudar">("ajudar");
  const [schedulingModalSpace, setSchedulingModalSpace] = useState<StudySpace | null>(null);
  const [scheduleBanner, setScheduleBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Procura se o monitor tem agendamento ativo de destino para HOJE
  const todayMonitorSchedule = monitorSchedules.find(
    (s) =>
      s.status === "agendado" &&
      s.data === todayStr &&
      (s.monitorId === currentUser.id ||
        (s.monitorEmail && s.monitorEmail.toLowerCase() === currentUser.email.toLowerCase()))
  );

  // Espaço detectado automaticamente para o monitor
  const autoDetectedSpace = todayMonitorSchedule
    ? spaces.find((s) => s.id === todayMonitorSchedule.espacoId)
    : resolvedRegisteredSpace;

  const [overrideMonitoredSpaceId, setOverrideMonitoredSpaceId] = useState<number | null>(null);

  const currentMonitoredSpace =
    (overrideMonitoredSpaceId && spaces.find((s) => s.id === overrideMonitoredSpaceId)) ||
    autoDetectedSpace ||
    resolvedRegisteredSpace ||
    spaces[0];

  // Formulário 2: Enviar aviso de não comparecimento no local de destino (Passo 3 - Item 2)
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | "manual">("manual");
  const [absenceSpaceId, setAbsenceSpaceId] = useState<number>(
    resolvedRegisteredSpace?.id || 1
  );
  const [absenceDate, setAbsenceDate] = useState<string>(todayStr);
  const [absenceStart, setAbsenceStart] = useState<string>("09:00");
  const [absenceEnd, setAbsenceEnd] = useState<string>("17:00");
  const [absenceReason, setAbsenceReason] = useState<string>(ABSENCE_REASON_PRESETS[0]);
  const [absenceBanner, setAbsenceBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Filtro da Lista de Alunos no Local Registrado (Passo 3 - Itens 9 e 10)
  const [studentStatusFilter, setStudentStatusFilter] = useState<
    "ativos" | "checkin" | "aguardando" | "todos"
  >("ativos");
  const [revokingReservation, setRevokingReservation] = useState<Reservation | null>(null);
  const [revokeReason, setRevokeReason] = useState<string>(REVOKE_CHECKIN_PRESETS[0]);

  const registeredSpace = currentMonitoredSpace;
  const registeredFreeSpots = registeredSpace
    ? Math.max(0, registeredSpace.capacidade - registeredSpace.ocupacao)
    : 0;

  // Filtragem da lista de todos os locais
  const filteredSpaces = spaces.filter((space) => {
    const matchesType =
      spaceTypeFilter === "Todos" || space.tipo === spaceTypeFilter;
    if (!matchesType) return false;
    if (!spaceQuery.trim()) return true;
    const q = spaceQuery.trim().toLowerCase();
    return (
      space.nome.toLowerCase().includes(q) ||
      space.bloco.toLowerCase().includes(q) ||
      space.salaIdentificacao.toLowerCase().includes(q)
    );
  });

  // Agendamentos e avisos visíveis (Monitor vê os seus; Admin vê todos ou os seus)
  const visibleSchedules =
    currentUser.perfil === "admin"
      ? monitorSchedules
      : monitorSchedules.filter(
          (s) =>
            s.monitorId === currentUser.id ||
            s.monitorEmail.toLowerCase() === currentUser.email.toLowerCase()
        );

  const visibleAbsences =
    currentUser.perfil === "admin"
      ? monitorAbsences
      : monitorAbsences.filter(
          (a) =>
            a.monitorId === currentUser.id ||
            a.monitorEmail.toLowerCase() === currentUser.email.toLowerCase()
        );

  // Lista de reservas de alunos no local em que o monitor foi registrado
  const allSpaceReservations = registeredSpace
    ? reservations.filter((r) => r.espacoId === registeredSpace.id)
    : [];

  const activeSpaceReservations = allSpaceReservations.filter(
    (r) => r.status !== "cancelada"
  );
  const checkedInStudentsCount = activeSpaceReservations.filter(
    (r) => r.checkIn && r.status === "confirmada"
  ).length;

  const filteredSpaceReservations = allSpaceReservations.filter((r) => {
    if (studentStatusFilter === "ativos") return r.status !== "cancelada";
    if (studentStatusFilter === "checkin") return r.checkIn && r.status === "confirmada";
    if (studentStatusFilter === "aguardando") return !r.checkIn && r.status === "reservada";
    return true;
  });

  const findStudentAccount = (res: Reservation): UserAccount | undefined => {
    return users.find(
      (u) =>
        (res.usuarioId && u.id === res.usuarioId) ||
        (res.usuarioEmail &&
          u.email.toLowerCase() === res.usuarioEmail.toLowerCase()) ||
        u.nome.toLowerCase() === res.usuarioNome.toLowerCase()
    );
  };

  const handleSelectSpaceForSchedule = (space: StudySpace) => {
    setSchedulingModalSpace(space);
    setDestSpaceId(space.id);
    setDestDate(todayStr);
    setDestStart("09:00");
    setDestEnd("17:00");
    setDestTipoAtividade("ajudar");
  };

  const handlePrefillAbsenceFromSchedule = (sched: MonitorDestinationSchedule) => {
    setSelectedScheduleId(sched.id);
    setAbsenceSpaceId(sched.espacoId);
    setAbsenceDate(sched.data);
    setAbsenceStart(sched.horarioInicio);
    setAbsenceEnd(sched.horarioFim);
    setAbsenceBanner(null);
  };

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleBanner(null);

    const result = onScheduleDestination({
      monitorId: currentUser.id,
      monitorNome: currentUser.nome,
      monitorEmail: currentUser.email,
      espacoId: destSpaceId,
      data: destDate,
      horarioInicio: destStart,
      horarioFim: destEnd,
      tipoAtividade: destTipoAtividade
    });

    setScheduleBanner({
      type: result.success ? "success" : "error",
      message: result.message
    });

    if (result.success && schedulingModalSpace) {
      setSchedulingModalSpace(null);
    }
  };

  const handleSubmitAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    setAbsenceBanner(null);

    const result = onSendAbsenceNotice({
      scheduleId: selectedScheduleId === "manual" ? undefined : selectedScheduleId,
      monitorId: currentUser.id,
      monitorNome: currentUser.nome,
      monitorEmail: currentUser.email,
      espacoId: absenceSpaceId,
      data: absenceDate,
      horarioInicio: absenceStart,
      horarioFim: absenceEnd,
      motivo: absenceReason
    });

    setAbsenceBanner({
      type: result.success ? "success" : "error",
      message: result.message
    });

    if (result.success) {
      setSelectedScheduleId("manual");
    }
  };

  const handleConfirmRevokeCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokingReservation) return;

    onCancelStudentCheckIn(revokingReservation.id, currentUser.nome, revokeReason);
    setRevokingReservation(null);
  };

  return (
    <div className="space-y-5 sm:space-y-7 w-full min-w-0">
      {/* Cabeçalho Institucional do Painel do Monitor */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-cyan-500/25 shadow-2xl space-y-5 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="p-3 rounded-2xl bg-linear-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/25 shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Painel de Gestão do Monitor
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentUser.perfil === "admin"
                    ? "Visão Supervisora (Admin)"
                    : "Monitor Habilitado"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                Consulte a lista de todos os locais, agende seu local de destino, envie avisos de não comparecimento e gerencie o check-in dos alunos registrados no seu espaço.
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Resumo Operacional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-1 min-w-0">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              Total de Locais no Campus
            </span>
            <strong className="text-lg sm:text-xl font-black text-white block">
              {spaces.length} espaços mapeados
            </strong>
            <span className="text-[11px] text-zinc-500 block">
              {spaces.reduce((acc, s) => acc + Math.max(0, s.capacidade - s.ocupacao), 0)} vagas livres no total
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/25 space-y-1 min-w-0">
            <span className="text-xs text-cyan-300 flex items-center gap-1.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Local Registrado da Monitoria
            </span>
            <strong className="text-sm sm:text-base font-bold text-white block wrap-break-word">
              {registeredSpace?.nome || "Não definido"}
            </strong>
            <span className="text-[11px] text-cyan-200/80 block">
              {registeredFreeSpots} vaga(s) livre(s) de {registeredSpace?.capacidade || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-1 min-w-0">
            <span className="text-xs text-emerald-300 flex items-center gap-1.5 font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Alunos no Local Registrado
            </span>
            <strong className="text-lg sm:text-xl font-black text-white block">
              {activeSpaceReservations.length} aluno(s) ativo(s)
            </strong>
            <span className="text-[11px] text-emerald-200/80 block">
              {checkedInStudentsCount} com check-in realizado
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 space-y-1 min-w-0">
            <span className="text-xs text-amber-300 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Escalas &amp; Avisos
            </span>
            <strong className="text-lg sm:text-xl font-black text-white block">
              {visibleSchedules.filter((s) => s.status === "agendado").length} destino(s) ativo(s)
            </strong>
            <span className="text-[11px] text-amber-200/80 block">
              {visibleAbsences.length} aviso(s) de ausência enviado(s)
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: Lista de Todos os Locais do Campus (Passo 3 - "monitor - 1. lista de todos") */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-5 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Lista Completa de Todos os Locais do Campus ({filteredSpaces.length})</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Visualize todos os espaços de estudo, ocupação em tempo real, monitores alocados e selecione rapidamente seu próximo local de destino ou reserve 1 local por dia para estudo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto min-w-0">
            <div className="relative min-w-0 sm:w-56">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={spaceQuery}
                onChange={(e) => setSpaceQuery(e.target.value)}
                placeholder="Buscar local ou bloco..."
                className="w-full min-w-0 bg-zinc-900/80 border border-zinc-700/70 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <select
              value={spaceTypeFilter}
              onChange={(e) => setSpaceTypeFilter(e.target.value)}
              className="w-full sm:w-auto min-w-0 bg-zinc-900/80 border border-zinc-700/70 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Biblioteca">Biblioteca</option>
              <option value="Laboratório">Laboratório</option>
              <option value="Sala">Sala</option>
              <option value="Sala de estudos">Sala de estudos</option>
              <option value="Auditório">Auditório</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => {
            const vagasLivres = Math.max(0, space.capacidade - space.ocupacao);
            const isRegisteredHere = registeredSpace?.id === space.id;
            const ocupacaoPct = Math.min(
              100,
              Math.round((space.ocupacao / space.capacidade) * 100)
            );

            return (
              <div
                key={space.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition min-w-0 ${
                  isRegisteredHere
                    ? "bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-950/20"
                    : "bg-zinc-900/60 border-white/5 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {space.tipo}
                    </span>
                    {isRegisteredHere && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Seu Local Registrado
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-white wrap-break-word">
                      {space.nome}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 wrap-break-word">
                      {space.salaIdentificacao} • {space.horarioFuncionamento}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Ocupação: <strong className="text-white">{space.ocupacao}/{space.capacidade}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          vagasLivres > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {vagasLivres > 0 ? `${vagasLivres} vaga(s) livre(s)` : "Lotado"}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          vagasLivres === 0
                            ? "bg-red-500"
                            : ocupacaoPct >= 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${ocupacaoPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-white/5 text-[11px] text-zinc-300">
                    <span className="text-zinc-400 block">Monitor em plantão:</span>
                    <strong className="text-white wrap-break-word">
                      {space.monitorDisponivel && space.nomeMonitor
                        ? `${space.nomeMonitor} (${space.horarioMonitor})`
                        : "Sem monitor ativo no turno"}
                    </strong>
                  </div>

                  {/* Aviso de Não Comparecimento para este Local */}
                  {visibleAbsences.filter((a) => a.espacoId === space.id).length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Aviso de Não Comparecimento:
                      </span>
                      {visibleAbsences
                        .filter((a) => a.espacoId === space.id)
                        .map((abs) => (
                          <p key={abs.id} className="text-zinc-300 leading-tight">
                            • <strong>{abs.monitorNome}</strong> ({abs.data}, {abs.horarioInicio}–{abs.horarioFim}): {abs.motivo}
                          </p>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleSelectSpaceForSchedule(space)}
                    className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/35 text-cyan-200 font-semibold py-2 px-3 rounded-xl text-xs transition text-center"
                  >
                    Agendar Destino Aqui
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenReserveStudySpot(space)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-2 px-3 rounded-xl text-xs transition text-center"
                  >
                    Reservar Estudo
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Dedicado: Agendar Destino Aqui */}
      {schedulingModalSpace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-auto min-w-0">
            <div className="flex justify-between items-start gap-3 pb-3 border-b border-zinc-800">
              <div className="min-w-0">
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 block">
                  Agendar Destino do Monitor
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white wrap-break-word">
                  {schedulingModalSpace.nome}
                </h3>
                <p className="text-xs text-zinc-400">
                  {schedulingModalSpace.salaIdentificacao} • {schedulingModalSpace.bloco}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingModalSpace(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Finalidade da Sua Presença no Local
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDestTipoAtividade("ajudar")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      destTipoAtividade === "ajudar"
                        ? "bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                  >
                    🤝 Ajudar (Monitoria)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestTipoAtividade("estudar")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      destTipoAtividade === "estudar"
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                  >
                    📖 Estudar (Individual)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Data</label>
                  <input
                    type="date"
                    required
                    value={destDate}
                    onChange={(e) => setDestDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Início</label>
                  <input
                    type="time"
                    required
                    value={destStart}
                    onChange={(e) => setDestStart(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Término</label>
                  <input
                    type="time"
                    required
                    value={destEnd}
                    onChange={(e) => setDestEnd(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-800/40 p-2.5 rounded-xl border border-white/5">
                ℹ️ Você só pode estar em um lugar no mesmo horário, mas pode agendar outro local em horário diferente se quiser.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedulingModalSpace(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEÇÃO 2: Agendar Local de Destino (Item 1) + Aviso de Não Comparecimento (Item 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Card Esquerdo: Agendar o Local de Destino */}
        <div className="lg:col-span-6 glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-cyan-500/25 shadow-2xl space-y-5 min-w-0">
          <div className="pb-4 border-b border-white/10">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 mt-0.5">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  1. Agendar o Local de Destino
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Defina o espaço, data e horário do seu plantão de monitoria (máximo de 1 local de destino agendado por dia).
                </p>
              </div>
            </div>
          </div>

          {scheduleBanner && (
            <ReactAlertBanner
              variant={scheduleBanner.type}
              title={
                scheduleBanner.type === "success"
                  ? "Agendamento de Destino"
                  : "Não Foi Possível Agendar"
              }
              message={scheduleBanner.message}
              onClose={() => setScheduleBanner(null)}
            />
          )}

          <form onSubmit={handleSubmitSchedule} className="space-y-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Finalidade da Sua Presença no Local
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDestTipoAtividade("ajudar")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                    destTipoAtividade === "ajudar"
                      ? "bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                  }`}
                >
                  🤝 Ajudar (Monitoria)
                </button>
                <button
                  type="button"
                  onClick={() => setDestTipoAtividade("estudar")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                    destTipoAtividade === "estudar"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                  }`}
                >
                  📖 Estudar (Individual)
                </button>
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Local de Destino da Monitoria
              </label>
              <select
                value={destSpaceId}
                onChange={(e) => setDestSpaceId(Number(e.target.value))}
                className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              >
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.nome} ({space.bloco})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={destDate}
                  onChange={(e) => setDestDate(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Início
                </label>
                <input
                  type="time"
                  required
                  value={destStart}
                  onChange={(e) => setDestStart(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Término
                </label>
                <input
                  type="time"
                  required
                  value={destEnd}
                  onChange={(e) => setDestEnd(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Confirmar Agendamento de Destino</span>
            </button>
          </form>

          {/* Lista de Destinos Agendados */}
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Destinos Agendados ({visibleSchedules.length})
            </h4>

            {visibleSchedules.length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                Nenhum local de destino agendado até o momento.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {visibleSchedules.map((sched) => (
                  <div
                    key={sched.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0 ${
                      sched.status === "agendado"
                        ? "bg-zinc-900/70 border-cyan-500/25"
                        : "bg-zinc-900/40 border-amber-500/25 opacity-80"
                    }`}
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-white wrap-break-word">
                          {sched.espacoNome}
                        </strong>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sched.status === "agendado"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {sched.status === "agendado"
                            ? "Agendado"
                            : "Ausência Informada"}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        {sched.data} • {sched.horarioInicio} às {sched.horarioFim} •{" "}
                        {sched.monitorNome}
                      </p>
                    </div>

                    {sched.status === "agendado" && (
                      <button
                        type="button"
                        onClick={() => handlePrefillAbsenceFromSchedule(sched)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-[11px] transition shrink-0 text-center"
                      >
                        Informar Ausência
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Direito: Enviar Aviso de Não Comparecimento no Local de Destino */}
        <div className="lg:col-span-6 glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/25 shadow-2xl space-y-5 min-w-0">
          <div className="pb-4 border-b border-white/10">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  2. Aviso de Não Comparecimento no Destino
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Comunique antecipadamente caso não possa comparecer ao local de destino agendado, atualizando o status de monitoria do espaço.
                </p>
              </div>
            </div>
          </div>

          {absenceBanner && (
            <ReactAlertBanner
              variant={absenceBanner.type}
              title={
                absenceBanner.type === "success"
                  ? "Aviso Registrado"
                  : "Falha ao Enviar Aviso"
              }
              message={absenceBanner.message}
              onClose={() => setAbsenceBanner(null)}
            />
          )}

          <form onSubmit={handleSubmitAbsence} className="space-y-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Vincular a um Plantão Agendado (Opcional)
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "manual") {
                    setSelectedScheduleId("manual");
                    return;
                  }
                  const numericId = Number(val);
                  const found = visibleSchedules.find((s) => s.id === numericId);
                  if (found) {
                    handlePrefillAbsenceFromSchedule(found);
                  }
                }}
                className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
              >
                <option value="manual">Selecionar local e horário manualmente</option>
                {visibleSchedules
                  .filter((s) => s.status === "agendado")
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.espacoNome} — {s.data} ({s.horarioInicio} às {s.horarioFim})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Local de Destino
                </label>
                <select
                  value={absenceSpaceId}
                  onChange={(e) => setAbsenceSpaceId(Number(e.target.value))}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {spaces.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Data da Ausência
                </label>
                <input
                  type="date"
                  required
                  value={absenceDate}
                  onChange={(e) => setAbsenceDate(e.target.value)}
                  className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 min-w-0">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Início
                  </label>
                  <input
                    type="time"
                    required
                    value={absenceStart}
                    onChange={(e) => setAbsenceStart(e.target.value)}
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Fim
                  </label>
                  <input
                    type="time"
                    required
                    value={absenceEnd}
                    onChange={(e) => setAbsenceEnd(e.target.value)}
                    className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 px-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-zinc-300">
                Motivos rápidos:
              </span>
              <div className="flex flex-col gap-1.5">
                {ABSENCE_REASON_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAbsenceReason(preset)}
                    className={`text-left text-[11px] px-3 py-1.5 rounded-xl border transition wrap-break-word ${
                      absenceReason === preset
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Justificativa / Aviso de Não Comparecimento
              </label>
              <textarea
                required
                rows={2}
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                placeholder="Descreva o motivo do não comparecimento no local de destino..."
                className="w-full min-w-0 bg-zinc-900/90 border border-zinc-700/80 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Enviar Aviso de Não Comparecimento</span>
            </button>
          </form>

          {/* Histórico recente de avisos de ausência */}
          {visibleAbsences.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Avisos de Ausência Enviados ({visibleAbsences.length})
              </h4>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {visibleAbsences.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25 text-xs space-y-1 min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <strong className="text-white wrap-break-word">
                        {notice.espacoNome}
                      </strong>
                      <span className="text-[11px] text-amber-300">
                        {notice.data} ({notice.horarioInicio}–{notice.horarioFim})
                      </span>
                    </div>
                    <p className="text-zinc-300 wrap-break-word">{notice.motivo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO 3: Lista de Alunos no Local Registrado + Cancelar Check-in Realizado e Liberar Vaga (Itens 9 e 10) */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-emerald-500/25 shadow-2xl space-y-5 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Alunos Registrados no Seu Local de Monitoria
              </h3>
            </div>

            {todayMonitorSchedule && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold wrap-break-word">
                <span>📍 Detectado Automaticamente:</span>
                <span className="text-white font-bold">{autoDetectedSpace?.nome}</span>
                <span className="text-cyan-200 text-[11px]">
                  ({todayMonitorSchedule.horarioInicio} às {todayMonitorSchedule.horarioFim} • {todayMonitorSchedule.tipoAtividade === "estudar" ? "Estudo Individual" : "Plantão de Monitoria"})
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed wrap-break-word">
              Local monitorado:{" "}
              <strong className="text-cyan-300">
                {registeredSpace?.nome || "Selecione um local"}
              </strong>{" "}
              ({registeredSpace?.salaIdentificacao}) —{" "}
              <strong className="text-emerald-400">
                {registeredFreeSpots} vaga(s) disponível(is) agora
              </strong>{" "}
              ({registeredSpace?.ocupacao}/{registeredSpace?.capacidade} ocupadas).
            </p>
          </div>

          {/* Troca rápida do local registrado de monitoria */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <label className="text-xs font-semibold text-zinc-400 shrink-0">
              Local Registrado:
            </label>
            <select
              value={registeredSpace?.id || 1}
              onChange={(e) => {
                const nextId = Number(e.target.value);
                setOverrideMonitoredSpaceId(nextId);
                const nextSpace = spaces.find((s) => s.id === nextId);
                if (nextSpace) {
                  onUpdateRegisteredSpace(nextSpace.id, nextSpace.nome);
                }
              }}
              className="w-full sm:w-auto min-w-0 bg-zinc-900 border border-zinc-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
            >
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.nome} ({Math.max(0, space.capacidade - space.ocupacao)} livres)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de status dos alunos */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ativos" as const, label: `Ativos (${activeSpaceReservations.length})` },
            { id: "checkin" as const, label: `Check-in Realizado (${checkedInStudentsCount})` },
            {
              id: "aguardando" as const,
              label: `Aguardando Check-in (${
                activeSpaceReservations.filter((r) => !r.checkIn).length
              })`
            },
            { id: "todos" as const, label: `Histórico Completo (${allSpaceReservations.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStudentStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                studentStatusFilter === tab.id
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20"
                  : "bg-zinc-900/70 text-zinc-300 border-white/5 hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredSpaceReservations.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/50 border border-dashed border-zinc-800 space-y-2">
            <Users className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">
              Nenhum aluno encontrado neste filtro para {registeredSpace?.nome}.
            </p>
            <p className="text-xs text-zinc-500">
              Assim que estudantes reservarem ou realizarem check-in neste espaço, eles serão listados aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSpaceReservations.map((res) => {
              const student = findStudentAccount(res);
              const isCheckInDone = res.checkIn && res.status === "confirmada";
              const isCanceled = res.status === "cancelada";

              return (
                <div
                  key={res.id}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-4 min-w-0 ${
                    isCheckInDone
                      ? "bg-emerald-950/20 border-emerald-500/35"
                      : isCanceled
                      ? "bg-zinc-900/40 border-zinc-800 opacity-75"
                      : "bg-zinc-900/70 border-zinc-700/80"
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white wrap-break-word">
                          {res.usuarioNome}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>
                              Matrícula:{" "}
                              <strong className="text-zinc-200 font-mono">
                                {student?.matricula || "Externa"}
                              </strong>
                            </span>
                          </span>
                          {(res.usuarioEmail || student?.email) && (
                            <span className="flex items-center gap-1 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="break-all">
                                {res.usuarioEmail || student?.email}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {isCheckInDone ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1 shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          Check-in Realizado
                        </span>
                      ) : isCanceled ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 inline-flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          Vaga Liberada
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          Aguardando Check-in
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 py-2.5 border-y border-white/5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {res.data}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {res.horarioInicio} às {res.horarioFim}
                      </span>
                    </div>

                    {isCanceled && res.motivoCancelamento && (
                      <p className="text-[11px] text-zinc-300 bg-red-950/25 border border-red-500/20 p-2.5 rounded-xl wrap-break-word">
                        {res.motivoCancelamento}
                      </p>
                    )}
                  </div>

                  {/* Passo 3 (Item 10): Cancelar check-in realizado e devolver a vaga para outro aluno reservar */}
                  {isCheckInDone && (
                    <button
                      type="button"
                      onClick={() => {
                        setRevokingReservation(res);
                        setRevokeReason(REVOKE_CHECKIN_PRESETS[0]);
                      }}
                      className="w-full bg-red-600/15 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs text-center"
                    >
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Cancelar Check-in Realizado &amp; Liberar Vaga</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Confirmação: Cancelar Check-in Realizado e Devolver Vaga (Passo 3 - Item 10) */}
      {revokingReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <form
            onSubmit={handleConfirmRevokeCheckIn}
            className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92dvh] overflow-y-auto my-auto"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
                  Ação de Monitoria — Liberação Imediata de Vaga
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Cancelar Check-in Realizado
                </h3>
                <p className="text-xs text-zinc-400 mt-1 wrap-break-word">
                  Aluno: <strong className="text-white">{revokingReservation.usuarioNome}</strong> •{" "}
                  {revokingReservation.data} ({revokingReservation.horarioInicio} às{" "}
                  {revokingReservation.horarioFim})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRevokingReservation(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
              Ao confirmar, o check-in deste estudante será cancelado e{" "}
              <strong>1 vaga voltará imediatamente a ficar disponível</strong> em{" "}
              <strong>{registeredSpace?.nome}</strong> para que outro aluno possa reservar.
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-zinc-300">
                Motivo da liberação pelo monitor:
              </span>
              <div className="flex flex-col gap-1.5">
                {REVOKE_CHECKIN_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRevokeReason(preset)}
                    className={`text-left text-[11px] px-3 py-2 rounded-xl border transition wrap-break-word ${
                      revokeReason === preset
                        ? "bg-red-500/15 border-red-500/40 text-red-200 font-semibold"
                        : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Observação do Monitor
              </label>
              <textarea
                required
                rows={2}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setRevokingReservation(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 px-4 rounded-xl transition text-xs"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/25 transition text-xs flex items-center justify-center gap-2 text-center"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Cancelar Check-in &amp; Devolver Vaga</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

