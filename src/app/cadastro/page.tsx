"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudyMap } from "../../context/StudyMapContext";
import { ReactAlertBanner } from "../../components/ReactAlert";
import {
  MapPin,
  UserPlus,
  User,
  Hash,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

export default function CadastroAlunoPage() {
  const router = useRouter();
  const { registerAluno, showAlert } = useStudyMap();

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (senha !== confirmarSenha) {
      const msg = "A confirmação de senha não coincide com a senha digitada.";
      setErrorMessage(msg);
      showAlert({
        variant: "error",
        title: "Senhas Diferentes",
        message: msg
      });
      return;
    }

    const result = registerAluno({
      nome,
      matricula,
      email,
      senha
    });

    if (!result.success) {
      setErrorMessage(result.message);
      showAlert({
        variant: "error",
        title: "Falha no Cadastro",
        message: result.message
      });
      return;
    }

    showAlert({
      variant: "success",
      title: "Cadastro Realizado",
      message: result.message
    });
    router.push("/");
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-3 py-6 sm:p-6 overflow-x-clip">
      <div className="w-full max-w-lg glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6">
        {/* Cabeçalho Centralizado */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 pb-2 border-b border-white/10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Criar Conta
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Cadastre-se no StudyMap com seu e-mail único
            </p>
          </div>
        </div>

        <ReactAlertBanner
          variant="info"
          title="Perfil Inicial: Aluno"
          message="Após o cadastro, sua conta terá o perfil de Aluno. Caso possua um token de Monitor ou Administrador, basta inseri-lo dentro de Configurações após entrar."
        />

        {errorMessage && (
          <ReactAlertBanner
            variant="error"
            title="Não foi possível concluir o cadastro"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nome Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Ana Clara Rodrigues"
                className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Número da Matrícula
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Ex: 20261099"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                E-mail (Único)
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Senha (mín. 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Crie uma senha"
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
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full min-w-0 bg-zinc-800/80 border border-zinc-700/70 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm mt-2"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Finalizar Cadastro e Entrar</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-center text-xs text-zinc-400 text-center">
          <span>
            Já possui uma conta?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
              Fazer Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
