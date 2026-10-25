# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## - 28-09-2026
### Adicionado
- Criação do Projeto StudyMap.
- definimos os problema real que vamos resolver apartir de um software.
- Criamos o ESCOPE.md, localiizado dentro de docs\ESCOPE.md 

### Modificado
- Adicionamos mais argumentos no ESCOPE.md 

### Corrigido
- n.f.


## - 29-09-2026
### Adicionado
- n.f.

### Modificado
- n.f.

### Corrigido
- Atualizada atualizamos o ESCOPE.md


## - 19-10-2026

### Adicionado
- criamos o CHANGELOG.md localizado em docs\CHANGELOG.md, e TASKS.MD localizado em docs\TASKS.md

### Modificado
- n.f.

### Corrigido
- n.f

## - 20-10-2026

### Adicionado
- Adicionamos as funções de cada perfil do sistema que são: ADM, Monitor e Aluno

### Modificado
- n.f.

### Corrigido
- organização dos passos 2, 3 e 4.

## - 24-10-2026

### Adicionado
- Preenchendo o CHANGELOg.md, com as devidas criações, modificações e correções de acordo com a data operada.
- Implementação do **Passo 1** (`docs/TASKS.md`): sistema de login Multi-Fator (MFA) persistido em `localStorage` para **Alunos** (número da matrícula, e-mail e senha), **Monitores** (token para monitor, e-mail e senha) e **Administradores** (e-mail, senha e token) em `src/hooks/useAuth.ts` e `src/components/LoginScreen.tsx`.
- Implementação da busca de usuários por **matrícula**, **nome** e **e-mail** com filtros por campo e perfil em `src/components/UserSearchSection.tsx`.
- Adição de contas iniciais de teste para alunos, monitores e administradores em `src/data/mockData.ts` e tipagens de autenticação em `src/types/index.ts`.

### Modificado
- Atualizado `src/components/Header.tsx` e `src/app/page.tsx` para exigir autenticação de acesso, exibir o perfil autenticado, permitir encerramento de sessão (logout) e acessar a busca de usuários.
- Atualizado `src/components/ReservationModal.tsx`, `src/components/WaitlistModal.tsx` e `src/app/layout.tsx` para integração com o usuário autenticado e metadados do StudyMap.
- Atualizado `docs/TASKS.md` marcando o **Passo 1** como feito (`[x]`) e documentando as notas de implementação.

### Corrigido
- Ajustada a inicialização de estado com `localStorage` em `src/hooks/useStudyMapData.ts` e escape de aspas em `src/components/RecommendationAssistant.tsx` para eliminar avisos do ESLint / React 19.
- Padronizadas as classes utilitárias canônicas do Tailwind CSS v4 (`bg-linear-to-*` e `shrink-0`) nos componentes da interface.


## - 25-10-2026

### Adicionado
- Migração da navegação para rotas reais de páginas do Next.js App Router (`src/context/StudyMapContext.tsx`, `/login`, `/cadastro`, `/recuperar-senha`, `/espacos`, `/ia`, `/reservas`, `/fila`, `/usuarios` e `/configuracoes`).
- Implementação completa do **Passo 2** (`docs/TASKS.md` — funções do perfil **Aluno**):
  - Página de cadastro de aluno (`src/app/cadastro/page.tsx`) com validação de e-mail único (`os emails devem ser diferentes`) e matrícula exclusiva.
  - Página de recuperação e redefinição de senha (`src/app/recuperar-senha/page.tsx`).
  - Página de configurações (`src/app/configuracoes/page.tsx`) com funções para **ver a senha atual**, **atualizar a senha** e validar tokens de perfil.
  - Regra de limite diário permitindo **reservar um único local por dia** por estudante em `src/hooks/useStudyMapData.ts`.
  - Consulta antecipada (véspera) listando todos os locais disponíveis antes do dia do agendamento em `src/app/espacos/page.tsx` (`getAvailableSpacesForDate`).
  - Regra de **check-in faltando 10 minutos** para o horário do local agendado (`getCheckInWindowInfo` / `performCheckIn`) ou cancelamento da reserva.
  - Exibição completa da lista de materiais disponibilizados pelo local e modal para **consultar o monitor do local agendado** em `src/components/ReservationSection.tsx`.
  - Modal e histórico de envio de **informação de cancelamento da vaga** (`CancellationNotice` em `studyMap_cancellations`) com liberação automática da vaga.
