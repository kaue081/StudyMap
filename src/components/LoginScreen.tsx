"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginCredentials, UserAccount } from "../types";
import { ReactAlertBanner } from "./ReactAlert";
import {
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";

interface LoginScreenProps {
  onLogin: (credentials: LoginCredentials) => {
    success: boolean;
    message: string;
    user?: UserAccount;
  };
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = onLogin({ email, senha });
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-3 py-6 sm:p-6 overflow-x-clip">
      <div className="w-full max-w-md glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6">
        {/* Identidade Visual Centralizada */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 pb-2 border-b border-white/10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              StudyMap
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Entre com seu e-mail e senha para acessar o sistema
            </p>
          </div>
        </div>

        {/* Alerta do React em caso de Erro */}
        {errorMessage && (
          <ReactAlertBanner
            variant="error"
            title="Falha no Login"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {/* Formulário de Login (apenas E-mail e Senha) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@studymap.edu.br"
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Senha
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Ocultar senha" : "Ver senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full font-bold py-3.5 px-5 rounded-2xl text-white text-sm bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            Entrar
          </button>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-zinc-400 text-center">
            <span>
              Não possui uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                Criar cadastro
              </Link>
            </span>
            <Link
              href="/recuperar-senha"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline transition"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
