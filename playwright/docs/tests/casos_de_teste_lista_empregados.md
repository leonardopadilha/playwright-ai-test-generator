# Cenários de Teste Sugeridos

**Página analisada:** Lista de Empregados - https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList  
**Provedor LLM:** Google Gemini (gemini-3-flash-preview)  
**Gerado em:** 17/04/2026, 23:57:02

---

# Documento de Casos de Teste - Módulo PIM (Lista de Empregados)

Este documento detalha os cenários de teste para a funcionalidade de listagem e filtragem de empregados do sistema OrangeHRM, baseando-se na interface do módulo PIM (Personal Information Management).

## 1. Identificação do Sistema e Perfis
*   **Sistema:** OrangeHRM - Módulo PIM
*   **Perfis de Usuário:**
    *   **Administrador/RH:** Possui acesso total para visualizar, buscar, adicionar e editar registros de qualquer empregado.
    *   **Usuário Comum (Visualizador):** Possui permissão apenas para consulta, sem acesso ao botão de adição ou edição (simulado para testes de permissão).

---

### CT01 - Pesquisa de Empregado por Nome (Fluxo Feliz)

#### Objetivo
Validar que o sistema retorna os registros corretos ao pesquisar por um nome de empregado existente utilizando o recurso de preenchimento automático (hint).

#### Pré-Condições
- Usuário autenticado com perfil de Administrador/RH.
- Navegar para o menu lateral "PIM" > "Employee List".
- Existir pelo menos um empregado cadastrado com o nome "John Doe".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Employee Name", digitar "John". | O sistema deve exibir uma lista de sugestões (hints) contendo nomes que iniciam com "John". |
| 2  | Selecionar "John Doe" na lista de sugestões. | O campo deve ser preenchido com o nome completo selecionado. |
| 3  | Clicar no botão "Search". | O sistema deve atualizar a grade de resultados exibindo apenas o registro correspondente a "John Doe". |

#### Resultados Esperados
- A lista de resultados deve ser filtrada com sucesso, apresentando as informações precisas do empregado pesquisado.

#### Critérios de Aceitação
- O componente de "hint" deve ser ativado após o terceiro caractere digitado.
- Apenas registros que correspondam exatamente ao nome selecionado devem aparecer após o clique em "Search".

---

### CT02 - Pesquisa de Empregado por ID (Fluxo Feliz)

#### Objetivo
Validar a busca de um empregado através do identificador único (Employee Id).

#### Pré-Condições
- Usuário autenticado.
- Estar na tela "Employee List".
- Conhecer um ID válido (ex: "0024").

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Employee Id", digitar "0024". | O valor deve ser inserido no campo de texto. |
| 2  | Clicar no botão "Search". | O sistema deve filtrar a lista e exibir apenas o empregado cujo ID seja "0024". |

#### Resultados Esperados
- O sistema exibe o registro único associado ao ID informado.

#### Critérios de Aceitação
- A busca por ID deve ser exata.
- Caso o ID não exista, a lista deve retornar a mensagem "No Records Found".

---

### CT03 - Pesquisa com Múltiplos Filtros (Regra de Negócio)

#### Objetivo
Validar a aplicação combinada de filtros (Job Title e Employment Status).

#### Pré-Condições
- Usuário autenticado.
- Existirem empregados com o cargo "Software Engineer" e status "Full-Time Permanent".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No dropdown "Employment Status", selecionar "Full-Time Permanent". | O valor selecionado deve ser exibido no campo. |
| 2  | No dropdown "Job Title", selecionar "Software Engineer". | O valor selecionado deve ser exibido no campo. |
| 3  | Clicar em "Search". | O sistema deve filtrar a lista aplicando a lógica "E" (AND) entre os filtros. |

#### Resultados Esperados
- A lista de resultados deve exibir apenas empregados que atendam a ambos os critérios simultaneamente.

#### Critérios de Aceitação
- Empregados que atendam apenas a um dos critérios não devem ser exibidos.

---

### CT04 - Limpeza de Filtros (Botão Reset)

#### Objetivo
Validar que o botão "Reset" limpa todos os parâmetros de busca e retorna a lista ao estado original.

#### Pré-Condições
- Ter realizado uma busca prévia com múltiplos campos preenchidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no botão "Reset". | Todos os campos de texto devem ser limpos e os dropdowns devem retornar ao estado padrão ("-- Select --" ou valor default). |
| 2  | Observar a grade de resultados. | A lista deve ser recarregada exibindo todos os registros sem filtros aplicados. |