- Adicionado sistema nativo de **Alertas do React** (`src/components/ReactAlert.tsx` — `ReactAlertContainer` e `ReactAlertBanner` integrados ao `StudyMapContext`), substituindo os `window.alert()` nativos do navegador por alertas reativos animados para login, cadastro, reservas, check-in, cancelamento e fila de espera.
- Adicionada camada de **criptografia para o `localStorage`** (`src/utils/cryptoStorage.ts`), criptografando todos os dados persistidos enquanto o sistema está em uso e apagando integralmente o `localStorage` (`localStorage.clear()`) ao clicar no botão **Sair**.
- Adicionada **animação de transição entre páginas** com `src/app/template.tsx` e keyframes CSS em `src/app/globals.css`.
- Criada a página de **Configurações** (`src/app/configuracoes/page.tsx`) com validação de **Token Institucional** (`applyRoleToken` em `src/hooks/useAuth.ts`), onde todo novo cadastro inicia como **Aluno** e só eleva o perfil para **Monitor** ou **Administrador** ao inserir um token válido.

### Modificado
- Centralizados os formulários de **Login**, **Cadastro** e **Recuperação de Senha** no meio da tela, removido o botão superior direito de cadastro e simplificado o login em `src/components/LoginScreen.tsx` exclusivamente para **e-mail e senha** (sem seleção prévia de perfil).
- Atualizado `src/components/Header.tsx`, `src/app/layout.tsx` e `src/app/page.tsx` para operar com navegação multi-página (`next/link`), exibir o perfil autenticado e atalho para **Configurações** (`/configuracoes`).
- Atualizado `src/components/LoginScreen.tsx`, `src/components/ReservationModal.tsx`, `src/components/ReservationSection.tsx` e `src/components/WaitlistModal.tsx` para integrar cadastro, recuperação de senha, materiais do local, consulta de monitor, janela de check-in de 10 minutos, justificativa de cancelamento e Alertas do React.
- Atualizado `docs/TASKS.md` marcando o **Passo 2** como feito (`[x]`) e documentando as notas técnicas de implementação.
- Refinada a **responsividade completa para PC, Tablet e Celular** em todas as páginas, cabeçalho (`Header.tsx` com menu hambúrguer mobile e grid/flex adaptativo para tablet e desktop), filtros, cards, formulários e modais, eliminando qualquer necessidade de scroll lateral (`overflow-x: clip`, `min-w-0` e `flex-wrap`).

### Corrigido
- Sincronização de hidratação client-side via `useSyncExternalStore` em `src/context/StudyMapContext.tsx` e remoção de `window.alert()` nativos em favor dos Alertas do React.
- Eliminadas barras de rolagem horizontais (`overflow-x-auto`) em menus, seletores de blocos, filtros de espaços e filtros de busca de usuários, garantindo quebra fluida (`wrap-break-word` / `flex-wrap`) em telas pequenas, médias e grandes.
- Resolvido o alerta `css(unknownAtRules)` para `@theme` em `src/app/globals.css` (migrado para variáveis CSS padrão em `:root` e configurado `.vscode/settings.json`) e restringida a visualização e o acesso à página **Usuários & Busca** (`/usuarios`) apenas para **Monitores** e **Administradores** (oculta e bloqueada para o perfil **Aluno**).


## - 26-10-2026

### Adicionado
- Implementação completa do **Passo 3** (`docs/TASKS.md` — funções do perfil **Monitor**):
  - Nova rota `src/app/monitoria/page.tsx` e componente `src/components/MonitorPanelSection.tsx` (**Painel do Monitor**) com layout responsivo para PC, Tablet e Celular sem scroll lateral.
  - Exibição da **lista completa de todos os locais do campus** com busca, filtro por tipo, ocupação em tempo real, vagas livres e atalho direto para agendar destino ou reservar 1 local de estudo por dia.
  - Função para **agendar o local de destino** (`scheduleMonitorDestination` em `src/hooks/useStudyMapData.ts`), sincronizando o plantão de monitoria no espaço e o local registrado do monitor (`updateMonitorRegisteredSpace` em `src/hooks/useAuth.ts`), limitada a 1 destino agendado por dia.
  - Função para **enviar aviso de não comparecimento no local de destino** (`sendMonitorAbsenceNotice`), persistindo `MonitorAbsenceNotice` criptografado em `studyMap_monitorAbsences` e atualizando o status da escala (`"ausencia_informada"`) e a disponibilidade do monitor no espaço.
  - Seção de **lista de alunos no local em que o monitor foi registrado** (`espacoMonitoriaId` / `espacoMonitoria`), exibindo nome, matrícula, e-mail, data, horário e status de check-in.
  - Poder do monitor de **cancelar o check-in realizado por um aluno** (`cancelStudentCheckInByMonitor` no Painel do Monitor e em `/reservas`), registrando a justificativa e devolvendo imediatamente a vaga (`ocupacao - 1`) para que outro aluno possa reservar.
- Novas interfaces `MonitorDestinationSchedule` e `MonitorAbsenceNotice` em `src/types/index.ts` e escalas iniciais `defaultMonitorSchedules` em `src/data/mockData.ts`.

