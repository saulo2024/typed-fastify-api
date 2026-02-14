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
        id: z.string().uuid(),
      }),
      response: {
        204: z.null().describe('User deleted'),
        404: z.object({ message: z.string() }).describe('User not found'), // Adicionamos a doc do 404
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;

    // 1. Passo extra: Verificar se o usuário existe antes de tentar deletar
    const user = await prisma.user.findUnique({
      where: { id }
    });

    // 2. Se não existir, paramos aqui e avisamos o cliente
    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado.' });
    }

    // 3. Se chegou aqui, é seguro deletar
    await prisma.user.delete({
      where: { id }
    });

    return reply.status(204).send(null);
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
        404: z.object({ message: z.string() }).describe('User not found'), // Documentamos o erro 404
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, email } = request.body;

    // 1. Verificação de Segurança (Guard Clause)
    // Antes de tentar atualizar, perguntamos ao banco: "Esse ID existe?"
    const user = await prisma.user.findUnique({
      where: { id }
    });

    // 2. Se a resposta for nula (não existe), cortamos o fluxo aqui.
    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado para atualização.' });
    }

    // 3. Se passou pelo "porteiro" acima, é seguro fazer o update.
    await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    return reply.status(204).send(null);
  });

}
