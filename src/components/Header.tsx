"use client";

import React from "react";
import { MapPin, Sparkles, Calendar, Layers, Clock, Users, RotateCcw } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reservationCount: number;
  waitlistCount: number;
  onReset: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  reservationCount,
  waitlistCount,
  onReset
}: HeaderProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "espacos", label: "Espaços & Mapa", icon: MapPin },
    { id: "ia", label: "Assistente IA (Recomendação)", icon: Sparkles },
    { id: "reservas", label: "Minhas Reservas", icon: Calendar, badge: reservationCount },
    { id: "fila", label: "Fila de Espera", icon: Users, badge: waitlistCount }
  ];

  return (
    <header className="glass rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight text-white">StudyMap</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Front-end Didático
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-0.5">
                Localização, consulta inteligente, mapa de calor e gestão de espaços de estudo
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={onReset}
            title="Redefinir dados para o padrão do escopo"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3.5 py-2 rounded-xl transition border border-zinc-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Dados Padrão
          </button>
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Acesso Livre (Sem Login)
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <nav className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white text-indigo-700" : "bg-indigo-500/30 text-indigo-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
