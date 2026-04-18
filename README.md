# 🚀 OrangeHRM E2E Automation + AI (Playwright + LLM)

Projeto de automação de testes End-to-End utilizando **Playwright + TypeScript**, com um diferencial importante:

👉 **Uso de IA para gerar automaticamente cenários de teste a partir da interface da aplicação (via screenshot)**

---

## 🎯 Problema que este projeto resolve

Criar cenários de teste manualmente é:

* repetitivo
* demorado
* sujeito a gaps de cobertura

💡 Este projeto explora uma abordagem diferente:

> Usar modelos de linguagem para analisar a UI e sugerir cenários automaticamente.

---

## 💡 Diferenciais do projeto

* 🤖 Geração automática de cenários via LLM (OpenAI / Gemini)
* ⚡ Reutilização de login com `storageState` por worker
* 🧱 Arquitetura baseada em fixtures do Playwright
* 🧪 Execução paralela otimizada
* 📄 Geração automática de documentação de testes (.md)

---

## ⚡ Quick Start (1 minuto)

```bash
npm install
npx playwright install
npm test
```

---

## 🧠 Como funciona (IA aplicada aos testes)

1. Um teste executa normalmente
2. A página é capturada via screenshot
3. A imagem é enviada para a LLM
4. A IA analisa a interface
5. Um arquivo `.md` é gerado com cenários de teste

---

## 🎥 Demonstração
![Demonstração do projeto](./playwright/docs/videos/demo-playwright-ai.mp4)
---

## 📸 Exemplo de saída da IA

```md
# Cenários de Teste - Lista de Empregados

### CT01 - Pesquisa de funcionário por nome completo (Fluxo Feliz)

#### Objetivo
Validar se o sistema retorna o registro correto ao pesquisar um funcionário utilizando o campo de autocomplete "Employee Name".

#### Pré-Condições
- Usuário autenticado com perfil de Admin ou HR Manager.
- Existência de ao menos um funcionário cadastrado (Ex: "Cassidy Hope").

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar o menu "PIM" e a aba "Employee List". | A tela de busca de informações de empregados é exibida. |
| 2  | No campo "Employee Name", digitar as primeiras letras do nome do funcionário. | O sistema exibe uma lista de sugestões (hints) correspondente aos caracteres digitados. |
| 3  | Selecionar o nome completo na lista de sugestões. | O campo é preenchido com o nome selecionado. |
| 4  | Clicar no botão "Search". | O sistema processa a busca e exibe o registro específico na tabela de resultados abaixo. |

#### Resultados Esperados
- O registro exibido na grid de resultados deve corresponder exatamente ao nome selecionado no filtro.

#### Critérios de Aceitação
- O componente de autocomplete deve carregar as sugestões em menos de 2 segundos.
- A grid de resultados deve ser atualizada conforme o filtro aplicado.

```

---

## 🏗️ Arquitetura

* `fixtures/` → gerenciamento de contexto e páginas
* `pages/` → Page Objects
* `llm/` → integração com IA
* `e2e/` → testes

---

## 🔐 Otimização de autenticação

Uso de fixture com escopo `worker`:

✔ login executado uma única vez
✔ reaproveitamento de sessão
✔ testes mais rápidos

---

## 🤖 Integração com LLM

Suporte a:

* OpenAI (GPT-4o)
* Google Gemini

A análise é feita via screenshot:

```ts
await captureAndAnalyzePage(page, {
  pageContext: 'Lista de Empregados',
});
```

---

## 📊 Relatório

```bash
npx playwright show-report
```

---

## 🚀 Próximos passos

* CI com GitHub Actions
* Testes negativos automatizados via IA
* Classificação de cenários (smoke/regression)

---

## 👨‍💻 Autor

Leonardo Padilha