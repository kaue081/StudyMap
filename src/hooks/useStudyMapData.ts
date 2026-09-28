import { useState, useEffect, useCallback } from 'react';
import { StudySpace, Reservation, Event, WaitlistEntry, RecommendationCriteria } from '../types';
import { defaultSpaces, defaultEvents } from '../data/mockData';

export function useStudyMapData() {
  const [spaces, setSpaces] = useState<StudySpace[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedSpaces = localStorage.getItem('studyMap_spaces');
      if (storedSpaces) {
        setSpaces(JSON.parse(storedSpaces));
      } else {
        setSpaces(defaultSpaces);
        localStorage.setItem('studyMap_spaces', JSON.stringify(defaultSpaces));
      }

      const storedEvents = localStorage.getItem('studyMap_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(defaultEvents);
        localStorage.setItem('studyMap_events', JSON.stringify(defaultEvents));
      }

      const storedReservations = localStorage.getItem('studyMap_reservations');
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      } else {
        // Exemplo inicial de reserva ativa para teste de check-in imediato
        const sampleReservation: Reservation = {
          id: 101,
          usuarioNome: "Estudante Visitante",
          espacoId: 1,
          data: new Date().toISOString().split('T')[0],
          horarioInicio: "14:00",
          horarioFim: "16:00",
          status: "reservada",
          checkIn: false,
          criadoEm: new Date().toISOString()
        };
        setReservations([sampleReservation]);
        localStorage.setItem('studyMap_reservations', JSON.stringify([sampleReservation]));
      }

      const storedWaitlist = localStorage.getItem('studyMap_waitlist');
      if (storedWaitlist) {
        setWaitlist(JSON.parse(storedWaitlist));
      } else {
        // Exemplo inicial de fila de espera para a Sala 203 (que está lotada)
        const sampleWaitlist: WaitlistEntry[] = [
          {
            id: 201,
            espacoId: 3,
            nomeAluno: "João Pedro",
            data: new Date().toISOString().split('T')[0],
            horarioInicio: "15:00",
            horarioFim: "17:00",
            posicao: 1,
            criadoEm: new Date().toISOString()
          },
          {
            id: 202,
            espacoId: 3,
            nomeAluno: "Maria Eduarda",
            data: new Date().toISOString().split('T')[0],
            horarioInicio: "15:00",
            horarioFim: "17:00",
            posicao: 2,
            criadoEm: new Date().toISOString()
          }
        ];
        setWaitlist(sampleWaitlist);
        localStorage.setItem('studyMap_waitlist', JSON.stringify(sampleWaitlist));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do LocalStorage:", e);
      setSpaces(defaultSpaces);
      setEvents(defaultEvents);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('studyMap_spaces', JSON.stringify(spaces));
      localStorage.setItem('studyMap_reservations', JSON.stringify(reservations));
      localStorage.setItem('studyMap_events', JSON.stringify(events));
      localStorage.setItem('studyMap_waitlist', JSON.stringify(waitlist));
    }
  }, [spaces, reservations, events, waitlist, isLoaded]);

  // Checar se há conflito com eventos agendados
  const checkEventConflict = useCallback((espacoId: number, data: string, inicio: string, fim: string) => {
    const conflictingEvent = events.find(event => {
      if (event.espacoId !== espacoId || event.data !== data) return false;
      // Checagem de sobreposição de horário
      return (inicio < event.horarioFim && fim > event.horarioInicio);
    });
    return conflictingEvent;
  }, [events]);

  // Realizar nova reserva
  const addReservation = (data: {
    espacoId: number;
    usuarioNome: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
  }) => {
    const space = spaces.find(s => s.id === data.espacoId);
    if (!space) {
      return { success: false, message: "Espaço não encontrado." };
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

  // Cancelar reserva (libera vaga e atende fila de espera)
  const cancelReservation = (reservationId: number) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return { success: false, message: "Reserva não encontrada." };

    const spaceId = reservation.espacoId;

    // Atualiza status da reserva para cancelada
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: "cancelada" } : r
    ));

    // Verifica se há fila de espera para esse espaço
    const { newWaitlist, promotedReservation } = processWaitlistPromotion(spaceId, waitlist);

    if (promotedReservation) {
      // Vaga passa diretamente para o primeiro da fila!
      setWaitlist(newWaitlist);
      setReservations(prev => [promotedReservation, ...prev]);
      return {
        success: true,
        promoted: true,
        message: `Reserva cancelada. A vaga foi automaticamente concedida ao primeiro da fila de espera (${promotedReservation.usuarioNome})!`
      };
    } else {
      // Diminui a ocupação normalmente
      setSpaces(prev => prev.map(s => 
        s.id === spaceId ? { ...s, ocupacao: Math.max(0, s.ocupacao - 1) } : s
      ));
      return {
        success: true,
        promoted: false,
        message: "Reserva cancelada com sucesso. A vaga foi liberada!"
      };
    }
  };

  // Realizar Check-in
  const performCheckIn = (reservationId: number) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: "confirmada", checkIn: true } : r
    ));
    return { success: true, message: "Check-in realizado com sucesso! Presença confirmada no espaço." };
  };

  // Simular Cancelamento por Ausência de Check-in (Regra explícita do ESCOPE.md)
  const expireCheckIn = (reservationId: number) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation || reservation.checkIn || reservation.status === "cancelada") {
      return { success: false, message: "Apenas reservas ativas sem check-in podem ser expiradas." };
    }

    return cancelReservation(reservationId);
  };

  // Entrar na Fila de Espera
  const addToWaitlist = (data: {
    espacoId: number;
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

  // Restaurar dados originais para demonstrações
  const resetToDefaults = () => {
    localStorage.removeItem('studyMap_spaces');
    localStorage.removeItem('studyMap_reservations');
    localStorage.removeItem('studyMap_events');
    localStorage.removeItem('studyMap_waitlist');
    setSpaces(defaultSpaces);
    setEvents(defaultEvents);
    setReservations([]);
    setWaitlist([]);
    window.location.reload();
  };

  return {
    spaces,
    reservations,
    events,
    waitlist,
    isLoaded,
    addReservation,
    cancelReservation,
    performCheckIn,
    expireCheckIn,
    addToWaitlist,
    removeFromWaitlist,
    getRecommendation,
    checkEventConflict,
    resetToDefaults
  };
}
