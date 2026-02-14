# Usa a imagem oficial do Node.js 20
FROM node:20-slim

# Instala dependências do sistema necessárias para o Prisma e OpenSSL
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências e gera o Prisma Client
RUN npm install
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Expõe a porta que o servidor vai usar
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npx", "tsx", "src/server.ts"]