### Modificado
- Atualizado `src/app/configuracoes/page.tsx` e `applyRoleToken` (`src/hooks/useAuth.ts`) para destacar e validar tokens disponibilizados pelo **Admin 1 (`Coordenação Geral (Admin 1)`)** na habilitação de novos **Monitores** (`MON-...`, com escolha do local de registro da monitoria) e **Administradores** (`ADM-...`).
- Atualizado `src/components/Header.tsx` e `src/context/StudyMapContext.tsx` para adicionar o link **Painel do Monitor** (`/monitoria`) para **Monitores** e **Administradores** e bloquear o acesso direto do perfil **Aluno** com alerta reativo (`ReactAlert`).
- Atualizado `src/components/ReservationSection.tsx` e `src/app/reservas/page.tsx` para permitir que monitores também cancelem check-ins realizados e liberem vagas diretamente pela listagem de reservas.
- Atualizado `docs/TASKS.md` marcando o **Passo 3** como concluído (`[x]`) e documentando as notas técnicas do caminho.

### Corrigido
- Garantida a persistência criptografada das novas chaves `studyMap_monitorSchedules` e `studyMap_monitorAbsences` no `localStorage` durante a sessão ativa e sua remoção completa (`localStorage.clear()`) ao clicar em **Sair**.


## - 27-10-2026

### Adicionado
- Implementação completa do **Passo 4** (`docs/TASKS.md` — funções do perfil **Administrador**):
  - Nova rota `src/app/admin/page.tsx` e módulo `src/components/AdminPanelSection.tsx` (**Painel Geral do Administrador**) com responsividade completa para PC, Tablet e Celular sem scroll lateral.
  - **Central de Criação Administrativa** permitindo cadastrar novos alunos (`adminCreateUser`), gerar tokens de verificação de **Monitor** (`MON-...`) e novos **ADMs** (`ADM-...`) (`adminGenerateRoleToken`), cadastrar novos lugares com **vagas disponíveis** e **materiais** (`adminCreateSpace`), publicar **avisos sobre os locais** (`adminCreateSpaceNotice`) e agendar novos eventos (`adminCreateEvent`).
  - **Lista Geral de Todos os Dados do Sistema** reunindo contadores, busca global e listagem completa de Usuários, Tokens, Lugares/Vagas/Materiais, Avisos dos Locais, Reservas, Fila de Espera, Eventos, Escalas de Monitoria, Avisos de Ausência e Cancelamentos.
  - Funções completas para **atualizar** (`adminUpdate*`) e **remover** (`adminDelete*`) registros de todas as coleções do sistema, com reconciliação automática de ocupação/vagas e proteção contra remoção da própria sessão ativa do Administrador.
- Nova interface `SpaceNotice` (`SpaceNoticePriority`) em `src/types/index.ts`, avisos iniciais `defaultSpaceNotices` em `src/data/mockData.ts` e exibição dos avisos oficiais sobre os locais em `src/app/espacos/page.tsx` e `src/components/SpaceDetailModal.tsx`.

- **Página da Equipe Desenvolvedora** (`/equipe`, `src/app/equipe/page.tsx`):
  - Interface dedicada apresentando o título do projeto **StudyMap (Turma 2 DSA • Projeto S.C.O.P.E.)**, visão geral do software e repositório oficial no GitHub (`https://github.com/kaue081/StudyMap`).
  - Cards detalhados de cada membro da equipe desenvolvedora: **Charles Kaue Barbosa da Silva**, **Caua Henrique Pinto de Lima**, **Emanuel da Silva Correia**, **Pedro Inacio Monteiro Silva** e **Ana Clara Vilanova**.
  - Cada card conta com foto/avatar responsivo com fallback elegante por iniciais estilizadas, nome completo, papel técnico no projeto, resumo descritivo das contribuições, tags de tecnologias e **link direto para o perfil no GitHub** com abertura em nova aba.
- **Botão Obrigatório de Acesso nas Configurações** (`src/app/configuracoes/page.tsx`):
  - Posicionado ao final da página de configurações de todos os perfis (**Aluno**, **Monitor** e **Administrador**), em destaque sem sobrepor nem interferir em qualquer formulário ou função preexistente.
  - Navega diretamente para `/equipe` com atalhos de retorno para o Dashboard e para as próprias configurações.
- Criação e atualização de avisos diretamente nos detalhes do espaço (`src/components/SpaceDetailModal.tsx`):
  - Formulários inline para criação instantânea de novos **Avisos Oficiais sobre o Local** e novos **Eventos Programados** com feedback instantâneo via `ReactAlert`.

