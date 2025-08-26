# 📤 Upload Files

Projeto de Upload de Arquivos com Node.js

Este é um projeto simples e completo para demonstrar como criar um sistema de upload de arquivos **sem a necessidade de instalar bibliotecas** externas como Express ou Multer. Ele utiliza apenas os módulos nativos do _Node.js_ (http e fs) no backend e HTML, CSS e JavaScript puros no frontend.

## Sumário

-   [Funcionalidades](#funcionalidades)
-   [Estrutura do projeto](#estrutura-do-projeto)
-   [Como Executar](#como-executar)
-   [Informações Adicionais](#informações-adicionais)
    -   [Criar arquivo de Execução `.bat` ou `.sh`](#criar-arquivo-de-execução-bat-ou-sh)
        -   [Conteúdo do arquivo `.bat`](#conteúdo-do-arquivo-bat)
    -   [Arquivo `plus`](#arquivo-plusjs)

## Funcionalidades

-   Upload de Arquivos: Permite que o usuário selecione e envie um único arquivo.

-   Salvamento Local: O arquivo enviado é salvo diretamente em uma pasta no servidor.

-   Sem Dependências: Todo o projeto é construído com ferramentas nativas do Node.js e do navegador, o que o torna leve e fácil de entender.

## Estrutura do Projeto

```
/upload-files
├── server.js
├── index.html
├── script.js
├── style.css
└── uploads/
```

-   `server.js`: O código do servidor Node.js que serve a página e processa o upload.

-   `index.html`: A estrutura da página web com a área de arrastar e soltar.

-   `script.js`: A lógica JavaScript do frontend para lidar com o drag-and-drop e o envio do arquivo.

-   `style.css`: A estilização da página.

-   `uploads/`: A pasta onde os arquivos enviados serão salvos pelo servidor. (ela será criada na execução do servidor caso não exista).

## Como Executar

1. Certifique-se de ter o [Node.js](https://nodejs.org) instalado em sua máquina.

2. Clone o repositório.

3. Abra o terminal na pasta do projeto e execute o comando:

    ```
      node server.js
    ```

4. Abra seu navegador e acesse a URL 👉 http://127.0.0.1:3000/

## Informações Adicionais

### Criar arquivo de Execução `.bat` ou `.sh`

Este arquivo ajuda usuários mais leigos, como por exemplo na igreja que frequento várias pessoas também usam o computador para trasmitir no projetor e logo deixei orientado para quando for passar um arquivo para o computador basta dar dois `clikes` no atalho que deixei na area de tabalho, ele abre o terminal com o IP para acessar através do navegador;

#### Conteúdo do arquivo `.bat`

```cmd
@echo off
REM Inicia o servidor Node.js
start cmd /k "node server.js"
```

### Arquivo `plus.js`

O arquivo `plus.js` é uma demonstração de que pode rodar toda aplicação em um único arquivo _.js_, porém para que o projeto seja mais legível e fácil de manter separei os arquivos conforme mostrado na [Estrutura do Projeto](#estrutura-do-projeto).
