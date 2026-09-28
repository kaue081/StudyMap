"use client";

import React from "react";
import { WaitlistEntry, StudySpace } from "../types";
import { Users, Clock, Calendar, MapPin, Trash2, AlertCircle, ArrowUpRight } from "lucide-react";

interface WaitlistSectionProps {
  waitlist: WaitlistEntry[];
  spaces: StudySpace[];
  onRemove: (id: number) => void;
  onNavigateToSpaces: () => void;
}

export function WaitlistSection({
  waitlist,
  spaces,
  onRemove,
  onNavigateToSpaces
}: WaitlistSectionProps) {
  const getSpace = (id: number) => spaces.find(s => s.id === id);

  return (
    <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Controle de Fila de Espera</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Quando um espaço atinge lotação máxima, os estudantes aguardam aqui a liberação de vagas
          </p>
        </div>

        <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-semibold self-start sm:self-auto">
          {waitlist.length} estudantes aguardando
        </span>
      </div>

      {/* Regra Explicativa da Fila de Espera */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div>
          <p className="font-semibold text-white mb-0.5">Funcionamento Automático da Fila:</p>
          <p className="text-zinc-300 leading-relaxed">
            Se alguma reserva do espaço em questão for cancelada ou liberada (por falta de check-in), o sistema automaticamente promove o <strong>primeiro usuário da fila (#1)</strong> transformando seu pedido em uma reserva ativa com vaga garantida!
          </p>
        </div>
      </div>

      {waitlist.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-800 space-y-3">
          <Users className="w-12 h-12 mx-auto text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-300">A fila de espera está vazia</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Não há estudantes aguardando por vagas no momento.
          </p>
          <button
            onClick={onNavigateToSpaces}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition"
          >
            Ver Espaços Lotados
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waitlist.map((entry) => {
            const space = getSpace(entry.espacoId);

            return (
              <div
                key={entry.id}
                className="bg-zinc-900/70 border border-zinc-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Posição #{entry.posicao} na fila
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{entry.nomeAluno}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Interesse em: <strong className="text-white">{space?.nome || "Espaço"}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => onRemove(entry.id)}
                    title="Desistir da fila"
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{space?.salaIdentificacao}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 py-2.5 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{entry.data}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{entry.horarioInicio} às {entry.horarioFim}</span>
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