### Modificado
- Atualizado `src/components/Header.tsx`, `src/app/configuracoes/page.tsx` e `src/context/StudyMapContext.tsx` para disponibilizar o acesso ao **Painel do Admin** (`/admin`) exclusivamente para usuários com perfil `admin` e bloquear acessos não autorizados com `ReactAlert`.
- Atualizado `src/app/recuperar-senha/page.tsx` para explicitar exemplos de recuperação com matrícula ou tokens `MON-...` e `ADM-...`.
- Atualizado `docs/TASKS.md` marcando o **Passo 4** como concluído (`[x]`) e registrando as notas técnicas de implementação.
- Atualizado [.vscode/settings.json](file:///c:/DEV/StudyMap/.vscode/settings.json) com regras de supressão para `@theme` do Tailwind CSS v4 (`css.lint.unknownAtRules: "ignore"`) e associação de arquivos `.css` para a sintaxe `tailwindcss`.

### Corrigido
- Garantida a validação de unicidade de e-mail e matrícula tanto na criação quanto na edição administrativa de usuários (`adminCreateUser` e `adminUpdateUser`), além da persistência criptografada de `studyMap_spaceNotices` e limpeza integral no logout.
- Normalização de imports e linting no ESLint (`0 errors, 0 warnings`) e verificação estrita de tipagem TypeScript (`npx tsc --noEmit` com código de saída 0).
- Correção do arquivo `next.config.ts`, removendo código incompatível de NestJS (`@nestjs/common`, `ServeStaticModule`) e configurando adequadamente o suporte a imagens remotas (`images.remotePatterns` para GitHub, Unsplash e wildcard seguro) e imagens locais (pasta `public/`), preservando o `reactCompiler: true`.
- Ajustes finos de usabilidade e integridade operacional:
  1. **Remoção de Token & Senha do Painel do Monitor:** Retirados o badge `MON-2026-103` e o botão `Senha & Token` do topo direito do cabeçalho do Painel do Monitor.
  2. **Validação de Token Restrita ao Admin:** O card de inserção e teste de tokens institucionais em `src/app/configuracoes/page.tsx` foi ocultado para perfis de `aluno` e `monitor`, ficando visível apenas para o `admin`.
  3. **Sincronização Dinâmica de Vagas Preenchidas:** O número de vagas ocupadas (`space.ocupacao`) é reconciliado dinamicamente com o quantitativo exato de reservas ativas (`status !== 'cancelada'`).
  4. **Finalidade de Presença do Monitor (Ajudar vs Estudar):** Adicionada seleção explícita de `tipoAtividade` no modal e no formulário de agendamento de destino. Ao selecionar "Ajudar (Monitoria)", aloca o monitor e horário no espaço; ao escolher "Estudar (Individual)", registra como estudo individual.
  5. **Regra Estrita de 1 Reserva Ativa por Usuário & Correção de Bloqueio Pós-Cancelamento:** Cada estudante só pode manter uma única reserva ativa. Reservas canceladas (`status === "cancelada"`) são desconsideradas na validação, permitindo agendar nova vaga imediatamente sem mensagens falsas de reserva duplicada.
  6. **Contagem Regressiva de 5 Segundos para Cancelamento:** Ao cancelar reservas, check-ins ou desistir da fila, o item permanece visível com badge de remoção por 5 segundos antes de sumir permanentemente da tela.
  7. **Desistência da Fila Restrita ao Solicitante:** Na fila de espera, o botão "Desistir da Fila" é exibido exclusivamente para o estudante proprietário do pedido (ou admin).
  8. **Agendamento de Destino Inteligente sem Sobreposição:** Permite agendar múltiplos destinos no mesmo dia contanto que os intervalos de horários não colidam.
  9. **Detecção Automática do Local do Monitor:** Na Seção 3 ("Alunos Registrados no Seu Local de Monitoria"), o sistema detecta automaticamente o destino agendado para hoje e exibe o badge de local detectado automaticamente.
  10. **Avisos de Ausência Vinculados Exclusivamente ao Local:** Avisos de não comparecimento informados pelo monitor afetam e são exibidos unicamente no espaço agendado e no respectivo modal de detalhes (`SpaceDetailModal`), nunca vazando para outros locais.
  11. **Botão 'Conhecer a Equipe':** Substituída a coluna vertical espremida por um botão horizontal elegante e responsivo ao final das configurações de todos os perfis.
  12. **Isolamento de 'Minhas Reservas' por Aluno Logado:** A aba `/reservas` (`Minhas Reservas & Check-in`) agora filtra estritamente pelo usuário autenticado (`currentUser.id`, `currentUser.email` ou `currentUser.nome`). Alunos e monitores só visualizam suas próprias reservas e cancelamentos pessoais, sem vazamento de reservas de outros colegas (visão geral de todos os agendamentos permanece restrita ao Painel do Administrador).

---

[LINK DO REPOSITÒRIO]: https://github.com/kaue081/StudyMap
