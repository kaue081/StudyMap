"use client";

import React, { useState } from "react";
import { StudySpace } from "../types";
import { X, Calendar, Clock, User, AlertTriangle, CheckCircle2, Users } from "lucide-react";

interface ReservationModalProps {
  space: StudySpace | null;
  initialData?: { data: string; horarioInicio: string; horarioFim: string } | null;
  onClose: () => void;
  onSubmit: (data: {
    espacoId: number;
    usuarioNome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => { success: boolean; message: string; isFull?: boolean };
  onOpenWaitlist: (space: StudySpace) => void;
}

export function ReservationModal({
  space,
  initialData,
  onClose,
  onSubmit,
  onOpenWaitlist
}: ReservationModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [usuarioNome, setUsuarioNome] = useState("Aluno Visitante");
  const [data, setData] = useState(initialData?.data || today);
  const [horarioInicio, setHorarioInicio] = useState(initialData?.horarioInicio || "14:00");
  const [horarioFim, setHorarioFim] = useState(initialData?.horarioFim || "16:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWaitlistOption, setShowWaitlistOption] = useState(false);

  if (!space) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowWaitlistOption(false);

    if (horarioInicio >= horarioFim) {
      setErrorMessage("O horário de início deve ser anterior ao horário de fim.");
      return;
    }

    const res = onSubmit({
      espacoId: space.id,
      usuarioNome,
      data,
      horarioInicio,
      horarioFim
    });

    if (res.success) {
      alert(res.message);
      onClose();
    } else {
      setErrorMessage(res.message);
      if (res.isFull) {
        setShowWaitlistOption(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Solicitação de Reserva
            </span>
            <h2 className="text-2xl font-black text-white">{space.nome}</h2>
            <p className="text-xs text-zinc-400">{space.salaIdentificacao}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Atenção:</span>
            </div>
            <p>{errorMessage}</p>

            {showWaitlistOption && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWaitlist(space);
                }}
                className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                Entrar na Fila de Espera Deste Espaço
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Nome do Estudante
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={usuarioNome}
                onChange={(e) => setUsuarioNome(e.target.value)}
                placeholder="Ex: Pedro Henrique"
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Data da Reserva
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Horário Inicial
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="time"
                  required
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Horário Final
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="time"
                  required
                  value={horarioFim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regra de Check-in: Você deve confirmar presença após chegar ao local.</span>
            </p>
            <p className="text-[11px] text-zinc-500 pl-5">
              Caso não faça check-in dentro do horário, a reserva será cancelada e a vaga irá para a fila de espera.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
