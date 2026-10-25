"use client";

import React from "react";
import { useStudyMap } from "../context/StudyMapContext";
import { DashboardStats } from "../components/DashboardStats";
import { InteractiveHeatmap } from "../components/InteractiveHeatmap";

export default function DashboardPage() {
  const { spaces, reservations, waitlist, openDetailModal } = useStudyMap();

  return (
    <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0">
      <DashboardStats
        spaces={spaces}
        reservations={reservations}
        waitlist={waitlist}
      />

      <InteractiveHeatmap
        spaces={spaces}
        onSelectSpace={(space) => openDetailModal(space)}
      />
    </div>
  );
}
