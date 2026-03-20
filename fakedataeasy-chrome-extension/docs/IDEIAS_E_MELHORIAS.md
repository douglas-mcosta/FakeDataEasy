# Ideias e melhorias — Fake Data Easy

Documento vivo com **sugestões de produto** e **melhorias técnicas**. Alguns itens do plano inicial **já estão implementados** (v2.2+) — ver secções com estado **Feito**.

---

## 1. Ícones ao lado do campo focado (content script) — **Feito (parcial)**

Implementado como barra fixa com **Auto** e **Escolher**, só nas origens da lista configurável (`src/content/field-helper.ts`). **Iframes:** content script com `allFrames` + atalho local **Alt+Shift+E**; comando global **«Abrir menu Escolher»** (sem tecla sugerida no manifest — limite de 4 do Chrome; configurar em Atalhos) usa `executeScript` em todos os frames. **Toggle** nas opções desliga o inject do helper sem apagar a lista de sites. **file://** continua fora do âmbito.

---

## 1b. (histórico) Texto original da ideia

**Ideia:** Com a extensão instalada, ao **focar ou clicar num `<input>` ou `<textarea>`**, aparecer um pequeno controlo (ícone ou chip) junto ao campo, ancorado à posição do elemento.

**Fluxo sugerido:**

- **Ícone A — “Automático”** (varinha, raio, ou label “Auto”): tenta **inferir o tipo de dado** pelo contexto do campo e gera + preenche (ou só copia, conforme preferência nas opções).
- **Ícone B — “Escolher”** (lista, engrenagem): abre um **mini menu** (popover) com: CPF, CNPJ, Nome, E-mail, Telefone, GUID, Data, Número, etc., e ao escolher **preenche o campo** ou cola no clipboard.

**Por que faz sentido:** reduz atrito em relação só ao popup e aos atalhos globais; o utilizador permanece na página que está a testar.

**Desafios:**

- Precisa de **content script** injectado em páginas `http(s)://` (e eventualmente `file://` se quiser suportar HTML local).
- Novas permissões típicas: **`activeTab`** (fluxo sob gesto do utilizador) e/ou **`host_permissions`** / padrões de URL se quiserem ícone em **todas** as páginas sem clicar primeiro na extensão — isto aumenta escrutínio na Chrome Web Store e exige **justificativa clara**.
- **Shadow DOM** e campos dentro de iframes (ex.: login em widget) complicam posicionamento do ícone.
- **Privacidade:** aparecer em qualquer site pode assustar utilizadores; convém **toggle nas opções** (“Mostrar ícones nos campos: Desligado / Só em localhost / Em todas as páginas permitidas”).
- **Performance:** observar só o elemento ativo ou usar `focusin` com debounce para não degradar páginas pesadas.

---

## 2. Deteção heurística do tipo de campo (“parece e-mail”) — **Feito**

Lógica central em `src/lib/field-heuristics.ts` (type, inputmode, autocomplete, name/id/placeholder/aria-label/class, maxLength). Geradores extra: telefone BR, data ISO, URL de teste.

**Ideia original:** O **ícone automático** usa regras simples para adivinhar o dado:

- `type="email"` ou `inputmode="email"` ou `autocomplete` contém `email` → gerar **e-mail fictício**.
- `name`, `id`, `placeholder`, `aria-label` com padrões (`cpf`, `cnpj`, `phone`, `tel`, `birth`, `data`, etc.) → mapear para gerador correspondente.
- Campos com **máscara** ou **comprimento máximo** (ex.: 11 para CPF) podem reforçar a hipótese.

**Extra — Feito:** overrides por **padrão de URL** + **selector CSS** + tipo de gerador, em `chrome.storage.local` (`fde_selector_overrides` / API em `storage-field-helper.ts`); o botão **Auto** usa a regra quando o URL e o campo coincidem.

**Risco:** falsos positivos; manter sempre o **ícone manual** visível para corrigir num clique.

---

## 3. Dois ícones distintos (Auto vs Escolher) — **Feito**

Dois controlos distintos no content script: **Auto** (ícone raio + texto) e **Escolher** (ícone lista + texto), com `title` / `aria-label` em português. Secundário: dica amarela quando a inferência é marcada como ambígua.

Proposta original:

| Controlo | Papel |
|----------|--------|
| **Auto** | Uma interação: inferência + preenchimento (ou tentativa; se não conseguir inferir, mostrar tooltip “Não reconhecido — use o menu”). |
| **Menu / Manual** | Lista explícita de tipos; útil para campos ambíguos ou quando a heurística falha. |

**UX:**

- Ícones pequenos (ex. 20–24 px), contraste acessível, posição fixa ao canto do campo (ex. direita interior) para não tapar texto.
- **Teclado:** atalho para abrir o menu manual sem rato (ex. quando o campo está focado).

---

## 4. Outras ideias que combinam bem

- **Mais geradores:** utilizador, palavra-passe forte, IBAN fictício (só formato), cartão de teste (só Luhn / bins de teste documentados), morada brasileira em uma linha, CEP, data/hora com intervalo.
- **Histórico local** dos últimos N valores gerados (opcional, com limpeza e sem enviar para rede).
- **Exportar lista** (hoje “Em breve” nas páginas CPF/CNPJ/Nome): CSV / copiar coluna.
- **Perfis:** “Sempre masculino no nome”, “CPF sempre sem pontos”, sincronizar opções com `storage.sync` entre máquinas (se fizer sentido).
- **Modo só clipboard vs preencher campo** nas opções globais.
- **Temas** claro/escuro no popup alinhado ao sistema.

---

## 5. Considerações para a Chrome Web Store

Qualquer funcionalidade que **injecte UI em páginas de terceiros** deve:

- Explicar **por que** precisa de hosts ou `activeTab` — ver justificativas prontas em [`docs/CHROME_WEB_STORE.md`](./CHROME_WEB_STORE.md) (secção 4).
- Manter **política de privacidade** pública (HTTPS) e coerente com o pacote: [`../PRIVACY.md`](../PRIVACY.md) (URLs sugeridas no guia).
- Oferecer **desligar totalmente** o content script — **Feito:** toggle «Helper nos campos» nas opções.
- Preencher **Data safety** / permissões no painel sem contradições com o código; checklist completo no mesmo guia.

---

## 6. Possível ordem de implementação (técnica)

1. ~~Opções + lista de sites; popup “Adicionar este site”.~~ **Feito**
2. ~~Content script + Shadow DOM + Auto / Escolher.~~ **Feito**
3. ~~Heurísticas.~~ **Feito**
4. ~~Toggle global “desligar helper”; atalho global configurável + **Alt+Shift+E** na página; iframes (`allFrames` + `executeScript`); overrides por selector.~~ **Feito**

---

*Se quiseres transformar isto em issues no GitHub, podes cortar cada secção num issue à parte (UX, permissões, heurísticas, novos geradores).*
