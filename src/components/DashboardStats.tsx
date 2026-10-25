"use client";

import React from "react";
import Link from "next/link";
import { StudySpace, Reservation, WaitlistEntry } from "../types";
import { Layers, Calendar, Flame, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";

interface StatsProps {
  spaces: StudySpace[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
}

export function DashboardStats({ spaces, reservations, waitlist }: StatsProps) {
  const totalCapacidade = spaces.reduce((acc, s) => acc + s.capacidade, 0);
  const totalOcupacao = spaces.reduce((acc, s) => acc + s.ocupacao, 0);
  const totalVagas = totalCapacidade - totalOcupacao;
  const taxaOcupacaoGeral = totalCapacidade > 0 ? Math.round((totalOcupacao / totalCapacidade) * 100) : 0;

  const reservasAtivas = reservations.filter((r) => r.status !== "cancelada");
  const checkinsFeitos = reservasAtivas.filter((r) => r.checkIn).length;

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 text-zinc-400">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Espaços de Estudo
            </span>
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{spaces.length}</span>
            <span className="text-xs text-zinc-400">ambientes</span>
          </div>
          <p className="text-xs text-zinc-500">Salas, labs e bibliotecas</p>
        </div>

        <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 text-zinc-400">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Vagas Disponíveis
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{totalVagas}</span>
            <span className="text-xs text-zinc-400">/ {totalCapacidade}</span>
          </div>
          <p className="text-xs text-zinc-500">Prontas para uso no campus</p>
        </div>

        <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 text-zinc-400">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Lotação Média
            </span>
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{taxaOcupacaoGeral}%</span>
            <span className="text-xs text-amber-400 font-medium">ocupado</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${taxaOcupacaoGeral}%` }}
            />
          </div>
        </div>

        <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 text-zinc-400">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Reservas &amp; Check-in
            </span>
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{reservasAtivas.length}</span>
            <span className="text-xs text-purple-400">({checkinsFeitos} com check-in)</span>
          </div>
          <p className="text-xs text-zinc-500">{waitlist.length} na fila de espera</p>
        </div>
      </div>

      {/* Banner de Boas-Vindas e Ação Rápida */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-r from-indigo-900/60 via-purple-900/50 to-zinc-900 border border-indigo-500/20 p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl min-w-0">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Sistema Inteligente Didático</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
            Encontre o melhor espaço para seus estudos hoje
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Consulte a ocupação em tempo real, evite horários de eventos agendados, confira os materiais disponíveis e faça seu check-in direto pelo navegador.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/ia"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Usar Assistente de IA</span>
          </Link>
          <Link
            href="/espacos"
            className="w-full sm:w-auto bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 sm:py-3.5 px-5 rounded-2xl border border-zinc-700/60 transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
          >
            <span>Ver Mapa de Calor</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
