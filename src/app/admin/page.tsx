"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { AdminPanelSection } from "../../components/AdminPanelSection";

export default function AdminPage() {
  const {
    currentUser,
    users,
    roleTokens,
    spaces,
    spaceNotices,
    reservations,
    waitlist,
    events,
    monitorSchedules,
    monitorAbsences,
    cancellations,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminGenerateRoleToken,
    adminUpdateRoleToken,
    adminDeleteRoleToken,
    adminCreateSpace,
    adminUpdateSpace,
    adminDeleteSpace,
    adminCreateSpaceNotice,
    adminUpdateSpaceNotice,
    adminDeleteSpaceNotice,
    adminUpdateReservation,
    adminDeleteReservation,
    adminUpdateWaitlistEntry,
    adminDeleteWaitlistEntry,
    adminCreateEvent,
    adminUpdateEvent,
    adminDeleteEvent,
    adminUpdateMonitorSchedule,
    adminDeleteMonitorSchedule,
    adminUpdateMonitorAbsence,
    adminDeleteMonitorAbsence,
    adminUpdateCancellationNotice,
    adminDeleteCancellationNotice,
    showAlert
  } = useStudyMap();

  if (!currentUser || currentUser.perfil !== "admin") {
    return null;
  }

  const notify = (
    res: { success: boolean; message: string },
    successTitle: string,
    errorTitle = "Operação Não Concluída"
  ) => {
    showAlert({
      variant: res.success ? "success" : "error",
      title: res.success ? successTitle : errorTitle,
      message: res.message
    });
    return res;
  };

  return (
    <div className="animate-in fade-in duration-300">
      <AdminPanelSection
        currentUser={currentUser}
        users={users}
        roleTokens={roleTokens}
        spaces={spaces}
        spaceNotices={spaceNotices}
        reservations={reservations}
        waitlist={waitlist}
        events={events}
        monitorSchedules={monitorSchedules}
        monitorAbsences={monitorAbsences}
        cancellations={cancellations}
        onCreateUser={(input) =>
          notify(adminCreateUser(input), "Novo Usuário Cadastrado")
        }
        onUpdateUser={(id, updates) =>
          notify(adminUpdateUser(id, updates), "Usuário Atualizado")
        }
        onDeleteUser={(id) =>
          notify(adminDeleteUser(id), "Usuário Removido")
        }
        onGenerateToken={(input) =>
          notify(adminGenerateRoleToken(input), "Token Institucional Gerado")
        }
        onUpdateToken={(orig, updates) =>
          notify(adminUpdateRoleToken(orig, updates), "Token Atualizado")
        }
        onDeleteToken={(codigo) =>
          notify(adminDeleteRoleToken(codigo), "Token Removido")
        }
        onCreateSpace={(input) =>
          notify(adminCreateSpace(input), "Novo Lugar Cadastrado")
        }
        onUpdateSpace={(id, updates) =>
          notify(adminUpdateSpace(id, updates), "Lugar Atualizado")
        }
        onDeleteSpace={(id) =>
          notify(adminDeleteSpace(id), "Lugar Removido")
        }
        onCreateSpaceNotice={(input) =>
          notify(adminCreateSpaceNotice(input), "Aviso sobre o Local Publicado")
        }
        onUpdateSpaceNotice={(id, updates) =>
          notify(adminUpdateSpaceNotice(id, updates), "Aviso Atualizado")
        }
        onDeleteSpaceNotice={(id) =>
          notify(adminDeleteSpaceNotice(id), "Aviso Removido")
        }
        onUpdateReservation={(id, updates) =>
          notify(adminUpdateReservation(id, updates), "Reserva Atualizada")
        }
        onDeleteReservation={(id) =>
          notify(adminDeleteReservation(id), "Reserva Removida")
        }
        onUpdateWaitlistEntry={(id, updates) =>
          notify(
            adminUpdateWaitlistEntry(id, updates),
            "Fila de Espera Atualizada"
          )
        }
        onDeleteWaitlistEntry={(id) =>
          notify(adminDeleteWaitlistEntry(id), "Entrada da Fila Removida")
        }
        onCreateEvent={(input) =>
          notify(adminCreateEvent(input), "Evento Cadastrado")
        }
        onUpdateEvent={(id, updates) =>
          notify(adminUpdateEvent(id, updates), "Evento Atualizado")
        }
        onDeleteEvent={(id) =>
          notify(adminDeleteEvent(id), "Evento Removido")
        }
        onUpdateMonitorSchedule={(id, updates) =>
          notify(
            adminUpdateMonitorSchedule(id, updates),
            "Escala de Monitoria Atualizada"
          )
        }
        onDeleteMonitorSchedule={(id) =>
          notify(adminDeleteMonitorSchedule(id), "Escala Removida")
        }
        onUpdateMonitorAbsence={(id, updates) =>
          notify(
            adminUpdateMonitorAbsence(id, updates),
            "Aviso de Ausência Atualizado"
          )
        }
        onDeleteMonitorAbsence={(id) =>
          notify(adminDeleteMonitorAbsence(id), "Aviso de Ausência Removido")
        }
        onUpdateCancellationNotice={(id, updates) =>
          notify(
            adminUpdateCancellationNotice(id, updates),
            "Registro de Cancelamento Atualizado"
          )
        }
        onDeleteCancellationNotice={(id) =>
          notify(
            adminDeleteCancellationNotice(id),
            "Registro de Cancelamento Removido"
          )
        }
      />
    </div>
  );
}

