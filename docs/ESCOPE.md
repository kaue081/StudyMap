# S.C.O.P.E. — StudyMap

## EQUIPE

Caua Henrique Pinto de Lima.
Charles Kaue Barbosa da Silva.
Emanuel da Silva Correia.
Pedro Inacio Monteiro Silva.

**Turma:** 2 DSA

**Nome do Projeto:** StudyMap

---

# Visão Geral

Desenvolver uma aplicação web de gerenciamento de espaços de estudo chamada **StudyMap**.

O sistema terá como finalidade facilitar a localização, consulta, recomendação e reserva de espaços destinados ao estudo, permitindo que os alunos visualizem informações como disponibilidade, horários, capacidade, ocupação, eventos, professores, monitores, regras e materiais disponíveis.

O projeto será desenvolvido exclusivamente **Front-end** e terá finalidade didática.

A aplicação funcionará somente pelo navegador.

As informações deverão permanecer disponíveis mesmo após:

* Atualizar a página.
* Fechar o navegador.
* Abrir novamente o navegador.

Para isso, o projeto utilizará o **LocalStorage** como mecanismo de armazenamento local.

O sistema deverá permitir que o aluno consulte os espaços disponíveis, escolha um local adequado, realize uma reserva, faça check-in e, quando necessário, entre em uma fila de espera.

---

# S — Situation | Situação

## Problema

Estudantes têm dificuldade para visualizar, localizar e reservar espaços destinados ao estudo, considerando fatores como:

* Disponibilidade.
* Horários.
* Eventos.
* Lotação.
* Capacidade.
* Localização.
* Presença de professores.
* Presença de monitores.
* Materiais disponíveis.
* Regras de utilização.

O StudyMap deverá centralizar essas informações em uma única aplicação.

O sistema deverá permitir que o aluno encontre um espaço adequado de acordo com suas necessidades e com a disponibilidade existente.

O agente de IA, representado dentro da proposta do projeto, atuará como um assistente inteligente para auxiliar na consulta e recomendação dos espaços de estudo.

## O sistema deverá receber informações como:

* Data desejada.
* Horário desejado.
* Local desejado.
* Preferências do aluno.
* Necessidade de determinados materiais.
* Preferência por locais mais tranquilos.
* Necessidade de professor ou monitor disponível.

A partir dessas informações, o sistema deverá apresentar os espaços compatíveis.

Existem diferentes possibilidades de utilização:

### Consulta

O aluno poderá consultar quais espaços estão disponíveis em determinado dia e horário.

### Recomendação

O sistema poderá recomendar espaços de acordo com características como:

* Menor ocupação.
* Distância.
* Capacidade.
* Horário.
* Eventos.
* Perfil do espaço.
* Preferências informadas pelo aluno.

### Reserva

O aluno poderá selecionar um espaço disponível e realizar uma reserva.

### Check-in

O aluno deverá confirmar sua presença próximo ao horário reservado.

### Fila de espera

Caso não existam vagas disponíveis, o aluno poderá entrar em uma fila de espera.

---

# C — Context | Contexto

## Tecnologias obrigatórias

Utilizar:

* Next.js
* React
* TypeScript
* Tailwind CSS
* LocalStorage

O projeto deverá utilizar o **Next.js com App Router**.

Poderão ser utilizados os hooks necessários do React, como:

* `useState`
* `useEffect`

E os recursos de navegação do Next.js, como:

* `useRouter`

Não adicionar bibliotecas externas sem necessidade.

---

# Arquitetura

O projeto será exclusivamente **Front-end**.

Não utilizar:

* Backend.
* Banco de dados.
* API.
* Rotas de API.
* Express.
* MySQL.
* MongoDB.
* Spring Boot.
* Serviços externos.
* Sistema de autenticação externo.
* JWT.
* Access Token.
* Refresh Token.
* OAuth.
* OAuth 2.0.
* NextAuth/Auth.js.

**Não será necessário criar página de Login ou sistema de autenticação.**

O aluno poderá utilizar diretamente as funcionalidades do StudyMap.

O projeto representa uma aplicação didática de gerenciamento e recomendação de espaços de estudo.

---

# Armazenamento dos dados

As informações do StudyMap deverão ser armazenadas localmente utilizando o `localStorage`.

Os dados deverão permanecer disponíveis mesmo quando o usuário:

* Atualizar a página.
* Fechar o navegador.
* Abrir novamente o navegador.

O LocalStorage poderá armazenar informações como:

* Espaços cadastrados.
* Reservas.
* Ocupação.
* Check-ins.
* Filas de espera.
* Eventos.
* Preferências.
* Dados necessários para o funcionamento da aplicação.

Não será utilizado banco de dados externo.

---

# Informações dos espaços

Cada espaço de estudo poderá possuir informações como:

