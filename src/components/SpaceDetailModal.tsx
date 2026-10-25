"use client";

import React, { useState } from "react";
import { StudySpace, Event, SpaceNotice, SpaceNoticePriority, UserAccount, MonitorAbsenceNotice } from "../types";
import { X, MapPin, Users, GraduationCap, Calendar, Megaphone, PlusCircle, AlertTriangle } from "lucide-react";

interface ModalProps {
  space: StudySpace | null;
  events: Event[];
  spaceNotices?: SpaceNotice[];
  monitorAbsences?: MonitorAbsenceNotice[];
  currentUser?: UserAccount | null;
  onClose: () => void;
  onReserve: (space: StudySpace) => void;
  onWaitlist: (space: StudySpace) => void;
  onCreateNotice?: (data: {
    espacoId: number;
    titulo: string;
    mensagem: string;
    prioridade: SpaceNoticePriority;
    autorNome: string;
    ativo?: boolean;
  }) => { success: boolean; message: string };
  onCreateEvent?: (data: Omit<Event, "id">) => { success: boolean; message: string };
}

export function SpaceDetailModal({
  space,
  events,
  spaceNotices = [],
  monitorAbsences = [],
  currentUser,
  onClose,
  onReserve,
  onWaitlist,
  onCreateNotice,
  onCreateEvent
}: ModalProps) {
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  // Form states for new notice
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticePriority, setNoticePriority] = useState<SpaceNoticePriority>("informativo");

  // Form states for new event
  const todayStr = new Date().toISOString().split("T")[0];
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(todayStr);
  const [eventStart, setEventStart] = useState("14:00");
  const [eventEnd, setEventEnd] = useState("16:00");
  const [eventDesc, setEventDesc] = useState("");

  if (!space) return null;

  const canManage = currentUser && currentUser.perfil !== "aluno";

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateNotice || !space) return;
    const author = currentUser?.nome || "Administração";
    const res = onCreateNotice({
      espacoId: space.id,
      titulo: noticeTitle,
      mensagem: noticeMessage,
      prioridade: noticePriority,
      autorNome: author,
      ativo: true
    });
    if (res.success) {
      setNoticeTitle("");
      setNoticeMessage("");
      setShowNoticeForm(false);
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateEvent || !space) return;
    const res = onCreateEvent({
      espacoId: space.id,
      nome: eventName,
      data: eventDate,
      horarioInicio: eventStart,
      horarioFim: eventEnd,
      descricao: eventDesc
    });
    if (res.success) {
      setEventName("");
      setEventDesc("");
      setShowEventForm(false);
    }
  };

  const spaceEvents = events.filter((e) => e.espacoId === space.id);
  const activeNotices = spaceNotices.filter(
    (n) => n.espacoId === space.id && n.ativo
  );
  const vagas = space.capacidade - space.ocupacao;
  const isFull = vagas <= 0;
  const occupancyRate = Math.round((space.ocupacao / space.capacidade) * 100);
  const spaceAbsences = space ? monitorAbsences.filter((a) => a.espacoId === space.id) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 max-h-[92dvh] overflow-y-auto my-auto min-w-0">
        {/* Header do Modal */}
        <div className="flex justify-between items-start gap-3 pb-4 border-zinc-800">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {space.tipo}
              </span>
              <span className="text-xs text-zinc-400">{space.perfilAmbiente}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white wrap-break-word">
              {space.nome}
            </h2>
            <div className="flex items-start gap-1.5 text-xs text-zinc-400 mt-1">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="wrap-break-word">{space.salaIdentificacao}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aviso de Não Comparecimento do Monitor (Apenas se houver para este espaço) */}
        {spaceAbsences.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              Aviso de Não Comparecimento do Monitor
            </span>
            {spaceAbsences.map((abs) => (
              <div key={abs.id} className="p-2.5 rounded-lg bg-zinc-900/60 border border-amber-500/20 space-y-0.5">
                <p className="text-white font-semibold">
                  {abs.monitorNome} • {abs.data} ({abs.horarioInicio} às {abs.horarioFim})
                </p>
                <p className="text-zinc-300 leading-relaxed wrap-break-word">
                  <strong>Motivo comunicado:</strong> {abs.motivo}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Status de Ocupação */}
        <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs text-zinc-400 block mb-0.5">Capacidade e Vagas</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-bold text-white">
                {space.ocupacao} / {space.capacidade}
              </span>
              <span className="text-xs text-zinc-400">ocupados</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isFull ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isFull ? "Lotado" : `${vagas} vagas livres`}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Lotação</span>
              <span className="font-semibold text-white">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-zinc-700/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyRate >= 90
                    ? "bg-red-500"
                    : occupancyRate >= 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Avisos sobre o Local (Publicados pela Administração / Monitores) */}
        {(activeNotices.length > 0 || (canManage && onCreateNotice)) && (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Avisos Oficiais sobre o Local ({activeNotices.length})</span>
              </h4>
              {canManage && onCreateNotice && (
                <button
                  type="button"
                  onClick={() => setShowNoticeForm(!showNoticeForm)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 font-medium transition flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{showNoticeForm ? "Fechar Formulário" : "+ Novo Aviso"}</span>
                </button>
              )}
            </div>

            {/* Formulário de Novo Aviso */}
            {showNoticeForm && (
              <form
                onSubmit={handleNoticeSubmit}
                className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3"
              >
                <p className="text-xs font-semibold text-purple-200">
                  Publicar novo aviso em {space.nome}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-zinc-400 mb-1">Título do Aviso</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Manutenção no Ar-Condicionado"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Prioridade</label>
                    <select
                      value={noticePriority}
                      onChange={(e) => setNoticePriority(e.target.value as SpaceNoticePriority)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="informativo">Informativo</option>
                      <option value="atencao">Atenção</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Mensagem do Aviso</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Descreva o comunicado detalhado para os alunos..."
                    value={noticeMessage}
                    onChange={(e) => setNoticeMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoticeForm(false)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md shadow-purple-600/30 transition flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Publicar Aviso</span>
                  </button>
                </div>
              </form>
            )}

            {activeNotices.length > 0 ? (
              <div className="space-y-2">
                {activeNotices.map((notice) => {
                  const style =
                    notice.prioridade === "urgente"
                      ? "bg-red-500/15 border-red-500/35 text-red-200"
                      : notice.prioridade === "atencao"
                      ? "bg-amber-500/15 border-amber-500/35 text-amber-200"
                      : "bg-indigo-500/15 border-indigo-500/35 text-indigo-200";
                  return (
                    <div
                      key={notice.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1 min-w-0 ${style}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-white wrap-break-word">{notice.titulo}</strong>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/30">
                          {notice.prioridade}
                        </span>
                      </div>
                      <p className="text-zinc-200 leading-relaxed wrap-break-word">
                        {notice.mensagem}
                      </p>
                      <span className="block text-[10px] opacity-75">
                        Publicado por: {notice.autorNome}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 bg-zinc-800/30 p-2.5 rounded-xl border border-zinc-800">
                Nenhum aviso ativo para este espaço no momento.
              </p>
            )}
          </div>
        )}

        {/* Descrição */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Sobre o Espaço
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-800/30 p-3.5 rounded-xl border border-zinc-800 wrap-break-word">
            {space.descricao}
          </p>
        </div>

        {/* Equipe: Professor & Monitor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800 min-w-0">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Professor Responsável</span>
            </div>
            {space.professorResponsavel ? (
              <div>
                <p className="text-sm font-semibold text-white wrap-break-word">
                  {space.professorResponsavel}
                </p>
                <p className="text-xs text-zinc-400">
                  Horário: {space.horarioProfessor || "Turno integral"}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Nenhum professor fixo atribuído.</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800 min-w-0">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
              <Users className="w-4 h-4 shrink-0" />
              <span>Aluno-Monitor</span>
            </div>
            {space.monitorDisponivel ? (
              <div>
                <p className="text-sm font-semibold text-white wrap-break-word">
                  {space.nomeMonitor || "Monitor de Plantão"}
                </p>
                <p className="text-xs text-zinc-400">
                  Horário: {space.horarioMonitor || "Disponível no turno"}
                </p>
              </div>
            ) : spaceAbsences.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-amber-400 wrap-break-word">
                  Ausência comunicada ({spaceAbsences[0].monitorNome})
                </p>
                <p className="text-[11px] text-zinc-400">
                  Plantão suspenso neste horário
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Sem monitor no momento.</p>
            )}
          </div>
        </div>

        {/* Materiais Disponíveis */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
            Materiais Disponíveis no Local
          </h4>
          <div className="flex flex-wrap gap-2">
            {space.materiais.map((mat, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium wrap-break-word"
              >
                ✓ {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Regras de Utilização */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
            Regras de Utilização
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300 bg-zinc-800/30 p-3.5 rounded-xl border border-zinc-800">
            {space.regras.map((regra, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold shrink-0">•</span>
                <span className="wrap-break-word">{regra}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eventos Programados */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Eventos Programados ({spaceEvents.length})</span>
            </h4>
            {canManage && onCreateEvent && (
              <button
                type="button"
                onClick={() => setShowEventForm(!showEventForm)}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 font-medium transition flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{showEventForm ? "Fechar Formulário" : "+ Novo Evento"}</span>
              </button>
            )}
          </div>

          {/* Formulário de Novo Evento */}
          {showEventForm && (
            <form
              onSubmit={handleEventSubmit}
              className="p-3.5 mb-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3"
            >
              <p className="text-xs font-semibold text-amber-200">
                Agendar novo evento em {space.nome}
              </p>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Nome do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Workshop de Algoritmos"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Início</label>
                  <input
                    type="time"
                    required
                    value={eventStart}
                    onChange={(e) => setEventStart(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Término</label>
                  <input
                    type="time"
                    required
                    value={eventEnd}
                    onChange={(e) => setEventEnd(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Descrição</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Descreva detalhes, público-alvo ou palestrante..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-600/30 transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Cadastrar Evento</span>
                </button>
              </div>
            </form>
          )}

          {spaceEvents.length > 0 ? (
            <div className="space-y-2">
              {spaceEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs"
                >
                  <div className="flex flex-wrap justify-between gap-1 font-bold text-amber-300">
                    <span className="wrap-break-word">{event.nome}</span>
                    <span>
                      {event.data} ({event.horarioInicio} - {event.horarioFim})
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-0.5 wrap-break-word">{event.descricao}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400/90 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              Nenhum evento programado para este espaço hoje.
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="pt-4 border-t border-zinc-800 flex gap-3">
          {isFull ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onWaitlist(space);
              }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-amber-600/30 transition text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Espaço Lotado — Entrar na Fila de Espera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReserve(space);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Solicitar Reserva Neste Espaço</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
