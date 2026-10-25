"use client";

import React, { useState } from "react";
import { StudySpace } from "../types";
import { ReactAlertBanner } from "./ReactAlert";
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Users,
  Package,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface ReservationModalProps {
  space: StudySpace | null;
  defaultUserName?: string;
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

function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ReservationModal({
  space,
  defaultUserName,
  initialData,
  onClose,
  onSubmit,
  onOpenWaitlist
}: ReservationModalProps) {
  const today = getLocalToday();

  const [usuarioNome, setUsuarioNome] = useState(defaultUserName || "Aluno Visitante");
  const [data, setData] = useState(initialData?.data || today);
  const [horarioInicio, setHorarioInicio] = useState(initialData?.horarioInicio || "14:00");
  const [horarioFim, setHorarioFim] = useState(initialData?.horarioFim || "16:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWaitlistOption, setShowWaitlistOption] = useState(false);

  if (!space) return null;

  const applyTenMinuteWindowPreset = () => {
    const now = new Date();
    const startInNineMin = new Date(now.getTime() + 9 * 60000);
    const endInTwoHours = new Date(startInNineMin.getTime() + 120 * 60000);

    const dateStr = `${startInNineMin.getFullYear()}-${String(
      startInNineMin.getMonth() + 1
    ).padStart(2, "0")}-${String(startInNineMin.getDate()).padStart(2, "0")}`;
    const startStr = `${String(startInNineMin.getHours()).padStart(2, "0")}:${String(
      startInNineMin.getMinutes()
    ).padStart(2, "0")}`;
    const endStr = `${String(endInTwoHours.getHours()).padStart(2, "0")}:${String(
      endInTwoHours.getMinutes()
    ).padStart(2, "0")}`;

    setData(dateStr);
    setHorarioInicio(startStr);
    setHorarioFim(endStr);
    setErrorMessage(null);
  };

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
      onClose();
    } else {
      setErrorMessage(res.message);
      if (res.isFull) {
        setShowWaitlistOption(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 max-h-[92dvh] overflow-y-auto my-auto min-w-0">
        <div className="flex justify-between items-start gap-3 pb-4 border-b border-zinc-800">
          <div className="min-w-0">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block">
              Solicitação de Reserva (Limite: 1 local por dia)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white wrap-break-word">
              {space.nome}
            </h2>
            <p className="text-xs text-zinc-400 wrap-break-word">{space.salaIdentificacao}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Materiais disponibilizados pelo local e Monitor */}
        <div className="p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-2.5 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              Materiais disponibilizados pelo local:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {space.materiais.map((mat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-zinc-900/80 text-zinc-200 px-2 py-0.5 rounded-lg border border-zinc-700 wrap-break-word"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-1 text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Monitor do local:
            </span>
            {space.monitorDisponivel ? (
              <span className="font-semibold text-cyan-300 wrap-break-word">
                {space.nomeMonitor} ({space.horarioMonitor})
              </span>
            ) : (
              <span className="text-zinc-500">Sem monitor de plantão neste espaço</span>
            )}
          </div>
        </div>

        {errorMessage && (
          <ReactAlertBanner
            variant={showWaitlistOption ? "warning" : "error"}
            title={showWaitlistOption ? "Espaço Esgotado" : "Não foi possível reservar"}
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          >
            {showWaitlistOption && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWaitlist(space);
                }}
                className="mt-1 w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2 text-center"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Entrar na Fila de Espera Deste Espaço</span>
              </button>
            )}
          </ReactAlertBanner>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
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
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
              <label className="block text-xs font-semibold text-zinc-400">
                Data da Reserva
              </label>
              <button
                type="button"
                onClick={applyTenMinuteWindowPreset}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition text-left"
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Definir p/ daqui a 10 min (Testar Check-in)</span>
              </button>
            </div>
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

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Horário Inicial
              </label>
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
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Horário Final
              </label>
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

          <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
            <p className="flex items-center gap-1.5 text-zinc-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Regras de Reserva e Check-in do Aluno:</span>
            </p>
            <ul className="text-[11px] text-zinc-400 pl-5 list-disc space-y-1">
              <li>É permitido reservar <strong>apenas um único local por dia</strong>.</li>
              <li>
                O <strong>check-in é liberado faltando 10 minutos</strong> para o horário inicial agendado, ou você pode cancelar enviando uma informação de cancelamento da vaga.
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition text-xs sm:text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Confirmar Reserva</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
