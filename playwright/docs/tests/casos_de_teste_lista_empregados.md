# Cenários de Teste Sugeridos

**Página analisada:** Lista de Empregados - https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList  
**Provedor LLM:** OpenAI (gpt-4o)  
**Gerado em:** 18/04/2026, 10:44:56

---

---

### CT01 - Pesquisa por Nome de Empregado

#### Objetivo
Validar a pesquisa de empregados pelo nome utilizando o campo "Employee Name".

#### Pré-Condições
- Usuário autenticado como administrador.
- Existem empregados cadastrados.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir "John" no campo "Employee Name" | Sugestões de nomes aparecem abaixo do campo. |
| 2  | Selecionar o nome sugerido e clicar em "Search" | Lista de empregados é atualizada mostrando apenas os empregados com o nome "John". |

#### Resultados Esperados
- Aparecem registros apenas de empregados com o nome "John".

#### Critérios de Aceitação
- Campo aceita o nome completo ou parte dele.
- Sugestões automáticas aparecem corretamente.

---

### CT02 - Pesquisa com Campos em Branco

#### Objetivo
Validar o comportamento da pesquisa quando nenhum campo é preenchido.

#### Pré-Condições
- Usuário autenticado como administrador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar todos os campos de pesquisa em branco e clicar em "Search" | Lista de empregados é carregada com todos os registros disponíveis. |

#### Resultados Esperados
- Todos os empregados são exibidos.

#### Critérios de Aceitação
- Sistema retorna à lista padrão de todos os empregados.

---

### CT03 - Pesquisa por ID de Empregado

#### Objetivo
Validar a pesquisa de empregados pelo campo "Employee Id".

#### Pré-Condições
- Usuário autenticado como administrador.
- Empregado com ID especificado existe.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir "123" no campo "Employee Id" | Lista de empregados exibe apenas o empregado com ID "123". |

#### Resultados Esperados
- Aparecem registros apenas do empregado com o ID "123".

#### Critérios de Aceitação
- Campo aceita apenas números.
- Pesquisa retorna corretamente o registro correspondente.

---

### CT04 - Pesquisa por Cargo (Job Title)

#### Objetivo
Validar a pesquisa de empregados pelo cargo utilizando o campo "Job Title".

#### Pré-Condições
- Usuário autenticado como administrador.
- Existem múltiplos cargos cadastrados.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar "Engineer" no campo "Job Title" | Lista de empregados é atualizada mostrando apenas os empregados com o cargo "Engineer". |

#### Resultados Esperados
- Aparecem registros apenas de empregados com o cargo "Engineer".

#### Critérios de Aceitação
- Lista de cargos está completa e atualizada.
- Pesquisa é executada adequadamente com base na seleção.

---

### CT05 - Reset da Pesquisa

#### Objetivo
Validar o funcionamento do botão "Reset" ao limpar filtros de busca previamente aplicados.

#### Pré-Condições
- Usuário autenticado como administrador.
- Campos de pesquisa previamente preenchidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher campos de busca e clicar em "Reset" | Todos os campos são limpos e a lista de empregados retorna a exibição inicial. |

#### Resultados Esperados
- Campos de pesquisa são resetados.
- Lista de empregados retorna todos os registros.

#### Critérios de Aceitação
- Botão "Reset" limpa completamente todos os filtros aplicados.

---

### CT06 - Permissão Negada para Usuário Não Autorizado

#### Objetivo
Garantir que somente usuários autorizados possam acessar a lista de empregados.

#### Pré-Condições
- Usuário autenticado sem privilégios de administrador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Tentar acessar o módulo "PIM" | Acesso negado, mensagem de permissão insuficiente exibida. |

#### Resultados Esperados
- Usuário não autorizado não acessa o módulo "PIM".

#### Critérios de Aceitação
- Sistema bloqueia o acesso a usuários sem credenciais adequadas.

---
