"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { RecommendationAssistant } from "../../components/RecommendationAssistant";

export default function AssistenteIAPage() {
  const { getRecommendation, openReservationModal, openDetailModal } = useStudyMap();

  return (
    <div className="animate-in fade-in duration-300">
      <RecommendationAssistant
        onRecommend={getRecommendation}
        onSelectSpaceForReservation={(space, initialData) =>
          openReservationModal(space, initialData)
        }
        onOpenDetails={(space) => openDetailModal(space)}
      />
    </div>
  );
}