* Nome do espaço.
* Identificação da sala ou local.
* Tipo do espaço.
* Localização.
* Capacidade máxima.
* Ocupação atual.
* Horários disponíveis.
* Eventos agendados.
* Professor responsável.
* Horários do professor.
* Monitores disponíveis.
* Regras de utilização.
* Materiais disponíveis.

## Tipos de espaços

O sistema poderá trabalhar com:

* Salas.
* Laboratórios.
* Bibliotecas.
* Outros espaços destinados ao estudo.

---

# Localização e mapa

O sistema deverá apresentar a localização dos espaços disponíveis.

A aplicação poderá utilizar uma representação visual do mapa para facilitar a localização dos ambientes.

Também poderá existir uma representação de **mapa de calor**, permitindo visualizar regiões ou espaços com maior concentração de pessoas.

Como o projeto será exclusivamente Front-end e não utilizará serviços externos, essa representação deverá ser simulada utilizando os dados armazenados localmente.

---

# Ocupação

O sistema deverá controlar a quantidade de pessoas presentes ou reservas realizadas em cada espaço.

A ocupação deverá ser utilizada para calcular a quantidade de vagas disponíveis.

Exemplo:

```text
Capacidade: 30 pessoas
Ocupação: 18 pessoas
Vagas disponíveis: 12
```

Conforme novas reservas forem realizadas, a quantidade de vagas disponíveis deverá diminuir.

Quando uma reserva for cancelada ou liberada, a quantidade de vagas deverá ser atualizada.

---

# Eventos

Cada espaço poderá possuir eventos agendados.

O sistema deverá verificar se existe algum evento no período escolhido pelo aluno.

Quando houver conflito com um evento, o espaço não deverá ser apresentado como disponível para reserva naquele período.

---

# Professores

Quando aplicável, um espaço poderá possuir um professor associado.

O sistema deverá permitir visualizar:

* Nome do professor.
* Espaço associado.
* Horários de disponibilidade.

Essas informações serão utilizadas para auxiliar o aluno na escolha do espaço.

---

# Monitores

O sistema poderá apresentar alunos-monitores disponíveis para auxiliar na recepção e organização dos espaços.

As informações poderão indicar:

* Nome do monitor.
* Local de atuação.
* Horário de disponibilidade.

---

# Capacidade e vagas

Cada espaço deverá possuir uma capacidade máxima.

O sistema deverá calcular as vagas disponíveis com base na capacidade e na quantidade de pessoas ou reservas existentes.

Exemplo:

```text
Capacidade: 20
Ocupação/Reservas: 15
Vagas disponíveis: 5
```

Ao realizar uma nova reserva:

```text
Capacidade: 20
Ocupação/Reservas: 16
Vagas disponíveis: 4
```

---

# Materiais disponíveis

O sistema deverá informar quais materiais estão disponíveis em cada espaço.

Exemplos:

* Pilotos.
* Apagadores.
* Notebooks.
* Livros.
* Folhas para impressão.
* Acesso à internet.
* Projetores.
* Outros materiais necessários para estudo.

O aluno poderá utilizar essas informações durante a escolha do local.

---

# Regras de utilização

Cada espaço poderá possuir regras específicas.

Exemplos:

* Limite de pessoas.
* Tempo máximo de utilização.
* Necessidade de reserva.
* Horário permitido.
* Proibição de alimentos.
* Necessidade de silêncio.
* Regras para utilização de equipamentos.

As regras deverão ser apresentadas ao aluno antes da realização da reserva.

---

# Estratégia de recomendação

O StudyMap poderá utilizar um sistema de recomendação para auxiliar o aluno na escolha do espaço.

O sistema poderá considerar:

* Preferência do aluno.
* Distância.
* Lotação.
* Horário.
* Eventos.
* Disponibilidade.
* Capacidade.
* Perfil do espaço.
* Materiais disponíveis.
* Presença de professor.
* Presença de monitor.

A recomendação não deverá apenas apresentar locais disponíveis, mas poderá indicar qual espaço possui características mais compatíveis com a solicitação realizada pelo aluno.

### Exemplo

O aluno informa:

> "Quero um local tranquilo para estudar das 14h às 16h."

O sistema poderá apresentar:

> **Recomendação:** Biblioteca 2
> Ocupação: 35%
> Vagas disponíveis: 12
> Eventos no período: Nenhum
> Perfil: Ambiente tranquilo
> Materiais: Livros, internet e notebooks

---

# Fluxo dos dados

O funcionamento geral deverá seguir uma lógica semelhante a:

```text
Dados dos espaços
        ↓
LocalStorage
        ↓
Consulta do aluno
        ↓
Verificação de disponibilidade
        ↓
Análise de horário e eventos
        ↓
Análise de ocupação e capacidade
        ↓
Recomendação
        ↓
Reserva
        ↓
Check-in
        ↓
Confirmação da vaga
        ↓
Cancelamento ou liberação
        ↓
Fila de espera
```

