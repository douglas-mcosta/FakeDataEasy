# Fake Data Easy — Inventário de funcionalidades

Documento de referência com **todas as capacidades** da extensão conforme implementadas no código atual (popup Angular, `manifest.json` v2 e script de background).

---

## Propósito

- **Objetivo:** gerar dados fictícios (mas com regras válidas onde aplicável) para **preencher e validar formulários** em desenvolvimento e testes.
- **Fluxo principal:** gerar um valor e **copiar para a área de transferência** para colar onde for necessário (navegador ou outros aplicativos).

---

## Interface — popup principal (menu)

Abre ao clicar no ícone da extensão (`browser_action` → `index.html`).

| Elemento | Comportamento |
|----------|----------------|
| **Logotipo** | Imagem de marca (`FakeDataEasy2.png`) no topo. |
| **Tabela “Opções”** | Quatro linhas: CPF, CNPJ, Nome, GUID. |
| **Atalhos exibidos** | Cada linha mostra o atalho padrão ao lado do rótulo (ver secção de comandos). |
| **Botão copiar (clipboard)** | Gera o dado correspondente, copia para o clipboard e exibe o valor gerado com ícone de confirmação por **~2 segundos** (depois o texto some). |
| **Botão de seta** | Para **CPF**, **CNPJ** e **Nome**, navega para a **tela de opções avançadas** daquele tipo. **GUID** não possui tela extra (só geração pelo menu/atalho). |
| **Rodapé** | Crédito “Desenvolviddo por Douglas M. Costa” e links para **LinkedIn** e **GitHub** (abrem em nova aba). |

---

## Atalhos de teclado (comandos globais)

Registrados em `manifest.json` com `"global": true`; o **background** trata o evento e copia o resultado.

| Comando interno | Tecla sugerida (padrão) | O que é gerado e copiado |
|-----------------|-------------------------|---------------------------|
| `gerar-cpf` | **Ctrl+Shift+1** | CPF **somente dígitos** (11 caracteres), com dígitos verificadores válidos. |
| `gerar-cnpj` | **Ctrl+Shift+2** | CNPJ **somente dígitos** (14 caracteres), com algoritmo de geração implementado no projeto. |
| `gerar-nome` | **Ctrl+Shift+3** | Nome gerado pela biblioteca **misturada** (`gerador-nome` — função geral, não restrita a um gênero). |
| `gerar-guid` | **Ctrl+Shift+4** | GUID/UUID em string (via `guid-typescript`). |

**Nota:** atalhos podem ser alterados pelo usuário nas configurações de atalhos do Chrome, desde que o comando continue mapeado.

---

## Geração e cópia — comportamento técnico

- **Clipboard:** uso de elemento `input` temporário, `select()` e `document.execCommand('copy')` (API legada, comum em extensões antigas).
- **Background:** apenas para **comandos de teclado**; não há outras tarefas persistentes descritas no manifest além dos scripts de background listados.

---

## CPF — tela de opções (`/cpf/cpf-options`)

| Funcionalidade | Detalhe |
|----------------|---------|
| **Campo de CPF** | Entrada com validação **ng-brazil** (`NgBrazilValidators.cpf`). Estado visual **válido/inválido** conforme o valor. |
| **Máscara de exibição** | Radio: **com pontos** (máscara `MASKS.cpf`) ou **sem pontos** (máscara apenas dígitos, 11 posições). |
| **Botão “Gerar”** | Chama geração de CPF **sem pontos** (`GerarCPFSemPontos`), **copia esse valor** e preenche o campo. |
| **Validar CPF** | Submissão do formulário (`ngSubmit`) executa validação customizada: normaliza com **apenas números** e usa **`js-brazil` / `validateBr.cpf`**. |
| **Algoritmo de geração** | Implementação própria na classe `CPF` (partes aleatórias + cálculo dos dois dígitos verificadores). |
| **Exportar lista** | Botão presente porém **desabilitado**, texto **“(Em breve)”**. |
| **Navegação** | Voltar ao **menu principal** (`/home`). |

---

## CNPJ — tela de opções (`/cnpj/cnpj-options`)

| Funcionalidade | Detalhe |
|----------------|---------|
| **Campo de CNPJ** | Validação **ng-brazil** (`NgBrazilValidators.cnpj`); feedback visual **válido/inválido**. |
| **Máscara de exibição** | Radio: **com pontos** / **sem pontos** (14 dígitos sem formatação na opção “sem pontos”). |
| **Botão “Gerar”** | Gera CNPJ numérico (14 dígitos), **copia** e preenche o campo. **Não** há botão dedicado “validar” no template (diferente do fluxo explícito de submit do CPF). |
| **Formatação “com pontos”** | Existe método `GerarCNPJComPontos` no modelo (pipe ng-brazil), mas o fluxo do botão “Gerar” na UI usa a string só numérica. |
| **Exportar lista** | **Desabilitado** — “Em breve”. |
| **Navegação** | Voltar ao **home**. |

---

## Nome — tela de opções (`/nome/nome-options`)

| Funcionalidade | Detalhe |
|----------------|---------|
| **Campo de nome** | Texto livre; preenchido ao gerar. |
| **Gênero** | Radio: **masculino** ou **feminino** — escolhe entre `geradorNomeMasculino()` e `geradorNomeFeminino()` da lib **`gerador-nome`**. |
| **Botão “Gerar”** | Gera conforme o rádio, **copia** e atualiza o campo. |
| **Menu principal vs. opções** | No menu principal, “Gerar Nome” usa **`geradorNome()`** (mistura, não o fluxo masculino/feminino da tela de opções). |
| **Exportar lista** | **Desabilitado** — “Em breve”. |
| **Navegação** | Voltar ao **home**. |

---

## GUID

| Contexto | Comportamento |
|----------|----------------|
| **Menu** | Botão de copiar gera GUID e copia (mesmo padrão de feedback temporário). |
| **Atalho** | Ctrl+Shift+4 no background — idem. |
| **Tela dedicada** | Não existe rota; só menu e atalho. |

---

## Identidade e assets

- **Nome:** Fake Data Easy  
- **Descrição (manifest):** “Gerar dados fake para preenchimento e validação de formulários”  
- **Ícones:** 16, 32, 48 e 128 px (`assets/FakeDataEasy-*.png`).

---

## Itens visíveis mas não implementados (UI)

- **Exportar lista** (CPF, CNPJ, Nome): controles na interface marcados como **em breve**, sem lógica ativa.

---

## Roadmap mencionado no README do projeto (não no código da UI)

- Ideia futura de **mais atalhos** (ex.: nome de usuário, e-mail), descrita na documentação do repositório — **não** constitui feature entregue na build atual.

---

## Stack técnica atual (contexto para migração)

- **Angular 12** (popup com rotas e lazy loading de módulos CPF/CNPJ/Nome).  
- **Bootstrap** + **Font Awesome** na interface.  
- Bibliotecas: **`ng-brazil`**, **`js-brazil`**, **`gerador-nome`**, **`guid-typescript`**.  
- **Manifest V2** (`browser_action`, `background.scripts`).

Este ficheiro descreve **o produto**; uma versão publicável na Chrome Web Store hoje exigiria, entre outras coisas, **Manifest V3** e substituição de APIs obsoletas — assunto separado da lista de features acima.
