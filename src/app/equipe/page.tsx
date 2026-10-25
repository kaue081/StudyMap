"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  ExternalLink,
  Layers,
  GraduationCap,
  Heart
} from "lucide-react";

interface DeveloperMember {
  nome: string;
  papel: string;
  descricao: string;
  githubUrl: string;
  githubUser: string;
  fotoUrl: string;
  iniciais: string;
  gradiente: string;
  tecnologias: string[];
}

const equipeMembros: DeveloperMember[] = [
  {
    nome: "Charles Kaue Barbosa da Silva",
    papel: "Líder Técnico & Arquiteto Front-end",
    descricao:
      "Responsável pela arquitetura modular em Next.js 16 e React 19, persistência com LocalStorage criptografado, sistema de controle de acesso por tokens e responsividade multi-dispositivo.",
    githubUrl: "https://github.com/kaue081",
    githubUser: "@kaue081",
    fotoUrl: "/equipe/kaue.jpg",
    iniciais: "CK",
    gradiente: "from-indigo-600 to-purple-600",
    tecnologias: ["Next.js", "React 19", "TypeScript", "Tailwind CSS v4", "Web Crypto"]
  },
  {
    nome: "Caua Henrique Pinto de Lima",
    papel: "Desenvolvedor Front-end & Lógica de Negócios",
    descricao:
      "Atuou na modelagem dos espaços acadêmicos, regras de reserva de salas, fluxo de check-in e critérios de recomendação inteligente do assistente.",
    githubUrl: "https://github.com/henrique699198-creator",
    githubUser: "@henrique699198-creator",
    fotoUrl: "/equipe/cauahenrique.jpeg",
    iniciais: "CL",
    gradiente: "from-cyan-600 to-blue-600",
    tecnologias: ["React", "TypeScript", "Business Logic", "State Management"]
  },
  {
    nome: "Emanuel da Silva Correia",
    papel: "Desenvolvedor Front-end & UI/UX Designer",
    descricao:
      "Idealizou a identidade visual em glassmorphism, paleta de cores escura com contraste acessível, mapa térmico de ocupação em tempo real e microinterações intuitivas.",
    githubUrl: "https://github.com/emanueldasilvacorreia1413-debug",
    githubUser: "@emanueldasilvacorreia1413-debug",
    fotoUrl: "/equipe/emanuel.jpeg",
    iniciais: "EC",
    gradiente: "from-emerald-600 to-teal-600",
    tecnologias: ["UI/UX Design", "Tailwind CSS", "Figma", "Accessibility"]
  },
  {
    nome: "Pedro Inacio Monteiro Silva",
    papel: "Desenvolvedor Front-end & Gestão de Dados",
    descricao:
      "Desenvolveu a gestão das filas de espera em tempo real, painéis de avisos institucionais para locais de estudo e formulários de agendamento validados.",
    githubUrl: "https://github.com/pedroinacio68",
    githubUser: "@pedroinacio68",
    fotoUrl: "/equipe/pedroInacio.jpeg",
    iniciais: "PI",
    gradiente: "from-amber-600 to-orange-600",
    tecnologias: ["Data Flow", "Form Validation", "Context API", "Components"]
  },
];

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function MemberAvatar({
  src,
  alt,
  initials,
  gradient
}: {
  src?: string;
  alt: string;
  initials: string;
  gradient: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-tr ${gradient} flex items-center justify-center font-bold text-xl sm:text-2xl text-white shadow-lg border border-white/20 shrink-0`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/20 shadow-lg shrink-0 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export default function EquipePage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0 max-w-full pb-10">
      {/* Botão Superior de Navegação & Voltar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/configuracoes"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Voltar às Configurações</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30"
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Ir para o Dashboard</span>
        </Link>
      </div>

      {/* Cabeçalho Principal com Título Relacionado ao Projeto */}
      <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/10 shadow-2xl relative overflow-hidden bg-linear-to-br from-indigo-950/40 via-zinc-900/60 to-purple-950/40 min-w-0">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Projeto S.C.O.P.E. • Turma 2 DSA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight wrap-break-word">
            Equipe Desenvolvedora do{" "}
            <span className="bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              StudyMap
            </span>
          </h1>

          <p className="text-xs sm:text-sm sm:leading-relaxed text-zinc-300 wrap-break-word">
            O <strong>StudyMap</strong> é um sistema web front-end de gerenciamento inteligente,
            localização, monitoria e reserva de espaços de estudo acadêmicos. Esta aplicação foi
            conduzida e desenvolvida com dedicação pelos alunos da turma 2 DSA, incorporando recursos
            como persistência local criptografada, recomendações inteligentes, controle de lotação e
            gestão de perfis por token institucional.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://github.com/kaue081/StudyMap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition shadow-lg"
            >
              <GithubIcon className="w-4 h-4 shrink-0" />
              <span>Ver Repositório no GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
            </a>

            <span className="text-[11px] text-zinc-400 px-3 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
              Versão 0.1.0 • 2026
            </span>
          </div>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Grid de Membros da Equipe */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-5 h-5 text-indigo-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Integrantes & Contribuidores
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            {equipeMembros.length} membros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {equipeMembros.map((membro) => (
            <div
              key={membro.nome}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 min-w-0 bg-zinc-900/50"
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Foto com Avatar Fallback */}
                <MemberAvatar
                  src={membro.fotoUrl}
                  alt={membro.nome}
                  initials={membro.iniciais}
                  gradient={membro.gradiente}
                />

                {/* Detalhes do Integrante */}
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white wrap-break-word">
                    {membro.nome}
                  </h3>
                  <div className="inline-block text-[11px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-0.5 rounded-lg wrap-break-word">
                    {membro.papel}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1.5 wrap-break-word">
                    {membro.descricao}
                  </p>
                </div>
              </div>

              {/* Tecnologias & Ações */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {membro.tecnologias.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-zinc-400 font-mono">
                    {membro.githubUser}
                  </span>

                  {/* Link Obrigatório para o GitHub */}
                  <a
                    href={membro.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-indigo-600 text-white text-xs font-semibold border border-zinc-700/70 hover:border-indigo-500 transition shadow-sm group/btn"
                  >
                    <GithubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Perfil no GitHub</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cartão de Encerramento / Resumo Didático */}
      <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/10 text-center space-y-3 bg-linear-to-r from-zinc-900/60 via-purple-950/20 to-zinc-900/60 min-w-0">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Heart className="w-5 h-5 text-pink-400" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Desenvolvido com excelência técnica para o ambiente acadêmico
        </h3>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed wrap-break-word">
          O projeto StudyMap integra boas práticas de desenvolvimento front-end com Next.js 16,
          design responsivo voltado para celulares, tablets e computadores, e arquitetura de dados
          desacoplada com segurança de armazenamento no navegador.
        </p>
      </div>
    </div>
  );
}
