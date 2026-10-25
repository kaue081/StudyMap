"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WaitlistEntry, StudySpace, UserAccount } from "../types";
import { Users, Clock, Calendar, MapPin, Trash2, AlertCircle } from "lucide-react";

interface WaitlistSectionProps {
  waitlist: WaitlistEntry[];
  spaces: StudySpace[];
  currentUser?: UserAccount | null;
  onRemove: (id: number) => void;
}

export function WaitlistSection({
  waitlist,
  spaces,
  currentUser,
  onRemove
}: WaitlistSectionProps) {
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const getSpace = (id: number) => spaces.find((s) => s.id === id);

  const handleDesistir = (id: number) => {
    if (removingIds.includes(id)) return;
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      onRemove(id);
      setRemovingIds((prev) => prev.filter((item) => item !== id));
    }, 5000);
  };

  return (
    <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Controle de Fila de Espera</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
            Quando um espaço atinge lotação máxima, os estudantes aguardam aqui a liberação de vagas
          </p>
        </div>

        <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-semibold self-start sm:self-auto shrink-0">
          {waitlist.length} estudantes aguardando
        </span>
      </div>

      {/* Regra Explicativa da Fila de Espera */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div className="min-w-0">
          <p className="font-semibold text-white mb-0.5">Funcionamento Automático da Fila:</p>
          <p className="text-zinc-300 leading-relaxed">
            Se alguma reserva do espaço em questão for cancelada ou liberada (por falta de check-in), o sistema automaticamente promove o <strong>primeiro usuário da fila (#1)</strong> transformando seu pedido em uma reserva ativa com vaga garantida!
          </p>
        </div>
      </div>

      {waitlist.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4 bg-zinc-900/40 rounded-2xl sm:rounded-3xl border border-dashed border-zinc-800 space-y-3">
          <Users className="w-12 h-12 mx-auto text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-300">A fila de espera está vazia</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Não há estudantes aguardando por vagas no momento.
          </p>
          <Link
            href="/espacos"
            className="inline-block mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition"
          >
            Ver Espaços Lotados
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waitlist.map((entry) => {
            const space = getSpace(entry.espacoId);
            const isOwner =
              currentUser &&
              ((entry.usuarioId && entry.usuarioId === currentUser.id) ||
                (entry.usuarioEmail &&
                  entry.usuarioEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
                entry.nomeAluno.trim().toLowerCase() === currentUser.nome.trim().toLowerCase());
            const canDesistir = isOwner || currentUser?.perfil === "admin";
            const isRemoving = removingIds.includes(entry.id);

            return (
              <div
                key={entry.id}
                className="bg-zinc-900/70 border border-zinc-700/80 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden min-w-0"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Posição #{entry.posicao} na fila
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white wrap-break-word">
                      {entry.nomeAluno}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 wrap-break-word">
                      Interesse em: <strong className="text-white">{space?.nome || "Espaço"}</strong>
                    </p>
                  </div>

                  {canDesistir ? (
                    isRemoving ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse shrink-0">
                        Saindo em 5s...
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDesistir(entry.id)}
                        title="Desistir da fila"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Desistir da Fila</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] text-zinc-500 px-2.5 py-1 rounded-lg bg-zinc-800/50 border border-zinc-700/50 shrink-0">
                      Aguardando vaga
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-1.5 text-xs text-zinc-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="wrap-break-word">{space?.salaIdentificacao}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400 py-2.5 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{entry.data}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>
                      {entry.horarioInicio} às {entry.horarioFim}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
