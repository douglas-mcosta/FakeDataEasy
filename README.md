# Fake Data Easy

Extensão Chrome para gerar dados fictícios (CPF, CNPJ, nome, GUID) e facilitar testes de formulários.

**Código e instruções de build:** veja [`fakedataeasy-chrome-extension/README.md`](fakedataeasy-chrome-extension/README.md).

A extensão foi reescrita com **Vite + TypeScript + Manifest V3** (sem Angular). Documentação de funcionalidades: [`fakedataeasy-chrome-extension/FEATURES.md`](fakedataeasy-chrome-extension/FEATURES.md).

---

## Atalhos (comportamento alvo)

- **Ctrl+Shift+1** — CPF  
- **Ctrl+Shift+2** — CNPJ  
- **Ctrl+Shift+3** — Nome  
- **Ctrl+Shift+4** — GUID  

Os atalhos são tratados no **service worker** (copiam para a área de transferência).

## Chrome Web Store

<https://chrome.google.com/webstore/detail/fake-data-easy/nkdncmpmmhpdngfjbghlebjfncemheij?hl=pt-BR>

**Publicar nova versão:** checklist, privacidade e ZIP — [`fakedataeasy-chrome-extension/docs/CHROME_WEB_STORE.md`](fakedataeasy-chrome-extension/docs/CHROME_WEB_STORE.md) e `npm run zip` dentro dessa pasta.
