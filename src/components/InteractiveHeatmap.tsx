"use client";

import React, { useState } from "react";
import { StudySpace } from "../types";
import { Flame, MapPin } from "lucide-react";

interface HeatmapProps {
  spaces: StudySpace[];
  onSelectSpace: (space: StudySpace) => void;
}

export function InteractiveHeatmap({ spaces, onSelectSpace }: HeatmapProps) {
  const [selectedBlock, setSelectedBlock] = useState<string>("Todos");

  const blocks = ["Todos", "Bloco A", "Bloco B", "Bloco C", "Prédio Central"];

  const filteredSpaces =
    selectedBlock === "Todos"
      ? spaces
      : spaces.filter((s) => s.bloco === selectedBlock);

  const getHeatmapColor = (ocupacao: number, capacidade: number) => {
    const rate = (ocupacao / capacidade) * 100;
    if (rate >= 90) {
      return {
        bg: "bg-red-500/20",
        border: "border-red-500/40",
        text: "text-red-400",
        bar: "bg-red-500",
        badge: "Alta Lotação / Quase Esgotado",
        level: "high"
      };
    } else if (rate >= 50) {
      return {
        bg: "bg-amber-500/20",
        border: "border-amber-500/40",
        text: "text-amber-400",
        bar: "bg-amber-500",
        badge: "Ocupação Moderada",
        level: "medium"
      };
    } else {
      return {
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/40",
        text: "text-emerald-400",
        bar: "bg-emerald-500",
        badge: "Baixa Ocupação (Tranquilo)",
        level: "low"
      };
    }
  };

  return (
    <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 space-y-5 sm:space-y-6 w-full min-w-0">
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-pulse shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Mapa Visual &amp; Mapa de Calor do Campus
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Simulação visual da concentração de pessoas e ocupação em tempo real por Bloco e Andar
          </p>
        </div>

        {/* Legenda de Calor */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs bg-zinc-900/60 p-3 rounded-2xl border border-white/5 self-start xl:self-auto">
          <span className="text-zinc-400 font-medium">Legenda:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0"></span>
            <span className="text-zinc-300">Baixa (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0"></span>
            <span className="text-zinc-300">Média (50-89%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shrink-0"></span>
            <span className="text-zinc-300">Alta (&ge;90%)</span>
          </div>
        </div>
      </div>

      {/* Seletor de Bloco — Flex Wrap sem scroll lateral */}
      <div className="flex flex-wrap items-center gap-2">
        {blocks.map((block) => (
          <button
            key={block}
            type="button"
            onClick={() => setSelectedBlock(block)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedBlock === block
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            {block}
          </button>
        ))}
      </div>

      {/* Grid de Mapa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpaces.map((space) => {
          const rate = Math.round((space.ocupacao / space.capacidade) * 100);
          const heat = getHeatmapColor(space.ocupacao, space.capacidade);
          const vagas = space.capacidade - space.ocupacao;

          return (
            <div
              key={space.id}
              onClick={() => onSelectSpace(space)}
              className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden min-w-0 ${heat.bg} ${heat.border} hover:-translate-y-0.5 hover:shadow-xl`}
            >
              {/* Indicador de calor no topo */}
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    {space.bloco} • {space.andar}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors wrap-break-word">
                    {space.nome}
                  </h4>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border shrink-0 ${heat.border} ${heat.text}`}>
                  {rate}%
                </span>
              </div>

              {/* Informações de Localização e Vagas */}
              <div className="text-xs text-zinc-300 space-y-1.5 mb-4">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="wrap-break-word">{space.salaIdentificacao}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-zinc-400 pt-1">
                  <span>
                    Ocupação atual: <strong className="text-white">{space.ocupacao}</strong> /{" "}
                    {space.capacidade}
                  </span>
                  <span className={`font-semibold ${vagas === 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {vagas === 0 ? "Lotado (0 vagas)" : `${vagas} vagas livres`}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso com gradiente de calor */}
              <div className="w-full bg-zinc-900/80 rounded-full h-2.5 overflow-hidden mb-3 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${heat.bar}`}
                  style={{ width: `${Math.min(rate, 100)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-white/5 text-xs">
                <span className={`font-medium ${heat.text}`}>{heat.badge}</span>
                <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform font-semibold shrink-0">
                  Detalhes &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
