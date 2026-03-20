# Plano de implementação — Fake Data Easy (sem Angular, pronto para Chrome Web Store)

Este documento descreve **como limpar o projeto atual** e **reimplementar a extensão em JavaScript “puro”** (com empacotamento mínimo), mantendo o comportamento descrito em [`FEATURES.md`](./FEATURES.md) e cumprindo **Manifest V3** (requisito atual para novas submissões e para extensões legadas que deixaram de ser aceites).

---

## 1. Objetivos e critérios de sucesso

| Objetivo | Como validar |
|----------|----------------|
| Remover Angular e dependências só ligadas ao framework | `package.json` sem `@angular/*`, `ng-brazil`, `rxjs`, `zone.js`, etc. |
| Manter paridade de funcionalidade com `FEATURES.md` | Menu, 3 ecrãs de opções, 4 comandos globais, cópia para clipboard, validação CPF/CNPJ onde existia |
| Manifest V3 | `manifest_version: 3`, `service_worker`, `action` em vez de `browser_action` |
| Tamanho e manutenção | Poucos ficheiros, build reprodutível, fácil de auditar para a loja |
| Publicação | Política da Chrome Web Store (permissões mínimas, política de privacidade se recolher dados — aqui idealmente **zero** recolha) |

---

## 2. Estratégia de “limpeza” do repositório

**Recomendação:** não apagar histórico git; **substituir** o conteúdo da pasta da extensão por uma árvore nova.

1. **Etiquetar ou criar branch** `archive/angular-v1` com o estado atual (opcional mas útil para consultar geradores e UX).
2. **Remover** ficheiros Angular: `angular.json`, `src/app/**`, `karma.conf.js`, `custom-webpack.config.js`, `tsconfig*.json` específicos do CLI, etc.
3. **Manter** o que ainda serve:
   - `FEATURES.md` (e este plano)
   - **Assets** de imagens (`FakeDataEasy*.png`, logo) — copiar para `extension/assets/` ou pasta equivalente
4. **Raiz da extensão** passar a ser algo do género:
   - `src/` — código e HTML
   - `dist/` ou `build/` — saída do empacotador (gitignored)
   - `package.json` — só dependências de build + bibliotecas de geração/validação

Isto evita conviver Angular e Vite no mesmo `src` e reduz confusão.

---

## 3. Stack proposta (sem Angular)

| Camada | Escolha sugerida | Motivo |
|--------|------------------|--------|
| Linguagem | **TypeScript opcional** ou **JavaScript** | TS ajuda a portar classes `CPF`/`CNPJ` com tipos; JS puro também basta |
| Empacotamento | **Vite** (multi-page) ou **esbuild** | Importar NPM (`gerador-nome`, `js-brazil`) no código da extensão; gerar `background.js` + bundles por página |
| UI | **HTML + CSS** (pode manter aparência Bootstrap via CDN ou CSS mínimo próprio) | Popup é pequeno; CDN no `index.html` é aceitável **se** a política da loja for cumprida (alguns usam CSS local para menos dependências de rede) |
| Ícones/fontes | Font Awesome: **local** ou **subset** | Menos dependência de rede no popup |

**Remover / substituir dependências:**

| Actual | Nova abordagem |
|--------|----------------|
| `guid-typescript` | `crypto.randomUUID()` (disponível em contextos da extensão modernos) |
| `ng-brazil` | Validar com **`js-brazil`** (`validateBr.cpf` / `validateBr.cnpj`) já usado no modelo CPF |
| Máscaras `angular2-text-mask` | Biblioteca leve (**IMask** ou funções simples de `input` + formatação ao perder foco) — ou só regex/`replace` para 11/14 dígitos |
| `document.execCommand('copy')` | **`navigator.clipboard.writeText()`** no popup; ver secção 5 para o **service worker** |

---

## 4. Manifest V3 — checklist

- **`manifest_version`:** `3`
- **`action.default_popup`:** apontar para o HTML do menu (ex. `popup.html` ou `src/popup/index.html` após build)
- **`background`:** `service_worker`: um único ficheiro (ex. `background.js`) — **sem** `background.scripts` array
- **`commands`:** manter os quatro comandos (`gerar-cpf`, etc.) e `global: true` onde ainda suportado / testado
- **`icons`:** iguais aos tamanhos actuais
- **`permissions`:** começar pelo mínimo:
  - provavelmente **`clipboardWrite`** (e validar na documentação actual se o SW precisa de permissão extra para escrever clipboard a partir de `chrome.commands`)
