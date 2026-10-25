import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  StudySpace,
  Reservation,
  Event,
  WaitlistEntry,
  RecommendationCriteria,
  CancellationNotice,
  MonitorDestinationSchedule,
  MonitorAbsenceNotice,
  SpaceNotice,
  SpaceNoticePriority
} from '../types';
import {
  defaultSpaces,
  defaultEvents,
  defaultMonitorSchedules,
  defaultSpaceNotices
} from '../data/mockData';
import {
  getEncryptedItem,
  setEncryptedItem,
  clearAllLocalStorage
} from '../utils/cryptoStorage';

const emptySubscribe = () => () => {};

function getSampleReservations(): Reservation[] {
  const today = new Date().toISOString().split('T')[0];
  const createdAt = new Date().toISOString();
  return [
    {
      id: 101,
      usuarioId: 1,
      usuarioEmail: "caua.lima@studymap.edu.br",
      usuarioNome: "Caua Henrique Pinto de Lima",
      espacoId: 1,
      data: today,
      horarioInicio: "09:30",
      horarioFim: "12:00",
      status: "confirmada",
      checkIn: true,
      criadoEm: createdAt
    },
    {
      id: 102,
      usuarioId: 2,
      usuarioEmail: "charles.kaue@studymap.edu.br",
      usuarioNome: "Charles Kaue Barbosa da Silva",
      espacoId: 1,
      data: today,
      horarioInicio: "14:00",
      horarioFim: "16:00",
      status: "reservada",
      checkIn: false,
      criadoEm: createdAt
    },
    {
      id: 103,
      usuarioId: 3,
      usuarioEmail: "emanuel.correia@studymap.edu.br",
      usuarioNome: "Emanuel da Silva Correia",
      espacoId: 2,
      data: today,
      horarioInicio: "13:00",
      horarioFim: "15:00",
      status: "confirmada",
      checkIn: true,
      criadoEm: createdAt
    },
    {
      id: 104,
      usuarioId: 4,
      usuarioEmail: "pedro.monteiro@studymap.edu.br",
      usuarioNome: "Pedro Inacio Monteiro Silva",
      espacoId: 5,
      data: today,
      horarioInicio: "14:30",
      horarioFim: "17:00",
      status: "confirmada",
      checkIn: true,
      criadoEm: createdAt
    },
    {
      id: 105,
      usuarioId: 11,
      usuarioEmail: "juliana.rocha@studymap.edu.br",
      usuarioNome: "Juliana Rocha",
      espacoId: 3,
      data: today,
      horarioInicio: "08:00",
      horarioFim: "12:00",
      status: "confirmada",
      checkIn: true,
      criadoEm: createdAt
    },
    {
      id: 106,
      usuarioId: 12,
      usuarioEmail: "thiago.mendes@studymap.edu.br",
      usuarioNome: "Thiago Mendes",
      espacoId: 3,
      data: today,
      horarioInicio: "08:30",
      horarioFim: "11:30",
      status: "confirmada",
      checkIn: true,
      criadoEm: createdAt
    }
  ];
}

function getSampleWaitlist(): WaitlistEntry[] {
  const today = new Date().toISOString().split('T')[0];
  const createdAt = new Date().toISOString();
  return [
    {
      id: 201,
      espacoId: 3,
      usuarioId: 5,
      usuarioEmail: "maria.eduarda@studymap.edu.br",
      nomeAluno: "Maria Eduarda Oliveira",
      data: today,
      horarioInicio: "15:00",
      horarioFim: "17:00",
      posicao: 1,
      criadoEm: createdAt
    },
    {
      id: 202,
      espacoId: 3,
      usuarioId: 13,
      usuarioEmail: "joao.pedro@studymap.edu.br",
      nomeAluno: "João Pedro Silveira",
      data: today,
      horarioInicio: "15:00",
      horarioFim: "17:00",
      posicao: 2,
      criadoEm: createdAt
    }
  ];
}

function readInitialSpaces(): StudySpace[] {
  const stored = getEncryptedItem<StudySpace[] | null>('studyMap_spaces', null);
  const base = Array.isArray(stored) && stored.length > 0 ? stored : defaultSpaces;
  const initialReservations = readInitialReservations();
  return base.map(s => {
    const activeCount = initialReservations.filter(
      r => r.espacoId === s.id && r.status !== 'cancelada'
    ).length;
    return { ...s, ocupacao: activeCount };
  });
}

function readInitialEvents(): Event[] {
  const stored = getEncryptedItem<Event[] | null>('studyMap_events', null);
  return Array.isArray(stored) ? stored : defaultEvents;
}

function readInitialReservations(): Reservation[] {
  const stored = getEncryptedItem<Reservation[] | null>('studyMap_reservations', null);
  return Array.isArray(stored) ? stored : getSampleReservations();
}

function readInitialWaitlist(): WaitlistEntry[] {
  const stored = getEncryptedItem<WaitlistEntry[] | null>('studyMap_waitlist', null);
  return Array.isArray(stored) ? stored : getSampleWaitlist();
}

export function getCheckInWindowInfo(data: string, horarioInicio: string, horarioFim: string, now: Date = new Date()) {
  const scheduledStart = new Date(`${data}T${horarioInicio}:00`);
  const scheduledEnd = new Date(`${data}T${horarioFim}:00`);
  const unlockTime = new Date(scheduledStart.getTime() - 10 * 60000);

  const unlockHours = String(unlockTime.getHours()).padStart(2, '0');
  const unlockMinutes = String(unlockTime.getMinutes()).padStart(2, '0');
  const unlockTimeFormatted = `${unlockHours}:${unlockMinutes}`;

  const diffMinutesUntilStart = (scheduledStart.getTime() - now.getTime()) / 60000;

  if (now.getTime() > scheduledEnd.getTime()) {
    return {
      canCheckIn: false,
      reason: 'expired' as const,
      unlockTimeFormatted,
      diffMinutesUntilStart,
      message: `O período agendado (${horarioInicio} às ${horarioFim} em ${data}) já foi encerrado. Cancele ou libere a reserva.`
    };
  }

  if (diffMinutesUntilStart > 10) {
    return {
      canCheckIn: false,
      reason: 'early' as const,
      unlockTimeFormatted,
      diffMinutesUntilStart,
      message: `O check-in só é liberado faltando 10 minutos para o horário agendado (a partir das ${unlockTimeFormatted} do dia ${data}). Aguarde o horário ou cancele a reserva.`
    };
  }

  return {
    canCheckIn: true,
    reason: 'open' as const,
    unlockTimeFormatted,
    diffMinutesUntilStart,
    message: 'Janela de check-in aberta!'
  };
}