---

# O — Objective | Objetivo

O objetivo do StudyMap é facilitar a localização, escolha, reserva e utilização dos espaços de estudo.

O sistema deverá oferecer ao aluno informações sobre:

* Disponibilidade.
* Lotação.
* Horários.
* Eventos.
* Capacidade.
* Localização.
* Regras.
* Professores.
* Monitores.
* Materiais disponíveis.

O sistema também deverá ajudar a reduzir reservas não utilizadas por meio de um sistema de **confirmação de presença (check-in)**.

Além disso, o projeto busca transformar um sistema simples de reservas em uma aplicação de apoio à decisão, utilizando informações dos espaços para recomendar locais mais adequados às necessidades do aluno.

---

# P — Process | Processo

O fluxo principal do sistema deverá funcionar da seguinte maneira:

1. O aluno acessa diretamente o StudyMap.

2. O aluno informa quando deseja estudar.

3. O aluno informa, quando necessário, onde deseja estudar ou quais características procura.

4. O sistema consulta os espaços cadastrados no LocalStorage.

5. O sistema verifica a data e o dia da semana.

6. O sistema verifica o horário solicitado.

7. O sistema verifica se existem eventos agendados no local.

8. O sistema consulta a capacidade máxima do espaço.

9. O sistema verifica a ocupação atual.

10. O sistema calcula a quantidade de vagas disponíveis.

11. O sistema verifica as regras de utilização.

12. O sistema consulta informações sobre professores e monitores, quando aplicável.

13. O sistema verifica os materiais disponíveis.

14. O sistema apresenta os espaços compatíveis.

15. O sistema poderá utilizar os dados de ocupação para apresentar um mapa de calor.

16. O sistema poderá recomendar o espaço mais adequado de acordo com as preferências informadas.

17. O aluno seleciona o espaço desejado.

18. O sistema verifica novamente a disponibilidade.

19. O aluno realiza a reserva.

20. A quantidade de vagas disponíveis é atualizada.

21. Próximo ao horário reservado, o aluno realiza o check-in.

22. Caso o check-in seja realizado, a vaga é confirmada.

23. Caso o aluno não realize o check-in dentro do período estabelecido, a reserva poderá ser cancelada.

24. A vaga liberada poderá ser disponibilizada para o próximo aluno da fila de espera.

---

# E — Execution | Execução

Na prática, o StudyMap poderá executar ou coordenar as seguintes ações:

## Consulta

Exemplo:

> "Quais salas estão disponíveis hoje das 14h às 16h?"

O sistema deverá:

* Verificar a data.
* Verificar o horário.
* Consultar os espaços.
* Verificar eventos.
* Verificar capacidade.
* Verificar ocupação.
* Calcular vagas.
* Apresentar os espaços disponíveis.

---

## Recomendação

Exemplo:

> "Quero um local tranquilo para estudar."

O sistema poderá analisar:

* Ocupação.
* Perfil do espaço.
* Eventos.
* Capacidade.
* Disponibilidade.
* Preferências do aluno.

E apresentar uma recomendação.

Exemplo:

> "Recomendo a Biblioteca 2. Ela possui baixa ocupação, não possui eventos no período selecionado e possui materiais adequados para estudo."

---

## Reserva

Exemplo:

> "Reserve a sala 203 das 15h às 17h."

O sistema deverá:

1. Identificar a sala.
2. Verificar a data.
3. Verificar o horário.
4. Verificar disponibilidade.
5. Verificar eventos.
6. Verificar capacidade.
7. Registrar a reserva no LocalStorage.
8. Atualizar a quantidade de vagas disponíveis.

Caso não exista disponibilidade, a reserva não deverá ser realizada.

---

## Check-in

Exemplo:

> "Cheguei na sala 203."

O sistema deverá registrar o check-in da reserva.

O check-in deverá confirmar que o aluno compareceu ao espaço reservado.

---

## Cancelamento por ausência

Caso o aluno não realize o check-in dentro do período definido pelo sistema:

1. A reserva poderá ser cancelada.
2. A vaga será liberada.
3. A quantidade de vagas disponíveis será atualizada.
4. O próximo aluno da fila de espera poderá receber a oportunidade de utilizar a vaga.

---

## Fila de espera

Quando todas as vagas estiverem ocupadas, o sistema poderá apresentar:

> "A sala está lotada. Deseja entrar na fila de espera?"

Caso o aluno aceite:

1. O aluno será adicionado à fila.
2. Sua posição será registrada.
3. Caso uma vaga seja liberada, o próximo aluno poderá receber a vaga.

---

# Regras importantes do projeto

## Regra 1 — Front-end

Todo o projeto deverá funcionar exclusivamente no Front-end.

## Regra 2 — Persistência

