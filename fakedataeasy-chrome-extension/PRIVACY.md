# Política de privacidade — Fake Data Easy

**Última atualização:** março de 2026  

**Extensão:** Fake Data Easy (Manifest V3, Google Chrome / Chromium)

## Resumo

A extensão **Fake Data Easy** gera dados fictícios (CPF, CNPJ, CEP, nome, GUID, telefone, datas de exemplo, etc.) **só no seu dispositivo**, para apoiar testes de formulários e desenvolvimento. **Não recolhe dados para servidores do autor nem de terceiros**, não vende informações, não integra publicidade nem ferramentas de análise (analytics) na extensão.

## Dados e rede

- **Não há contas, início de sessão nem telemetria** integradas na extensão.
- **Não são feitos pedidos HTTP pela extensão** para enviar valores gerados, texto da área de transferência ou conteúdo de páginas web.
- Os únicos dados produzidos são **strings geradas localmente** e o texto **que você copia explicitamente** ao usar botões, páginas de geradores ou **atalhos de teclado** (o mesmo fluxo de “gerar e copiar”).
- **Código da extensão** executa a partir do pacote instalado; **não** há carregamento remoto de scripts (sem “remote code”).

## Permissões (Chrome) e finalidade

| Permissão | Para que serve |
|-----------|----------------|
| **activeTab** | Quando usa **Adicionar este site** no popup, a extensão lê o **URL do separador activo** para propor o padrão de origem. Também permite, **após um gesto seu** (atalho global opcional “Abrir Escolher”), usar a API de scripting **só na página em que está** para abrir o menu do helper. **Não** é usada para seguir a sua navegação em segundo plano. |
| **scripting** | Regista o **content script** do helper apenas nos **hosts que você aprovou** na lista (com `optional_host_permissions`). Usa **programmatic injection** / registo limitado a esses URLs — não injecta em “toda a Internet” sem permissão explícita por origem. |
| **storage** | Guarda **localmente** (`chrome.storage.local`): lista de padrões de sites, preferência de tema, **ligar/desligar o helper**, **regras opcionais** (URL + selector + tipo de dado para o botão Auto) e, se aplicável, dados de UI da sessão (ex.: histórico de valores gerados só para exportar CSV). **Nada disto é enviado pela extensão para a rede.** |
| **clipboardWrite** | Escreve na área de transferência **apenas** o valor que acabou de ser gerado por si, para poder colar noutro campo ou aplicação. |
| **offscreen** | Cria um documento invisível **só quando necessário** (`reason: CLIPBOARD`), para copiar de forma fiável a partir do **service worker** quando usa **atalhos globais** nos sistemas em que o Chrome não permite `navigator.clipboard` directamente no worker. |
| **tabs** | Usada para **abrir um separador** com a página **Opções** da extensão quando clica em **Configurar** / **Gerir lista** (equivalente a `chrome.runtime.openOptionsPage` com `options_ui.open_in_tab`). **Não** é usada para ler o conteúdo dos sites que visita. |

### Permissões de host (sites)

| Tipo | Finalidade |
|------|------------|
| **host_permissions** (`localhost`, `127.0.0.1`) | Permitir o helper e o fluxo “Adicionar site” em **ambiente de desenvolvimento local** sem passo extra para o utilizador base. |
| **optional_host_permissions** (`http://*/*`, `https://*/*`) | Concedidas **só quando você adiciona** cada site (popup ou opções) e aceita o pedido do Chrome. Sem isto, a extensão **não** injecta UI em domínios que não estejam aprovados. |

## Helper nos campos (content script)

- Só corre nas **origens que estão na sua lista** e quando o **helper não está desligado** nas opções.
- Mostra controlos locais (Auto / Escolher) e pode **ler atributos e etiquetas do campo** (nome, id, tipo, etc.) **só no browser** para **heurísticas** e para aplicar **regras que você definiu** (selector + tipo). Essa informação **não é transmitida** para servidores externos pela extensão.
- **Pode desligar totalmente** o inject do helper nas **Configurações** (“Helper nos campos”); nesse caso continuam a funcionar o popup e os atalhos que só copiam dados gerados.

## Cookies e armazenamento

A extensão **não utiliza cookies** para rastreio. Usa apenas **`chrome.storage.local`** conforme descrito acima. Os dados permanecem no perfil do Chrome até os apagar ou desinstalar a extensão.

## Terceiros e bibliotecas

As dependências empacotadas (ex.: geração/validação de documentos brasileiros, nomes) executam **localmente** no pacote da extensão. Não há SDKs de anúncios nem de analytics ligados afora pelo código da extensão.

## Links externos na interface

O popup pode conter **hiperligações** (redes sociais, GitHub, política de privacidade) que abrem no browser como qualquer outro site. Essa navegação fica sujeita à política desse site.

## Menores

A extensão não se dirige a menores; o uso previsto é de **desenvolvedores, QA e equipas técnicas**.

## Alterações

Esta política pode ser actualizada quando a funcionalidade mudar. A versão em vigor está no repositório público do projeto (ficheiro `PRIVACY.md`).

## Contacto

Questões sobre privacidade desta extensão: abra um tópico em **GitHub** em  
[github.com/douglas-mcosta/FakeDataEasy/issues](https://github.com/douglas-mcosta/FakeDataEasy/issues)  
ou use o contacto indicado na ficha da extensão na **Chrome Web Store**.
