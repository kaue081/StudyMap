"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { ReservationSection } from "../../components/ReservationSection";

export default function ReservasPage() {
  const {
    currentUser,
    reservations,
    spaces,
    users,
    cancellations,
    performCheckIn,
    simulateCheckInWindow,
    cancelReservation,
    expireCheckIn,
    cancelStudentCheckInByMonitor,
    showAlert
  } = useStudyMap();

  return (
    <div className="animate-in fade-in duration-300">
      <ReservationSection
        reservations={reservations}
        spaces={spaces}
        users={users}
        cancellations={cancellations}
        currentUser={currentUser}
        onCheckIn={(id) => {
          const res = performCheckIn(id);
          showAlert({
            variant: res.success ? "success" : "warning",
            title: res.success ? "Check-in Confirmado" : "Janela de Check-in (10 min)",
            message: res.message
          });
        }}
        onSimulateCheckInWindow={(id) => {
          const res = simulateCheckInWindow(id);
          showAlert({
            variant: "info",
            title: "Simulação de 10 Minutos Ativada",
            message: res.message
          });
        }}
        onCancel={(id, motivoCancelamento) => {
          const res = cancelReservation(id, motivoCancelamento);
          showAlert({
            variant: res.success ? "info" : "error",
            title: res.promoted
              ? "Cancelamento Enviado & Fila Promovida"
              : "Informação de Cancelamento Enviada",
            message: res.message
          });
        }}
        onExpireCheckIn={(id) => {
          const res = expireCheckIn(id);
          showAlert({
            variant: res.success ? "warning" : "error",
            title: res.success ? "Reserva Expirada por Ausência" : "Ação Indisponível",
            message: res.message
          });
        }}
        onMonitorRevokeCheckIn={(id) => {
          if (!currentUser) return;
          const res = cancelStudentCheckInByMonitor(
            id,
            currentUser.nome,
            "Check-in cancelado pelo monitor na página de Reservas; vaga devolvida ao espaço."
          );
          showAlert({
            variant: res.success ? "success" : "error",
            title: res.success
              ? "Check-in Cancelado & Vaga Disponível"
              : "Ação Indisponível",
            message: res.message
          });
        }}
      />
    </div>
  );
}