function readInitialCancellations(): CancellationNotice[] {
  const stored = getEncryptedItem<CancellationNotice[] | null>('studyMap_cancellations', null);
  return Array.isArray(stored) ? stored : [];
}

function readInitialMonitorSchedules(): MonitorDestinationSchedule[] {
  const stored = getEncryptedItem<MonitorDestinationSchedule[] | null>('studyMap_monitorSchedules', null);
  return Array.isArray(stored) ? stored : defaultMonitorSchedules;
}

function readInitialMonitorAbsences(): MonitorAbsenceNotice[] {
  const stored = getEncryptedItem<MonitorAbsenceNotice[] | null>('studyMap_monitorAbsences', null);
  return Array.isArray(stored) ? stored : [];
}

function readInitialSpaceNotices(): SpaceNotice[] {
  const stored = getEncryptedItem<SpaceNotice[] | null>('studyMap_spaceNotices', null);
  return Array.isArray(stored) ? stored : defaultSpaceNotices;
}

export function useStudyMapData(isPersistEnabled = true) {
  // Initialize from encrypted LocalStorage
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [spaces, setSpaces] = useState<StudySpace[]>(() => readInitialSpaces());
  const [reservations, setReservations] = useState<Reservation[]>(() => readInitialReservations());
  const [events, setEvents] = useState<Event[]>(() => readInitialEvents());
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => readInitialWaitlist());
  const [cancellations, setCancellations] = useState<CancellationNotice[]>(() => readInitialCancellations());
  const [monitorSchedules, setMonitorSchedules] = useState<MonitorDestinationSchedule[]>(
    () => readInitialMonitorSchedules()
  );
  const [monitorAbsences, setMonitorAbsences] = useState<MonitorAbsenceNotice[]>(
    () => readInitialMonitorAbsences()
  );
  const [spaceNotices, setSpaceNotices] = useState<SpaceNotice[]>(
    () => readInitialSpaceNotices()
  );

  // Sincronização computada estrita: cada espaço sempre tem sua ocupação derivada em tempo real do total de reservas ativas
  const synchronizedSpaces = spaces.map(space => {
    const activeCount = reservations.filter(
      r => r.espacoId === space.id && r.status !== 'cancelada'
    ).length;
    return space.ocupacao === activeCount ? space : { ...space, ocupacao: activeCount };
  });

  // Salvar dados criptografados no LocalStorage apenas quando o sistema estiver autenticado em uso
  useEffect(() => {
    if (isLoaded && isPersistEnabled) {
      setEncryptedItem('studyMap_spaces', synchronizedSpaces);
      setEncryptedItem('studyMap_reservations', reservations);
      setEncryptedItem('studyMap_events', events);
      setEncryptedItem('studyMap_waitlist', waitlist);
      setEncryptedItem('studyMap_cancellations', cancellations);
      setEncryptedItem('studyMap_monitorSchedules', monitorSchedules);
      setEncryptedItem('studyMap_monitorAbsences', monitorAbsences);
      setEncryptedItem('studyMap_spaceNotices', spaceNotices);
    }
  }, [
    synchronizedSpaces,
    reservations,
    events,
    waitlist,
    cancellations,
    monitorSchedules,
    monitorAbsences,
    spaceNotices,
    isLoaded,
    isPersistEnabled
  ]);

  // Checar se há conflito com eventos agendados
  const checkEventConflict = useCallback((espacoId: number, data: string, inicio: string, fim: string) => {
    const conflictingEvent = events.find(event => {
      if (event.espacoId !== espacoId || event.data !== data) return false;
      // Checagem de sobreposição de horário
      return (inicio < event.horarioFim && fim > event.horarioInicio);
    });
    return conflictingEvent;
  }, [events]);

  // Realizar nova reserva (máximo 1 único local por dia por estudante)
  const addReservation = (data: {
    espacoId: number;
    usuarioId?: number;
    usuarioEmail?: string;
    usuarioNome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => {
    const space = spaces.find(s => s.id === data.espacoId);
    if (!space) {
      return { success: false, message: "Espaço não encontrado." };
    }

    // 0. Regra: Cada pessoa só pode ter uma única reserva ativa.
    // Só poderá fazer outra reserva quando a anterior for cancelada!
    const normalizedEmail = (data.usuarioEmail || "").trim().toLowerCase();
    const normalizedName = data.usuarioNome.trim().toLowerCase();

    const existingActiveReservation = reservations.find(r => {
      if (r.status === "cancelada") return false;
      if (data.usuarioId && r.usuarioId) {
        return r.usuarioId === data.usuarioId;
      }
      if (normalizedEmail && r.usuarioEmail) {
        return r.usuarioEmail.trim().toLowerCase() === normalizedEmail;
      }
      if (!data.usuarioId && !data.usuarioEmail && !r.usuarioId && !r.usuarioEmail) {
        return r.usuarioNome.trim().toLowerCase() === normalizedName;
      }
      return false;
    });

    if (existingActiveReservation) {
      const bookedSpace = spaces.find(s => s.id === existingActiveReservation.espacoId);
      return {
        success: false,
        message: `Limite de reserva atingido: você já possui uma reserva ativa em "${bookedSpace?.nome || 'Espaço agendado'}" (${existingActiveReservation.data}, das ${existingActiveReservation.horarioInicio} às ${existingActiveReservation.horarioFim}). Cada pessoa só pode ter uma única reserva ativa; cancele a reserva atual para poder agendar outra.`
      };
    }

    // 1. Verificar conflito de evento
    const conflict = checkEventConflict(data.espacoId, data.data, data.horarioInicio, data.horarioFim);
    if (conflict) {
      return {
        success: false,
        message: `Conflito de horário! O espaço possui o evento "${conflict.nome}" agendado das ${conflict.horarioInicio} às ${conflict.horarioFim}.`
      };
    }

    // 2. Verificar capacidade
    if (space.ocupacao >= space.capacidade) {
      return {
        success: false,
        isFull: true,
        message: `A ${space.nome} atingiu a lotação máxima (${space.capacidade}/${space.capacidade} vagas). Você pode entrar na fila de espera!`
      };
    }

    // 3. Registrar reserva
    const newReservation: Reservation = {
      id: Date.now(),
      usuarioId: data.usuarioId,
      usuarioEmail: data.usuarioEmail,
      usuarioNome: data.usuarioNome.trim() || "Estudante",
      espacoId: data.espacoId,
      data: data.data,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      status: "reservada",
      checkIn: false,
      criadoEm: new Date().toISOString()
    };

    setSpaces(prev => prev.map(s =>
      s.id === data.espacoId ? { ...s, ocupacao: s.ocupacao + 1 } : s
    ));

    setReservations(prev => [newReservation, ...prev]);

    return {
      success: true,
      reservation: newReservation,
      message: `Reserva para ${space.nome} confirmada com sucesso!`
    };
  };

  // Processar avanço da fila de espera quando uma vaga for liberada
  const processWaitlistPromotion = useCallback((espacoId: number, currentWaitlist: WaitlistEntry[]) => {
    const spaceQueue = currentWaitlist.filter(w => w.espacoId === espacoId);
    if (spaceQueue.length === 0) return { newWaitlist: currentWaitlist, promotedReservation: null };

    // Pega o primeiro da fila
    const firstInLine = spaceQueue.sort((a, b) => a.posicao - b.posicao)[0];

    // Cria a reserva direta para ele
    const promotedReservation: Reservation = {
      id: Date.now() + 1,
      usuarioNome: `${firstInLine.nomeAluno} (Promovido da Fila)`,
      espacoId: firstInLine.espacoId,
      data: firstInLine.data,
      horarioInicio: firstInLine.horarioInicio,
      horarioFim: firstInLine.horarioFim,
      status: "reservada",
      checkIn: false,
      criadoEm: new Date().toISOString()
    };

    // Remove da fila e reajusta as posições dos restantes
    const remainingWaitlist = currentWaitlist
      .filter(w => w.id !== firstInLine.id)
      .map(w => {
        if (w.espacoId === espacoId && w.posicao > firstInLine.posicao) {
          return { ...w, posicao: w.posicao - 1 };
        }
        return w;
      });

    return { newWaitlist: remainingWaitlist, promotedReservation };
  }, []);

  // Cancelar reserva com envio de informação de cancelamento da vaga (libera vaga e atende fila de espera)
  const cancelReservation = (reservationId: number, motivoCancelamento?: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return { success: false, message: "Reserva não encontrada." };

    const spaceId = reservation.espacoId;
    const space = spaces.find(s => s.id === spaceId);
    const mensagemCancelamento = (motivoCancelamento || "").trim() || "Cancelamento de reserva informado pelo estudante.";
    const canceladoEm = new Date().toISOString();

    // Atualiza status da reserva para cancelada e grava a informação enviada
    setReservations(prev => prev.map(r =>
      r.id === reservationId
        ? { ...r, status: "cancelada" as const, motivoCancelamento: mensagemCancelamento, canceladoEm }
        : r
    ));

    // Regra dos 5 segundos: a reserva cancelada fica visível por 5 segundos e depois é removida da visualização
    setTimeout(() => {
      setReservations(prev => prev.filter(r => r.id !== reservationId));
    }, 5000);

    // Registra o aviso de cancelamento da vaga no histórico do sistema
    const notice: CancellationNotice = {
      id: Date.now(),
      reservationId: reservation.id,
      espacoId: spaceId,
      espacoNome: space?.nome || "Espaço de Estudo",
      usuarioId: reservation.usuarioId,
      usuarioNome: reservation.usuarioNome,
      usuarioEmail: reservation.usuarioEmail,
      dataReserva: reservation.data,
      horarioInicio: reservation.horarioInicio,
      horarioFim: reservation.horarioFim,
      mensagem: mensagemCancelamento,
      enviadoEm: canceladoEm
    };
    setCancellations(prev => [notice, ...prev]);

    // Verifica se há fila de espera para esse espaço
    const { newWaitlist, promotedReservation } = processWaitlistPromotion(spaceId, waitlist);

    if (promotedReservation) {
      // Vaga passa diretamente para o primeiro da fila!
      setWaitlist(newWaitlist);
      setReservations(prev => [
        promotedReservation,
        ...prev.map(r =>
          r.id === reservationId
            ? { ...r, status: "cancelada" as const, motivoCancelamento: mensagemCancelamento, canceladoEm }
            : r
        )
      ]);
      setTimeout(() => {
        setReservations(prev => prev.filter(r => r.id !== reservationId));
      }, 5000);
      return {
        success: true,
        promoted: true,
        message: `Informação de cancelamento enviada! A vaga foi concedida a ${promotedReservation.usuarioNome}. A reserva cancelada sairá da tela em 5 segundos.`
      };
    } else {
      // Diminui a ocupação normalmente
      setSpaces(prev => prev.map(s =>
        s.id === spaceId ? { ...s, ocupacao: Math.max(0, s.ocupacao - 1) } : s
      ));
      return {
        success: true,
        promoted: false,
        message: "Informação de cancelamento enviada com sucesso! A reserva foi cancelada e sairá da tela em 5 segundos."
      };
    }
  };

  // Realizar Check-in (permitido faltando 10 minutos para o horário do local agendado)
  const performCheckIn = (reservationId: number) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) {
      return { success: false, message: "Reserva não encontrada." };
    }

    const windowInfo = getCheckInWindowInfo(
      reservation.data,
      reservation.horarioInicio,
      reservation.horarioFim
    );

    if (!windowInfo.canCheckIn) {
      return {
        success: false,
        message: windowInfo.message
      };
    }

    setReservations(prev => prev.map(r =>
      r.id === reservationId ? { ...r, status: "confirmada", checkIn: true } : r
    ));
    return { success: true, message: "Check-in realizado com sucesso! Presença confirmada no espaço." };
  };

  // Ajustar horário da reserva para testar a janela de check-in faltando 10 minutos (recurso didático)
  const simulateCheckInWindow = (reservationId: number) => {
    const now = new Date();
    const inTenMin = new Date(now.getTime() + 9 * 60000); // faltando ~9-10 min para o início
    const endTwoHours = new Date(inTenMin.getTime() + 120 * 60000);

    const dateStr = `${inTenMin.getFullYear()}-${String(inTenMin.getMonth() + 1).padStart(2, '0')}-${String(inTenMin.getDate()).padStart(2, '0')}`;
    const startStr = `${String(inTenMin.getHours()).padStart(2, '0')}:${String(inTenMin.getMinutes()).padStart(2, '0')}`;
    const endStr = `${String(endTwoHours.getHours()).padStart(2, '0')}:${String(endTwoHours.getMinutes()).padStart(2, '0')}`;

    setReservations(prev => prev.map(r =>
      r.id === reservationId
        ? { ...r, data: dateStr, horarioInicio: startStr, horarioFim: endStr }
        : r
    ));

    return {
      success: true,
      message: `Horário ajustado para ${startStr} de hoje (faltando menos de 10 minutos). O botão de Check-in já está liberado!`
    };
  };

  // Simular Cancelamento por Ausência de Check-in (Regra explícita do ESCOPE.md)
  const expireCheckIn = (reservationId: number) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation || reservation.checkIn || reservation.status === "cancelada") {
      return { success: false, message: "Apenas reservas ativas sem check-in podem ser expiradas." };
    }

    return cancelReservation(reservationId, "Cancelamento automático por ausência de check-in no prazo regulamentar.");
  };

  // Lista de todos os locais disponíveis para uma data de agendamento (consulta no dia que antecede o agendamento)
  const getAvailableSpacesForDate = useCallback(
    (targetDate: string, horarioInicio = "08:00", horarioFim = "22:00") => {
      return spaces.filter(space => {
        const vagasLivres = space.capacidade - space.ocupacao;
        if (vagasLivres <= 0) return false;
        const conflict = checkEventConflict(space.id, targetDate, horarioInicio, horarioFim);
        return !conflict;
      });
    },
    [spaces, checkEventConflict]
  );

  // Entrar na Fila de Espera
  const addToWaitlist = (data: {
    espacoId: number;
    usuarioId?: number;
    usuarioEmail?: string;
    nomeAluno: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => {
    const spaceQueue = waitlist.filter(w => w.espacoId === data.espacoId);
    const nextPosition = spaceQueue.length + 1;

    const newEntry: WaitlistEntry = {
      id: Date.now(),
      espacoId: data.espacoId,
      usuarioId: data.usuarioId,
      usuarioEmail: data.usuarioEmail,
      nomeAluno: data.nomeAluno.trim() || "Estudante",
      data: data.data,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      posicao: nextPosition,
      criadoEm: new Date().toISOString()
    };

    setWaitlist(prev => [...prev, newEntry]);

    const space = spaces.find(s => s.id === data.espacoId);

    return {
      success: true,
      entry: newEntry,
      message: `Você entrou na fila de espera para ${space?.nome || 'o espaço'}. Posição na fila: #${nextPosition}º!`
    };
  };

  // Remover da fila de espera
  const removeFromWaitlist = (entryId: number) => {
    const entry = waitlist.find(w => w.id === entryId);
    if (!entry) return;

    setWaitlist(prev =>
      prev
        .filter(w => w.id !== entryId)
        .map(w => {
          if (w.espacoId === entry.espacoId && w.posicao > entry.posicao) {
            return { ...w, posicao: w.posicao - 1 };
          }
          return w;
        })
    );
  };

  // Assistente Inteligente de Recomendação do StudyMap
  const getRecommendation = useCallback((criteria: RecommendationCriteria) => {
    // 1. Filtrar espaços sem conflito de evento no horário
    const availableSpaces = spaces.filter(space => {
      const hasConflict = checkEventConflict(space.id, criteria.data, criteria.horarioInicio, criteria.horarioFim);
      if (hasConflict) return false;
      if (criteria.tipoEspaco && criteria.tipoEspaco !== "Todos" && space.tipo !== criteria.tipoEspaco) return false;
      return true;
    });

    if (availableSpaces.length === 0) {
      return {
        space: null,
        justificativa: "Nenhum espaço disponível no horário selecionado sem conflitos com eventos agendados."
      };
    }

    // 2. Sistema de pontuação baseado nas preferências do estudante
    const scoredSpaces = availableSpaces.map(space => {
      let score = 50; // base score

      const vagas = space.capacidade - space.ocupacao;
      const taxaOcupacao = space.ocupacao / space.capacidade;

      // Penalidade se estiver lotado
      if (vagas <= 0) score -= 100;

      // Preferência de silêncio
      if (criteria.preferenciaSilencio) {
        if (space.perfilAmbiente === 'Silencioso') score += 40;
        else if (space.perfilAmbiente === 'Moderado') score += 10;
        else score -= 20;

        // Bonifica menor ocupação
        score += Math.round((1 - taxaOcupacao) * 30);
      }

      // Necessidade de computador
      if (criteria.precisaComputador) {
        const temPC = space.materiais.some(m => m.toLowerCase().includes('computador') || m.toLowerCase().includes('notebook'));
        if (temPC) score += 35;
        else score -= 30;
      }

      // Presença de monitor
      if (criteria.precisaMonitor) {
        if (space.monitorDisponivel) score += 25;
      }

      // Presença de professor
      if (criteria.precisaProfessor) {
        if (space.professorResponsavel) score += 25;
      }

      return { space, score, vagas, taxaOcupacao };
    });

    // Ordenar pelo maior score
    scoredSpaces.sort((a, b) => b.score - a.score);
    const best = scoredSpaces[0];

    // Gerar justificativa detalhada
    const motivos: string[] = [];
    if (best.taxaOcupacao < 0.4) motivos.push(`baixa ocupação (${Math.round(best.taxaOcupacao * 100)}%)`);
    else motivos.push(`${best.vagas} vagas disponíveis`);

    if (criteria.preferenciaSilencio && best.space.perfilAmbiente === 'Silencioso') {
      motivos.push("ambiente calmo e com foco em silêncio");
    }
    if (criteria.precisaComputador && best.space.materiais.some(m => m.toLowerCase().includes('computador') || m.toLowerCase().includes('notebook'))) {
      motivos.push("estações de computadores preparadas");
    }
    if (best.space.monitorDisponivel) {
      motivos.push(`monitor disponível (${best.space.nomeMonitor || 'Plantão'})`);
    }
    motivos.push("sem nenhum conflito com eventos no horário");

    const justificativa = `Recomendamos o ${best.space.nome} (${best.space.localizacao}) pois oferece ${motivos.join(', ')}.`;

    return {
      space: best.space,
      justificativa
    };
  }, [spaces, checkEventConflict]);

  // Passo 3 (Item 1): Agendar o local de destino da monitoria (apenas 1 local no mesmo dia e horário; horários diferentes são permitidos)
  const scheduleMonitorDestination = (data: {
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    tipoAtividade?: "ajudar" | "estudar";
  }) => {
    const space = spaces.find(s => s.id === data.espacoId);
    if (!space) {
      return { success: false, message: "Local de destino não encontrado." };
    }

    if (!data.data || !data.horarioInicio || !data.horarioFim) {
      return {
        success: false,
        message: "Preencha a data, o horário inicial e o horário final da presença do monitor."
      };
    }

    if (data.horarioInicio >= data.horarioFim) {
      return {
        success: false,
        message: "O horário de término deve ser posterior ao horário de início."
      };
    }

    const emailNormalized = data.monitorEmail.trim().toLowerCase();
    const tipo = data.tipoAtividade || "ajudar";

    // Regra: monitor só pode estar em 1 local no mesmo dia e horário (sobreposição de horário).
    // Mas ele pode agendar outro local em horário diferente se quiser!
    const conflictingSchedule = monitorSchedules.find(
      s =>
        s.status === "agendado" &&
        s.data === data.data &&
        (s.monitorId === data.monitorId ||
          s.monitorEmail.trim().toLowerCase() === emailNormalized) &&
        data.horarioInicio < s.horarioFim &&
        data.horarioFim > s.horarioInicio
    );

    if (conflictingSchedule) {
      return {
        success: false,
        message: `Conflito de horário: você já possui agendamento em "${conflictingSchedule.espacoNome}" no dia ${data.data} das ${conflictingSchedule.horarioInicio} às ${conflictingSchedule.horarioFim}. O monitor só pode estar em um lugar no mesmo horário, mas pode agendar outro local em horário diferente!`
      };
    }

    const newSchedule: MonitorDestinationSchedule = {
      id: Date.now(),
      monitorId: data.monitorId,
      monitorNome: data.monitorNome.trim(),
      monitorEmail: emailNormalized,
      espacoId: space.id,
      espacoNome: space.nome,
      data: data.data,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      tipoAtividade: tipo,
      status: "agendado",
      criadoEm: new Date().toISOString()
    };

    setMonitorSchedules(prev => [newSchedule, ...prev]);

    if (tipo === "ajudar") {
      setSpaces(prev =>
        prev.map(s =>
          s.id === space.id
            ? {
                ...s,
                monitorDisponivel: true,
                nomeMonitor: data.monitorNome.trim(),
                horarioMonitor: `${data.horarioInicio} às ${data.horarioFim}`
              }
            : s
        )
      );
    }

    return {
      success: true,
      schedule: newSchedule,
      spaceName: space.nome,
      message: `Presença agendada para ${tipo === "estudar" ? "estudar individualmente" : "ajudar como monitor"} em "${space.nome}" no dia ${data.data} (${data.horarioInicio} às ${data.horarioFim}) com sucesso!`
    };
  };

  // Passo 3 (Item 2): Enviar um aviso de não comparecimento no local de destino
  const sendMonitorAbsenceNotice = (data: {
    scheduleId?: number;
    monitorId: number;
    monitorNome: string;
    monitorEmail: string;
    espacoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    motivo: string;
  }) => {
    const motivoLimpo = data.motivo.trim();
    if (!motivoLimpo) {
      return {
        success: false,
        message: "Informe o motivo do não comparecimento antes de enviar o aviso."
      };
    }

    const space = spaces.find(s => s.id === data.espacoId);
    const emailNormalized = data.monitorEmail.trim().toLowerCase();
    const enviadoEm = new Date().toISOString();

    const matchedSchedule = monitorSchedules.find(s => {
      if (data.scheduleId && s.id === data.scheduleId) return true;
      return (
        s.status === "agendado" &&
        s.espacoId === data.espacoId &&
        s.data === data.data &&
        (s.monitorId === data.monitorId ||
          s.monitorEmail.trim().toLowerCase() === emailNormalized)
      );
    });

    const notice: MonitorAbsenceNotice = {
      id: Date.now(),
      scheduleId: matchedSchedule?.id ?? data.scheduleId,
      monitorId: data.monitorId,
      monitorNome: data.monitorNome.trim(),
      monitorEmail: emailNormalized,
      espacoId: data.espacoId,
      espacoNome: space?.nome || matchedSchedule?.espacoNome || "Local de Monitoria",
      data: data.data,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      motivo: motivoLimpo,
      enviadoEm
    };

    setMonitorAbsences(prev => [notice, ...prev]);

    if (matchedSchedule) {
      setMonitorSchedules(prev =>
        prev.map(s =>
          s.id === matchedSchedule.id
            ? { ...s, status: "ausencia_informada", motivoAusencia: motivoLimpo }
            : s
        )
      );
    }

    // Atualiza disponibilidade do monitor no local de destino caso ele estivesse alocado
    setSpaces(prev =>
      prev.map(s => {
        if (s.id !== data.espacoId) return s;
        const isCurrentSpaceMonitor =
          !s.nomeMonitor ||
          s.nomeMonitor.trim().toLowerCase() === data.monitorNome.trim().toLowerCase();
        if (!isCurrentSpaceMonitor) return s;
        return {
          ...s,
          monitorDisponivel: false,
          nomeMonitor: undefined,
          horarioMonitor: undefined
        };
      })
    );

    return {
      success: true,
      notice,
      message: `Aviso de não comparecimento enviado com sucesso para "${notice.espacoNome}" (${data.data}, ${data.horarioInicio}–${data.horarioFim}).`
    };
  };

  // Passo 3 (Item 10): Cancelar o check-in realizado por um aluno e devolver a vaga para outro aluno reservar
  const cancelStudentCheckInByMonitor = (
    reservationId: number,
    monitorNome: string,
    motivo?: string
  ) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) {
      return { success: false, message: "Reserva não encontrada." };
    }

    if (!reservation.checkIn || reservation.status !== "confirmada") {
      return {
        success: false,
        message: "Apenas reservas com check-in já realizado podem ter o check-in cancelado pelo monitor."
      };
    }

    const spaceId = reservation.espacoId;
    const space = spaces.find(s => s.id === spaceId);
    const canceladoEm = new Date().toISOString();
    const justificativa =
      (motivo || "").trim() ||
      "Check-in revogado pelo monitor responsável para liberação da vaga.";
    const mensagemCompleta = `Check-in cancelado pelo monitor ${monitorNome}: ${justificativa}`;

    setReservations(prev =>
      prev.map(r =>
        r.id === reservationId
          ? {
              ...r,
              checkIn: false,
              status: "cancelada",
              motivoCancelamento: mensagemCompleta,
              canceladoEm
            }
          : r
      )
    );

    // Regra dos 5 segundos: o check-in cancelado fica visível por 5 segundos e depois sai
    setTimeout(() => {
      setReservations(prev => prev.filter(r => r.id !== reservationId));
    }, 5000);

    const notice: CancellationNotice = {
      id: Date.now(),
      reservationId: reservation.id,
      espacoId: spaceId,
      espacoNome: space?.nome || "Espaço de Estudo",
      usuarioId: reservation.usuarioId,
      usuarioNome: reservation.usuarioNome,
      usuarioEmail: reservation.usuarioEmail,
      dataReserva: reservation.data,
      horarioInicio: reservation.horarioInicio,
      horarioFim: reservation.horarioFim,
      mensagem: mensagemCompleta,
      enviadoEm: canceladoEm
    };
    setCancellations(prev => [notice, ...prev]);

    // Decrementa a ocupação em 1 para que a vaga volte imediatamente a ficar disponível para outro aluno reservar
    setSpaces(prev =>
      prev.map(s =>
        s.id === spaceId ? { ...s, ocupacao: Math.max(0, s.ocupacao - 1) } : s
      )
    );

    return {
      success: true,
      message: `Check-in do aluno ${reservation.usuarioNome} cancelado! A vaga em "${space?.nome || 'Espaço de Estudo'}" voltou a ficar disponível para outro aluno reservar.`
    };
  };

  // =========================================================================
  // PASSO 4 — FUNÇÕES ADMINISTRATIVAS (CRIAR, ATUALIZAR E REMOVER TODOS OS DADOS)
  // =========================================================================

  // 1. Cadastrar novos lugares, vagas disponíveis e materiais
  const adminCreateSpace = (input: Omit<StudySpace, 'id'>) => {
    const nome = input.nome.trim();
    if (!nome) {
      return { success: false, message: 'Informe o nome do novo lugar / espaço de estudo.' };
    }

    const capacidade = Math.max(1, Math.round(Number(input.capacidade) || 1));
    const ocupacao = Math.min(capacidade, Math.max(0, Math.round(Number(input.ocupacao) || 0)));
    const salaIdentificacao =
      input.salaIdentificacao.trim() || `${input.bloco.trim() || 'Bloco Principal'} — ${input.andar.trim() || 'Térreo'}`;

    const newSpace: StudySpace = {
      id: Date.now(),
      nome,
      salaIdentificacao,
      bloco: input.bloco.trim() || 'Bloco Principal',
      andar: input.andar.trim() || 'Térreo',
      tipo: input.tipo,
      localizacao: input.localizacao.trim() || salaIdentificacao,
      capacidade,
      ocupacao,
      descricao: input.descricao.trim() || 'Espaço institucional destinado ao estudo.',
      perfilAmbiente: input.perfilAmbiente,
      horarioFuncionamento: input.horarioFuncionamento.trim() || '08:00 às 22:00',
      regras:
        input.regras.filter(Boolean).length > 0
          ? input.regras.map((r) => r.trim()).filter(Boolean)
          : ['Zelar pelos materiais do local', 'Realizar check-in no prazo regulamentar'],
      materiais:
        input.materiais.filter(Boolean).length > 0
          ? input.materiais.map((m) => m.trim()).filter(Boolean)
          : ['Wi-Fi institucional', 'Mesas e cadeiras de estudo'],
      professorResponsavel: input.professorResponsavel?.trim() || undefined,
      horarioProfessor: input.horarioProfessor?.trim() || undefined,
      monitorDisponivel: Boolean(input.monitorDisponivel),
      nomeMonitor: input.monitorDisponivel ? input.nomeMonitor?.trim() || undefined : undefined,
      horarioMonitor: input.monitorDisponivel ? input.horarioMonitor?.trim() || undefined : undefined
    };

    setSpaces((prev) => [newSpace, ...prev]);

    const vagasDisponiveis = newSpace.capacidade - newSpace.ocupacao;
    return {
      success: true,
      space: newSpace,
      message: `Novo lugar "${newSpace.nome}" cadastrado com sucesso (${vagasDisponiveis} vaga(s) disponível(is) e ${newSpace.materiais.length} material(is))!`
    };
  };

  // Atualizar qualquer lugar, vagas disponíveis, capacidade, materiais ou equipe
  const adminUpdateSpace = (spaceId: number, updates: Partial<Omit<StudySpace, 'id'>>) => {
    const existing = spaces.find((s) => s.id === spaceId);
    if (!existing) {
      return { success: false, message: 'Espaço não encontrado.' };
    }

    const nextCapacidade =
      updates.capacidade !== undefined
        ? Math.max(1, Math.round(Number(updates.capacidade) || 1))
        : existing.capacidade;

    const nextOcupacao =
      updates.ocupacao !== undefined
        ? Math.min(nextCapacidade, Math.max(0, Math.round(Number(updates.ocupacao) || 0)))
        : Math.min(nextCapacidade, existing.ocupacao);

    const nextNome = updates.nome !== undefined ? updates.nome.trim() || existing.nome : existing.nome;
    const nextBloco = updates.bloco !== undefined ? updates.bloco.trim() || existing.bloco : existing.bloco;
    const nextAndar = updates.andar !== undefined ? updates.andar.trim() || existing.andar : existing.andar;
    const nextSala =
      updates.salaIdentificacao !== undefined
        ? updates.salaIdentificacao.trim() || `${nextBloco} — ${nextAndar}`
        : existing.salaIdentificacao;

    const updatedSpace: StudySpace = {
      ...existing,
      ...updates,
      nome: nextNome,
      bloco: nextBloco,
      andar: nextAndar,
      salaIdentificacao: nextSala,
      localizacao: updates.localizacao !== undefined ? updates.localizacao.trim() || nextSala : existing.localizacao,
      capacidade: nextCapacidade,
      ocupacao: nextOcupacao,
      materiais:
        updates.materiais !== undefined
          ? updates.materiais.map((m) => m.trim()).filter(Boolean)
          : existing.materiais,
      regras:
        updates.regras !== undefined
          ? updates.regras.map((r) => r.trim()).filter(Boolean)
          : existing.regras
    };

    setSpaces((prev) => prev.map((s) => (s.id === spaceId ? updatedSpace : s)));

    if (nextNome !== existing.nome) {
      setSpaceNotices((prev) =>
        prev.map((n) => (n.espacoId === spaceId ? { ...n, espacoNome: nextNome } : n))
      );
      setMonitorSchedules((prev) =>
        prev.map((m) => (m.espacoId === spaceId ? { ...m, espacoNome: nextNome } : m))
      );
    }

    return {
      success: true,
      space: updatedSpace,
      message: `Espaço "${updatedSpace.nome}" atualizado (${updatedSpace.capacidade - updatedSpace.ocupacao} vaga(s) livre(s), ${updatedSpace.materiais.length} material(is))!`
    };
  };

  // Remover espaço do sistema (limpando vínculos dependentes)
  const adminDeleteSpace = (spaceId: number) => {
    const existing = spaces.find((s) => s.id === spaceId);
    if (!existing) {
      return { success: false, message: 'Espaço não encontrado.' };
    }

    setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
    setEvents((prev) => prev.filter((e) => e.espacoId !== spaceId));
    setWaitlist((prev) => prev.filter((w) => w.espacoId !== spaceId));
    setSpaceNotices((prev) => prev.filter((n) => n.espacoId !== spaceId));
    setReservations((prev) => prev.filter((r) => r.espacoId !== spaceId));
    setMonitorSchedules((prev) => prev.filter((m) => m.espacoId !== spaceId));

    return {
      success: true,
      message: `Lugar "${existing.nome}" e seus registros vinculados foram removidos do sistema.`
    };
  };

  // 2. Avisos sobre os locais (Criar, Atualizar e Remover)
  const adminCreateSpaceNotice = (input: {
    espacoId: number;
    titulo: string;
    mensagem: string;
    prioridade: SpaceNoticePriority;
    autorNome: string;
    ativo?: boolean;
  }) => {
    const space = spaces.find((s) => s.id === input.espacoId);
    if (!space) {
      return { success: false, message: 'Selecione um local válido para publicar o aviso.' };
    }

    const titulo = input.titulo.trim();
    const mensagem = input.mensagem.trim();
    if (!titulo || !mensagem) {
      return { success: false, message: 'Preencha o título e a mensagem do aviso sobre o local.' };
    }

    const newNotice: SpaceNotice = {
      id: Date.now(),
      espacoId: space.id,
      espacoNome: space.nome,
      titulo,
      mensagem,
      prioridade: input.prioridade,
      autorNome: input.autorNome.trim() || 'Administração',
      ativo: input.ativo !== undefined ? input.ativo : true,
      criadoEm: new Date().toISOString()
    };

    setSpaceNotices((prev) => [newNotice, ...prev]);

    return {
      success: true,
      notice: newNotice,
      message: `Aviso "${newNotice.titulo}" publicado para "${space.nome}"!`
    };
  };

  const adminUpdateSpaceNotice = (
    noticeId: number,
    updates: {
      espacoId: number;
      titulo: string;
      mensagem: string;
      prioridade: SpaceNoticePriority;
      ativo: boolean;
    }
  ) => {
    const existing = spaceNotices.find((n) => n.id === noticeId);
    if (!existing) {
      return { success: false, message: 'Aviso não encontrado.' };
    }

    const space = spaces.find((s) => s.id === updates.espacoId);
    const titulo = updates.titulo.trim();
    const mensagem = updates.mensagem.trim();
    if (!titulo || !mensagem) {
      return { success: false, message: 'O título e a mensagem do aviso são obrigatórios.' };
    }

    const updatedNotice: SpaceNotice = {
      ...existing,
      espacoId: updates.espacoId,
      espacoNome: space?.nome || existing.espacoNome,
      titulo,
      mensagem,
      prioridade: updates.prioridade,
      ativo: updates.ativo,
      atualizadoEm: new Date().toISOString()
    };

    setSpaceNotices((prev) => prev.map((n) => (n.id === noticeId ? updatedNotice : n)));

    return {
      success: true,
      message: `Aviso "${updatedNotice.titulo}" atualizado com sucesso!`
    };
  };

  const adminDeleteSpaceNotice = (noticeId: number) => {
    const existing = spaceNotices.find((n) => n.id === noticeId);
    if (!existing) {
      return { success: false, message: 'Aviso não encontrado.' };
    }

    setSpaceNotices((prev) => prev.filter((n) => n.id !== noticeId));
    return {
      success: true,
      message: `Aviso "${existing.titulo}" removido do sistema.`
    };
  };

  // 3. Reservas (Atualizar e Remover)
  const adminUpdateReservation = (
    reservationId: number,
    updates: {
      usuarioNome: string;
      usuarioEmail?: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: 'reservada' | 'confirmada' | 'cancelada';
      checkIn: boolean;
      motivoCancelamento?: string;
    }
  ) => {
    const existing = reservations.find((r) => r.id === reservationId);
    if (!existing) {
      return { success: false, message: 'Reserva não encontrada.' };
    }

    const wasActive = existing.status !== 'cancelada';
    const willBeActive = updates.status !== 'cancelada';

    const updatedReservation: Reservation = {
      ...existing,
      usuarioNome: updates.usuarioNome.trim() || existing.usuarioNome,
      usuarioEmail: updates.usuarioEmail?.trim() || existing.usuarioEmail,
      espacoId: updates.espacoId,
      data: updates.data,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim,
      status: updates.status,
      checkIn: updates.status === 'confirmada' ? true : updates.status === 'cancelada' ? false : updates.checkIn,
      motivoCancelamento: updates.motivoCancelamento?.trim() || existing.motivoCancelamento
    };

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? updatedReservation : r))
    );

    // Reconciliar ocupação dos espaços caso espaço ou status tenha mudado
    if (existing.espacoId !== updates.espacoId || wasActive !== willBeActive) {
      setSpaces((prev) =>
        prev.map((s) => {
          let delta = 0;
          if (wasActive && s.id === existing.espacoId) delta -= 1;
          if (willBeActive && s.id === updates.espacoId) delta += 1;
          if (delta === 0) return s;
          return {
            ...s,
            ocupacao: Math.min(s.capacidade, Math.max(0, s.ocupacao + delta))
          };
        })
      );
    }

    return {
      success: true,
      message: `Reserva de "${updatedReservation.usuarioNome}" atualizada com sucesso!`
    };
  };

  const adminDeleteReservation = (reservationId: number) => {
    const existing = reservations.find((r) => r.id === reservationId);
    if (!existing) {
      return { success: false, message: 'Reserva não encontrada.' };
    }

    setReservations((prev) => prev.filter((r) => r.id !== reservationId));

    if (existing.status !== 'cancelada') {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === existing.espacoId
            ? { ...s, ocupacao: Math.max(0, s.ocupacao - 1) }
            : s
        )
      );
    }

    return {
      success: true,
      message: `Reserva de "${existing.usuarioNome}" removida do sistema e ocupação reconciliada.`
    };
  };

  // 4. Fila de Espera (Atualizar e Remover)
  const adminUpdateWaitlistEntry = (
    entryId: number,
    updates: {
      nomeAluno: string;
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      posicao: number;
    }
  ) => {
    const existing = waitlist.find((w) => w.id === entryId);
    if (!existing) {
      return { success: false, message: 'Registro da fila de espera não encontrado.' };
    }

    const updated: WaitlistEntry = {
      ...existing,
      nomeAluno: updates.nomeAluno.trim() || existing.nomeAluno,
      espacoId: updates.espacoId,
      data: updates.data,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim,
      posicao: Math.max(1, Math.round(Number(updates.posicao) || 1))
    };

    setWaitlist((prev) => prev.map((w) => (w.id === entryId ? updated : w)));

    return {
      success: true,
      message: `Posição na fila de espera de "${updated.nomeAluno}" atualizada!`
    };
  };

  const adminDeleteWaitlistEntry = (entryId: number) => {
    const existing = waitlist.find((w) => w.id === entryId);
    if (!existing) {
      return { success: false, message: 'Registro da fila de espera não encontrado.' };
    }
    removeFromWaitlist(entryId);
    return {
      success: true,
      message: `"${existing.nomeAluno}" removido da fila de espera.`
    };
  };

  // 5. Eventos dos Espaços (Criar, Atualizar e Remover)
  const adminCreateEvent = (input: Omit<Event, 'id'>) => {
    const nome = input.nome.trim();
    if (!nome) {
      return { success: false, message: 'Informe o nome do evento.' };
    }
    if (input.horarioInicio >= input.horarioFim) {
      return { success: false, message: 'O horário final do evento deve ser posterior ao inicial.' };
    }

    const newEvent: Event = {
      id: Date.now(),
      espacoId: input.espacoId,
      nome,
      descricao: input.descricao.trim() || 'Atividade institucional agendada.',
      data: input.data,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim
    };

    setEvents((prev) => [newEvent, ...prev]);
    return {
      success: true,
      event: newEvent,
      message: `Evento "${newEvent.nome}" cadastrado com sucesso!`
    };
  };

  const adminUpdateEvent = (eventId: number, updates: Omit<Event, 'id'>) => {
    const existing = events.find((e) => e.id === eventId);
    if (!existing) {
      return { success: false, message: 'Evento não encontrado.' };
    }
    if (updates.horarioInicio >= updates.horarioFim) {
      return { success: false, message: 'O horário final do evento deve ser posterior ao inicial.' };
    }

    const updated: Event = {
      ...existing,
      espacoId: updates.espacoId,
      nome: updates.nome.trim() || existing.nome,
      descricao: updates.descricao.trim() || existing.descricao,
      data: updates.data,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim
    };

    setEvents((prev) => prev.map((e) => (e.id === eventId ? updated : e)));
    return {
      success: true,
      message: `Evento "${updated.nome}" atualizado com sucesso!`
    };
  };

  const adminDeleteEvent = (eventId: number) => {
    const existing = events.find((e) => e.id === eventId);
    if (!existing) {
      return { success: false, message: 'Evento não encontrado.' };
    }
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    return {
      success: true,
      message: `Evento "${existing.nome}" removido do sistema.`
    };
  };

  // 6. Escalas de Monitoria, Avisos de Ausência e Cancelamentos (Atualizar e Remover)
  const adminUpdateMonitorSchedule = (
    scheduleId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      status: 'agendado' | 'ausencia_informada';
      motivoAusencia?: string;
    }
  ) => {
    const existing = monitorSchedules.find((s) => s.id === scheduleId);
    if (!existing) {
      return { success: false, message: 'Escala de monitoria não encontrada.' };
    }
    const space = spaces.find((sp) => sp.id === updates.espacoId);
    const updated: MonitorDestinationSchedule = {
      ...existing,
      espacoId: updates.espacoId,
      espacoNome: space?.nome || existing.espacoNome,
      data: updates.data,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim,
      status: updates.status,
      motivoAusencia: updates.motivoAusencia?.trim() || undefined
    };

    setMonitorSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? updated : s))
    );
    return {
      success: true,
      message: `Escala do monitor "${updated.monitorNome}" atualizada com sucesso!`
    };
  };

  const adminDeleteMonitorSchedule = (scheduleId: number) => {
    const existing = monitorSchedules.find((s) => s.id === scheduleId);
    if (!existing) {
      return { success: false, message: 'Escala de monitoria não encontrada.' };
    }
    setMonitorSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    return {
      success: true,
      message: `Escala de destino de "${existing.monitorNome}" removida.`
    };
  };

  const adminUpdateMonitorAbsence = (
    absenceId: number,
    updates: {
      espacoId: number;
      data: string;
      horarioInicio: string;
      horarioFim: string;
      motivo: string;
    }
  ) => {
    const existing = monitorAbsences.find((a) => a.id === absenceId);
    if (!existing) {
      return { success: false, message: 'Aviso de ausência não encontrado.' };
    }
    const space = spaces.find((sp) => sp.id === updates.espacoId);
    const updated: MonitorAbsenceNotice = {
      ...existing,
      espacoId: updates.espacoId,
      espacoNome: space?.nome || existing.espacoNome,
      data: updates.data,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim,
      motivo: updates.motivo.trim() || existing.motivo
    };

    setMonitorAbsences((prev) =>
      prev.map((a) => (a.id === absenceId ? updated : a))
    );
    return {
      success: true,
      message: `Aviso de ausência de "${updated.monitorNome}" atualizado!`
    };
  };

  const adminDeleteMonitorAbsence = (absenceId: number) => {
    const existing = monitorAbsences.find((a) => a.id === absenceId);
    if (!existing) {
      return { success: false, message: 'Aviso de ausência não encontrado.' };
    }
    setMonitorAbsences((prev) => prev.filter((a) => a.id !== absenceId));
    return {
      success: true,
      message: `Aviso de ausência de "${existing.monitorNome}" removido.`
    };
  };

  const adminUpdateCancellationNotice = (
    noticeId: number,
    updates: {
      mensagem: string;
      dataReserva: string;
      horarioInicio: string;
      horarioFim: string;
    }
  ) => {
    const existing = cancellations.find((c) => c.id === noticeId);
    if (!existing) {
      return { success: false, message: 'Registro de cancelamento não encontrado.' };
    }
    const updated: CancellationNotice = {
      ...existing,
      mensagem: updates.mensagem.trim() || existing.mensagem,
      dataReserva: updates.dataReserva,
      horarioInicio: updates.horarioInicio,
      horarioFim: updates.horarioFim
    };
    setCancellations((prev) => prev.map((c) => (c.id === noticeId ? updated : c)));
    return {
      success: true,
      message: `Registro de cancelamento de "${updated.usuarioNome}" atualizado!`
    };
  };

  const adminDeleteCancellationNotice = (noticeId: number) => {
    const existing = cancellations.find((c) => c.id === noticeId);
    if (!existing) {
      return { success: false, message: 'Registro de cancelamento não encontrado.' };
    }
    setCancellations((prev) => prev.filter((c) => c.id !== noticeId));
    return {
      success: true,
      message: `Registro de cancelamento de "${existing.usuarioNome}" removido.`
    };
  };

  // Limpar todos os dados do LocalStorage e redefinir o estado em memória
  const resetToDefaults = useCallback(() => {
    setSpaces(defaultSpaces);
    setEvents(defaultEvents);
    setReservations(getSampleReservations());
    setWaitlist(getSampleWaitlist());
    setCancellations([]);
    setMonitorSchedules(defaultMonitorSchedules);
    setMonitorAbsences([]);
    setSpaceNotices(defaultSpaceNotices);
    clearAllLocalStorage();
  }, []);

  return {
    spaces: synchronizedSpaces,
    reservations,
    events,
    waitlist,
    cancellations,
    monitorSchedules,
    monitorAbsences,
    spaceNotices,
    isLoaded,
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
    resetToDefaults
  };
}
