"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAccount } from "../types";
import {
  MapPin,
  Sparkles,
  Calendar,
  Layers,
  Users,
  RotateCcw,
  Search,
  LogOut,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  Settings,
  Menu,
  X
} from "lucide-react";

interface HeaderProps {
  reservationCount: number;
  waitlistCount: number;
  usersCount: number;
  currentUser: UserAccount;
  onLogout: () => void;
  onReset: () => void;
}

export function Header({
  reservationCount,
  waitlistCount,
  usersCount,
  currentUser,
  onLogout,
  onReset
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canViewUsers = currentUser.perfil !== "aluno";
  const isAdmin = currentUser.perfil === "admin";

  const navItems = [
    { href: "/", label: "Dashboard", icon: Layers },
    { href: "/espacos", label: "Espaços & Mapa", icon: MapPin },
    { href: "/ia", label: "Assistente IA", icon: Sparkles },
    { href: "/reservas", label: "Minhas Reservas", icon: Calendar, badge: reservationCount },
    { href: "/fila", label: "Fila de Espera", icon: Users, badge: waitlistCount },
    ...(canViewUsers
      ? [
          { href: "/monitoria", label: "Painel do Monitor", icon: ShieldCheck },
          { href: "/usuarios", label: "Usuários & Busca", icon: Search, badge: usersCount }
        ]
      : []),
    ...(isAdmin
      ? [{ href: "/admin", label: "Painel do Admin", icon: KeyRound }]
      : []),
    { href: "/configuracoes", label: "Configurações", icon: Settings }
  ];

  const activeNavItem =
    navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    ) || navItems[0];
  const ActiveIcon = activeNavItem.icon;

  const roleStyle =
    currentUser.perfil === "aluno"
      ? {
          classes: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
          Icon: GraduationCap
        }
      : currentUser.perfil === "monitor"
      ? {
          classes: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
          Icon: ShieldCheck
        }
      : {
          classes: "bg-purple-500/15 border-purple-500/30 text-purple-300",
          Icon: KeyRound
        };

  const RoleIcon = roleStyle.Icon;

  return (
    <header className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl backdrop-blur-xl w-full min-w-0">
      {/* Linha Superior: Identidade Visual + Botão Mobile / Ações Tablet & PC */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 md:pb-5 md:border-b md:border-white/10">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white group-hover:text-indigo-300 transition">
                  StudyMap
                </h1>
              </div>
              <p className="hidden sm:block text-xs lg:text-sm text-zinc-400 mt-0.5">
                Localização, consulta inteligente e gestão de espaços de estudo
              </p>
            </div>
          </Link>

          {/* Botão Hambúrguer Exclusivo para Celular (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/70 text-xs font-semibold transition shrink-0"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Fechar</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Barra de Página Atual no Celular quando o menu está recolhido */}
        {!mobileMenuOpen && (
          <div className="flex md:hidden items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold min-w-0">
              <ActiveIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{activeNavItem.label}</span>
            </div>

            <Link
              href="/configuracoes"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold max-w-[55%] ${roleStyle.classes}`}
            >
              <RoleIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-white">{currentUser.nome}</span>
            </Link>
          </div>
        )}

        {/* Controles de Conta e Sessão (Visíveis em Tablet & PC: >= md) */}
        <div className="hidden md:flex flex-wrap items-center gap-2.5">
          <Link
            href="/configuracoes"
            title="Abrir Configurações (Senha e Token de Perfil)"
            className={`flex items-center gap-2.5 border px-3.5 py-2 rounded-xl text-xs hover:brightness-110 transition min-w-0 max-w-full ${roleStyle.classes}`}
          >
            <RoleIcon className="w-4 h-4 shrink-0" />
            <div className="leading-tight min-w-0">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="truncate max-w-52">{currentUser.nome}</span>
              </div>
              <div className="text-[11px] opacity-80 truncate max-w-60">
                {currentUser.matricula
                  ? `Matrícula: ${currentUser.matricula}`
                  : currentUser.email}
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onReset}
            title="Redefinir dados para o padrão do escopo"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3.5 py-2.5 rounded-xl transition border border-zinc-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            title="Encerrar sessão atual"
            className="flex items-center gap-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-500/10 hover:bg-red-600/80 border border-red-500/30 px-3.5 py-2.5 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Menu Expansível para Celular (< md) — Zero Scroll Lateral */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 mt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
          {/* Card do Usuário no Menu Mobile */}
          <Link
            href="/configuracoes"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 border p-3 rounded-xl text-xs transition min-w-0 ${roleStyle.classes}`}
          >
            <RoleIcon className="w-4 h-4 shrink-0" />
            <div className="leading-tight min-w-0 flex-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="truncate">{currentUser.nome}</span>
              </div>
              <div className="text-[11px] opacity-80 truncate">
                {currentUser.matricula
                  ? `Matrícula: ${currentUser.matricula}`
                  : currentUser.email}
              </div>
            </div>
          </Link>

          {/* Links de Navegação em Grid Responsivo */}
          <nav className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-w-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-white/5 border border-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive ? "bg-white text-indigo-700" : "bg-indigo-500/30 text-indigo-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Ações de Sessão Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onReset();
              }}
              className="flex items-center justify-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 px-3 py-2.5 rounded-xl transition border border-zinc-700/60 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Restaurar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-500/15 hover:bg-red-600/80 border border-red-500/30 px-3 py-2.5 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Navegação Tablet (Grid adaptativo) & PC (Flex Wrap) — Zero Scroll Lateral */}
      <nav
        className={`hidden md:grid ${
          currentUser.perfil === "monitor" ? "md:grid-cols-4" : "md:grid-cols-3"
        } xl:flex xl:flex-wrap items-center gap-2 pt-4`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center xl:justify-start gap-2 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-all min-w-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 bg-zinc-900/30 xl:bg-transparent border border-white/5 xl:border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive ? "bg-white text-indigo-700" : "bg-indigo-500/30 text-indigo-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
