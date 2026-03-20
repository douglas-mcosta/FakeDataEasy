# Política de privacidade — Fake Data Easy

**Última atualização:** março de 2026  

**Extensão:** Fake Data Easy (Manifest V3, Chrome / Chromium)

## Resumo

A extensão **Fake Data Easy** gera dados fictícios (CPF, CNPJ, nome, GUID) **localmente no seu dispositivo** para apoio a testes de formulários. **Não recolhe, armazena nem transmite** informações pessoais ou de utilização para servidores do autor ou de terceiros.

## Dados e rede

- **Não há contas, início de sessão nem análises** integradas na extensão.
- **Não são feitos pedidos HTTP** pela extensão para enviar os dados gerados ou o que escreve na área de transferência.
- Os únicos dados tratados são **strings geradas no próprio browser** e o texto **explicitamente copiado** para a área de transferência **quando você usa** os botões da extensão ou os **atalhos de teclado** configurados.

## Permissões (Chrome)

| Permissão        | Utilização |
|------------------|------------|
| **clipboardWrite** | Escrever na área de transferência **apenas** o valor que acabou de ser gerado, para poder colar noutra aplicação (por exemplo num campo de formulário ou no Bloco de notas). |
| **offscreen**      | Criar um documento invisível **só quando necessário** como método alternativo de acesso à API de clipboard em segundo plano (atalhos globais), quando o ambiente não permite escrever no clipboard diretamente a partir do service worker. |
| **tabs**           | Abrir **um separador** com a página de configurações da extensão quando o utilizador clica em **Configurações** ou **Gerir lista** no popup. **Não** é usada para ler o conteúdo dos separadores nem para injectar código em páginas Web por esta API. |

## Cookies e armazenamento local

A extensão **não utiliza cookies** para fins de rastreio. Usa **`chrome.storage.local`** só para definições de produto: a **lista de padrões de URL** onde o helper nos campos pode injectar, e a **preferência de tema** (claro / escuro / automático). Estes dados **não saem do dispositivo** por intermédio da extensão.

## Script nas páginas que configurar

Se activar sites na lista (por defeito só desenvolvimento local), a extensão pode injectar um **content script** nesses URLs **apenas** para mostrar botões junto de campos de formulário e preenchê-los com dados que **gere localmente**. Não envolve envio desses dados para servidores do autor; o funcionamento é análogo ao popup, sem telemetria.

## Terceiros

As **bibliotecas** incluídas no pacote da extensão (por exemplo geração e validação de documentos brasileiros, geração de nomes) executam **localmente**. Não há SDKs de publicidade nem de análise ligados a serviços externos pela extensão.

## Links externos na interface

O popup pode incluir **hiperligações** (por exemplo redes sociais do autor) que abrem no browser **como qualquer outro site**. Essa navegação está sujeita à política desse site, não à presente extensão.

## Menores

A extensão não se dirige especificamente a menores; o seu uso destina-se sobretudo a **desenvolvedores e testadores de software**.

## Alterações

Esta política pode ser atualizada quando a funcionalidade da extensão mudar. A versão em vigor estará disponível no mesmo local onde consultou este documento (por exemplo repositório público do projeto).

## Contacto

Para questões sobre privacidade relacionadas com esta extensão, utilize os contactos indicados na página da extensão na Chrome Web Store ou no repositório do projeto (por exemplo issues no GitHub do proprietário).

---

*Este texto é fornecido como modelo informativo; adapte o bloco “Contacto” com o seu e-mail ou URL oficiais antes de publicar.*
