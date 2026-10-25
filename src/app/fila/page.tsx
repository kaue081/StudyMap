"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { WaitlistSection } from "../../components/WaitlistSection";

export default function FilaEsperaPage() {
  const { waitlist, spaces, currentUser, removeFromWaitlist, showAlert } = useStudyMap();

  return (
    <div className="animate-in fade-in duration-300">
      <WaitlistSection
        waitlist={waitlist}
        spaces={spaces}
        currentUser={currentUser}
        onRemove={(id) => {
          removeFromWaitlist(id);
          showAlert({
            variant: "info",
            title: "Removido da Fila de Espera",
            message: "Sua solicitação foi removida da fila de espera e as posições restantes foram atualizadas."
          });
        }}
      />
    </div>
  );
}
