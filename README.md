# API REST Node.js

Uma aplicação de API REST para gerenciamento de transações financeiras, construída com Node.js, TypeScript e Fastify.

## 📋 Sobre o Projeto

Este projeto é uma API REST que permite aos usuários gerenciar transações financeiras (créditos e débitos), visualizar resumos de conta e manter um histórico de todas as suas transações. O sistema identifica o usuário entre as requisições e garante que cada usuário só pode acessar suas próprias transações.

## 🚀 Tecnologias Utilizadas

- **Runtime**: Node.js
- **Linguagem**: TypeScript 5.9
- **Framework Web**: Fastify 5.7
- **Banco de Dados**: SQLite 3
- **Query Builder**: Knex 3.1
- **Validação**: Zod 4.3
- **Variáveis de Ambiente**: dotenv 17.2
- **Executor TypeScript**: tsx 4.21

## 📦 Requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ▶️ Como Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Executar migrações
npm run knex migrate:latest
```

## 📋 Requisitos Funcionais

- [X] O usuário deve poder criar uma transação;
- [X] O usuário deve poder obter um resumo da conta;
- [X] O usuário deve poder listar todas as transações que já ocorreram;
- [X] O usuário deve poder visualizar uma transação única;

## 📐 Regras de Negócio

- [X] A transação deve ser do tipo crédito que somará ao valor total, ou débito que subtrairá;
- [ ] Deve ser possível identificarmos o usuário entre as requisições;
- [ ] O usuário só pode visualizar transações que ele criou;

## 🎯 Requisitos Não Funcionais

- Loading...
