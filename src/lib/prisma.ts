import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Configura a conexão usando o driver nativo 'pg'
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ 
  connectionString 
})

// Cria o adaptador que conecta o Prisma ao Pool do Postgres
const adapter = new PrismaPg(pool)

// Inicializa o Prisma Client usando o adaptador
export const prisma = new PrismaClient({ 
  adapter 
})