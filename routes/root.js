'use strict'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { verificarSenha } = require('../util');

const prisma = new PrismaClient();


module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  // Rota para gerar um token JWT (ex.: login)
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    
    // Autenticação do usuário (verifique se o email e a senha estão corretos)
    // Este é apenas um exemplo, substitua pela lógica de autenticação apropriada
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (await verificarSenha(password, user.password)) {
      // Gerar o token JWT
      const token = fastify.jwt.sign({ email, profile: 'ADMIN' });
      return reply.send({ token });
    }

    reply.status(401).send({ message: 'Credenciais inválidas' });
  });

  // Exemplo de rota protegida
  fastify.get('/protected/*', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    reply.send({ message: 'Você está autenticado!', user: (request.user || "sem usuario") });
  });
}