- **`host_permissions`:** evitar `https://*/*` a menos que seja estritamente necessário; para links LinkedIn/GitHub no rodapé **não** é preciso — são `target="_blank"` para URLs públicas

**Versionamento:** subir `version` no manifest (ex. `2.0.0`) alinhado com `package.json` para a nova submissão.

---

## 5. Clipboard a partir do service worker (atalhos globais)

O popup tem contexto de página: **`navigator.clipboard.writeText`** costuma bastar quando o utilizador clica.

Para **`chrome.commands`** o handler corre no **service worker**, onde não há DOM fiável nem `execCommand`.

Plano em dois níveis (implementar na ordem):

1. **Verificar suporte** na versão mínima do Chrome que pretendes suportar: `navigator.clipboard.writeText` dentro do service worker com a permissão certa.
2. Se não for fiável em todos os alvos: usar **Offscreen API** (`chrome.offscreen`) com um documento mínimo que executa a cópia — padrão recomendado em extensões MV3 para operações que precisam de “janela”.

**Critério de fecho da fase:** Ctrl+Shift+1–4 cola o valor esperado noutra aplicação (Bloco de notas, etc.) sem abrir o popup.

---

## 6. Arquitectura de ficheiros sugerida

```
fakedataeasy-chrome-extension/
  package.json
  vite.config.ts          # ou esbuild.mjs
  FEATURES.md
  IMPLEMENTATION_PLAN.md
  src/
    manifest.json         # copiado para dist na build, ou gerado
    background/
      service-worker.ts     # chrome.commands + copy strategy
    lib/
      cpf.ts              # port da lógica actual
      cnpj.ts
      nome.ts             # re-export gerador-nome
      guid.ts             # crypto.randomUUID
      string-utils.ts
      clipboard.ts        # funções unificadas popup vs SW
    popup/
      index.html          # menu principal
      main.ts
      styles.css
    pages/
      cpf.html + cpf.ts
      cnpj.html + cnpj.ts
      nome.html + nome.ts
  public/
    assets/               # png, etc.
```

**Navegação entre ecrãs:** cada “página” pode ser um HTML dedicado aberto na mesma janela do popup via `location.href = 'cpf.html'` (paths relativos ao bundle), evitando router SPA.

---

## 7. Fases de implementação (ordem recomendada)

### Fase A — Arranque do novo projeto (0,5–1 dia) ✅ **feito**

- Inicializar `package.json` limpo com script `build` e `dev` (watch).
- Configurar empacotador com **múltiplas entradas**: `service-worker`, `popup/main`, `pages/cpf`, etc.
- Garantir que `dist/` contém estrutura carregável em **Carregar expandida** no Chrome.

**Implementação:** Vite 6 + TypeScript; entradas em `popup/index.html`, `pages/*.html` e `src/background/service-worker.ts`; `public/manifest.json` (MV3) e ícones em `public/assets/`; Angular e ficheiros antigos removidos. Ver [`README.md`](./README.md) para `npm run build` e pasta **`dist`**.

### Fase B — Port dos geradores (0,5–1 dia) ✅ **feito** (com C+D)

- Copiar / adaptar **`CPF`**, **`CNPJ`** e utilitários (`onlyNumbers`, formatação com pontos) do código Angular actual para `src/lib/`.
- Integrar **`gerador-nome`** como hoje (menu = geral; página nome = masc/fem).
- GUID = **`crypto.randomUUID()`**.

**Implementação:** `src/lib/cpf.ts`, `cnpj.ts`, `format-br.ts`, `nome.ts`, `guid.ts`, `string-utils.ts`, `clipboard.ts`; dependências `js-brasil` e `gerador-nome`.

### Fase C — UI do menu principal (0,5 dia) ✅ **feito**

- Tabela com 4 linhas, botões, texto temporário ~2 s (setTimeout + classes CSS), rodapé com links.
- Wired aos geradores + `clipboard` no popup.

**Implementação:** `popup/index.html` + `popup/main.ts` + estilos em `popup/styles.css`.

### Fase D — Páginas CPF / CNPJ / Nome (1–1,5 dias) ✅ **feito**

