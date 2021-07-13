# Fake Data Easy Chrome Extension
## Visão Geral
O intuito dessa extensão é facilitar o preenchimento de formulários por desenvolvedores. Já que, geralmente temos que preencher os mesmos formulários para teste por diversas vezes.
Essa extensão disponibiliza atalhos que geram os dados CPF, CNPJ, Nome e Guid na área de transferência, bastando apenas pressionar o atalho do dado que deseja gerar + CTRL + V no campo escolhido.
A ideia é que na próxima versão sejam adicionados mais atalhos com dados usuais como nome de usuário, e-mail, entre outros.

![fake-data-easy2](https://user-images.githubusercontent.com/12072278/125501518-8a9d09ee-f20a-4513-87f2-ea6428a7b78f.gif)

## Atalhos

A maneira mais rápida e prática de gerar um dado válido através da extensão é através dos atalhos. A partir da execução deles é gerado instantaneamente o dado na área de transferência do sistema operacional, permitindo ao usuário colar em qualquer campo dentro ou fora do navegador. 

Lista de atalhos disponiveis no momento:

- CTRL + SHIFT + 1 - Gera um CPF
- CTRL + SHIFT + 2 - Gera um CNPJ
- CTRL + SHIFT + 3 - Gera um Nome 
- CTRL + SHIFT + 4 - Gera um Guid

## Desenvolvedores
O projeto está escrito em Angular 12.

### Iniciar o projeto
- ng s

### Build do projeto
- ng b

Quando executado o build do projeto é criado a pasta "Dist" com o código transpilado em Javascript. Esse código pode ser utilizado para adicionar a extensão no seu Google Chrome para realizar os testes necessários antes do PR
![image](https://user-images.githubusercontent.com/12072278/125503405-a20deef5-38e9-4f37-96d5-371150593a54.png)

### Adicionar um atalho

- No arquivo manifest.json registre seu atalho 

![image](https://user-images.githubusercontent.com/12072278/125504032-320c2b4d-e1ab-4793-92fa-67ad610bc9b7.png)

- Em models > commandType-enum.ts registre seu atalho com o mesmo nome utilizado no manifest.js. Esse enum é utilzado para facilitar a leitura e utilização dos atalhos no código

![image](https://user-images.githubusercontent.com/12072278/125504266-6ec4ad53-6546-467e-b7ca-ff13ba741d66.png)

- Estamos utilizando um background service para capturar os atalhos quando precinados no teclado, adiciona a condição do seu atalho e qual função será executada 

![image](https://user-images.githubusercontent.com/12072278/125504497-9bb904b7-d103-4514-8734-e2c57b804461.png)

- Estamos organizando o projeto por modulo/feature conforme a imagem abaixo
![image](https://user-images.githubusercontent.com/12072278/125511368-cdfc0b18-520c-4bcb-b39f-31002508fe96.png)





