# Fake Data Easy — extensão Chrome (MV3)

Geração de dados fictícios para testes de formulários. **Stack:** Vite 6, TypeScript, Manifest V3 (sem Angular).

## Requisitos

- Node.js 18+
- npm

## Comandos

```bash
npm ci
npm run build
```

Saída em **`dist/`**. Em desenvolvimento contínuo:

```bash
npm run dev
```

(`vite build --watch` — volte a carregar a extensão no Chrome quando o build terminar.)

## Carregar no Chrome

1. Abra `chrome://extensions`
2. Ative **Modo do programador**
3. **Carregar sem compactação** → escolha a pasta **`dist`**

## Documentação

- [`FEATURES.md`](./FEATURES.md) — comportamento alvo (versão Angular anterior)
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — fases da reescrita
- [`docs/IDEIAS_E_MELHORIAS.md`](docs/IDEIAS_E_MELHORIAS.md) — ideias futuras (ícones no campo, auto vs manual, loja)

## Helper nos campos (por site)

- **Os atalhos globais (Ctrl+Shift+1–4) funcionam em qualquer sítio ou aplicação** onde o Chrome os aceite: **não** dependem da lista de sites. Copiam para a área de transferência sem injectar nada na página.
- **A barra Auto / Escolher** junto aos campos só aparece nas **origens que estiverem na tua lista** (por defeito `localhost` e `127.0.0.1`). Isto limita o content script aos sites onde autorizaste a extensão.
- Ao focar um `<input>` / `<textarea>` compatível: **Auto** (raio + texto; heurística “parece e-mail”, CPF, CNPJ, telefone BR, data ISO, URL, nome, GUID…) e **Escolher** (lista + texto; menu manual). Se o campo for ambíguo, aparece uma dica a amarelo a sugerir **Escolher**.
- No **popup**: **Site actual** → **Adicionar este site** ou **Gerir lista…**; **⚙ Configurações** ou **Gerir lista** abrem a página de configurações **num novo separador** (sites + tema). As setas **→** levam ao ecrã do gerador **no próprio popup** (navegação interna). **CEP** no menu (8 dígitos no 📋; página **→** com CEPs reais exemplo por região).
- **Exportar CSV** nas páginas CPF, CNPJ, Nome e CEP: histórico da **sessão** (valores gerados com «↻ Gerar»), UTF-8 com BOM.
- **Tema**: em **Configurações** → **Aparência**, escolhe **Automático** (segue o sistema), **Claro** ou **Escuro**. Popup, configurações e páginas de geradores partilham a mesma preferência (`chrome.storage.local`).

## Atalhos globais

**Ctrl+Shift+1–4** (no macOS, **Command+Shift+…** conforme sugerido) geram e **copiam** CPF, CNPJ, nome ou GUID **em qualquer lado**, sem estar o URL na lista. Personalize em `chrome://extensions` → **Atalhos**.

As regras oficiais do Chrome **não mudaram** em traços gerais: atalhos **globais** só podem ser sugeridos como **`Ctrl+Shift+0`–`9`** (medida de segurança). Ver [documentação `commands`](https://developer.chrome.com/docs/extensions/reference/api/commands).

### Se o atalho “não faz nada”

1. Em **Extensões → Atalhos**, confirme que o comando não está **em branco** e que não há conflito com outra extensão.
2. **ChromeOS** não suporta comandos globais (`global: true`).
3. O **service worker** não tem documento focado: `navigator.clipboard` **costuma falhar** lá; os atalhos copiam via **documento offscreen** (com retry e `execCommand` de reserva). Faça **`npm run build`** e **Recarregar** a extensão após actualizar o código.

## Permissões

- **`activeTab`** — ler o URL do separador actual no popup para “Adicionar este site”.
- **`scripting`** + **`storage`** — injectar o helper só nos hosts da tua lista; guardar a lista localmente.
- **`host_permissions`** — `localhost` / `127.0.0.1` por defeito.
- **`optional_host_permissions`** (`http://*/*`, `https://*/*`) — concedidas **quando adicionas** cada site (popup ou opções). Só esses hosts entram no registo do content script.
- **`clipboardWrite`** — copiar valores gerados.
- **`offscreen`** — clipboard fiável a partir dos **atalhos** globais (MV3).
- **`tabs`** — abrir a página de **configurações** num separador a partir do botão no popup (`chrome.tabs.create` para `options/options.html`).

## Marca e ícones

- **Fonte do ícone:** `public/assets/logo-icon.svg` (gradiente teal → azul → índigo, linhas “formulário”, selo âmbar “+”).
- **PNG da barra e da loja:** gerados automaticamente no build (`FakeDataEasy-{16,32,48,128}.png`). Para regenerar só os PNG após editar o SVG: `npm run icons` (usa **sharp**; mantenha o SVG em UTF-8 **sem** comentários com caracteres que corrompam o ficheiro).

## Estrutura

```
popup/          — menu principal
pages/          — opções CPF / CNPJ / Nome
offscreen/      — fallback de clipboard (MV3)
src/background/ — service worker + comandos
src/lib/        — geradores e utilitários
public/         — manifest + ícones SVG/PNG (copiados para dist/)
```

## Chrome Web Store

- Guia completo: [`docs/CHROME_WEB_STORE.md`](docs/CHROME_WEB_STORE.md) — checklist, **Data safety**, justificativas **activeTab / scripting / storage**, texto para revisor, URLs `raw.githubusercontent.com` vs página no GitHub.
- Política de privacidade: [`PRIVACY.md`](PRIVACY.md) (o painel da loja deve usar o **mesmo** URL HTTPS que declarar; o popup/opções ligam à vista no GitHub).

Gerar o **ZIP** de submissão (faz build e cria o ficheiro **dentro de** `dist/`):

```bash
npm run zip
```

→ `dist/fake-data-easy-chrome-<versão>.zip` (ficheiros `*.zip` antigos em `dist/` não entram no arquivo).

Com **nome personalizado**:

```bash
node scripts/zip-dist.mjs fake_data_easy_v2.0
```

→ `dist/fake_data_easy_v2.0.zip`.

O ZIP contém o **interior** de `dist/` na raiz (com `manifest.json` no topo), como a loja exige.