Os dados deverão ser armazenados no LocalStorage.

## Regra 3 — Sem backend

Não criar servidor ou backend.

## Regra 4 — Sem banco de dados

Não utilizar MySQL, MongoDB ou qualquer outro banco de dados.

## Regra 5 — Sem API

Não criar ou utilizar APIs externas para o funcionamento principal do projeto.

## Regra 6 — Next.js

Utilizar Next.js com App Router.

## Regra 7 — TypeScript

O projeto deverá ser desenvolvido utilizando TypeScript.

## Regra 8 — Interface

A interface deverá ser desenvolvida utilizando Tailwind CSS.

## Regra 9 — Responsividade

A aplicação deverá possuir uma interface responsiva e funcionar adequadamente em diferentes tamanhos de tela.

## Regra 10 — Persistência após atualização

As informações importantes não deverão ser perdidas ao atualizar a página.

## Regra 11 — Persistência após fechar o navegador

As informações armazenadas no LocalStorage deverão permanecer disponíveis após fechar e abrir novamente o navegador.

## Regra 12 — Sem autenticação

O projeto não deverá possuir sistema de Login ou autenticação.

O usuário deverá conseguir acessar diretamente as funcionalidades do StudyMap.

---

# Estrutura conceitual do projeto

A aplicação deverá possuir, conforme a necessidade do projeto, páginas e componentes relacionados a:

```text
StudyMap
│
├── Dashboard
│
├── Espaços
│
├── Detalhes do espaço
│
├── Mapa
│
├── Reservas
│
├── Check-in
│
├── Fila de espera
│
└── Perfil / Preferências
```

A estrutura poderá ser adaptada durante o desenvolvimento, desde que mantenha as funcionalidades e regras definidas neste documento.

---

# SCOPE resumido

## S — Situation

Estudantes precisam encontrar e utilizar espaços de estudo de maneira organizada e eficiente, considerando disponibilidade, horários, eventos, ocupação, localização, capacidade, professores, monitores, regras e materiais disponíveis.

## C — Context

O StudyMap será uma aplicação exclusivamente Front-end desenvolvida com Next.js, React, TypeScript, Tailwind CSS e LocalStorage. O sistema trabalhará com informações sobre espaços, mapas, horários, eventos, professores, capacidade, ocupação, regras, monitores, materiais e reservas.

## O — Objective

Facilitar a escolha, localização, reserva e utilização de espaços de estudo, aumentando a utilização eficiente dos locais e reduzindo vagas ociosas por meio de confirmação de presença e fila de espera.

## P — Process

```text
Consultar disponibilidade
        ↓
Analisar data e horário
        ↓
Verificar eventos
        ↓
Verificar capacidade e ocupação
        ↓
Verificar regras e recursos
        ↓
Recomendar
        ↓
Reservar
        ↓
Realizar check-in
        ↓
Confirmar utilização
        ↓
Liberar vaga quando necessário
        ↓
Acionar fila de espera
```

## E — Execution

O sistema deverá permitir consultar informações dos espaços, recomendar locais, realizar reservas, controlar vagas, registrar check-ins, cancelar reservas não confirmadas e controlar a fila de espera, utilizando exclusivamente recursos do Front-end e o LocalStorage.

---

# Limitações do projeto

O StudyMap possui finalidade didática e, portanto, algumas funcionalidades serão simuladas.

Não haverá:

* Backend.
* Banco de dados.
* API própria.
* Autenticação.
* Login.
* Integração com sistemas institucionais.
* GPS real.
* Sistema externo de mapas obrigatório.
* Notificações externas.
* Serviços externos obrigatórios.

Os dados utilizados pela aplicação serão armazenados localmente no navegador.

O agente de IA descrito neste documento representa a lógica inteligente de consulta e recomendação do projeto. Sua implementação deverá respeitar as limitações de uma aplicação exclusivamente Front-end.

---

# Resultado esperado

Ao final do desenvolvimento, o StudyMap deverá ser uma aplicação web capaz de:

* Apresentar espaços de estudo.
* Exibir disponibilidade.
* Exibir capacidade.
* Exibir ocupação.
* Calcular vagas disponíveis.
* Apresentar localização dos espaços.
* Exibir eventos.
* Exibir professores e horários, quando aplicável.
* Exibir monitores.
* Exibir materiais disponíveis.
* Exibir regras.
* Recomendar espaços.
* Realizar reservas.
* Registrar check-in.
* Cancelar reservas não confirmadas.
* Controlar fila de espera.
* Atualizar a quantidade de vagas.
* Persistir os dados utilizando LocalStorage.
* Funcionar exclusivamente no navegador.
* Permitir acesso direto às funcionalidades sem necessidade de Login.

O projeto deverá manter como princípio central a criação de uma solução simples, didática e funcional para gerenciamento inteligente de espaços de estudo.
