# Ideias e melhorias — Fake Data Easy

Documento vivo com **sugestões de produto** e **melhorias técnicas** para evoluções futuras da extensão. Nada disto está comprometido no roadmap; serve para priorizar e discutir.

---

## 1. Ícones ao lado do campo focado (content script)

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

## 2. Deteção heurística do tipo de campo (“parece e-mail”)

**Ideia:** O **ícone automático** usa regras simples para adivinhar o dado:

- `type="email"` ou `inputmode="email"` ou `autocomplete` contém `email` → gerar **e-mail fictício**.
- `name`, `id`, `placeholder`, `aria-label` com padrões (`cpf`, `cnpj`, `phone`, `tel`, `birth`, `data`, etc.) → mapear para gerador correspondente.
- Campos com **máscara** ou **comprimento máximo** (ex.: 11 para CPF) podem reforçar a hipótese.

**Extra:** permitir ao utilizador **sobrepor** a heurística (“neste site trata sempre este campo como CPF”) guardado em `chrome.storage.local` com chave por origem + selector (avançado).

**Risco:** falsos positivos; manter sempre o **ícone manual** visível para corrigir num clique.

---

## 3. Dois ícones distintos (Auto vs Escolher)

Proposta alinhada com o que descreveste:

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

- Explicar **por que** precisa de hosts ou `activeTab`.
- Manter **política de privacidade** actualizada (“não lemos o conteúdo dos campos para servidores externos”; se houver heurística, é **local**).
- Oferecer **desligar totalmente** o content script para quem só quer popup + atalhos.

---

## 6. Possível ordem de implementação (técnica)

1. Opções da extensão (`options.html` ou secção no popup) com toggle **Inject field helpers: on/off**.
2. Content script mínimo: só mostrar ícone em **localhost** e **127.0.0.1** primeiro (menos fricção na loja).
3. Popover “manual” com os mesmos tipos que o popup.
4. Heurísticas + ícone “Auto”.
5. Alargar hosts permitidos conforme feedback e requisitos da loja.

---

*Se quiseres transformar isto em issues no GitHub, podes cortar cada secção num issue à parte (UX, permissões, heurísticas, novos geradores).*
