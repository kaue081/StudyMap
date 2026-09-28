"use client";

import React, { useState } from "react";
import { StudySpace } from "../types";
import { X, Users, Calendar, Clock, User, CheckCircle2 } from "lucide-react";

interface WaitlistModalProps {
  space: StudySpace | null;
  onClose: () => void;
  onSubmit: (data: {
    espacoId: number;
    nomeAluno: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => { success: boolean; message: string };
}

export function WaitlistModal({
  space,
  onClose,
  onSubmit
}: WaitlistModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [nomeAluno, setNomeAluno] = useState("Estudante Interessado");
  const [data, setData] = useState(today);
  const [horarioInicio, setHorarioInicio] = useState("14:00");
  const [horarioFim, setHorarioFim] = useState("16:00");

  if (!space) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onSubmit({
      espacoId: space.id,
      nomeAluno,
      data,
      horarioInicio,
      horarioFim
    });

    if (res.success) {
      alert(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Espaço Lotado (0 vagas livres)
            </span>
            <h2 className="text-2xl font-black text-white">Entrar na Fila de Espera</h2>
            <p className="text-xs text-zinc-400">{space.nome} — {space.salaIdentificacao}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
          <p className="font-semibold mb-1">Como funciona a Fila de Espera:</p>
          <p className="text-zinc-300 leading-relaxed">
            Se alguma reserva deste espaço for cancelada ou perder a validade por falta de check-in, a vaga é liberada automaticamente para o primeiro aluno da fila.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Seu Nome
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
                placeholder="Ex: Emanuel da Silva"
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Data de Interesse
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Início
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="time"
                  required
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Fim
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="time"
                  required
                  value={horarioFim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition text-sm"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="w-2/3 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Confirmar Entrada na Fila
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
