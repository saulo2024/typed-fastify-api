import { z } from "zod";
import type { FastifyTypeInstance } from "./types.js";
import { prisma } from "./lib/prisma.js";

export async function routes(app: FastifyTypeInstance) {
  // --- Rota de LISTAGEM ---
  app.get('/users', {
    schema: {
      description: 'Listar usuários',
      tags: ['users'],
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        })),
      },
    }
  }, async () => {
    const users = await prisma.user.findMany();
    return users;
  });

  // --- Rota de CRIAÇÃO ---
  app.post('/users', {
    schema: {
      description: 'Criar usuário',
      tags: ['users'],
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
      response: {
        201: z.object({}).describe('User created'),
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body;
    await prisma.user.create({ data: { name, email } });
    return reply.status(201).send({});
  });

  // --- Rota de DELETAR (Corrigida sem o erro do token) ---
  app.delete('/users/:id', {
    schema: {
      description: 'Deletar um usuário pelo ID',
      tags: ['users'],
      params: z.object({
        id: z.string().uuid(),
      }),
      response: {
        204: z.null().describe('User deleted'),
        404: z.object({ message: z.string() }).describe('User not found'),
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });
    return reply.status(204).send(null);
  });

  // --- Rota de ATUALIZAR ---
  app.put('/users/:id', {
    schema: {
      description: 'Atualizar dados de um usuário',
      tags: ['users'],
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      }),
      response: {
        204: z.null().describe('User updated'),
        404: z.object({ message: z.string() }).describe('User not found'),
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, email } = request.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado.' });
    }

    await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    return reply.status(204).send(null);
  });

  // --- ROTA DE LOGIN (ADICIONADA AQUI) ---
  app.post('/login', {
    schema: {
      description: 'Fazer login e receber token',
      tags: ['auth'],
      body: z.object({
        email: z.string().email(),
        // Se você não tem senha no banco ainda, remova essa linha:
        password: z.string(), 
      }),
      response: {
        200: z.object({
          token: z.string(),
        }),
        401: z.object({ message: z.string() }),
      },
    },
  }, async (request, reply) => {
    const { email } = request.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    // Gerando o token
    const token = app.jwt.sign(
      { name: user.name }, 
      { sub: user.id, expiresIn: '7d' }
    );

    return { token };
  });
} // FIM DA FUNÇÃO ROUTES