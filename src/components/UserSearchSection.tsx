"use client";

import React, { useState } from "react";
import { UserAccount, UserRole, UserSearchField } from "../types";
import {
  Search,
  Users,
  Mail,
  Hash,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  X,
  Filter,
  MapPin
} from "lucide-react";

interface UserSearchSectionProps {
  searchUsers: (
    query: string,
    field?: UserSearchField,
    roleFilter?: UserRole | "todos"
  ) => UserAccount[];
  currentUser?: UserAccount | null;
  compact?: boolean;
}

export function UserSearchSection({
  searchUsers,
  currentUser,
  compact = false
}: UserSearchSectionProps) {
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<UserSearchField>("todos");
  const [roleFilter, setRoleFilter] = useState<UserRole | "todos">("todos");

  const results = searchUsers(query, searchField, roleFilter);

  const searchFields: { id: UserSearchField; label: string }[] = [
    { id: "todos", label: "Matrícula, Nome ou E-mail" },
    { id: "matricula", label: "Apenas Matrícula" },
    { id: "nome", label: "Apenas Nome" },
    { id: "email", label: "Apenas E-mail" }
  ];

  const roleOptions: { id: UserRole | "todos"; label: string }[] = [
    { id: "todos", label: "Todos os Perfis" },
    { id: "aluno", label: "Alunos" },
    { id: "monitor", label: "Monitores" },
    { id: "admin", label: "Administradores" }
  ];

  const getRoleBadge = (role: UserRole) => {
    if (role === "aluno") {
      return {
        label: "Aluno",
        classes: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        avatarBg: "from-indigo-600 to-blue-600",
        Icon: GraduationCap
      };
    }
    if (role === "monitor") {
      return {
        label: "Monitor",
        classes: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        avatarBg: "from-cyan-600 to-teal-600",
        Icon: ShieldCheck
      };
    }
    return {
      label: "Administrador",
      classes: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      avatarBg: "from-purple-600 to-fuchsia-600",
      Icon: KeyRound
    };
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const clearFilters = () => {
    setQuery("");
    setSearchField("todos");
    setRoleFilter("todos");
  };

  return (
    <div
      className={`glass rounded-2xl sm:rounded-3xl ${
        compact ? "p-4 sm:p-6" : "p-4 sm:p-6 md:p-8"
      } border border-white/10 shadow-2xl space-y-5 sm:space-y-6 w-full min-w-0`}
    >
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className={`${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"} font-bold text-white`}>
              Diretório e Busca de Usuários
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
              Consulte alunos, monitores e administradores pela matrícula, nome ou e-mail
            </p>
          </div>
        </div>

        <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-full font-semibold self-start sm:self-auto shrink-0">
          {results.length} {results.length === 1 ? "registro encontrado" : "registros encontrados"}
        </span>
      </div>

      {/* Controles de Busca e Filtros */}
      <div className="space-y-4 bg-zinc-900/50 p-3.5 sm:p-5 rounded-2xl border border-white/5 min-w-0">
        <div className="relative min-w-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchField === "matricula"
                ? "Digite o número da matrícula (ex: 20261001, ADM-0001)..."
                : searchField === "nome"
                ? "Digite o nome do aluno, monitor ou administrador..."
                : searchField === "email"
                ? "Digite o endereço de e-mail institucional..."
                : "Pesquisar por matrícula, nome completo ou e-mail..."
            }
            className="w-full min-w-0 bg-zinc-800/90 border border-zinc-700/70 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              title="Limpar pesquisa"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1">
          {/* Seletor de Campo de Busca — Flex Wrap sem scroll lateral */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
              <Search className="w-3 h-3 text-indigo-400 shrink-0" /> Buscar por:
            </span>
            {searchFields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setSearchField(field.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  searchField === field.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-zinc-800/60 text-zinc-400 hover:text-white border border-zinc-700/50"
                }`}
              >
                {field.label}
              </button>
            ))}
          </div>

          {/* Filtro por Perfil — Flex Wrap sem scroll lateral */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-400 shrink-0" /> Perfil:
            </span>
            {roleOptions.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setRoleFilter(role.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  roleFilter === role.id
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "bg-zinc-800/40 text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Resultados */}
      {results.length === 0 ? (
        <div className="text-center py-12 px-4 bg-zinc-900/40 rounded-2xl sm:rounded-3xl border border-dashed border-zinc-800 space-y-3">
          <Search className="w-10 h-10 mx-auto text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-300">
            Nenhum usuário encontrado para a busca informada
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Verifique se a matrícula, o nome ou o e-mail foram digitados corretamente ou altere os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition"
          >
            Limpar Filtros de Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((user) => {
            const badge = getRoleBadge(user.perfil);
            const RoleIcon = badge.Icon;
            const isCurrentUser = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 min-w-0 ${
                  isCurrentUser
                    ? "bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-950/30"
                    : "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-3 min-w-0">
                  {/* Topo do Card: Avatar e Perfil */}
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl bg-linear-to-br ${badge.avatarBg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}
                      >
                        {getInitials(user.nome)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white wrap-break-word" title={user.nome}>
                          {user.nome}
                        </h3>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold text-emerald-400 block">
                            • Sessão Atual
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 shrink-0 ${badge.classes}`}
                    >
                      <RoleIcon className="w-3 h-3 shrink-0" />
                      {badge.label}
                    </span>
                  </div>

                  {/* Dados de Matrícula e E-mail */}
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 bg-zinc-800/50 px-3 py-2 rounded-xl border border-white/5">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        Matrícula:
                      </span>
                      <span className="font-mono font-bold text-white break-all">
                        {user.matricula || "Não informada"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/30 border border-white/5 text-zinc-300 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="break-all sm:truncate" title={user.email}>
                        {user.email}
                      </span>
                    </div>

                    {user.espacoMonitoria && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="wrap-break-word" title={user.espacoMonitoria}>
                          {user.espacoMonitoria}
                        </span>
                      </div>
                    )}

                    {currentUser?.perfil === "admin" && user.token && (
                      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          Token:
                        </span>
                        <span className="font-mono font-bold break-all">{user.token}</span>
                      </div>
                    )}
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
