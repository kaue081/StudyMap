"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudyMap } from "../../context/StudyMapContext";
import { ReactAlertBanner } from "../../components/ReactAlert";
import {
  Settings,
  User,
  Mail,
  Hash,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Calendar,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  ArrowRight
} from "lucide-react";

export default function ConfiguracoesPage() {
  const {
    currentUser,
    spaces,
    roleTokens,
    applyRoleToken,
    updateCurrentPassword,
    reservations,
    showAlert
  } = useStudyMap();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [tokenInput, setTokenInput] = useState("");
  const [selectedMonitorSpaceId, setSelectedMonitorSpaceId] = useState<number>(
    currentUser?.espacoMonitoriaId || 1
  );
  const [tokenFeedback, setTokenFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (!currentUser) return null;

  const freeAdmin1Tokens = roleTokens.filter((t) => !t.usadoPorEmail);

  const userReservations = reservations.filter(
    (r) =>
      r.usuarioId === currentUser.id ||
      (r.usuarioEmail && r.usuarioEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      r.usuarioNome.toLowerCase() === currentUser.nome.toLowerCase()
  );
  const activeUserReservations = userReservations.filter((r) => r.status !== "cancelada");

  const roleBadge =
    currentUser.perfil === "aluno"
      ? {
          label: "Aluno (Padrão pós-cadastro)",
          badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          iconBg: "from-indigo-600 to-purple-600",
          Icon: GraduationCap
        }
      : currentUser.perfil === "monitor"
      ? {
          label: "Monitor Validado por Token",
          badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          iconBg: "from-cyan-600 to-indigo-600",
          Icon: ShieldCheck
        }
      : {
          label: "Administrador Validado por Token",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          iconBg: "from-purple-600 to-indigo-600",
          Icon: KeyRound
        };

  const RoleIcon = roleBadge.Icon;

  const handleApplyToken = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenFeedback(null);

    const chosenSpace = spaces.find((s) => s.id === selectedMonitorSpaceId);
    const res = applyRoleToken(
      tokenInput,
      chosenSpace ? { id: chosenSpace.id, nome: chosenSpace.nome } : undefined
    );
    if (!res.success) {
      setTokenFeedback({ type: "error", message: res.message });
      showAlert({
        variant: "error",
        title: "Token Não Validado",
        message: res.message
      });
      return;
    }

    setTokenInput("");
    setTokenFeedback({ type: "success", message: res.message });
    showAlert({
      variant: "success",
      title:
        res.newRole === "admin"
          ? "Perfil Elevado para Administrador"
          : "Perfil Elevado para Monitor",
      message: res.message
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (novaSenha !== confirmarNovaSenha) {
      const msg = "A confirmação da nova senha não coincide com a senha digitada.";
      setPasswordFeedback({ type: "error", message: msg });
      showAlert({
        variant: "error",
        title: "Senhas Diferentes",
        message: msg
      });
      return;
    }

    const result = updateCurrentPassword(novaSenha);
    if (!result.success) {
      setPasswordFeedback({ type: "error", message: result.message });
      showAlert({
        variant: "error",
        title: "Não Foi Possível Atualizar",
        message: result.message
      });
      return;
    }

    setNovaSenha("");
    setConfirmarNovaSenha("");
    setPasswordFeedback({ type: "success", message: result.message });
    showAlert({
      variant: "success",
      title: "Senha Atualizada",
      message: result.message
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Cabeçalho da Página de Configurações */}
      <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Configurações da Conta</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
              Gerencie seus dados, visualize/atualize sua senha e valide tokens para elevar seu perfil para Monitor ou Administrador
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3.5 py-2 rounded-xl border self-start md:self-auto flex items-center gap-2 max-w-full ${roleBadge.badgeClass}`}>
          <RoleIcon className="w-4 h-4 shrink-0" />
          <span className="wrap-break-word">{roleBadge.label}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Coluna Esquerda: Dados do Usuário & Senha Atual */}
        <div className="lg:col-span-5 glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-white/10 shadow-2xl space-y-5 sm:space-y-6 min-w-0">
          <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-white/10 min-w-0">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-tr ${roleBadge.iconBg} flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0`}>
              <RoleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white wrap-break-word">
                {currentUser.nome}
              </h3>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">
                Perfil Atual:{" "}
                {currentUser.perfil === "aluno"
                  ? "Aluno"
                  : currentUser.perfil === "monitor"
                  ? "Monitor"
                  : "Administrador"}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-1 min-[400px]:gap-2 p-3 sm:p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 min-w-0">
              <span className="text-zinc-400 flex items-center gap-2 shrink-0">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                Nome:
              </span>
              <span className="font-bold text-white wrap-break-word min-[400px]:text-right">
                {currentUser.nome}
              </span>
            </div>

            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-1 min-[400px]:gap-2 p-3 sm:p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 min-w-0">
              <span className="text-zinc-400 flex items-center gap-2 shrink-0">
                <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
                Matrícula:
              </span>
              <span className="font-mono font-bold text-white break-all min-[400px]:text-right">
                {currentUser.matricula || "Não informada"}
              </span>
            </div>

            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-1 min-[400px]:gap-2 p-3 sm:p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 min-w-0">
              <span className="text-zinc-400 flex items-center gap-2 shrink-0">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                E-mail:
              </span>
              <span className="font-semibold text-white break-all min-[400px]:truncate">
                {currentUser.email}
              </span>
            </div>

            {currentUser.token && (
              <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-1 min-[400px]:gap-2 p-3 sm:p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 min-w-0">
                <span className="text-emerald-300 flex items-center gap-2 shrink-0 font-semibold">
                  <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                  Token Vinculado:
                </span>
                <span className="font-mono font-bold text-emerald-300 break-all">
                  {currentUser.token}
                </span>
              </div>
            )}

            {currentUser.espacoMonitoria && (
              <div className="flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 min-w-0">
                <span className="text-cyan-300 flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  Local Registrado da Monitoria:
                </span>
                <span className="font-bold text-white wrap-break-word">
                  {currentUser.espacoMonitoria}
                </span>
              </div>
            )}

            {/* Visualizar Senha Atual */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  Minha Senha Atual
                </span>
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition shrink-0"
                >
                  {showCurrentPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      Ocultar Senha
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      Ver Senha Atual
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-white bg-zinc-900/80 px-3.5 py-2.5 rounded-xl border border-white/5 break-all">
                {showCurrentPassword
                  ? currentUser.senha
                  : "•".repeat(Math.max(8, currentUser.senha.length))}
              </div>
            </div>
          </div>

          {/* Resumo rápido de Reservas & Atalho do Monitor */}
          <div className="space-y-2.5">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-zinc-400 block">Suas reservas ativas</span>
                <strong className="text-base sm:text-lg text-white">
                  {activeUserReservations.length} agendamento(s)
                </strong>
              </div>
              <Link
                href="/reservas"
                className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition w-full sm:w-auto"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Ver Reservas
              </Link>
            </div>

            {currentUser.perfil !== "aluno" && (
              <Link
                href="/monitoria"
                className="flex items-center justify-center gap-2 w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/35 text-cyan-200 font-bold text-xs py-3 px-4 rounded-2xl transition"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Acessar Painel do Monitor (Destinos &amp; Check-ins)</span>
              </Link>
            )}

            {currentUser.perfil === "admin" && (
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 w-full bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/40 text-purple-200 font-bold text-xs py-3 px-4 rounded-2xl transition"
              >
                <KeyRound className="w-4 h-4 text-purple-300 shrink-0" />
                <span>Acessar Painel Geral do Administrador</span>
              </Link>
            )}
          </div>
          
          {/* Botão no Final das Configurações: Conhecer a Equipe (Todos os Perfis) */}
          <div className="pt-2 pb-4 flex justify-center sm:justify-end min-w-0">
        <Link
          href="/equipe"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-indigo-500/25 border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Users className="w-4 h-4 shrink-0 text-white" />
          <span>Conhecer a Equipe Desenvolvedora</span>
          <ArrowRight className="w-4 h-4 shrink-0 text-white" />
        </Link>
      </div>
        </div>

        {/* Coluna Direita: Validação de Token de Perfil (Apenas Admin) + Atualização de Senha */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0">
          {/* Card 1: Token disponibilizado pelo Admin 1 (Retirado do perfil Aluno e Monitor conforme solicitado) */}
          {currentUser.perfil === "admin" && (
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-indigo-500/30 shadow-2xl space-y-5 min-w-0">
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      Validação de Token Institucional (Disponibilizado pelo Admin 1)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Painel administrativo para validação e testes de tokens institucionais emitidos.
                    </p>
                  </div>
                </div>
              </div>

              {tokenFeedback && (
                <ReactAlertBanner
                  variant={tokenFeedback.type}
                  title={
                    tokenFeedback.type === "success"
                      ? "Perfil Atualizado com Sucesso"
                      : "Token Inválido"
                  }
                  message={tokenFeedback.message}
                  onClose={() => setTokenFeedback(null)}
                />
              )}

              <form onSubmit={handleApplyToken} className="space-y-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Código do Token Disponibilizado pelo Admin 1
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Ex: MON-2026-201 ou ADM-2026-201"
                      className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 transition font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Local de Registro da Monitoria (aplicado para tokens de Monitor)
                  </label>
                  <select
                    value={selectedMonitorSpaceId}
                    onChange={(e) => setSelectedMonitorSpaceId(Number(e.target.value))}
                    className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id}>
                        {space.nome} ({space.bloco})
                      </option>
                    ))}
                  </select>
                </div>

                {freeAdmin1Tokens.length > 0 && (
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-400 block">
                      Tokens livres emitidos por Coordenação Geral (Admin 1) para testes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {freeAdmin1Tokens.map((tok) => (
                        <button
                          key={tok.codigo}
                          type="button"
                          onClick={() => setTokenInput(tok.codigo)}
                          className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition ${
                            tok.perfilDestino === "monitor"
                              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25"
                              : "bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25"
                          }`}
                        >
                          {tok.codigo} ({tok.perfilDestino === "monitor" ? "Monitor" : "Admin"})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Validar Token e Atualizar Perfil</span>
                </button>
              </form>
            </div>
          )}

          {/* Card 2: Atualizar Senha Atual */}
          <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-white/10 shadow-2xl space-y-5 min-w-0">
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white">
                    Atualizar Senha de Acesso
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Altere sua senha a qualquer momento com salvamento criptografado no LocalStorage
                  </p>
                </div>
              </div>
            </div>

            {passwordFeedback && (
              <ReactAlertBanner
                variant={passwordFeedback.type}
                title={passwordFeedback.type === "success" ? "Senha Atualizada" : "Atenção"}
                message={passwordFeedback.message}
                onClose={() => setPasswordFeedback(null)}
              />
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nova Senha (mín. 6 caracteres)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Nova senha"
                      className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmarNovaSenha}
                      onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                      placeholder="Confirme a senha"
                      className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Atualizar Senha Agora</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      
      
    </div>
  );
}
