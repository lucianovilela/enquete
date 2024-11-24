const fastify = require('fastify')({ logger: true });
const App = require('./app');

// Função para iniciar o servidor
const start = async () => {
  try {
    const PORT=  process.env.PORT_API_SERVER || 3000;
    await App(fastify, {});
    await fastify.listen({ port:  PORT, host:'0.0.0.0'});
    console.log(`fastify rodando no ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

