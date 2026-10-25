# Task 01: Implementar Autenticação MFA (Multi-Fator)

## 🎯 Objetivo Principal
criar uma site para organizar os espaços de um anbiente escolar destindos para o estudo.
* **Referência:** `docs/ESCOPE.md`
---

## 📋 Passos de Implementação (Implementation Steps) 
[x] - Feito
[~] - nada feito ou em desenvolvimento
[ ] - pendente
- [x] **Passo 1:** * Implementar login de acesso para os alunos, monitores e administradores.
* Informações de login: Aluno - Numero da matricula, email e senha.
* Informações de login: monitor - token para monitor, email e senha.
* Informações de login: Administrador - email, senha e tocken
* Implementar busca pela matricula, nome e email.

- [x] **Passo 2:** função do perfil: aluno -
 1. realizar um cadastro e logins.
 2. os emails devem ser diferentes.
 3. funções para recuperar senha.
 4. reservar um unico local por dia.
 5. ter uma lista de todos os locais disponiveis no que antecede o dia do agendamento do local.
 6. checkin faltando 10 minutos para o horario do local agendado ou cancelar a reserva.
 7. função para atualizar e ver a senha atual.
 8. lista de materiais que o local pode disponibilizar.
 9. Consultar o monitor do local agendado.
 10. Enviar uma informção de cancelamento da vaga.

- [x] **Passo 3:** função do perfil: 
monitor - 1. lista de todos 
 1. Agendar o local de destino.
 2. Enviar um aviso de não comparecimento  no local de destino.
 3.realizar um cadastro e logins.
 4. os emails devem ser diferentes.
 5. funções para recuperar senha.
 6. reservar um unico local por dia.
 7. função para atualizar e ver a senha atual.
 8.local para colocar um token que ira validar que ele e um monitor disponibilizado pelo admin1, para cadastrar novos os monitores e adms.
 9.lista de alunos no local que ele foi registrado.
 10. ter o poder de cancelar o checkin realizado e a vaga tem que voltar a ser dispnivel para outro aluno reservar.
                                            
- [x] **Passo 4:** função do perfil:
 ADM - 1. funções para criar: novo cadastro de aluno, gerar token de verificação de monitor e novos adms, cadastrar novos lugares, vagas disponiveis materiais, avisos sobre os locais. 
 2. criar uma listas de todos os dados do sistema.
 3. atualizar todos os dados do sistema.
 4. poder remover dados do sistema.
 5. realizar um cadastro e logins.
 6. os emails devem ser diferentes.
 7. funções para recuperar senha.
- [ ] **Passo 5:** 
- [ ] **Passo 6:** 
---

## 🔍 Descobertas e Notas do Caminho
- **Passo 1 concluído (24-10-2026):**
  - Criado o hook `src/hooks/useAuth.ts` e a interface `src/components/LoginScreen.tsx` com validação Multi-Fator (MFA) persistida via `localStorage` para cada perfil:
    - **Aluno:** número da matrícula, e-mail e senha.
    - **Monitor:** token para monitor, e-mail e senha.
    - **Administrador:** e-mail, senha e token de administrador.
  - Criado o módulo `src/components/UserSearchSection.tsx` permitindo busca unificada ou filtrada por **matrícula**, **nome** e **e-mail**, disponível na tela inicial e na página **Usuários & Busca** do sistema autenticado.
  - Cadastrados perfis iniciais de demonstração em `src/data/mockData.ts` para testes imediatos de login e busca.