#### Resultados Esperados
- O formulário de busca deve ser reiniciado e a listagem completa de empregados deve ser restaurada.

#### Critérios de Aceitação
- O campo "Include" deve retornar ao valor padrão "Current Employees Only" após o reset.

---

### CT05 - Busca por Empregado Inexistente (Cenário Negativo)

#### Objetivo
Validar o comportamento do sistema ao realizar uma busca que não retorna resultados.

#### Pré-Condições
- Usuário autenticado na tela de Employee List.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Employee Id", digitar um valor inexistente (ex: "999999"). | O valor é inserido no campo. |
| 2  | Clicar no botão "Search". | O sistema deve processar a consulta. |

#### Resultados Esperados
- A grade de resultados deve exibir uma mensagem clara de "No Records Found" ou similar.

#### Critérios de Aceitação
- O sistema não deve apresentar erro de aplicação (crash) ou tela em branco.
- O cabeçalho da tabela de resultados deve permanecer visível.

---

### CT06 - Navegação para Cadastro de Novo Empregado

#### Objetivo
Validar que o botão "+ Add" direciona o usuário para a funcionalidade de criação de registros.

#### Pré-Condições
- Usuário com perfil de Administrador/RH.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Localizar o botão "+ Add" acima da grade de resultados. | O botão deve estar visível e habilitado. |
| 2  | Clicar no botão "+ Add". | O sistema deve navegar para a tela de "Add Employee". |

#### Resultados Esperados
- A URL deve mudar para o endpoint de adição e o formulário de cadastro de novo empregado deve ser exibido.

#### Critérios de Aceitação
- O redirecionamento deve ser imediato.

---

### CT07 - Restrição de Acesso a Funcionalidades (Perfil de Usuário)

#### Objetivo
Validar que um usuário sem permissões administrativas não consegue visualizar botões de ação (como "+ Add").

#### Pré-Condições
- Usuário autenticado com perfil de "Visualizador" (sem permissões de escrita).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a tela de "Employee List". | A tela de listagem deve carregar. |
| 2  | Verificar a presença do botão "+ Add". | O botão "+ Add" NÃO deve estar visível ou deve estar desabilitado para este perfil. |
| 3  | Verificar o menu superior "Configuration" e "Add Employee". | Estas opções de aba não devem estar visíveis para o perfil restrito. |

#### Resultados Esperados
- O sistema omite elementos de interface que permitem alteração de dados para usuários sem permissão.

#### Critérios de Aceitação
- Segurança por perfil aplicada na UI.

---

### CT08 - Validação de Autocomplete no campo Supervisor Name

#### Objetivo
Validar se a busca por Supervisor segue a regra de negócio de sugestão dinâmica.

#### Pré-Condições
- Existir um supervisor cadastrado no sistema (ex: "Odis Adalwin").

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Supervisor Name", digitar "Odis". | O sistema deve exibir o nome completo "Odis Adalwin" na lista de sugestões. |
| 2  | Clicar fora do campo sem selecionar a sugestão. | O sistema deve limpar o campo ou manter apenas o texto digitado sem associar a um registro interno. |
| 3  | Digitar "Odis" novamente e selecionar o nome na lista. | O nome deve ser fixado no campo. |
| 4  | Clicar em "Search". | O sistema deve filtrar todos os empregados que reportam para "Odis Adalwin". |

#### Resultados Esperados
- O filtro por supervisor funciona corretamente apenas quando um registro da lista de sugestões é selecionado.

#### Critérios de Aceitação
- A lista de sugestões deve ser precisa e rápida.
- O sistema deve diferenciar empregados homônimos através de detalhes adicionais na lista de sugestões (se disponível).

---

### CT09 - Validação de Colapso do Formulário de Busca

#### Objetivo
Validar a funcionalidade de minimizar a área de filtros para ganhar espaço em tela.

#### Pré-Condições
- Estar na tela de Employee List.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no ícone de seta (triângulo invertido) no canto superior direito do card "Employee Information". | A seção de filtros deve ser colapsada (escondida). |
| 2  | Clicar novamente no ícone. | A seção de filtros deve ser expandida, mantendo os dados que haviam sido inseridos anteriormente. |

#### Resultados Esperados
- A interface deve responder visualmente ao comando de expansão/colapso para melhorar a usabilidade em telas menores.

#### Critérios de Aceitação
- A transição deve ser fluída.
- O estado dos filtros (valores preenchidos) não deve ser perdido ao colapsar.
