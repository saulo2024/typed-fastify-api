import 'dotenv/config';
import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { routes } from './routes.js';
import fastifyJwt from '@fastify/jwt'

const app =  fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifyJwt, {
  secret: 'sua-chave-secreta-aqui', // Em produção, isso vai para o .env
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'My API',
      description: 'API documentation',
      version: '1.0.0'
    }
  },

  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.register (routes)

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
    console.log('HTTP server running!')
})