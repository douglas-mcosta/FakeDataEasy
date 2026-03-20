# Fake Data Easy

Extensão para **Google Chrome** (Manifest V3) que gera **dados fictícios com formato válido** — CPF, CNPJ, CEP, nomes, GUID e mais — para **testes de formulários**, QA e desenvolvimento. Tudo corre **no teu computador**: sem contas, sem envio desses dados para servidores externos e sem telemetria na extensão.

[Instalar na Chrome Web Store](https://chrome.google.com/webstore/detail/fake-data-easy/nkdncmpmmhpdngfjbghlebjfncemheij?hl=pt-BR) · [Política de privacidade](fakedataeasy-chrome-extension/PRIVACY.md) · [Código-fonte](https://github.com/douglas-mcosta/FakeDataEasy)

---

## O que inclui

| Área | Descrição |
|------|-----------|
| **Popup** | Gerar e copiar CPF, CNPJ, nome, CEP, GUID; atalhos visíveis; ecrãs extra para CPF/CNPJ/Nome/CEP com máscaras e validação onde aplicável. |
| **Atalhos globais** | **Ctrl+Shift+1–4** (macOS: **⌘⇧1–4** por omissão) copiam o tipo correspondente **em qualquer aplicação** onde o Chrome permita — não dependem da lista de sites. |
| **Helper nos campos** | Barra **Auto** / **Escolher** junto a `input`/`textarea` só nas **origens que autorizares** (por omissão `localhost`). Heurísticas locais (e-mail, documentos BR, telefone, datas, etc.); **iframes** suportados. |
| **Opções** | Lista de sites, tema (claro / escuro / sistema), **ligar ou desligar** o helper por completo, **regras por URL + selector CSS** para forçar o tipo no **Auto**. |
| **Exportação** | CSV (UTF-8 com BOM) do histórico de geração na sessão nas páginas de geradores. |

O comando **«Abrir menu Escolher»** no helper pode ser atribuído em `chrome://extensions/shortcuts` (o Chrome limita a **quatro** teclas sugeridas no manifest; dentro da página podes usar **Alt+Shift+E**).

---

## Para utilizadores

1. Instala a extensão pela [Chrome Web Store](https://chrome.google.com/webstore/detail/fake-data-easy/nkdncmpmmhpdngfjbghlebjfncemheij?hl=pt-BR).
2. Para ver o helper em staging ou produção interna: no popup, **Adicionar este site** (ou gere a lista em **Configurar**). O Chrome pede permissão **por origem**.
3. Se só quiseres atalhos e popup **sem** botões nas páginas: **Configurar** → desliga **Helper nos campos**.

Mais detalhe de comportamento: [fakedataeasy-chrome-extension/README.md](fakedataeasy-chrome-extension/README.md).

---

## Para desenvolvedores

O código da extensão está em **`fakedataeasy-chrome-extension/`**.

**Requisitos:** Node.js 18+ · npm

```bash
cd fakedataeasy-chrome-extension
npm ci
npm run build
```

Carrega no Chrome a pasta **`fakedataeasy-chrome-extension/dist`** em modo programador (`chrome://extensions` → **Carregar sem compactação**).

| Comando | Efeito |
|---------|--------|
| `npm run dev` | Build em modo *watch* (recompila ao gravar; recarrega a extensão manualmente). |
| `npm run zip` | Build + arquivo `fake-data-easy-chrome-<versão>.zip` pronto para a loja (conteúdo = interior de `dist/`). |

**Stack:** Vite 6 · TypeScript · MV3 (service worker, *offscreen* para clipboard nos atalhos) · *content script* com Shadow DOM no helper.

---

## Estrutura do repositório

```
FakeDataEasy/
├── README.md                          ← estás aqui
└── fakedataeasy-chrome-extension/
    ├── public/                        manifest, ícones → copiados para dist/
    ├── popup/ , pages/ , options/     UI
    ├── src/background/                service worker, comandos, registo de scripts
    ├── src/content/                   helper nos campos
    ├── src/lib/                       geradores, heurísticas, storage
    ├── PRIVACY.md                     política para utilizadores e revisão da loja
    └── docs/
        ├── CHROME_WEB_STORE.md        checklist, Data safety, justificativas
        └── IDEIAS_E_MELHORIAS.md      ideias e estado de implementação
```

---

## Documentação e privacidade

- [README da extensão](fakedataeasy-chrome-extension/README.md) — permissões, estrutura técnica, problemas com atalhos.
- [CHROME_WEB_STORE.md](fakedataeasy-chrome-extension/docs/CHROME_WEB_STORE.md) — submissão, ZIP, textos para o painel.
- [PRIVACY.md](fakedataeasy-chrome-extension/PRIVACY.md) — dados, rede, permissões; usa um URL HTTPS estável (ex.: *raw* no GitHub) no formulário da loja.
- [IDEIAS_E_MELHORIAS.md](fakedataeasy-chrome-extension/docs/IDEIAS_E_MELHORIAS.md) — roadmap e contexto de produto.
- [IMPLEMENTATION_PLAN.md](fakedataeasy-chrome-extension/IMPLEMENTATION_PLAN.md) — notas da reescrita MV3.

---

## Créditos

**Douglas M. Costa** — desenvolvimento da extensão. Ligações no popup: LinkedIn e GitHub.

Sugestões ou bugs: [Issues no GitHub](https://github.com/douglas-mcosta/FakeDataEasy/issues).
