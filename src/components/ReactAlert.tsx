"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X
} from "lucide-react";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AppAlertItem {
  id: number;
  variant: AlertVariant;
  title: string;
  message: string;
}

const VARIANT_STYLES: Record<
  AlertVariant,
  {
    container: string;
    iconColor: string;
    titleColor: string;
    badgeBg: string;
    Icon: React.ElementType;
    defaultTitle: string;
  }
> = {
  success: {
    container: "bg-zinc-900/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-300",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    Icon: CheckCircle2,
    defaultTitle: "Sucesso"
  },
  error: {
    container: "bg-zinc-900/95 border-red-500/40 text-red-200 shadow-red-950/40",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
    badgeBg: "bg-red-500/15 border-red-500/30",
    Icon: XCircle,
    defaultTitle: "Erro na Operação"
  },
  warning: {
    container: "bg-zinc-900/95 border-amber-500/40 text-amber-200 shadow-amber-950/40",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    Icon: AlertTriangle,
    defaultTitle: "Atenção"
  },
  info: {
    container: "bg-zinc-900/95 border-indigo-500/40 text-indigo-200 shadow-indigo-950/40",
    iconColor: "text-indigo-400",
    titleColor: "text-indigo-300",
    badgeBg: "bg-indigo-500/15 border-indigo-500/30",
    Icon: Info,
    defaultTitle: "Informação"
  }
};

export function getDefaultAlertTitle(variant: AlertVariant): string {
  return VARIANT_STYLES[variant].defaultTitle;
}

interface ReactAlertBannerProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ReactAlertBanner({
  variant,
  title,
  message,
  onClose,
  children
}: ReactAlertBannerProps) {
  const style = VARIANT_STYLES[variant];
  const Icon = style.Icon;

  return (
    <div
      role="alert"
      className={`w-full p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-lg text-xs flex items-start gap-3 animate-in fade-in duration-200 ${style.container}`}
    >
      <div className={`p-1.5 rounded-xl border shrink-0 mt-0.5 ${style.badgeBg}`}>
        <Icon className={`w-4 h-4 ${style.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className={`font-bold text-xs wrap-break-word ${style.titleColor}`}>
          {title || style.defaultTitle}
        </div>
        <p className="text-zinc-200 leading-relaxed wrap-break-word">{message}</p>
        {children && <div className="pt-1.5">{children}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar alerta"
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface ReactAlertContainerProps {
  alerts: AppAlertItem[];
  onDismiss: (id: number) => void;
}

export function ReactAlertContainer({
  alerts,
  onDismiss
}: ReactAlertContainerProps) {
  if (alerts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 z-100 sm:w-96 max-w-full flex flex-col gap-2.5 pointer-events-none"
    >
      {alerts.map((alertItem) => {
        const style = VARIANT_STYLES[alertItem.variant];
        const Icon = style.Icon;

        return (
          <div
            key={alertItem.id}
            role="alert"
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 animate-in fade-in duration-200 ${style.container}`}
          >
            <div className={`p-2 rounded-xl border shrink-0 ${style.badgeBg}`}>
              <Icon className={`w-4 h-4 ${style.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold wrap-break-word ${style.titleColor}`}>
                {alertItem.title}
              </p>
              <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed wrap-break-word">
                {alertItem.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(alertItem.id)}
              aria-label="Fechar notificação"
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
