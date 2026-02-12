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

  
// Rota de DELETAR (DELETE)
  app.delete('/users/:id', {
    schema: {
      description: 'Deletar um usuário pelo ID',
      tags: ['users'],
      params: z.object({
        id: z.string().uuid(), // Valida se é um UUID válido
      }),
      response: {
        204: z.null().describe('User deleted'), // 204 = No Content (Sucesso sem conteúdo)
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;

    await prisma.user.delete({
      where: { id }
    });

    return reply.status(204).send();
  });

  // Rota de ATUALIZAR (PUT)
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
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, email } = request.body;

    await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    return reply.status(204).send({});
  });

}