- **Migração para rotas de páginas App Router & Passo 2 concluído (25-10-2026):**
  - Substituída a navegação por abas/âncoras por páginas reais do Next.js App Router (`/`, `/login`, `/cadastro`, `/recuperar-senha`, `/espacos`, `/ia`, `/reservas`, `/fila`, `/usuarios`, `/configuracoes`) centralizadas em `src/context/StudyMapContext.tsx` e com animações de transição em `src/app/template.tsx`.
  - Implementados **Alertas do React** (`src/components/ReactAlert.tsx`), **criptografia dos dados no `localStorage`** (`src/utils/cryptoStorage.ts`) enquanto o sistema está em uso e limpeza integral (`localStorage.clear()`) ao clicar em **Sair**.
  - Centralizados os formulários de **Login** e **Cadastro** no meio da tela, simplificando o login exclusivamente para **e-mail e senha** (`src/components/LoginScreen.tsx`). Todo novo cadastro inicia com o perfil **Aluno** e só eleva para **Monitor** ou **Administrador** ao validar um token institucional em **Configurações** (`src/app/configuracoes/page.tsx` / `applyRoleToken`).
  - Ajustada a **responsividade integral para PC, Tablet e Celular** sem scroll lateral (`overflow-x: clip`, `Viewport` explícito em `src/app/layout.tsx`, menu mobile expansível em `src/components/Header.tsx`, grids adaptativos e `flex-wrap` em todos os filtros, cards e modais), além de restringir a página **Usuários & Busca** (`/usuarios`) exclusivamente para **Monitores** e **Administradores** (oculta para **Alunos**).
  - Implementadas todas as 10 funções do perfil **Aluno** (`Passo 2`):
    1. Cadastro de novos alunos em `src/app/cadastro/page.tsx` (`registerAluno` em `src/hooks/useAuth.ts`) e login por e-mail e senha.
    2. Validação estrita de unicidade de e-mail (`os emails devem ser diferentes`) e de matrícula em todo o sistema.
    3. Fluxo em duas etapas para recuperação e redefinição de senha em `src/app/recuperar-senha/page.tsx` (`verifyRecoveryIdentity` e `resetPassword`).
    4. Bloqueio de múltiplas reservas no mesmo dia por estudante (`reservar um único local por dia`) em `addReservation` (`src/hooks/useStudyMapData.ts`).
    5. Painel de consulta antecipada (véspera) em `src/app/espacos/page.tsx` listando todos os locais disponíveis e sem conflitos de eventos para a data do agendamento (`getAvailableSpacesForDate`).
    6. Validação da janela de check-in liberada faltando **10 minutos** para o horário inicial agendado (`getCheckInWindowInfo` / `performCheckIn`), com simulador didático de 10 minutos e opção de cancelamento da reserva.
    7. Página `src/app/configuracoes/page.tsx` permitindo **ver a senha atual** (com alternância mostrar/ocultar), **atualizar a senha** (`updateCurrentPassword`) e validar tokens de elevação de perfil.
    8. Exibição da lista completa de materiais disponibilizados por cada local nos cards de espaços, no modal de reserva e nos cards de reservas agendadas.
    9. Modal de consulta detalhada do **monitor do local agendado** (nome, turno de plantão, sala e e-mail institucional) em `src/components/ReservationSection.tsx`.
    10. Envio e histórico de **informação de cancelamento da vaga** (`CancellationNotice` persistido criptografado em `studyMap_cancellations`), liberando a vaga ou promovendo automaticamente o próximo aluno da fila de espera.
- **Passo 3 concluído (26-10-2026):**
  - Criada a página exclusiva **Painel do Monitor** em `src/app/monitoria/page.tsx` e o módulo `src/components/MonitorPanelSection.tsx` (visível no `Header.tsx` para **Monitores** e **Administradores**, e bloqueado com redirecionamento e `ReactAlert` para **Alunos** em `src/context/StudyMapContext.tsx`).
  - Adicionadas as interfaces `MonitorDestinationSchedule` e `MonitorAbsenceNotice` em `src/types/index.ts`, escalas iniciais `defaultMonitorSchedules` e vínculo `espacoMonitoriaId` em `src/data/mockData.ts`, com persistência criptografada em `studyMap_monitorSchedules` e `studyMap_monitorAbsences` (`src/hooks/useStudyMapData.ts`) e limpeza total ao clicar em **Sair**.
  - Implementadas todas as funções do perfil **Monitor** (`Passo 3`):
    - **Lista de todos os locais do campus** com filtro por nome/bloco/tipo, ocupação em tempo real, vagas livres e monitor de plantão.
    1. **Agendar o local de destino** (`scheduleMonitorDestination`), atualizando automaticamente o plantão do espaço (`monitorDisponivel`, `nomeMonitor`, `horarioMonitor`) e sincronizando o local registrado do monitor (`updateMonitorRegisteredSpace`), respeitando o limite de 1 destino agendado por dia.
    2. **Enviar aviso de não comparecimento no local de destino** (`sendMonitorAbsenceNotice`), registrando a justificativa em `MonitorAbsenceNotice`, marcando a escala como `"ausencia_informada"` e desativando a disponibilidade do monitor no espaço correspondente.
    3. **Cadastro e login** unificados (`/cadastro` iniciando como Aluno + `/login` com e-mail e senha, além das contas de monitores pré-cadastradas).
    4. **Unicidade de e-mails** garantida em todo o sistema (`registerAluno`).
    5. **Recuperação de senha** em duas etapas em `/recuperar-senha` validando e-mail + matrícula ou token do monitor (`MON-...`).
    6. **Reservar um único local por dia** aplicado tanto para reservas de estudo (`addReservation`) quanto para escalas diárias de destino (`scheduleMonitorDestination`).
    7. **Ver a senha atual e atualizar a senha** em `src/app/configuracoes/page.tsx` (`updateCurrentPassword`).
    8. **Validação de token disponibilizado pelo Admin 1** (`Coordenação Geral (Admin 1)`) em `src/app/configuracoes/page.tsx` (`applyRoleToken`), permitindo elevar contas recém-cadastradas para **Monitor** (`MON-2026-201..203`, com seleção do local de registro da monitoria) ou **Administrador** (`ADM-2026-201..202`).
    9. **Lista de alunos no local registrado** exibindo nome, matrícula, e-mail, data, horário e status de check-in dos estudantes agendados no espaço do monitor (`espacoMonitoriaId` / `espacoMonitoria`).
    10. **Poder de cancelar o check-in realizado e devolver a vaga** (`cancelStudentCheckInByMonitor` no Painel do Monitor e em `/reservas`), revogando o check-in do estudante, registrando o aviso no histórico e decrementando `ocupacao` em `1` para que a vaga volte imediatamente a ficar disponível para outro aluno reservar.
