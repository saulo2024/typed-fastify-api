import z from 'zod'
import type { FastifyTypeInstance } from "./types.js";
import crypto from 'node:crypto'

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

export async function routes(app: FastifyTypeInstance) {
  app.get('/users', {
    schema: {
      tags: ['Users'],
      description: 'Get all users',
      response: {
        200: z.array(z.object({
          id: z.string().uuid(),
          name: z.string(),
        })),

        response: {
          201: z.null().describe('User created'),
        }
      },
    }
  }, () => {
    return
  })

  app.post('/users', {
    schema: {
      tags: ['Users'],
      description: 'Create a new user',
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    }
  }, async(request, reply) => {
    const { name, email } = request.body;

    users.push({
      id: crypto.randomUUID(),
      name,
      email
    });

    return reply.status(201).send({});
  })
}