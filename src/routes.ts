import { z } from "zod";
import type { FastifyTypeInstance } from "./types.js";
import { prisma } from "./lib/prisma.js";

export async function routes(app: FastifyTypeInstance) {
  // Rota de LISTAGEM
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

  // Rota de CRIAÇÃO
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
    
    await prisma.user.create({
      data: { name, email }
    });

    return reply.status(201).send({});
  });
}