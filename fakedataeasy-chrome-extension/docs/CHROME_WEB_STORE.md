# Guia de publicação — Chrome Web Store

Checklist e textos auxiliares para submeter **Fake Data Easy** (Manifest V3), alinhado às exigências de [Programa de desenvolvimento de extensões](https://developer.chrome.com/docs/webstore/program-policies) e ao questionário **Data safety** do painel.

## 1. Antes de carregar o pacote

1. `npm ci`
2. `npm run build` — pasta `dist/` com `manifest.json` na raiz.
3. Teste **Carregar sem compactação** em `chrome://extensions` apontando para `dist/`.
4. (Opcional) `npm run zip` — gera `fake-data-easy-chrome-<versão>.zip` na raiz do projecto da extensão (conteúdo = interior de `dist/`, sem pasta extra).

## 2. Testes manuais

Marque após validar:

- [ ] **Popup:** gerar CPF, CNPJ, nome, CEP, GUID; cópia e colar noutra app.
- [ ] **Páginas** CPF / CNPJ / Nome / CEP.
- [ ] **Atalhos globais** `Ctrl+Shift+1` … `4` (ou os definidos em **Extensões → Atalhos**).
- [ ] **Helper** (site na lista): Auto, Escolher, **ligar/desligar** nas opções (confirma que desliga o inject).
- [ ] **Atalho** “Abrir menu Escolher” (se atribuído em Atalhos) ou **Alt+Shift+E** na página.
- [ ] **Overrides** por selector (opções): regra aplicada no Auto.
- [ ] Subir **versão** em `public/manifest.json` e `package.json` antes de cada envio.

## 3. Política de privacidade (URL HTTPS)

A loja exige um URL **HTTPS** estável.

**Repositório oficial:** `https://github.com/douglas-mcosta/FakeDataEasy`

| Uso | URL sugerida |
|-----|----------------|
| Campo “Privacy policy” no painel (Markdown legível) | `https://raw.githubusercontent.com/douglas-mcosta/FakeDataEasy/master/fakedataeasy-chrome-extension/PRIVACY.md` |
| Ligação humana no popup / opções | `https://github.com/douglas-mcosta/FakeDataEasy/blob/master/fakedataeasy-chrome-extension/PRIVACY.md` |

Confirme que o branch (`master`) corresponde ao que usa no GitHub. O popup e este documento devem usar o **mesmo** URL que colar na loja (ou uma página HTTPS equivalente).

## 4. Justificação de permissões (copiar para o formulário da loja)

Use **Português** ou **English** conforme o painel. Textos alinhados ao `manifest.json` actual.

### clipboardWrite

**PT:** A extensão só escreve na área de transferência valores que o utilizador acabou de gerar (CPF, CNPJ, nome, etc.) por botão, ecrã de gerador ou atalho. Não lê a área de transferência nem envia o seu conteúdo para a rede.

**EN:** The extension writes to the clipboard only values the user just generated via a button, generator page, or shortcut. It does not read the clipboard or exfiltrate clipboard data.

### offscreen

**PT:** Usada apenas para um documento invisível com motivo `CLIPBOARD`, quando o Chrome não permite copiar directamente do service worker ao usar atalhos globais. Não mostra UI nem recolhe dados para servidores.

**EN:** Used only for an invisible offscreen document with the `CLIPBOARD` reason when the browser cannot write to the clipboard from the service worker for global shortcuts. No UI; no data collection or transmission.

### tabs

**PT:** Usada para abrir o separador das **opções** da extensão quando o utilizador escolhe Configurar / Gerir lista. Não serve para ler histórico nem conteúdo de páginas web.

**EN:** Used to open a tab with the extension’s options page when the user opens settings from the popup. Not used to read browsing history or page content.

### activeTab

**PT:** Permite ler o **URL do separador activo** quando o utilizador clica em **Adicionar este site** no popup, e permite usar scripting **nessa página** depois de um gesto explícito (ex.: atalho opcional que abre o menu “Escolher” no helper). Não monitoriza a navegação em segundo plano.

**EN:** Grants temporary access to the active tab when the user invokes “Add this site” in the popup (to read the tab URL) and for user-gesture actions like an optional shortcut that opens the in-page “Choose” menu. It is not used for background tracking.

### scripting

**PT:** Regista o content script do **helper** apenas nos hosts que o utilizador aprovou (via `optional_host_permissions` por origem). Também executa um snippet pontual nesses contextos para o atalho “Abrir Escolher”. Não injecta em sites sem permissão concedida.

**EN:** Registers the optional field-helper content script only on user-approved hosts (per-origin optional permissions). Runs short scripting for the optional “open picker” shortcut in those contexts. Does not inject on sites without permission.

### storage

**PT:** Armazena localmente a lista de sites permitidos, tema, opção de ligar/desligar o helper, regras opcionais de selector e dados de sessão de geradores (ex. export CSV). Nada é sincronizado com servidores pela extensão.

**EN:** Stores locally the allowed-site list, theme, helper on/off, optional selector rules, and session-only generator data (e.g. CSV export). The extension does not sync this to our servers.

### host_permissions (localhost / 127.0.0.1)

**PT:** Ambiente de desenvolvimento local pré-autorizado para o helper e testes sem pedido extra ao utilizador base.

**EN:** Pre-declared access to local development origins so developers can use the field helper on localhost without an extra step for the default install.

### optional_host_permissions (http/https)

**PT:** O utilizador concede **cada origem** ao adicionar um site. A extensão **não** pede acesso global a todos os sites automaticamente; só aos domínios que o utilizador escolhe.

**EN:** Host access is granted **per origin** when the user adds a site. The extension does not request blanket access to all websites without user action.

## 5. Data safety (painel da loja) — orientação

Declare de forma coerente com [`PRIVACY.md`](../PRIVACY.md):

- **User data collection:** a extensão **não** envia dados pessoais nem conteúdo de páginas para o programador; geração e heurísticas são **locais**.
- Se perguntarem por dados no dispositivo: **definições e listas** em `chrome.storage.local` permanecem no dispositivo; o utilizador pode apagar ao desinstalar ou limpar dados da extensão.
- **Não** venda de dados; **não** uso de dados para publicidade (a extensão não tem anúncios).
- **Código remoto:** não aplicável — sem execução remota de código.

Se algo no questionário não coincidir com o seu pacote, ajuste o código **ou** a declaração; revisores verificam consistência.

## 6. Finalidade única (single purpose)

**PT ( campo “single purpose”):** Gerar dados fictícios localmente para testes de formulários (CPF, CNPJ, CEP, nome, GUID, etc.) e copiá-los para a área de transferência ou preencher campos **opcionalmente**, só em sites que o utilizador autorizar.

**EN:** Generate fake sample data locally for form testing (Brazilian IDs, CEP, names, GUIDs, etc.), copy to clipboard, and optionally fill fields only on user-allowed sites.

## 7. Nota para o revisor (se existir o campo)

Sugestão curta **PT:**

> MV3, service worker, sem código remoto. O helper injecta UI só em URLs da lista do utilizador (permissões de host opcionais por origem). Pode ser desligado nas opções. Atalhos globais só geram texto local e copiam para o clipboard (offscreen quando necessário). Ver `PRIVACY.md` no repositório.

## 8. Media na loja

- **Ícone:** 128×128 px (`public/assets/FakeDataEasy-128.png`).
- **Capturas:** típico **1280×800** ou **640×400** — popup, opções de sites/tema/helper, exemplo do helper num formulário, export CSV se quiser destacar.
- **Vídeo:** opcional.

## 9. Pacote ZIP

- O ZIP deve ter **`manifest.json` na raiz**, como o interior de `dist/` após `npm run build`.
- **Não** empacotar `src/`, `node_modules/`, nem uma pasta única `dist/` por cima de tudo.

O script `npm run zip` gera a estrutura correcta.

## 10. Documentação oficial

[Chrome Web Store — Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies) e [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare).

---

*Actualize a versão e este guia quando o `manifest` ou as permissões mudarem.*
