# Site estático — Fake Data Easy

Páginas HTML públicas sobre a extensão: **Início**, **Recursos**, **Instalar**, **Sobre** e **Privacidade**.
Esta pasta **não** é processada pelo `npm run build` do Vite. O pacote da extensão continua saindo apenas de `dist/`, a partir de `popup/`, `pages/`, `public/` e afins.

## Pré-visualizar localmente

Na pasta `fakedataeasy-chrome-extension`:

```bash
npm run site:serve
```

Ou:

```bash
npx --yes serve site
```

Abra o URL indicado no terminal, como `http://localhost:3000`.

## GitHub Pages

Se quiser publicar este material no GitHub Pages, as opções mais simples são:

1. Copiar o conteúdo de `site/` para `/docs` na raiz do repositório `FakeDataEasy` e configurar `Settings > Pages`.
2. Publicar esta pasta com GitHub Actions para um branch `gh-pages`.

Os links entre as páginas são relativos e funcionam bem em subpastas.

O texto de privacidade mais completo continua em [`../PRIVACY.md`](../PRIVACY.md). A página `privacidade.html` resume esse conteúdo em uma versão mais direta para o site público.
