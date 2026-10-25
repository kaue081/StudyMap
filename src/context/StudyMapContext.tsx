"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useStudyMapData } from "../hooks/useStudyMapData";
import { clearAllLocalStorage } from "../utils/cryptoStorage";
import { Header } from "../components/Header";
import { SpaceDetailModal } from "../components/SpaceDetailModal";
import { ReservationModal } from "../components/ReservationModal";
import { WaitlistModal } from "../components/WaitlistModal";
import {
  AlertVariant,
  AppAlertItem,
  ReactAlertContainer,
  getDefaultAlertTitle
} from "../components/ReactAlert";
import {
  StudySpace,
  Reservation,
  Event,
  WaitlistEntry,
  CancellationNotice,
  MonitorDestinationSchedule,
  MonitorAbsenceNotice,
  SpaceNotice,
  SpaceNoticePriority,
  RecommendationCriteria,
  UserAccount,
  UserRole,
  UserSearchField,
  LoginCredentials,
  AlunoRegistrationInput,
  RoleVerificationToken
} from "../types";

interface ReservationPresetData {
  data: string;
  horarioInicio: string;
  horarioFim: string;
}

export interface ShowAlertOptions {
  variant: AlertVariant;
  title?: string;
  message: string;
  durationMs?: number;
}

interface StudyMapContextValue {
  users: UserAccount[];
  roleTokens: RoleVerificationToken[];
  currentUser: UserAccount | null;
  login: (credentials: LoginCredentials) => { success: boolean; message: string; user?: UserAccount };
  logout: () => void;
  registerAluno: (input: AlunoRegistrationInput) => { success: boolean; message: string; user?: UserAccount };
  applyRoleToken: (
    codigoInput: string,
    initialSpace?: { id: number; nome: string }
  ) => { success: boolean; message: string; newRole?: UserRole };
  updateMonitorRegisteredSpace: (
    espacoId: number,
    espacoNome: string
  ) => { success: boolean; message: string };
  verifyRecoveryIdentity: (email: string, identificador: string) => { success: boolean; message: string; user?: UserAccount };
  resetPassword: (email: string, identificador: string, novaSenha: string) => { success: boolean; message: string };
  updateCurrentPassword: (novaSenha: string) => { success: boolean; message: string };
  searchUsers: (query: string, field?: UserSearchField, roleFilter?: UserRole | "todos") => UserAccount[];
  adminCreateUser: (input: {
    nome: string;
    matricula: string;
    email: string;
    senha: string;
    perfil?: UserRole;
    token?: string;
    espacoMonitoriaId?: number;
    espacoMonitoria?: string;
  }) => { success: boolean; message: string; user?: UserAccount };
  adminUpdateUser: (
    userId: number,
    updates: {
      nome: string;
      email: string;
      senha: string;
      perfil: UserRole;
      matricula?: string;
      token?: string;
      espacoMonitoriaId?: number;
      espacoMonitoria?: string;
    }
  ) => { success: boolean; message: string };
  adminDeleteUser: (userId: number) => { success: boolean; message: string };
  adminGenerateRoleToken: (input: {
    codigo?: string;
    perfilDestino: "monitor" | "admin";
    descricao: string;
    criadoPor?: string;
  }) => { success: boolean; message: string; token?: RoleVerificationToken };
  adminUpdateRoleToken: (
    originalCodigo: string,
    updates: {
      codigo: string;
      perfilDestino: "monitor" | "admin";
      descricao: string;
      liberarVinculo?: boolean;
    }
  ) => { success: boolean; message: string };
  adminDeleteRoleToken: (codigo: string) => { success: boolean; message: string };
  spaces: StudySpace[];
  reservations: Reservation[];
  events: Event[];
  waitlist: WaitlistEntry[];
  cancellations: CancellationNotice[];
  monitorSchedules: MonitorDestinationSchedule[];
  monitorAbsences: MonitorAbsenceNotice[];
  spaceNotices: SpaceNotice[];
  addReservation: (data: {
    espacoId: number;
    usuarioId?: number;
    usuarioEmail?: string;
    usuarioNome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => { success: boolean; message: string; isFull?: boolean; reservation?: Reservation };
  cancelReservation: (reservationId: number, motivoCancelamento?: string) => { success: boolean; message: string; promoted?: boolean };
  performCheckIn: (reservationId: number) => { success: boolean; message: string };
  simulateCheckInWindow: (reservationId: number) => { success: boolean; message: string };
  expireCheckIn: (reservationId: number) => { success: boolean; message: string };
  scheduleMonitorDestination: (data: {
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => { success: boolean; message: string; schedule?: MonitorDestinationSchedule; spaceName?: string };
  sendMonitorAbsenceNotice: (data: {
    scheduleId?: number;
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    motivo: string;
  }) => { success: boolean; message: string; notice?: MonitorAbsenceNotice };
  cancelStudentCheckInByMonitor: (
    reservationId: number,
    monitorNome: string,
    motivo?: string
  ) => { success: boolean; message: string };
  addToWaitlist: (data: {
    espacoId: number;
    nomeAluno: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => { success: boolean; message: string; entry?: WaitlistEntry };
  removeFromWaitlist: (entryId: number) => void;
  getRecommendation: (criteria: RecommendationCriteria) => { space: StudySpace | null; justificativa: string };
  getAvailableSpacesForDate: (targetDate: string, horarioInicio?: string, horarioFim?: string) => StudySpace[];
  checkEventConflict: (espacoId: number, data: string, inicio: string, fim: string) => Event | undefined;
  adminCreateSpace: (input: Omit<StudySpace, "id">) => { success: boolean; message: string; space?: StudySpace };
  adminUpdateSpace: (spaceId: number, updates: Partial<Omit<StudySpace, "id">>) => { success: boolean; message: string; space?: StudySpace };
  adminDeleteSpace: (spaceId: number) => { success: boolean; message: string };
  adminCreateSpaceNotice: (input: {
    espacoId: number;
    titulo: string;
    mensagem: string;
    prioridade: SpaceNoticePriority;
    autorNome: string;
    ativo?: boolean;
  }) => { success: boolean; message: string; notice?: SpaceNotice };
  adminUpdateSpaceNotice: (
    noticeId: number,
    updates: {
      espacoId: number;
      titulo: string;
      mensagem: string;
      prioridade: SpaceNoticePriority;
      ativo: boolean;
    }
  ) => { success: boolean; message: string };
  adminDeleteSpaceNotice: (noticeId: number) => { success: boolean; message: string };
  adminUpdateReservation: (
    reservationId: number,
    updates: {
      usuarioNome: string;
      usuarioEmail?: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: "reservada" | "confirmada" | "cancelada";
      checkIn: boolean;
      motivoCancelamento?: string;
    }
  ) => { success: boolean; message: string };
  adminDeleteReservation: (reservationId: number) => { success: boolean; message: string };
  adminUpdateWaitlistEntry: (
    entryId: number,
    updates: {
      nomeAluno: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      posicao: number;
    }
  ) => { success: boolean; message: string };
  adminDeleteWaitlistEntry: (entryId: number) => { success: boolean; message: string };
  adminCreateEvent: (input: Omit<Event, "id">) => { success: boolean; message: string; event?: Event };
  adminUpdateEvent: (eventId: number, updates: Omit<Event, "id">) => { success: boolean; message: string };
  adminDeleteEvent: (eventId: number) => { success: boolean; message: string };
  adminUpdateMonitorSchedule: (
    scheduleId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: "agendado" | "ausencia_informada";
      motivoAusencia?: string;
    }
  ) => { success: boolean; message: string };
  adminDeleteMonitorSchedule: (scheduleId: number) => { success: boolean; message: string };
  adminUpdateMonitorAbsence: (
    absenceId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      motivo: string;
    }
  ) => { success: boolean; message: string };
  adminDeleteMonitorAbsence: (absenceId: number) => { success: boolean; message: string };
  adminUpdateCancellationNotice: (
    noticeId: number,
    updates: {
      mensagem: string;
      dataReserva: string;
      horarioInicio: string;
      horarioFim: string;
    }
  ) => { success: boolean; message: string };
  adminDeleteCancellationNotice: (noticeId: number) => { success: boolean; message: string };
  openDetailModal: (space: StudySpace) => void;
  openReservationModal: (space: StudySpace, initialData?: ReservationPresetData) => void;
  openWaitlistModal: (space: StudySpace) => void;
  showAlert: (options: ShowAlertOptions) => void;
  dismissAlert: (id: number) => void;
}

const StudyMapContext = createContext<StudyMapContextValue | null>(null);

const emptySubscribe = () => () => {};

function StudyMapShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    users,
    roleTokens,
    currentUser,
    login,
    logout: clearAuthSession,
    registerAluno,
    applyRoleToken,
    updateMonitorRegisteredSpace,
    verifyRecoveryIdentity,
    resetPassword,
    updateCurrentPassword,
    searchUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminGenerateRoleToken,
    adminUpdateRoleToken,
    adminDeleteRoleToken,
    resetAuthStorage
  } = useAuth();

  const {
    spaces,
    reservations,
    events,
    waitlist,
    cancellations,
    monitorSchedules,
    monitorAbsences,
    spaceNotices,
    addReservation,
    cancelReservation,
    performCheckIn,
    simulateCheckInWindow,
    expireCheckIn,
    scheduleMonitorDestination: rawScheduleMonitorDestination,
    sendMonitorAbsenceNotice,
    cancelStudentCheckInByMonitor,
    addToWaitlist,
    removeFromWaitlist,
    getRecommendation,
    getAvailableSpacesForDate,
    checkEventConflict,
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
    resetToDefaults
  } = useStudyMapData(Boolean(currentUser));

  const scheduleMonitorDestination = useCallback(
    (data: {
      monitorId: number;
      monitorNome: string;
      monitorEmail: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
    }) => {
      const res = rawScheduleMonitorDestination(data);
      if (res.success && res.spaceName && currentUser && currentUser.id === data.monitorId) {
        updateMonitorRegisteredSpace(data.espacoId, res.spaceName);
      }
      return res;
    },
    [rawScheduleMonitorDestination, currentUser, updateMonitorRegisteredSpace]
  );

  const [detailSpace, setDetailSpace] = useState<StudySpace | null>(null);
  const [reservationSpace, setReservationSpace] = useState<StudySpace | null>(null);
  const [reservationPresetData, setReservationPresetData] = useState<ReservationPresetData | null>(null);
  const [waitlistSpace, setWaitlistSpace] = useState<StudySpace | null>(null);

  // Estado global de Alertas do React (Toasts)
  const [alerts, setAlerts] = useState<AppAlertItem[]>([]);
  const alertTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const nextAlertIdRef = useRef<number>(1);

  const dismissAlert = useCallback((id: number) => {
    const timer = alertTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      alertTimersRef.current.delete(id);
    }
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showAlert = useCallback(
    ({ variant, title, message, durationMs = 5000 }: ShowAlertOptions) => {
      const id = nextAlertIdRef.current++;
      const newAlert: AppAlertItem = {
        id,
        variant,
        title: title || getDefaultAlertTitle(variant),
        message
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 4));

      const timer = setTimeout(() => {
        alertTimersRef.current.delete(id);
        setAlerts((prev) => prev.filter((item) => item.id !== id));
      }, durationMs);

      alertTimersRef.current.set(id, timer);
    },
    []
  );

  useEffect(() => {
    const timersMap = alertTimersRef.current;
    return () => {
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, []);

  const authGuestOnlyRoutes =
    pathname === "/login" || pathname === "/cadastro" || pathname === "/recuperar-senha";
  const isPublicRoute = authGuestOnlyRoutes;
  const isAlunoBlockedFromUsers = Boolean(
    currentUser && currentUser.perfil === "aluno" && pathname.startsWith("/usuarios")
  );
  const isAlunoBlockedFromMonitorPanel = Boolean(
    currentUser && currentUser.perfil === "aluno" && pathname.startsWith("/monitoria")
  );
  const isNonAdminBlockedFromAdminPanel = Boolean(
    currentUser && currentUser.perfil !== "admin" && pathname.startsWith("/admin")
  );

  useEffect(() => {
    if (!currentUser && !isPublicRoute) {
      router.replace("/login");
    } else if (currentUser && authGuestOnlyRoutes) {
      router.replace("/");
    } else if (isAlunoBlockedFromUsers) {
      showAlert({
        variant: "warning",
        title: "Acesso Restrito",
        message:
          "O perfil de Aluno não possui permissão para visualizar a página Usuários & Busca."
      });
      router.replace("/");
    } else if (isAlunoBlockedFromMonitorPanel) {
      showAlert({
        variant: "warning",
        title: "Painel Exclusivo de Monitoria",
        message:
          "O perfil de Aluno não possui permissão para acessar o Painel do Monitor. Caso possua um token do Admin 1, valide-o em Configurações."
      });
      router.replace("/");
    } else if (isNonAdminBlockedFromAdminPanel) {
      showAlert({
        variant: "warning",
        title: "Painel Exclusivo da Administração",
        message:
          "Apenas usuários com perfil de Administrador podem acessar o Painel do Admin. Caso possua um token ADM-..., valide-o em Configurações."
      });
      router.replace("/");
    }
  }, [
    currentUser,
    isPublicRoute,
    authGuestOnlyRoutes,
    isAlunoBlockedFromUsers,
    isAlunoBlockedFromMonitorPanel,
    isNonAdminBlockedFromAdminPanel,
    router,
    showAlert
  ]);

  const handleLogout = () => {
    setDetailSpace(null);
    setReservationSpace(null);
    setReservationPresetData(null);
    setWaitlistSpace(null);
    clearAuthSession();
    resetToDefaults();
    clearAllLocalStorage();
    showAlert({
      variant: "info",
      title: "Sessão Encerrada & Dados Apagados",
      message: "Você saiu da sua conta e todos os dados salvos no LocalStorage foram apagados."
    });
    router.push("/login");
  };

  const handleResetAll = () => {
    resetAuthStorage();
    resetToDefaults();
    showAlert({
      variant: "info",
      title: "Padrão Restaurado",
      message: "Todos os espaços, reservas e usuários foram restaurados para o estado inicial do escopo."
    });
    router.push("/login");
  };

  const openDetailModal = (space: StudySpace) => {
    setDetailSpace(space);
  };

  const openReservationModal = (space: StudySpace, initialData?: ReservationPresetData) => {
    const vagas = space.capacidade - space.ocupacao;
    if (vagas <= 0) {
      setWaitlistSpace(space);
    } else {
      setReservationSpace(space);
      setReservationPresetData(initialData || null);
    }
  };

  const openWaitlistModal = (space: StudySpace) => {
    setWaitlistSpace(space);
  };

  const contextValue: StudyMapContextValue = {
    users,
    roleTokens,
    currentUser,
    login,
    logout: handleLogout,
    registerAluno,
    applyRoleToken,
    updateMonitorRegisteredSpace,
    verifyRecoveryIdentity,
    resetPassword,
    updateCurrentPassword,
    searchUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminGenerateRoleToken,
    adminUpdateRoleToken,
    adminDeleteRoleToken,
    spaces,
    reservations,
    events,
    waitlist,
    cancellations,
    monitorSchedules,
    monitorAbsences,
    spaceNotices,
    addReservation,
    cancelReservation,
    performCheckIn,
    simulateCheckInWindow,
    expireCheckIn,
    scheduleMonitorDestination,
    sendMonitorAbsenceNotice,
    cancelStudentCheckInByMonitor,
    addToWaitlist,
    removeFromWaitlist,
    getRecommendation,
    getAvailableSpacesForDate,
    checkEventConflict,
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
    openDetailModal,
    openReservationModal,
    openWaitlistModal,
    showAlert,
    dismissAlert
  };

  const isRedirecting =
    (!currentUser && !isPublicRoute) ||
    (currentUser && authGuestOnlyRoutes) ||
    isAlunoBlockedFromUsers ||
    isAlunoBlockedFromMonitorPanel ||
    isNonAdminBlockedFromAdminPanel;

  return (
    <StudyMapContext.Provider value={contextValue}>
      <ReactAlertContainer alerts={alerts} onDismiss={dismissAlert} />

      {isRedirecting ? (
        <div className="flex h-screen items-center justify-center bg-[#0f1115] text-indigo-400 font-semibold gap-3">
          <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
          Redirecionando...
        </div>
      ) : !currentUser ? (
        children
      ) : (
        <div className="w-full min-h-dvh px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-5 sm:space-y-8 overflow-x-clip">
          <Header
            reservationCount={reservations.filter((r) => r.status !== "cancelada").length}
            waitlistCount={waitlist.length}
            usersCount={users.length}
            currentUser={currentUser}
            onLogout={handleLogout}
            onReset={handleResetAll}
          />

          <main className="w-full min-w-0">{children}</main>

          <SpaceDetailModal
            space={detailSpace}
            events={events}
            spaceNotices={spaceNotices}
            monitorAbsences={monitorAbsences}
            currentUser={currentUser}
            onClose={() => setDetailSpace(null)}
            onReserve={(s) => openReservationModal(s)}
            onWaitlist={(s) => setWaitlistSpace(s)}
            onCreateNotice={(data) => {
              const res = adminCreateSpaceNotice(data);
              showAlert({
                variant: res.success ? "success" : "error",
                title: res.success ? "Aviso Publicado" : "Erro ao Publicar Aviso",
                message: res.message
              });
              return res;
            }}
            onCreateEvent={(data) => {
              const res = adminCreateEvent(data);
              showAlert({
                variant: res.success ? "success" : "error",
                title: res.success ? "Evento Cadastrado" : "Erro ao Cadastrar Evento",
                message: res.message
              });
              return res;
            }}
          />

          {reservationSpace && (
            <ReservationModal
              key={`${reservationSpace.id}-${currentUser.id}-${reservationPresetData?.data || "hoje"}`}
              space={reservationSpace}
              defaultUserName={currentUser.nome}
              initialData={reservationPresetData}
              onClose={() => {
                setReservationSpace(null);
                setReservationPresetData(null);
              }}
              onSubmit={(formData) => {
                const res = addReservation({
                  ...formData,
                  usuarioId: currentUser.id,
                  usuarioEmail: currentUser.email
                });
                if (res.success) {
                  showAlert({
                    variant: "success",
                    title: "Reserva Confirmada",
                    message: res.message
                  });
                } else {
                  showAlert({
                    variant: res.isFull ? "warning" : "error",
                    title: res.isFull ? "Espaço Lotado" : "Reserva Não Realizada",
                    message: res.message
                  });
                }
                return res;
              }}
              onOpenWaitlist={(s) => setWaitlistSpace(s)}
            />
          )}

          {waitlistSpace && (
            <WaitlistModal
              key={`${waitlistSpace.id}-${currentUser.id}`}
              space={waitlistSpace}
              defaultUserName={currentUser.nome}
              onClose={() => setWaitlistSpace(null)}
              onSubmit={(waitlistData) => {
                const res = addToWaitlist({
                  ...waitlistData,
                  usuarioId: currentUser.id,
                  usuarioEmail: currentUser.email
                });
                if (res.success) {
                  showAlert({
                    variant: "success",
                    title: "Entrada na Fila Confirmada",
                    message: res.message
                  });
                }
                return res;
              }}
            />
          )}
        </div>
      )}
    </StudyMapContext.Provider>
  );
}

export function StudyMapProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1115] text-indigo-400 font-semibold gap-3">
        <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
        Carregando StudyMap...
      </div>
    );
  }

  return <StudyMapShell>{children}</StudyMapShell>;
}

export function useStudyMap() {
  const context = useContext(StudyMapContext);
  if (!context) {
    throw new Error("useStudyMap deve ser utilizado dentro de um StudyMapProvider.");
  }
  return context;
}
