# Projeto Final Recomenda Filme UFRR 2025

Projeto Final feito para a materia de Arquitetura Web com o intuito de aprender sobre desenvolvimento Web. Foi-se usado React + Vite, Firebase, Node.js, javascript e axios.

O projeto faz uso da API do TMDB para fazer requisicoes das informacoes dos filmes e recomendar de acordo com os filmes favoritados.

## Instalacao

Primeiro , faca o git clone do arquivo:

```bash
git clone https://github.com/ThiagoVieiraCamara/ThiagoVieiraCamara_Projeto_recomenda-filme_UFRR_2025.git
```
Depois, entre no arquivo e utilize o npm para fazer a instalacao das dependencias:
```bash
  cd CineFlow
  npm install
```
Apos isso, crie um arquivo .env e adicione as chaves da seguinte forma:
```bash
VITE_TMDB_API_KEY=CHAVE_TMDB_AQUI
VITE_FIREBASE_API_KEY=CHAVE_FIREBASE_API
VITE_FIREBASE_AUTH_DOMAIN=CHAVE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=CHAVE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=CHAVE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=CHAVE_MESSAGING_SENDER
VITE_FIREBASE_APP_ID=CHAVE_FIREBASE_APP_ID
```
Obs.: o .env deve estar no root do arquivo, ou seja, dentro do arquivo do CineFlow e nao dentro do src ou outra pasta.

Para iniciar o projeto, rode o seguinte comando:

```bash
npm run dev
```
