"use client";

import React, { useState } from "react";
import { StudySpace, RecommendationCriteria } from "../types";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Flame,
  BookOpen,
  Monitor,
  Users,
  ArrowRight
} from "lucide-react";

interface RecommendationProps {
  onRecommend: (criteria: RecommendationCriteria) => { space: StudySpace | null; justificativa: string };
  onSelectSpaceForReservation: (
    space: StudySpace,
    initialData?: { data: string; horarioInicio: string; horarioFim: string }
  ) => void;
  onOpenDetails: (space: StudySpace) => void;
}

export function RecommendationAssistant({
  onRecommend,
  onSelectSpaceForReservation,
  onOpenDetails
}: RecommendationProps) {
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState(today);
  const [horarioInicio, setHorarioInicio] = useState("14:00");
  const [horarioFim, setHorarioFim] = useState("16:00");

  const [preferenciaSilencio, setPreferenciaSilencio] = useState(true);
  const [precisaComputador, setPrecisaComputador] = useState(false);
  const [precisaMonitor, setPrecisaMonitor] = useState(false);
  const [precisaProfessor, setPrecisaProfessor] = useState(false);
  const [tipoEspaco, setTipoEspaco] = useState("Todos");

  const [result, setResult] = useState<{ space: StudySpace | null; justificativa: string } | null>(
    null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: RecommendationCriteria = {
      data,
      horarioInicio,
      horarioFim,
      preferenciaSilencio,
      precisaComputador,
      precisaMonitor,
      precisaProfessor,
      tipoEspaco
    };
    const rec = onRecommend(criteria);
    setResult(rec);
  };

  const applyPreset = (preset: {
    silencio: boolean;
    pc: boolean;
    monitor: boolean;
    prof: boolean;
    tipo: string;
  }) => {
    setPreferenciaSilencio(preset.silencio);
    setPrecisaComputador(preset.pc);
    setPrecisaMonitor(preset.monitor);
    setPrecisaProfessor(preset.prof);
    setTipoEspaco(preset.tipo);

    const rec = onRecommend({
      data,
      horarioInicio,
      horarioFim,
      preferenciaSilencio: preset.silencio,
      precisaComputador: preset.pc,
      precisaMonitor: preset.monitor,
      precisaProfessor: preset.prof,
      tipoEspaco: preset.tipo
    });
    setResult(rec);
  };

  return (
    <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 sm:space-y-8 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Assistente de Recomendação Inteligente (IA)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
              O assistente analisa ocupação, eventos agendados, regras e materiais para recomendar o espaço ideal
            </p>
          </div>
        </div>
      </div>

      {/* Cenários Rápidos / Presets didáticos */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Exemplos rápidos do Escopo:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                silencio: true,
                pc: false,
                monitor: false,
                prof: false,
                tipo: "Biblioteca"
              })
            }
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 transition flex items-center gap-1.5 text-left"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>&ldquo;Quero um lugar silencioso para leitura&rdquo;</span>
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                silencio: false,
                pc: true,
                monitor: true,
                prof: false,
                tipo: "Laboratório"
              })
            }
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 transition flex items-center gap-1.5 text-left"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>&ldquo;Preciso de computador com monitor de apoio&rdquo;</span>
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                silencio: false,
                pc: false,
                monitor: false,
                prof: false,
                tipo: "Sala de estudos"
              })
            }
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 transition flex items-center gap-1.5 text-left"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>&ldquo;Estudo em equipe para debate acadêmico&rdquo;</span>
          </button>
        </div>
      </div>

      {/* Formulário de Busca da IA */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 bg-zinc-900/40 p-4 sm:p-6 rounded-2xl border border-white/5 min-w-0"
      >
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Data do Estudo</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 min-w-0">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Horário Início</label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="time"
                required
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Horário Fim</label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="time"
                required
                value={horarioFim}
                onChange={(e) => setHorarioFim(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1 min-w-0">
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Tipo de Espaço</label>
          <select
            value={tipoEspaco}
            onChange={(e) => setTipoEspaco(e.target.value)}
            className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="Todos">Qualquer Tipo</option>
            <option value="Biblioteca">Biblioteca</option>
            <option value="Laboratório">Laboratório</option>
            <option value="Sala de estudos">Sala de estudos</option>
            <option value="Sala">Sala de Aula</option>
            <option value="Auditório">Auditório</option>
          </select>
        </div>

        {/* Preferências e filtros inteligentes */}
        <div className="md:col-span-2 lg:col-span-3 pt-1">
          <label className="block text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Preferências adicionais para o assistente avaliar:
          </label>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition ${
                preferenciaSilencio
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
              }`}
            >
              <input
                type="checkbox"
                checked={preferenciaSilencio}
                onChange={(e) => setPreferenciaSilencio(e.target.checked)}
                className="rounded accent-indigo-600 shrink-0"
              />
              <span>Ambiente Silencioso</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition ${
                precisaComputador
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
              }`}
            >
              <input
                type="checkbox"
                checked={precisaComputador}
                onChange={(e) => setPrecisaComputador(e.target.checked)}
                className="rounded accent-indigo-600 shrink-0"
              />
              <span>Preciso de Computador</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition ${
                precisaMonitor
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
              }`}
            >
              <input
                type="checkbox"
                checked={precisaMonitor}
                onChange={(e) => setPrecisaMonitor(e.target.checked)}
                className="rounded accent-indigo-600 shrink-0"
              />
              <span>Monitor no Local</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition ${
                precisaProfessor
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
              }`}
            >
              <input
                type="checkbox"
                checked={precisaProfessor}
                onChange={(e) => setPrecisaProfessor(e.target.checked)}
                className="rounded accent-indigo-600 shrink-0"
              />
              <span>Professor Disponível</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 pt-1">
          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>Analisar e Recomendar Melhor Espaço</span>
          </button>
        </div>
      </form>

      {/* Resultado da Recomendação */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {result.space ? (
            <div className="bg-linear-to-br from-indigo-950/60 to-purple-950/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-indigo-500/40 shadow-xl space-y-5 sm:space-y-6 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block">
                      Espaço mais compatível encontrado
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white wrap-break-word">
                      {result.space.nome}
                    </h3>
                    <p className="text-xs text-zinc-300 wrap-break-word">
                      {result.space.salaIdentificacao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-indigo-500/20 px-3.5 py-2 rounded-xl border border-indigo-500/30 text-xs font-semibold text-indigo-300 self-start lg:self-auto">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Ocupação: {Math.round((result.space.ocupacao / result.space.capacidade) * 100)}% (
                    {result.space.capacidade - result.space.ocupacao} vagas livres)
                  </span>
                </div>
              </div>

              {/* Justificativa Inteligente da IA */}
              <div className="bg-zinc-900/70 p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-zinc-200 leading-relaxed wrap-break-word">
                <strong className="text-indigo-400 font-semibold block mb-1">
                  Análise do StudyMap:
                </strong>
                {result.justificativa}
              </div>

              {/* Informações Rápidas do Espaço */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
                  <span className="text-zinc-400 block mb-1">Ambiente:</span>
                  <strong className="text-white text-sm wrap-break-word">
                    {result.space.perfilAmbiente}
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
                  <span className="text-zinc-400 block mb-1">Funcionamento:</span>
                  <strong className="text-white text-sm wrap-break-word">
                    {result.space.horarioFuncionamento}
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
                  <span className="text-zinc-400 block mb-1">Monitor:</span>
                  <strong className="text-white text-sm wrap-break-word">
                    {result.space.monitorDisponivel
                      ? result.space.nomeMonitor || "Disponível"
                      : "Não possui"}
                  </strong>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
                  <span className="text-zinc-400 block mb-1">Eventos no Período:</span>
                  <strong className="text-emerald-400 text-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Nenhum (Livre)
                  </strong>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onSelectSpaceForReservation(result.space!, { data, horarioInicio, horarioFim })
                  }
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Reservar este Espaço Agora</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDetails(result.space!)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 px-5 rounded-xl border border-zinc-700/60 transition text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
                >
                  <span>Ver Regras e Detalhes</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center bg-zinc-900/60 rounded-2xl sm:rounded-3xl border border-zinc-800 text-zinc-400 space-y-2">
              <p className="text-sm sm:text-base font-semibold text-zinc-300">
                {result.justificativa}
              </p>
              <p className="text-xs text-zinc-500">
                Tente selecionar outro horário ou alterar as preferências de busca acima.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
