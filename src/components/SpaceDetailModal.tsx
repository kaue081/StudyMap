"use client";

import React from "react";
import { StudySpace, Event } from "../types";
import { X, MapPin, Users, BookOpen, Clock, ShieldAlert, GraduationCap, CheckCircle2, Calendar, Flame } from "lucide-react";

interface ModalProps {
  space: StudySpace | null;
  events: Event[];
  onClose: () => void;
  onReserve: (space: StudySpace) => void;
  onWaitlist: (space: StudySpace) => void;
}

export function SpaceDetailModal({
  space,
  events,
  onClose,
  onReserve,
  onWaitlist
}: ModalProps) {
  if (!space) return null;

  const spaceEvents = events.filter(e => e.espacoId === space.id);
  const vagas = space.capacidade - space.ocupacao;
  const isFull = vagas <= 0;
  const occupancyRate = Math.round((space.ocupacao / space.capacidade) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header do Modal */}
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {space.tipo}
              </span>
              <span className="text-xs text-zinc-400">{space.perfilAmbiente}</span>
            </div>
            <h2 className="text-2xl font-black text-white">{space.nome}</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{space.salaIdentificacao}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status de Ocupação */}
        <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-400 block mb-0.5">Capacidade e Vagas</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{space.ocupacao} / {space.capacidade}</span>
              <span className="text-xs text-zinc-400">ocupados</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                isFull ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isFull ? "Lotado" : `${vagas} vagas livres`}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Lotação</span>
              <span className="font-semibold text-white">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-zinc-700/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyRate >= 90 ? 'bg-red-500' : occupancyRate >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Sobre o Espaço</h4>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/30 p-3.5 rounded-xl border border-zinc-800">
            {space.descricao}
          </p>
        </div>

        {/* Equipe: Professor & Monitor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Professor Responsável</span>
            </div>
            {space.professorResponsavel ? (
              <div>
                <p className="text-sm font-semibold text-white">{space.professorResponsavel}</p>
                <p className="text-xs text-zinc-400">Horário: {space.horarioProfessor || "Turno integral"}</p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Nenhum professor fixo atribuído.</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
              <Users className="w-4 h-4" />
              <span>Aluno-Monitor</span>
            </div>
            {space.monitorDisponivel ? (
              <div>
                <p className="text-sm font-semibold text-white">{space.nomeMonitor || "Monitor de Plantão"}</p>
                <p className="text-xs text-zinc-400">Horário: {space.horarioMonitor || "Disponível no turno"}</p>
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
                className="text-xs px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
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
                <span className="text-indigo-400 font-bold">•</span>
                <span>{regra}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eventos Programados */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
            Eventos Programados
          </h4>
          {spaceEvents.length > 0 ? (
            <div className="space-y-2">
              {spaceEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="flex justify-between font-bold text-amber-300">
                    <span>{event.nome}</span>
                    <span>{event.horarioInicio} - {event.horarioFim}</span>
                  </div>
                  <p className="text-zinc-400 mt-0.5">{event.descricao}</p>
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
              onClick={() => {
                onClose();
                onWaitlist(space);
              }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Espaço Lotado — Entrar na Fila de Espera
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onReserve(space);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Solicitar Reserva Neste Espaço
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