- **Passo 4 concluído (27-10-2026):**
  - Criada a página exclusiva **Painel Geral do Administrador** em `src/app/admin/page.tsx` e o módulo `src/components/AdminPanelSection.tsx` (visível no `Header.tsx` e em `/configuracoes` exclusivamente para o perfil **Administrador**, e bloqueada com alerta reativo `ReactAlert` e redirecionamento para Alunos e Monitores em `src/context/StudyMapContext.tsx`).
  - Adicionado o modelo `SpaceNotice` (`SpaceNoticePriority`) em `src/types/index.ts`, avisos iniciais `defaultSpaceNotices` em `src/data/mockData.ts` e persistência criptografada em `studyMap_spaceNotices` (`src/hooks/useStudyMapData.ts`), exibindo os avisos oficiais diretamente nos cards de `src/app/espacos/page.tsx` e em `src/components/SpaceDetailModal.tsx`.
  - Implementadas todas as 7 funções do perfil **Administrador** (`Passo 4`):
    1. **Funções para criar:**
       - Novo cadastro de aluno sem encerrar a sessão do ADM (`adminCreateUser` em `src/hooks/useAuth.ts`).
       - Geração de tokens de verificação para novos **Monitores** (`MON-...`) e novos **Administradores** (`ADM-...`) com sugestão automática ou código personalizado (`adminGenerateRoleToken`).
       - Cadastro de novos lugares (`StudySpace`) definindo capacidade, **vagas disponíveis**, **materiais**, regras e professor responsável (`adminCreateSpace` em `src/hooks/useStudyMapData.ts`).
       - Publicação de **avisos sobre os locais** (`adminCreateSpaceNotice`) e eventos institucionais (`adminCreateEvent`).
    2. **Lista geral de todos os dados do sistema:** visualização consolidada, contadores em tempo real e filtro unificado para **Usuários**, **Tokens**, **Lugares, Vagas & Materiais**, **Avisos dos Locais**, **Reservas**, **Fila de Espera**, **Eventos**, **Escalas de Monitoria**, **Avisos de Ausência** e **Cancelamentos**.
    3. **Atualizar todos os dados do sistema:** modais de edição dedicados para atualizar qualquer registro em todas as coleções (`adminUpdateUser`, `adminUpdateRoleToken`, `adminUpdateSpace` — incluindo ajuste direto de vagas disponíveis e materiais —, `adminUpdateSpaceNotice`, `adminUpdateReservation`, `adminUpdateWaitlistEntry`, `adminUpdateEvent`, `adminUpdateMonitorSchedule`, `adminUpdateMonitorAbsence` e `adminUpdateCancellationNotice`).
    4. **Remover dados do sistema:** remoção com confirmação e integridade referencial para todas as coleções (`adminDeleteUser` — protegendo a sessão ativa do próprio ADM —, `adminDeleteRoleToken`, `adminDeleteSpace`, `adminDeleteSpaceNotice`, `adminDeleteReservation`, `adminDeleteWaitlistEntry`, `adminDeleteEvent`, `adminDeleteMonitorSchedule`, `adminDeleteMonitorAbsence` e `adminDeleteCancellationNotice`).
    5. **Cadastro e login:** login unificado por e-mail e senha (`/login`) para ADMs pré-cadastrados e fluxo de cadastro (`/cadastro`) seguido de validação de token `ADM-...` em `/configuracoes` (`applyRoleToken`) para novos ADMs.
    6. **Unicidade de e-mails:** validada na criação e também na atualização administrativa de contas (`registerAluno`, `adminCreateUser` e `adminUpdateUser`).
    7. **Recuperação de senha:** fluxo em duas etapas em `src/app/recuperar-senha/page.tsx` validando e-mail + matrícula ou token administrativo (`ADM-...`).

---
