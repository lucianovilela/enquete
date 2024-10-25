'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
const options = {}

const fastifyJWT = require('fastify-jwt');

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })


  // Configurar o plugin fastify-jwt
  fastify.register(fastifyJWT, {
    secret: 'supersecretkey', // Use uma chave secreta segura e armazene-a em uma variável de ambiente

  });

  // Middleware para verificar o token JWT
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
      
    } catch (err) {
      reply.send(err);
    }
  });

}

module.exports.options = options
