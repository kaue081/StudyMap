"use client";

import React from "react";
import { StudySpace, Reservation, WaitlistEntry } from "../types";
import { Layers, Users, Calendar, Flame, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";

interface StatsProps {
  spaces: StudySpace[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  onNavigate: (tab: string) => void;
}

export function DashboardStats({ spaces, reservations, waitlist, onNavigate }: StatsProps) {
  const totalCapacidade = spaces.reduce((acc, s) => acc + s.capacidade, 0);
  const totalOcupacao = spaces.reduce((acc, s) => acc + s.ocupacao, 0);
  const totalVagas = totalCapacidade - totalOcupacao;
  const taxaOcupacaoGeral = totalCapacidade > 0 ? Math.round((totalOcupacao / totalCapacidade) * 100) : 0;

  const reservasAtivas = reservations.filter(r => r.status !== 'cancelada');
  const checkinsFeitos = reservasAtivas.filter(r => r.checkIn).length;

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Espaços de Estudo</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{spaces.length}</span>
            <span className="text-xs text-zinc-400">ambientes</span>
          </div>
          <p className="text-xs text-zinc-500">Salas, labs e bibliotecas</p>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Vagas Disponíveis</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{totalVagas}</span>
            <span className="text-xs text-zinc-400">/ {totalCapacidade}</span>
          </div>
          <p className="text-xs text-zinc-500">Prontas para uso no campus</p>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lotação Média</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{taxaOcupacaoGeral}%</span>
            <span className="text-xs text-amber-400 font-medium">ocupado</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${taxaOcupacaoGeral}%` }}
            />
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Reservas & Check-in</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{reservasAtivas.length}</span>
            <span className="text-xs text-purple-400">({checkinsFeitos} com check-in)</span>
          </div>
          <p className="text-xs text-zinc-500">{waitlist.length} na fila de espera</p>
        </div>
      </div>

      {/* Banner de Boas-Vindas e Ação Rápida */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-zinc-900 border border-indigo-500/20 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Sistema Inteligente Didático</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Encontre o melhor espaço para seus estudos hoje
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Consulte a ocupação em tempo real, evite horários de eventos agendados, confira os materiais disponíveis e faça seu check-in direto pelo navegador.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 self-start md:self-center">
          <button
            onClick={() => onNavigate("ia")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            Usar Assistente de IA
          </button>
          <button
            onClick={() => onNavigate("espacos")}
            className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-semibold py-3.5 px-5 rounded-2xl border border-zinc-700/60 transition flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            Ver Mapa de Calor
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
