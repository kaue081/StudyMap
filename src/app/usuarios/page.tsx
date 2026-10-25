"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { UserSearchSection } from "../../components/UserSearchSection";

export default function UsuariosPage() {
  const { searchUsers, currentUser } = useStudyMap();

  if (!currentUser || currentUser.perfil === "aluno") {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-300 w-full min-w-0">
      <UserSearchSection
        searchUsers={searchUsers}
        currentUser={currentUser}
      />
    </div>
  );
}
