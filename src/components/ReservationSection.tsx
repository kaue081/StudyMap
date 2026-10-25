"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Reservation,
  StudySpace,
  UserAccount,
  CancellationNotice
} from "../types";
import { getCheckInWindowInfo } from "../hooks/useStudyMapData";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Package,
  Users,
  Mail,
  Send,
  X,
  Sparkles,
  MessageSquareText,
  GraduationCap
} from "lucide-react";

interface ReservationSectionProps {
  reservations: Reservation[];
  spaces: StudySpace[];
  users: UserAccount[];
  cancellations: CancellationNotice[];
  currentUser?: UserAccount | null;
  onCheckIn: (id: number) => void;
  onSimulateCheckInWindow: (id: number) => void;
  onCancel: (id: number, motivoCancelamento: string) => void;
  onExpireCheckIn: (id: number) => void;
  onMonitorRevokeCheckIn?: (id: number) => void;
}

const CANCELLATION_PRESETS = [
  "Imprevisto acadêmico / aula extra no mesmo horário.",
  "Não conseguirei chegar nos 10 minutos antecedentes para realizar o check-in.",
  "Mudança no cronograma de estudos; liberando a vaga para outro colega."
];

export function ReservationSection({
  reservations,
  spaces,
  users,
  cancellations,
  currentUser,
  onCheckIn,
  onSimulateCheckInWindow,
  onCancel,
  onExpireCheckIn,
  onMonitorRevokeCheckIn
}: ReservationSectionProps) {
  const [monitorModalReservation, setMonitorModalReservation] = useState<Reservation | null>(null);
  const [cancelingReservation, setCancelingReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState<string>(CANCELLATION_PRESETS[0]);

  const getSpace = (id: number) => spaces.find((s) => s.id === id);

  const getMonitorAccountForSpace = (space?: StudySpace): UserAccount | undefined => {
    if (!space || !space.monitorDisponivel) return undefined;
    return users.find(
      (u) =>
        u.perfil === "monitor" &&
        ((space.nomeMonitor && u.nome.toLowerCase() === space.nomeMonitor.toLowerCase()) ||
          (u.espacoMonitoria && u.espacoMonitoria.toLowerCase() === space.nome.toLowerCase()))
    );
  };

  const openCancelDialog = (res: Reservation) => {
    setCancelingReservation(res);
    setCancelReason(CANCELLATION_PRESETS[0]);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingReservation) return;
    onCancel(cancelingReservation.id, cancelReason);
    setCancelingReservation(null);
  };

  const inspectedSpace = monitorModalReservation
    ? getSpace(monitorModalReservation.espacoId)
    : undefined;
  const inspectedMonitorAccount = getMonitorAccountForSpace(inspectedSpace);

  // Filtrar estritamente para exibir apenas as reservas do aluno/usuário logado
  const userReservations = currentUser
    ? currentUser.perfil === "admin"
      ? reservations
      : reservations.filter((r) => {
          if (r.usuarioId && currentUser.id) {
            return r.usuarioId === currentUser.id;
          }
          if (r.usuarioEmail && currentUser.email) {
            return r.usuarioEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase();
          }
          return r.usuarioNome.trim().toLowerCase() === currentUser.nome.trim().toLowerCase();
        })
    : reservations;

  const userCancellations = currentUser
    ? currentUser.perfil === "admin"
      ? cancellations
      : cancellations.filter((c) => {
          if (c.usuarioId && currentUser.id) {
            return c.usuarioId === currentUser.id;
          }
          if (c.usuarioEmail && currentUser.email) {
            return c.usuarioEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase();
          }
          return c.usuarioNome.trim().toLowerCase() === currentUser.nome.trim().toLowerCase();
        })
    : cancellations;

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Minhas Reservas &amp; Check-in ({userReservations.length})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
              {currentUser?.perfil === "admin"
                ? "Visão administrativa completa de todas as reservas do sistema."
                : "Acompanhe seus horários agendados, realize check-in presencial ou envie a informação de cancelamento para liberar a vaga."}
            </p>
          </div>

          <Link
            href="/espacos"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition text-xs flex items-center justify-center gap-2 shrink-0"
          >
            + Fazer Nova Reserva
          </Link>
        </div>

        {/* Regra Explicativa de Check-in (10 minutos antes) e Limite Diário */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold text-white mb-0.5">
              Regras Oficiais do Aluno (Passo 2 &amp; Escopo):
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Cada aluno pode reservar <strong>um único local por dia</strong>. O check-in presencial é liberado <strong>faltando 10 minutos para o horário inicial do local agendado</strong>; caso não possa comparecer, envie a informação de cancelamento para liberar a vaga imediatamente para a fila de espera.
            </p>
          </div>
        </div>

        {userReservations.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 bg-zinc-900/40 rounded-2xl sm:rounded-3xl border border-dashed border-zinc-800 space-y-3">
            <Calendar className="w-12 h-12 mx-auto text-zinc-600" />
            <h3 className="text-base font-semibold text-zinc-300">Você não possui nenhuma reserva ativa</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Você ainda não solicitou nenhuma reserva de espaço no campus. Explore os locais disponíveis e agende seu horário.
            </p>
            <Link
              href="/espacos"
              className="inline-block mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-xl text-xs transition"
            >
              Ver Espaços Disponíveis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {userReservations.map((res) => {
              const space = getSpace(res.espacoId);
              const isConfirmed = res.checkIn && res.status === "confirmada";
              const isCanceled = res.status === "cancelada";
              const isWaitingCheckin = !res.checkIn && res.status === "reservada";
              const windowInfo = getCheckInWindowInfo(
                res.data,
                res.horarioInicio,
                res.horarioFim
              );

              return (
                <div
                  key={res.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 min-w-0 ${
                    isConfirmed
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : isCanceled
                      ? "bg-zinc-900/40 border-zinc-800 opacity-75"
                      : "bg-zinc-900/70 border-zinc-700/80 shadow-lg"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-col min-[420px]:flex-row justify-between items-start gap-2.5 mb-3">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-zinc-400 block wrap-break-word">
                          Estudante: {res.usuarioNome}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white wrap-break-word">
                          {space?.nome || "Espaço de Estudo"}
                        </h4>
                        <div className="flex items-start gap-1.5 text-xs text-zinc-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                          <span className="wrap-break-word">
                            {space?.salaIdentificacao || "Campus"}
                          </span>
                        </div>
                      </div>

                      {/* Badge de Status */}
                      <div className="shrink-0">
                        {isConfirmed && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Check-in Realizado
                          </span>
                        )}
                        {isWaitingCheckin && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 shrink-0" /> Aguardando Check-in
                          </span>
                        )}
                        {isCanceled && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center gap-1 animate-pulse">
                            <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" /> Cancelada (Removendo em 5s...)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detalhes de Data e Horário */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-300 py-3 border-y border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{res.data}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>
                          {res.horarioInicio} às {res.horarioFim}
                        </span>
                      </div>
                    </div>

                    {/* Passo 2 (Item 8): Lista de materiais que o local agendado disponibiliza */}
                    {space && (
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          Materiais disponibilizados pelo local ({space.materiais.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {space.materiais.map((mat, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-zinc-800/80 text-zinc-200 px-2 py-0.5 rounded-lg border border-zinc-700/60 wrap-break-word"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passo 2 (Item 9): Resumo e botão para Consultar o Monitor do Local Agendado */}
                    <div className="mt-3 p-3 rounded-xl bg-zinc-800/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-start sm:items-center gap-2 min-w-0">
                        <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
                        <div className="min-w-0">
                          <span className="text-zinc-400 block text-[11px]">
                            Monitor do local agendado:
                          </span>
                          <span className="font-semibold text-white wrap-break-word">
                            {space?.monitorDisponivel
                              ? `${space.nomeMonitor} (${space.horarioMonitor})`
                              : "Sem monitor registrado neste local"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMonitorModalReservation(res)}
                        className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px] transition shrink-0 text-center"
                      >
                        Consultar Monitor
                      </button>
                    </div>

                    {/* Status da janela de 10 minutos para reservas aguardando check-in */}
                    {isWaitingCheckin && (
                      <div
                        className={`mt-3 p-3 rounded-xl border text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                          windowInfo.canCheckIn
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-indigo-500/10 border-indigo-500/25 text-indigo-200"
                        }`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            {windowInfo.canCheckIn
                              ? "Janela de check-in aberta (faltando ≤ 10 min ou horário em andamento)."
                              : windowInfo.reason === "early"
                              ? `Check-in libera às ${windowInfo.unlockTimeFormatted} de ${res.data} (10 min antes das ${res.horarioInicio}).`
                              : `Período agendado (${res.horarioInicio}–${res.horarioFim}) encerrado sem check-in.`}
                          </span>
                        </div>

                        {!windowInfo.canCheckIn && (
                          <button
                            type="button"
                            onClick={() => onSimulateCheckInWindow(res.id)}
                            title="Ajusta o início desta reserva para daqui a 9 minutos para testar o check-in imediatamente"
                            className="w-full sm:w-auto px-2.5 py-1.5 sm:py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-semibold text-[11px] sm:text-[10px] transition flex items-center justify-center gap-1 shrink-0"
                          >
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>Simular 10 min</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Caso cancelada, exibir a informação de cancelamento enviada */}
                    {isCanceled && res.motivoCancelamento && (
                      <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-zinc-300 space-y-1">
                        <span className="font-bold text-red-300 flex items-center gap-1.5">
                          <MessageSquareText className="w-3.5 h-3.5 shrink-0" />
                          Informação de cancelamento enviada:
                        </span>
                        <p className="text-zinc-300 wrap-break-word">{res.motivoCancelamento}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações de Gerenciamento (Check-in faltando 10 min ou Enviar Cancelamento) */}
                  {!isCanceled && (
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      {isWaitingCheckin && (
                        <button
                          type="button"
                          onClick={() => onCheckIn(res.id)}
                          className={`w-full font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1.5 text-center ${
                            windowInfo.canCheckIn
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>
                            {windowInfo.canCheckIn
                              ? "Confirmar Presença (Fazer Check-in)"
                              : `Check-in (Libera às ${windowInfo.unlockTimeFormatted})`}
                          </span>
                        </button>
                      )}

                       <div className="flex flex-col sm:flex-row gap-2">
                        {isWaitingCheckin && (
                          <button
                            type="button"
                            onClick={() => onExpireCheckIn(res.id)}
                            title="Simula a expiração automática de check-in descrita no ESCOPE.md"
                            className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 py-2 px-3 rounded-xl transition text-[11px] font-medium flex items-center justify-center gap-1 text-center"
                          >
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>Simular Falha</span>
                          </button>
                        )}

                        {isConfirmed &&
                          currentUser &&
                          currentUser.perfil !== "aluno" &&
                          onMonitorRevokeCheckIn && (
                            <button
                              type="button"
                              onClick={() => onMonitorRevokeCheckIn(res.id)}
                              className="flex-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 py-2 px-3 rounded-xl transition text-[11px] font-semibold flex items-center justify-center gap-1 text-center"
                            >
                              <XCircle className="w-3 h-3 shrink-0" />
                              <span>Cancelar Check-in &amp; Liberar Vaga</span>
                            </button>
                          )}

                        <button
                          type="button"
                          onClick={() => openCancelDialog(res)}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-3 rounded-xl transition text-[11px] font-semibold flex items-center justify-center gap-1 text-center"
                        >
                          <Send className="w-3 h-3 shrink-0" />
                          <span>Enviar Cancelamento da Vaga</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Passo 2 (Item 10): Registro de Informações de Cancelamento de Vaga Enviadas */}
      {userCancellations.length > 0 && (
        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl space-y-4 min-w-0">
          <div className="flex items-start sm:items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Minhas Informações de Cancelamento Enviadas ({userCancellations.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userCancellations.map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/60 border border-white/5 text-xs space-y-1.5 min-w-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-bold text-white wrap-break-word">{notice.espacoNome}</span>
                  <span className="text-[11px] text-zinc-400">
                    {notice.dataReserva} ({notice.horarioInicio}–{notice.horarioFim})
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] wrap-break-word">
                  Enviado por: <strong className="text-zinc-200">{notice.usuarioNome}</strong>
                </p>
                <p className="text-zinc-200 bg-zinc-800/70 p-2.5 rounded-xl border border-zinc-700/50 wrap-break-word">
                  {notice.mensagem}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Consultar Monitor do Local Agendado (Passo 2 - Item 9) */}
      {monitorModalReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92dvh] overflow-y-auto my-auto">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Consulta de Monitoria
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 wrap-break-word">
                  {inspectedSpace?.nome || "Local Agendado"}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Agendamento: {monitorModalReservation.data} das{" "}
                  {monitorModalReservation.horarioInicio} às {monitorModalReservation.horarioFim}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMonitorModalReservation(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inspectedSpace?.monitorDisponivel ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="wrap-break-word">{inspectedSpace.nomeMonitor}</span>
                  </div>

                  <div className="space-y-2 text-zinc-300">
                    <p className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Horário de Plantão:</strong> {inspectedSpace.horarioMonitor}
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="wrap-break-word">
                        <strong>Sala / Setor:</strong> {inspectedSpace.salaIdentificacao}
                      </span>
                    </p>
                    {inspectedMonitorAccount && (
                      <p className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="break-all">
                          <strong>E-mail Institucional:</strong> {inspectedMonitorAccount.email}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {inspectedSpace.professorResponsavel && (
                  <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-500/25 text-purple-200 flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="wrap-break-word">
                      Docente de Apoio: <strong>{inspectedSpace.professorResponsavel}</strong>
                      {inspectedSpace.horarioProfessor ? ` (${inspectedSpace.horarioProfessor})` : ""}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700 text-xs text-zinc-300 space-y-2">
                <p className="font-bold text-white">
                  Este local não possui monitor de plantão alocado no momento.
                </p>
                {inspectedSpace?.professorResponsavel ? (
                  <p className="text-purple-300">
                    Responsável pelo espaço: <strong>{inspectedSpace.professorResponsavel}</strong>
                    {inspectedSpace.horarioProfessor ? ` (${inspectedSpace.horarioProfessor})` : ""}.
                  </p>
                ) : (
                  <p className="text-zinc-400">
                    Consulte a coordenação ou siga as diretrizes de convivência do espaço
                    {inspectedSpace?.regras?.length ? ` (${inspectedSpace.regras.join("; ")})` : ""}.
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMonitorModalReservation(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs"
            >
              Fechar Consulta
            </button>
          </div>
        </div>
      )}

      {/* Modal: Enviar Informação de Cancelamento da Vaga (Passo 2 - Item 10) */}
      {cancelingReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <form
            onSubmit={handleConfirmCancel}
            className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92dvh] overflow-y-auto my-auto"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
                  Liberação de Vaga
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Enviar Informação de Cancelamento
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 wrap-break-word">
                  {getSpace(cancelingReservation.espacoId)?.nome} — {cancelingReservation.data} (
                  {cancelingReservation.horarioInicio} às {cancelingReservation.horarioFim})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCancelingReservation(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-zinc-300">
                Sugestões rápidas de justificativa:
              </span>
              <div className="flex flex-col gap-1.5">
                {CANCELLATION_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCancelReason(preset)}
                    className={`text-left text-[11px] px-3 py-2 rounded-xl border transition wrap-break-word ${
                      cancelReason === preset
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
                Mensagem / Informação de Cancelamento da Vaga
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo do cancelamento para registro e liberação da vaga..."
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setCancelingReservation(null)}
                className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 px-4 rounded-xl transition text-xs"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/25 transition text-xs flex items-center justify-center gap-2 text-center"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Enviar Informação e Liberar Vaga</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
