"use client";

import React, { useState } from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { InteractiveHeatmap } from "../../components/InteractiveHeatmap";
import {
  Search,
  MapPin,
  Users,
  Filter,
  Flame,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  AlertTriangle,
  Megaphone
} from "lucide-react";

function getTomorrowLocalDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EspacosPage() {
  const {
    spaces,
    spaceNotices,
    getAvailableSpacesForDate,
    checkEventConflict,
    openDetailModal,
    openReservationModal,
    openWaitlistModal
  } = useStudyMap();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"cards" | "mapa">("cards");

  // Passo 2 (Item 5): Consulta antecipada (véspera) de todos os locais disponíveis para o dia do agendamento
  const [targetScheduleDate, setTargetScheduleDate] = useState<string>(() => getTomorrowLocalDate());
  const [scheduleStart, setScheduleStart] = useState<string>("14:00");
  const [scheduleEnd, setScheduleEnd] = useState<string>("16:00");
  const [onlyAvailableForDate, setOnlyAvailableForDate] = useState<boolean>(false);

  const tipos = ["Todos", "Biblioteca", "Laboratório", "Sala de estudos", "Sala", "Auditório"];

  const availableSpacesForTargetDate = getAvailableSpacesForDate(
    targetScheduleDate,
    scheduleStart,
    scheduleEnd
  );
  const availableIdsSet = new Set(availableSpacesForTargetDate.map((s) => s.id));

  const filteredSpaces = spaces.filter((space) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      space.nome.toLowerCase().includes(query) ||
      space.tipo.toLowerCase().includes(query) ||
      space.localizacao.toLowerCase().includes(query) ||
      space.materiais.some((m) => m.toLowerCase().includes(query));

    const matchesType = selectedType === "Todos" || space.tipo === selectedType;
    const matchesAvailability = !onlyAvailableForDate || availableIdsSet.has(space.id);

    return matchesQuery && matchesType && matchesAvailability;
  });

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300 w-full min-w-0">
      {/* Passo 2 (Item 5): Painel de Consulta Antecipada (Véspera do Agendamento) */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-indigo-500/25 shadow-xl space-y-4 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Consulta Antecipada de Agendamento (Véspera)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Locais Disponíveis para o Dia do Agendamento
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulte com antecedência todos os espaços com vagas livres e sem conflito de eventos antes do dia agendado. Lembrete: cada aluno pode reservar <strong>1 único local por dia</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOnlyAvailableForDate((prev) => !prev)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 self-start lg:self-auto shrink-0 text-center ${
              onlyAvailableForDate
                ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30"
                : "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {onlyAvailableForDate
                ? `Filtrando Disponíveis (${availableSpacesForTargetDate.length})`
                : `Listar Apenas Disponíveis (${availableSpacesForTargetDate.length}/${spaces.length})`}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="min-w-0">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Data Desejada do Agendamento
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={targetScheduleDate}
                onChange={(e) => setTargetScheduleDate(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Horário Inicial Previsto
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                value={scheduleStart}
                onChange={(e) => setScheduleStart(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Horário Final Previsto
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                value={scheduleEnd}
                onChange={(e) => setScheduleEnd(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Lista rápida de todos os locais disponíveis na data selecionada */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2.5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-zinc-300">
              Locais disponíveis para{" "}
              <span className="text-indigo-400 font-bold">{targetScheduleDate}</span> (
              {scheduleStart} às {scheduleEnd}):
            </span>
            <span className="text-emerald-400 font-bold">
              {availableSpacesForTargetDate.length} local(is) disponível(is)
            </span>
          </div>

          {availableSpacesForTargetDate.length === 0 ? (
            <p className="text-xs text-amber-400">
              Nenhum local possui vagas livres sem conflito de eventos neste horário.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSpacesForTargetDate.map((space) => {
                const freeSpots = space.capacidade - space.ocupacao;
                return (
                  <button
                    key={space.id}
                    type="button"
                    onClick={() =>
                      openReservationModal(space, {
                        data: targetScheduleDate,
                        horarioInicio: scheduleStart,
                        horarioFim: scheduleEnd
                      })
                    }
                    className="max-w-full text-left text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition flex flex-wrap items-center gap-1.5 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
                    <span className="wrap-break-word">{space.nome}</span>
                    <span className="text-emerald-400/80 font-bold">({freeSpots} vagas)</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 space-y-4 min-w-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3.5 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar por nome, sala, tipo ou material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Alternador de Modo de Exibição */}
          <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-700/60 w-full md:w-auto text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 sm:py-1.5 rounded-xl transition text-center ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Cards dos Espaços
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mapa")}
              className={`px-3 py-2 sm:py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                viewMode === "mapa"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Mapa de Calor</span>
            </button>
          </div>
        </div>

        {/* Filtros por Tipo de Espaço — Flex Wrap sem scroll lateral */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3 shrink-0" /> Tipo:
          </span>
          {tipos.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setSelectedType(tipo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedType === tipo
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "bg-zinc-800/40 text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Exibição condicional: Cards ou Mapa de Calor */}
      {viewMode === "mapa" ? (
        <InteractiveHeatmap
          spaces={filteredSpaces}
          onSelectSpace={(space) => openDetailModal(space)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSpaces.map((space) => {
            const vagas = space.capacidade - space.ocupacao;
            const isFull = vagas <= 0;
            const rate = Math.round((space.ocupacao / space.capacidade) * 100);
            const conflictOnTargetDate = checkEventConflict(
              space.id,
              targetScheduleDate,
              scheduleStart,
              scheduleEnd
            );
            const activeNoticesForSpace = spaceNotices.filter(
              (n) => n.espacoId === space.id && n.ativo
            );

            return (
              <div
                key={space.id}
                className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between min-w-0"
              >
                <div className="min-w-0">
                  {/* Topo do Card */}
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {space.tipo}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 wrap-break-word">
                        {space.nome}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-lg border border-white/5 shrink-0">
                      {space.perfilAmbiente}
                    </span>
                  </div>

                  {/* Localização */}
                  <div className="flex items-start gap-1.5 text-xs text-zinc-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="wrap-break-word">{space.salaIdentificacao}</span>
                  </div>

                  {/* Avisos sobre o local (Passo 4 - Administração) */}
                  {activeNoticesForSpace.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                      {activeNoticesForSpace.slice(0, 2).map((notice) => (
                        <div
                          key={notice.id}
                          className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 min-w-0 ${
                            notice.prioridade === "urgente"
                              ? "bg-red-500/10 border-red-500/30 text-red-200"
                              : notice.prioridade === "atencao"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                              : "bg-purple-500/10 border-purple-500/30 text-purple-200"
                          }`}
                        >
                          <Megaphone className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <strong className="block text-white wrap-break-word">
                              {notice.titulo}
                            </strong>
                            <span className="text-zinc-300 wrap-break-word">
                              {notice.mensagem}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status para a data de agendamento selecionada */}
                  {conflictOnTargetDate && (
                    <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="wrap-break-word">
                        Evento em {targetScheduleDate}: {conflictOnTargetDate.nome} (
                        {conflictOnTargetDate.horarioInicio}–{conflictOnTargetDate.horarioFim})
                      </span>
                    </div>
                  )}

                  {/* Ocupação e Vagas */}
                  <div className="space-y-1.5 mb-4 bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-xs gap-2">
                      <span className="text-zinc-400">Ocupação:</span>
                      <span className="font-bold text-white">
                        {space.ocupacao} / {space.capacidade}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? "bg-red-500" : rate >= 60 ? "bg-amber-500" : "bg-indigo-500"
                        }`}
                        style={{ width: `${Math.min(rate, 100)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-1 pt-1 text-xs">
                      <span className="text-[11px] text-zinc-500">{rate}% lotado</span>
                      <span className={`font-semibold ${isFull ? "text-red-400" : "text-emerald-400"}`}>
                        {isFull ? "Esgotado (0 vagas)" : `${vagas} vagas livres`}
                      </span>
                    </div>
                  </div>

                  {/* Passo 2 (Item 8): Lista completa de materiais disponibilizados pelo local */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Materiais disponíveis ({space.materiais.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {space.materiais.map((mat, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-zinc-800/70 text-zinc-200 px-2 py-0.5 rounded-lg border border-zinc-700/60 wrap-break-word"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Monitor / Professor indicador */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 mb-5">
                    {space.monitorDisponivel && (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Users className="w-3 h-3 shrink-0" />
                        <span>Monitor: {space.nomeMonitor || "Disponível"}</span>
                      </span>
                    )}
                    {space.professorResponsavel && (
                      <span className="flex items-center gap-1 text-purple-400">
                        <GraduationCap className="w-3 h-3 shrink-0" /> Prof. Responsável
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="flex flex-col min-[380px]:flex-row gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => openDetailModal(space)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-3 rounded-xl transition text-xs text-center"
                  >
                    Detalhes &amp; Regras
                  </button>

                  {isFull ? (
                    <button
                      type="button"
                      onClick={() => openWaitlistModal(space)}
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs shadow-md shadow-amber-600/20 text-center"
                    >
                      Fila de Espera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openReservationModal(
                          space,
                          onlyAvailableForDate
                            ? {
                                data: targetScheduleDate,
                                horarioInicio: scheduleStart,
                                horarioFim: scheduleEnd
                              }
                            : undefined
                        )
                      }
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs shadow-md shadow-indigo-600/30 text-center"
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
