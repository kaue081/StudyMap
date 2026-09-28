"use client";

import React, { useState } from "react";
import { useStudyMapData } from "../hooks/useStudyMapData";
import { Header } from "../components/Header";
import { DashboardStats } from "../components/DashboardStats";
import { InteractiveHeatmap } from "../components/InteractiveHeatmap";
import { RecommendationAssistant } from "../components/RecommendationAssistant";
import { SpaceDetailModal } from "../components/SpaceDetailModal";
import { ReservationModal } from "../components/ReservationModal";
import { WaitlistModal } from "../components/WaitlistModal";
import { ReservationSection } from "../components/ReservationSection";
import { WaitlistSection } from "../components/WaitlistSection";
import { StudySpace } from "../types";
import { Search, MapPin, Users, Calendar, Filter, Flame, Info, CheckCircle2, AlertTriangle, GraduationCap } from "lucide-react";

export default function Home() {
  const {
    spaces,
    reservations,
    events,
    waitlist,
    isLoaded,
    addReservation,
    cancelReservation,
    performCheckIn,
    expireCheckIn,
    addToWaitlist,
    removeFromWaitlist,
    getRecommendation,
    resetToDefaults
  } = useStudyMapData();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"cards" | "mapa">("cards");

  // Modais
  const [detailSpace, setDetailSpace] = useState<StudySpace | null>(null);
  const [reservationSpace, setReservationSpace] = useState<StudySpace | null>(null);
  const [reservationPresetData, setReservationPresetData] = useState<{
    data: string;
    horarioInicio: string;
    horarioFim: string;
  } | null>(null);
  const [waitlistSpace, setWaitlistSpace] = useState<StudySpace | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1115] text-indigo-400 font-semibold gap-3">
        <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
        Carregando StudyMap...
      </div>
    );
  }

  const tipos = ["Todos", "Biblioteca", "Laboratório", "Sala de estudos", "Sala", "Auditório"];

  const filteredSpaces = spaces.filter((space) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      space.nome.toLowerCase().includes(query) ||
      space.tipo.toLowerCase().includes(query) ||
      space.localizacao.toLowerCase().includes(query) ||
      space.materiais.some(m => m.toLowerCase().includes(query));

    const matchesType = selectedType === "Todos" || space.tipo === selectedType;

    return matchesQuery && matchesType;
  });

  const handleOpenReservation = (
    space: StudySpace,
    initialData?: { data: string; horarioInicio: string; horarioFim: string }
  ) => {
    const vagas = space.capacidade - space.ocupacao;
    if (vagas <= 0) {
      setWaitlistSpace(space);
    } else {
      setReservationSpace(space);
      setReservationPresetData(initialData || null);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header com Navegação e Aviso de Sem Login */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationCount={reservations.filter(r => r.status !== 'cancelada').length}
        waitlistCount={waitlist.length}
        onReset={resetToDefaults}
      />

      {/* 1. ABA DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <DashboardStats
            spaces={spaces}
            reservations={reservations}
            waitlist={waitlist}
            onNavigate={setActiveTab}
          />

          {/* Destaque do Mapa de Calor */}
          <InteractiveHeatmap
            spaces={spaces}
            onSelectSpace={(s) => setDetailSpace(s)}
          />
        </div>
      )}

      {/* 2. ABA ESPAÇOS & MAPA */}
      {activeTab === "espacos" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Barra de Filtro e Busca */}
          <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, sala, tipo ou material (ex: computador, livros)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Alternador de Modo de Exibição */}
              <div className="flex items-center gap-1 bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-700/60 self-start md:self-auto text-xs font-semibold">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    viewMode === "cards" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Cards dos Espaços
                </button>
                <button
                  onClick={() => setViewMode("mapa")}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    viewMode === "mapa" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Mapa de Calor
                </button>
              </div>
            </div>

            {/* Filtros por Tipo de Espaço */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
              <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1 pl-1">
                <Filter className="w-3 h-3" /> Tipo:
              </span>
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setSelectedType(tipo)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
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
              onSelectSpace={(s) => setDetailSpace(s)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space) => {
                const vagas = space.capacidade - space.ocupacao;
                const isFull = vagas <= 0;
                const rate = Math.round((space.ocupacao / space.capacidade) * 100);

                return (
                  <div
                    key={space.id}
                    className="glass rounded-3xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            {space.tipo}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5">{space.nome}</h3>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-lg border border-white/5">
                          {space.perfilAmbiente}
                        </span>
                      </div>

                      {/* Localização */}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{space.salaIdentificacao}</span>
                      </div>

                      {/* Ocupação e Vagas */}
                      <div className="space-y-1.5 mb-4 bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-400">Ocupação:</span>
                          <span className="font-bold text-white">{space.ocupacao} / {space.capacidade}</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFull ? 'bg-red-500' : rate >= 60 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.min(rate, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center pt-1 text-xs">
                          <span className="text-[11px] text-zinc-500">{rate}% lotado</span>
                          <span className={`font-semibold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isFull ? "Esgotado (0 vagas)" : `${vagas} vagas livres`}
                          </span>
                        </div>
                      </div>

                      {/* Materiais resumidos */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {space.materiais.slice(0, 3).map((mat, i) => (
                          <span key={i} className="text-[11px] bg-zinc-800/60 text-zinc-300 px-2 py-0.5 rounded-lg border border-zinc-700/50">
                            {mat}
                          </span>
                        ))}
                        {space.materiais.length > 3 && (
                          <span className="text-[11px] text-zinc-500 px-1 py-0.5">
                            +{space.materiais.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Monitor / Professor indicador */}
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-6">
                        {space.monitorDisponivel && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Users className="w-3 h-3" /> Monitor
                          </span>
                        )}
                        {space.professorResponsavel && (
                          <span className="flex items-center gap-1 text-purple-400">
                            <GraduationCap className="w-3 h-3" /> Prof. Responsável
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => setDetailSpace(space)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-3 rounded-xl transition text-xs text-center"
                      >
                        Detalhes & Regras
                      </button>

                      {isFull ? (
                        <button
                          onClick={() => setWaitlistSpace(space)}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs shadow-md shadow-amber-600/20"
                        >
                          Fila de Espera
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReservation(space)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs shadow-md shadow-indigo-600/30"
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
      )}

      {/* 3. ABA ASSISTENTE IA */}
      {activeTab === "ia" && (
        <div className="animate-in fade-in duration-300">
          <RecommendationAssistant
            onRecommend={getRecommendation}
            onSelectSpaceForReservation={handleOpenReservation}
            onOpenDetails={(s) => setDetailSpace(s)}
          />
        </div>
      )}

      {/* 4. ABA MINHAS RESERVAS */}
      {activeTab === "reservas" && (
        <div className="animate-in fade-in duration-300">
          <ReservationSection
            reservations={reservations}
            spaces={spaces}
            onCheckIn={(id) => {
              const res = performCheckIn(id);
              alert(res.message);
            }}
            onCancel={(id) => {
              const res = cancelReservation(id);
              alert(res.message);
            }}
            onExpireCheckIn={(id) => {
              const res = expireCheckIn(id);
              alert(res.message);
            }}
            onNavigateToSpaces={() => setActiveTab("espacos")}
          />
        </div>
      )}

      {/* 5. ABA FILA DE ESPERA */}
      {activeTab === "fila" && (
        <div className="animate-in fade-in duration-300">
          <WaitlistSection
            waitlist={waitlist}
            spaces={spaces}
            onRemove={removeFromWaitlist}
            onNavigateToSpaces={() => setActiveTab("espacos")}
          />
        </div>
      )}

      {/* Modais do Sistema */}
      <SpaceDetailModal
        space={detailSpace}
        events={events}
        onClose={() => setDetailSpace(null)}
        onReserve={(s) => handleOpenReservation(s)}
        onWaitlist={(s) => setWaitlistSpace(s)}
      />

      <ReservationModal
        space={reservationSpace}
        initialData={reservationPresetData}
        onClose={() => {
          setReservationSpace(null);
          setReservationPresetData(null);
        }}
        onSubmit={addReservation}
        onOpenWaitlist={(s) => setWaitlistSpace(s)}
      />

      <WaitlistModal
        space={waitlistSpace}
        onClose={() => setWaitlistSpace(null)}
        onSubmit={addToWaitlist}
      />
    </div>
  );
}
