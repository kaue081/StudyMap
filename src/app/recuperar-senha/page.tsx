"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudyMap } from "../../context/StudyMapContext";
import { ReactAlertBanner } from "../../components/ReactAlert";
import {
  KeyRound,
  Mail,
  Hash,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export default function RecuperarSenhaPage() {
  const { verifyRecoveryIdentity, resetPassword, showAlert } = useStudyMap();

  const [step, setStep] = useState<"verify" | "reset" | "done">("verify");
  const [email, setEmail] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = verifyRecoveryIdentity(email, identificador);
    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      showAlert({
        variant: "error",
        title: "Identidade Não Confirmada",
        message: res.message
      });
      return;
    }

    setVerifiedName(res.user.nome);
    setSuccessMessage(res.message);
    showAlert({
      variant: "info",
      title: "Identidade Verificada",
      message: res.message
    });
    setStep("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (novaSenha !== confirmarNovaSenha) {
      const msg = "A confirmação de senha não coincide com a nova senha.";
      setErrorMessage(msg);
      showAlert({
        variant: "error",
        title: "Senhas Diferentes",
        message: msg
      });
      return;
    }

    const res = resetPassword(email, identificador, novaSenha);
    if (!res.success) {
      setErrorMessage(res.message);
      showAlert({
        variant: "error",
        title: "Falha ao Redefinir Senha",
        message: res.message
      });
      return;
    }

    setSuccessMessage(res.message);
    showAlert({
      variant: "success",
      title: "Senha Redefinida",
      message: res.message
    });
    setStep("done");
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-3 py-6 sm:p-6 overflow-x-clip">
      <div className="w-full max-w-md glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6">
        {/* Cabeçalho Centralizado */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 pb-2 border-b border-white/10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Recuperação de Senha
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Valide sua matrícula e seu e-mail para redefinir sua senha
            </p>
          </div>
        </div>

        {errorMessage && (
          <ReactAlertBanner
            variant="error"
            title="Atenção"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: caua.lima@studymap.edu.br"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Número da Matrícula (ou Token)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  placeholder="Ex: 20261001, MON-2026-101 ou ADM-2026-001"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Validar Identidade
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <ReactAlertBanner
              variant="success"
              title={`Conta verificada: ${verifiedName}`}
              message={successMessage || "Defina sua nova senha abaixo."}
            />

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nova Senha (mín. 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              Salvar Nova Senha
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Senha Atualizada!</h2>
            <p className="text-xs sm:text-sm text-zinc-300 wrap-break-word">
              {successMessage}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm"
            >
              Ir para o Login
            </Link>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
          Lembrou sua senha?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
            Voltar para Login
          </Link>
        </div>
      </div>
    </div>
  );
}
