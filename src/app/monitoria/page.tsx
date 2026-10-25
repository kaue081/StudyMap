"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { MonitorPanelSection } from "../../components/MonitorPanelSection";

export default function MonitoriaPage() {
  const {
    currentUser,
    spaces,
    reservations,
    users,
    monitorSchedules,
    monitorAbsences,
    scheduleMonitorDestination,
    sendMonitorAbsenceNotice,
    cancelStudentCheckInByMonitor,
    updateMonitorRegisteredSpace,
    openReservationModal,
    showAlert
  } = useStudyMap();

  if (!currentUser || currentUser.perfil === "aluno") {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <MonitorPanelSection
        currentUser={currentUser}
        spaces={spaces}
        reservations={reservations}
        users={users}
        monitorSchedules={monitorSchedules}
        monitorAbsences={monitorAbsences}
        onScheduleDestination={(data) => {
          const res = scheduleMonitorDestination(data);
          showAlert({
            variant: res.success ? "success" : "warning",
            title: res.success
              ? "Local de Destino Agendado"
              : "Agendamento Não Realizado",
            message: res.message
          });
          return res;
        }}
        onSendAbsenceNotice={(data) => {
          const res = sendMonitorAbsenceNotice(data);
          showAlert({
            variant: res.success ? "info" : "error",
            title: res.success
              ? "Aviso de Não Comparecimento Enviado"
              : "Erro ao Enviar Aviso",
            message: res.message
          });
          return res;
        }}
        onCancelStudentCheckIn={(reservationId, monitorNome, motivo) => {
          const res = cancelStudentCheckInByMonitor(
            reservationId,
            monitorNome,
            motivo
          );
          showAlert({
            variant: res.success ? "success" : "error",
            title: res.success
              ? "Check-in Cancelado & Vaga Disponível"
              : "Ação Indisponível",
            message: res.message
          });
          return res;
        }}
        onUpdateRegisteredSpace={(espacoId, espacoNome) => {
          const res = updateMonitorRegisteredSpace(espacoId, espacoNome);
          if (res.success) {
            showAlert({
              variant: "info",
              title: "Local de Monitoria Atualizado",
              message: res.message
            });
          }
          return res;
        }}
        onOpenReserveStudySpot={(space) => openReservationModal(space)}
      />
    </div>
  );
}

