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

## Atalhos globais

Após instalar, **Ctrl+Shift+1–4** (no macOS, combinações sugeridas com **Command**) geram e **copiam** CPF, CNPJ, nome ou GUID, sem abrir o popup. Personalize em `chrome://extensions` → **Atalhos**.

As regras oficiais do Chrome **não mudaram** em traços gerais: atalhos **globais** só podem ser sugeridos como **`Ctrl+Shift+0`–`9`** (medida de segurança). Ver [documentação `commands`](https://developer.chrome.com/docs/extensions/reference/api/commands).

### Se o atalho “não faz nada”

1. Em **Extensões → Atalhos**, confirme que o comando não está **em branco** e que não há conflito com outra extensão.
2. **ChromeOS** não suporta comandos globais (`global: true`).
3. O **service worker** não tem documento focado: `navigator.clipboard` **costuma falhar** lá; os atalhos copiam via **documento offscreen** (com retry e `execCommand` de reserva). Faça **`npm run build`** e **Recarregar** a extensão após actualizar o código.

## Permissões

- **`clipboardWrite`** — copiar valores gerados.
- **`offscreen`** — documento invisível com motivo `CLIPBOARD` usado para escrever na área de transferência a partir dos **atalhos** (fluxo fiável em MV3).

## Estrutura

```
popup/          — menu principal
pages/          — opções CPF / CNPJ / Nome
offscreen/      — fallback de clipboard (MV3)
src/background/ — service worker + comandos
src/lib/        — geradores e utilitários
public/         — manifest + ícones (copiados para dist/)
```

## Chrome Web Store

- Guia completo: [`docs/CHROME_WEB_STORE.md`](docs/CHROME_WEB_STORE.md) (checklist, política de privacidade, justificativas das permissões).
- Política de privacidade (publique num URL HTTPS, p.ex. raw do GitHub): [`PRIVACY.md`](PRIVACY.md).

Gerar o **ZIP** de submissão (faz build e cria `fake-data-easy-chrome-<versão>.zip` na raiz desta pasta):

```bash
npm run zip
```

O ZIP contém o **interior** de `dist/` na raiz (com `manifest.json` no topo), como a loja exige.
