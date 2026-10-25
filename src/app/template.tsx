"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="relative w-full min-w-0">
      {/* Barra superior animada de transição entre páginas */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-0.5 z-90 pointer-events-none overflow-hidden"
      >
        <div className="h-full w-full bg-linear-to-r from-indigo-500 via-cyan-400 to-purple-500 page-route-progress" />
      </div>

      {/* Container com animação fluida de entrada da página */}
      <div className="page-transition-enter w-full min-w-0">{children}</div>
    </div>
  );
}
