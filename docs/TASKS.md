# Task 01: Implementar Autenticação MFA (Multi-Fator)

## 🎯 Objetivo Principal
criar uma site para organizar os espaços de um anbiente escolar destindos para o estudo.
* **Referência:** `docs/ESCOPE.md`
---

## 📋 Passos de Implementação (Implementation Steps) 
[x] - Feito
[~] - nada feito ou em desenvolvimento
[ ] - pendente
- [ ] **Passo 1:** * Implementar login de acesso para os alunos, monitores e administradores.
* Informações de login: Aluno - Numero da matricula, email e senha.
* Informações de login: monitor - token para monitor, email e senha.
* Informações de login: Administrador - email, senha e tocken
* Implementar busca pela matricula, nome e email..
- [ ] **Passo 2:** funções dos perfis: aluno - 1. realizar um cadastro e logins.
                                            2. os emails devem ser diferentes.
                                            3. funções para recuperar senha.
                                            4. reservar um unico local por dia.
                                            5. ter uma lista de todos os locais disponiveis no que antecede o dia do agendamento do local.
                                            6. checkin faltando 10 minutos para o horario do local agendado ou cancelar a reserva.
                                            7. função para atualizar e ver a senha atual.
                                            8. lista de materiais que o local pode disponibilizar.
                                            9. Consultar o monitor do local agendado.
                                            10. Enviar uma informção de cancelamento da vaga.
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
                                        ADM - 1. funções para criar: novo cadastro de aluno, gerar token de verificação de monitor e novos adms, cadastrar novos lugares, vagas disponiveis materiais, avisos sobre os locais. 
                                        2. criar uma listas de todos os dados do sistema.
                                        3. atualizar todos os dados do sistema.
                                        4. poder remover dados do sistema.
                                        5. realizar um cadastro e logins.
                                        6. os emails devem ser diferentes.
                                        7. funções para recuperar senha.
                                         
- [ ] **Passo 3:**
- [ ] **Passo 4:** 
- [ ] **Passo 5:** 
- [ ] **Passo 6:** 
---

## 🔍 Descobertas e Notas do Caminho


---

## ✅ Critérios de Aceitação (Acceptance Criteria)
- [ ] O projeto deve compilar sem erros de TypeScript (`npm run build`).

---