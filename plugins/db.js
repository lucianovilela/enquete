'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


module.exports = fp(async function (fastify, opts) {
  // Adiciona o Prisma Client ao Fastify
  fastify.log.info('prisma plugin %s', 'create prisma');
  fastify.decorate('prisma', prisma);

  // Fecha a conexão com o banco de dados quando o servidor for encerrado
  fastify.addHook('onClose', async (fastifyInstance, done) => {
    fastifyInstance.log.info('prisma plugin %s', 'onClose');
    await fastifyInstance.prisma.$disconnect();
    done();
  });


})