- Formulários sem Reactive Forms: `input` + listeners.
- Máscara com/sem pontos (comportamento equivalente ao actual: gerar continua a produzir **só dígitos**; máscara é sobretudo para edição/visualização — documentar igual ao `FEATURES.md`).
- CPF: botão / submit de validação usando `validateBr.cpf` após `onlyNumbers`.
- CNPJ: validação em tempo real ou ao evento equivalente ao que tinhas com `ng-brazil`.
- Botões “Exportar lista” **desabilitados** com “Em breve” **ou** removidos — decidir se queres paridade visual exacta.

**Implementação:** `pages/cpf.html` + `cpf.ts`, `cnpj.*`, `nome.*`; validação CNPJ com `js-brasil` ao atingir 14 dígitos; rádios alinhados ao comportamento do Angular (incl. nome masc/fem vs menu geral).

### Fase E — Background + comandos (0,5–1 dia) ✅ **feito**

- Registar `chrome.commands.onCommand` no service worker.
- Reutilizar mesmas funções de `src/lib` (import no bundle do SW).
- Implementar cópia (secção 5).

**Implementação:** [`src/background/service-worker.ts`](./src/background/service-worker.ts) + [`src/lib/commands.ts`](./src/lib/commands.ts); cópia via `navigator.clipboard.writeText` no SW e fallback com **documento offscreen** ([`src/background/clipboard-sw.ts`](./src/background/clipboard-sw.ts), [`offscreen/`](./offscreen/)) com motivo `CLIPBOARD`.

### Fase F — Manifest, ícones, polish (0,5 dia) ✅ **feito**

- Textos `name`, `description` em PT ou bilingue conforme loja.
- Revisão de permissões.

**Implementação:** `public/manifest.json` — `description` mais clara para a loja (atalhos + sem rede), `default_title`, atalhos sugeridos **mac** + texto dos comandos; `minimum_chrome_version`: **109**; permissões: `clipboardWrite` + `offscreen`; versão **2.1.0** alinhada com `package.json`.

### Fase G — Qualidade e loja (0,5–1 dia) ✅ **feito**

- Testar em Windows (atalhos podem colidir com outras extensões/apps).
- Lista de verificação da Chrome Web Store: política de privacidade, capturas de ecrã, justificação de permissões.
- Empacotar `.zip` só com `dist/`.

**Implementação:** [`docs/CHROME_WEB_STORE.md`](./docs/CHROME_WEB_STORE.md) (checklist, testes manuais, textos PT/EN para permissões e finalidade única); [`PRIVACY.md`](./PRIVACY.md) (política para URL pública); script **`npm run zip`** ([`scripts/zip-dist.mjs`](./scripts/zip-dist.mjs)) gera `fake-data-easy-chrome-<versão>.zip` com o conteúdo de `dist/` na raiz do arquivo.

---

## 8. Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| `js-brazil` / `gerador-nome` incham o bundle | Tree-shaking; importar apenas funções necessárias; avaliar bundle size antes de publicar |
| Clipboard no SW falha em alguns ambientes | Offscreen document como fallback |
| Teclas globais em conflito | Documentar na descrição da loja; manter comandos personalizáveis pelo Chrome |
| Revisão da loja rejeita permissões | Pedir só `clipboardWrite`; não pedir `tabs` / `host_permissions` sem necessidade |

---

## 9. Após o primeiro lançamento

- Atualizar `README.md` com instruções `npm ci`, `npm run build`, “Carregar expandida”.
- Opcional: testes automatizados só para funções puras (`CPF.Validar`, geração + checksum).
- Funcionalidades “Em breve” (exportar lista) podem entrar como issues separadas.

---

## 10. Resumo executivo

1. **Arquivar** o Angular e **apagar** a estrutura antiga da pasta da extensão.  
2. **Subir** um projeto **MV3** com **HTML + JS/TS** e **build** (Vite/esbuild).  
3. **Portar** geradores e validações; **trocar** GUID e clipboard por APIs modernas.  
4. **Resolver** cópia a partir do **service worker** (clipboard API ou **offscreen**).  
5. **Reproduzir** UI e fluxos de [`FEATURES.md`](./FEATURES.md), depois **empacotar** e **resubmeter** na Chrome Web Store.

Quando quiseres passar à execução, o passo seguinte natural é **Fase A + B** (scaffolding do build e port dos `lib/*` com teste manual num SW mínimo).
