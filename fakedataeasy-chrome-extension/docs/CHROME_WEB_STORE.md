# Guia de publicação — Chrome Web Store (Fase G)

Checklist e textos auxiliares para submeter **Fake Data Easy** (MV3).

## 1. Antes de carregar o pacote

1. `npm ci`
2. `npm run build` — pasta `dist/` com `manifest.json` na raiz.
3. Teste **Carregar sem compactação** em `chrome://extensions` apontando para `dist/`.
4. (Opcional) `npm run zip` — gera `fake-data-easy-chrome-<versão>.zip` na raiz do projeto da extensão (conteúdo = interior de `dist/`, sem pasta extra).

## 2. Testes manuais (Windows e outros)

Marque após validar:

- [ ] **Popup:** gerar CPF, CNPJ, nome, GUID pelos botões; texto aparece e copia (colar noutra app).
- [ ] **Páginas** CPF / CNPJ / Nome: gerar, máscaras, validação CPF/CNPJ, voltar ao menu.
- [ ] **Atalhos globais** `Ctrl+Shift+1` … `4` (ou os que definiu em **Extensões → Atalhos**): copiam o tipo certo sem abrir o popup.
- [ ] Se um atalho **não dispara**, verifique conflito com outra extensão ou atalho do SO — reatribua em `chrome://extensions/shortcuts`.
- [ ] **Atualização:** subir versão em `public/manifest.json` e `package.json` antes de um novo envio.

## 3. Política de privacidade (URL pública)

A loja exige uma **URL HTTPS** para a política de privacidade.

1. Faça commit de [`../PRIVACY.md`](../PRIVACY.md) no repositório público.
2. Utilize por exemplo o endereço **raw** do GitHub (substitua utilizador, repo e caminho):

   `https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/master/fakedataeasy-chrome-extension/PRIVACY.md`

   Ou publique a mesma informação numa página `https://…` sua.

3. No painel da loja, cole essa URL no campo de política de privacidade.

**Contacto:** edite o fim de `PRIVACY.md` com email ou link real antes de submeter.

## 4. Justificação de permissões (copiar/colar no formulário da loja)

### clipboardWrite

**Português:**  
“A extensão só escreve na área de transferência o CPF, CNPJ, nome ou GUID que o utilizador acaba de gerar por botão ou atalho, para poder colar noutro campo ou aplicação. Não lê nem envia o conteúdo da área de transferência para a rede.”

**English (se o formulário pedir em inglês):**  
“The extension writes to the clipboard only the CPF, CNPJ, name, or GUID the user just generated via a toolbar action or keyboard shortcut, so they can paste it elsewhere. It does not read the clipboard or send clipboard contents over the network.”

### offscreen

**Português:**  
“Utilizada apenas para um documento invisível com motivo `CLIPBOARD`, quando o Chrome não permite copiar diretamente a partir do service worker ao usar atalhos globais. Não exibe interface nem recolhe dados.”

### tabs

**Português:**  
“Usada só para abrir o separador da página de configurações da extensão (lista de sites, tema) quando o utilizador clica em **Configurações** ou **Gerir lista** no popup. A extensão não lê o histórico nem o conteúdo dos sites do utilizador através desta permissão.”

**English:**  
“Used only to open a tab showing the extension’s settings page (site list, theme) when the user clicks **Settings** or **Manage list** in the popup. The extension does not read browsing history or page content through this permission.”

### optional_host_permissions (http/https)

**Português:**  
“O utilizador escolhe em que sites a extensão pode injectar o helper nos campos. A permissão é pedida **por origem** (ao clicar em ‘Adicionar este site’ ou ao guardar a lista nas opções). Não é pedido acesso a todos os sites automaticamente.”

**English:**  
“Users choose which sites may run the optional in-page field helper. Host access is requested **per origin** when they add a site or save the list. The extension does not request blanket access to all websites without user action.”

**English:**  
“Used only for an invisible offscreen document with the `CLIPBOARD` reason when the browser cannot write to the clipboard directly from the service worker for global shortcuts. No UI is shown and no user data is collected.”

## 5. Finalidade única (Single purpose)

**Sugestão (PT):**  
“Gerar dados fictícios localmente (CPF, CNPJ, nome, GUID) para testes de formulários e copiá-los para a área de transferência.”

## 6. Media na loja

- **Ícone da loja:** 128×128 px (já existe em `public/assets/FakeDataEasy-128.png`).
- **Capturas de ecrã:** normalmente **1280×800** ou **640×400** (PNG ou JPEG). Faça capturas do popup, das páginas de opções e, se quiser, da configuração de atalhos.
- **Vídeo promocional:** opcional.

## 7. Pacote ZIP

- O ficheiro `.zip` deve conter **no nível raiz** ficheiros como `manifest.json`, `background.js`, pastas `popup/`, `assets/`, etc. — **igual** à pasta `dist/` após `npm run build`.
- **Não** incluir `src/`, `node_modules/`, nem `dist` como pasta única dentro do zip (erro comum: zip da pasta `dist` em vez dos *filhos* de `dist`).

O script `npm run zip` gera o arquivo com a estrutura correcta.

## 8. Notas para re.submissão

Se a extensão anterior foi removida por **Manifest V2** ou incompatibilidade, indique na **nota para o revisor** (se disponível) que esta versão é **Manifest V3**, com service worker e permissões mínimas justificadas.

---

Consulte sempre a [documentação oficial da Chrome Web Store](https://developer.chrome.com/docs/webstore) para requisitos actualizados.
