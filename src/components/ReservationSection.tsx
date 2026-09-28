"use client";

import React from "react";
import { Reservation, StudySpace } from "../types";
import { Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, XCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface ReservationSectionProps {
  reservations: Reservation[];
  spaces: StudySpace[];
  onCheckIn: (id: number) => void;
  onCancel: (id: number) => void;
  onExpireCheckIn: (id: number) => void;
  onNavigateToSpaces: () => void;
}

export function ReservationSection({
  reservations,
  spaces,
  onCheckIn,
  onCancel,
  onExpireCheckIn,
  onNavigateToSpaces
}: ReservationSectionProps) {
  const getSpace = (id: number) => spaces.find(s => s.id === id);

  return (
    <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Minhas Reservas & Check-in</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Acompanhe o status das suas reservas, confirme sua presença ou simule o cancelamento por ausência
          </p>
        </div>

        <button
          onClick={onNavigateToSpaces}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          + Fazer Nova Reserva
        </button>
      </div>

      {/* Regra Explicativa de Check-in Didático */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-indigo-400 mt-0.5" />
        <div>
          <p className="font-semibold text-white mb-0.5">Regra Oficial de Check-in (Mecanismo do Escopo):</p>
          <p className="text-zinc-300 leading-relaxed">
            Para evitar ociosidade e reservas abandonadas, o estudante deve fazer o check-in presencial no início do período reservado. Caso o aluno não realize o check-in, a vaga é cancelada automaticamente e repassada para o próximo da fila de espera.
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-800 space-y-3">
          <Calendar className="w-12 h-12 mx-auto text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-300">Nenhuma reserva encontrada</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Você ainda não solicitou nenhuma reserva de espaço. Explore os espaços do campus e agende um horário.
          </p>
          <button
            onClick={onNavigateToSpaces}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition"
          >
            Ver Espaços Disponíveis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => {
            const space = getSpace(res.espacoId);
            const isConfirmed = res.checkIn && res.status === "confirmada";
            const isCanceled = res.status === "cancelada";
            const isWaitingCheckin = !res.checkIn && res.status === "reservada";

            return (
              <div
                key={res.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isConfirmed
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : isCanceled
                    ? "bg-zinc-900/40 border-zinc-800 opacity-60"
                    : "bg-zinc-900/70 border-zinc-700/80 shadow-lg"
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-zinc-400">
                      Estudante: {res.usuarioNome}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {space?.nome || "Espaço de Estudo"}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{space?.salaIdentificacao || "Campus"}</span>
                    </div>
                  </div>

                  {/* Badge de Status */}
                  <div>
                    {isConfirmed && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Check-in Realizado
                      </span>
                    )}
                    {isWaitingCheckin && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Aguardando Check-in
                      </span>
                    )}
                    {isCanceled && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Cancelada
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalhes de Data e Horário */}
                <div className="flex items-center gap-4 text-xs text-zinc-300 py-3 border-y border-white/5 my-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{res.data}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{res.horarioInicio} às {res.horarioFim}</span>
                  </div>
                </div>

                {/* Ações de Gerenciamento */}
                {!isCanceled && (
                  <div className="space-y-2 pt-1">
                    {isWaitingCheckin && (
                      <button
                        onClick={() => onCheckIn(res.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition text-xs flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Confirmar Presença (Fazer Check-in)
                      </button>
                    )}

                    <div className="flex gap-2">
                      {isWaitingCheckin && (
                        <button
                          onClick={() => onExpireCheckIn(res.id)}
                          title="Simula a expiração automática de check-in descrita no ESCOPE.md"
                          className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 py-2 px-3 rounded-xl transition text-[11px] font-medium flex items-center justify-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Simular Falha de Check-in
                        </button>
                      )}

                      <button
                        onClick={() => onCancel(res.id)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-3 rounded-xl transition text-[11px] font-medium flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Cancelar Reserva
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
