"use client";

import React, { useState } from "react";
import { StudySpace } from "../types";
import { ReactAlertBanner } from "./ReactAlert";
import { X, Users, Calendar, Clock, User } from "lucide-react";

interface WaitlistModalProps {
  space: StudySpace | null;
  defaultUserName?: string;
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
  defaultUserName,
  onClose,
  onSubmit
}: WaitlistModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [nomeAluno, setNomeAluno] = useState(defaultUserName || "Estudante Interessado");
  const [data, setData] = useState(today);
  const [horarioInicio, setHorarioInicio] = useState("14:00");
  const [horarioFim, setHorarioFim] = useState("16:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!space) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (horarioInicio >= horarioFim) {
      setErrorMessage("O horário de início deve ser anterior ao horário de término.");
      return;
    }

    const res = onSubmit({
      espacoId: space.id,
      nomeAluno,
      data,
      horarioInicio,
      horarioFim
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 max-h-[92dvh] overflow-y-auto my-auto min-w-0">
        <div className="flex justify-between items-start gap-3 pb-4 border-b border-zinc-800">
          <div className="min-w-0">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block">
              Espaço Lotado (0 vagas livres)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Entrar na Fila de Espera</h2>
            <p className="text-xs text-zinc-400 wrap-break-word">
              {space.nome} — {space.salaIdentificacao}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ReactAlertBanner
          variant="warning"
          title="Como funciona a Fila de Espera"
          message="Se alguma reserva deste espaço for cancelada ou perder a validade por falta de check-in, a vaga é liberada automaticamente para o primeiro aluno da fila."
        />

        {errorMessage && (
          <ReactAlertBanner
            variant="error"
            title="Horário Inválido"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
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
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Data de Interesse
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Início
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Fim
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={horarioFim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-9 pr-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition text-xs sm:text-sm"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/30 transition text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Confirmar Entrada na Fila</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
