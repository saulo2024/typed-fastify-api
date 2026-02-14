# 🚀 Typed Fastify API

> API RESTful de alta performance desenvolvida para gerenciamento de usuários, com foco em escalabilidade, tipagem estática rigorosa e Developer Experience (DX).

![Node Version](https://img.shields.io/badge/node-20.x-green) ![TypeScript](https://img.shields.io/badge/typescript-5.x-blue) ![Fastify](https://img.shields.io/badge/fastify-5.x-black) ![Prisma](https://img.shields.io/badge/prisma-7-indigo)

## 📸 Demonstração (Swagger UI)
*[Aqui você colocará um Print ou GIF da sua tela /docs rodando]*
*A documentação interativa (Swagger/OpenAPI) permite testar todas as rotas em tempo real sem calibração externa.*

## 🛠️ Tech Stack & Decisões Técnicas

Este projeto adota as tecnologias mais modernas do ecossistema Node.js (2026 ready):

* **Runtime:** Node.js (com TypeScript para segurança de tipos em tempo de compilação)
* **Framework:** [Fastify](https://fastify.dev/) - Escolhido pela performance superior ao Express e suporte nativo a Async/Await.
* **ORM:** [Prisma 7](https://www.prisma.io/) + **Driver Adapter** (`pg`) - Configuração moderna para ambientes Serverless e Connection Pooling otimizado.
* **Validação:** [Zod](https://zod.dev/) - Utilizado para validação de esquemas e inferência de tipos (Zero Duplication).
* **Banco de Dados:** PostgreSQL (NeonDB Serverless).
* **Docs:** Integração nativa Swagger/OpenAPI.

## ✨ Funcionalidades

- [x] **CRUD Completo:** Criação, Leitura, Atualização e Remoção de usuários.
- [x] **Fail Fast Strategy:** Tratamento de erros defensivo (ex: verificação de existência antes de update/delete).
- [x] **HTTP Semântico:** Uso correto de status codes (201, 204, 404, 500).
- [x] **Type Safety:** Fluxo de dados tipado da rota ao banco de dados.

## 🚀 Como Rodar Localmente

### Pré-requisitos
* Node.js 20+
* NPM

Desenvolvido por [Saulo Esteves](https://www.linkedin.com/in/saulo-esteves-8651b1168/) 🚀

### Instalação

```bash
# 1. Clone o repositório
git clone [https://github.com/saulo2024/typed-fastify-api.git](https://github.com/saulo2024/typed-fastify-api.git)

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz e adicione sua DATABASE_URL
cp .env.example .env

# 4. Gere a tipagem do Prisma
npx prisma generate

# 5. Sincronize o banco de dados
npx prisma db push

# 6. Inicie o servidor
npm run dev```

