const { PrismaClient } = require('@prisma/client');



const { gerarHashSenha } = require('../util');

module.exports = async function (fastify, opts) {
    const prisma = fastify.prisma;
    // Rota para criar um usuário
    fastify.post('/users', async (request, reply) => {
        const { email, password } = request.body;
        const hash = await gerarHashSenha(password);
        fastify.log.info(hash)
        try {
            const user = await prisma.user.create({
                data: { email, password:hash },
            });
            reply.send({...user, password:'secret'});
        } catch (error) {
            reply.status(400).send(error);
        }
    });

    // Rota para listar todos os usuários
    fastify.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany();
        reply.send(users);
    });

    // Rota para criar uma enquete
    fastify.post('/surveys', async (request, reply) => {
        const { title, creatorId } = request.body;
        try {
            const survey = await prisma.survey.create({
                data: {
                    title,
                    creatorId,
                },
            });
            reply.send(survey);
        } catch (error) {
            reply.status(400).send(error);
        }
    });

    // Rota para listar todas as enquetes
    fastify.get('/surveys', async (request, reply) => {
        const surveys = await prisma.survey.findMany({
            include: {
                questions: true,
            },
        });
        reply.send(surveys);
    });

    // Rota para criar uma questão para uma enquete
    fastify.post('/questions', async (request, reply) => {
        const { text, surveyId } = request.body;
        try {
            const question = await prisma.question.create({
                data: {
                    text,
                    surveyId,
                },
            });
            reply.send(question);
        } catch (error) {
            reply.status(400).send(error);
        }
    });

    // Rota para listar todas as questões de uma enquete específica
    fastify.get('/surveys/:surveyId/questions', async (request, reply) => {
        const { surveyId } = request.params;
        const questions = await prisma.question.findMany({
            where: {
                surveyId: Number(surveyId),
            },
        });
        reply.send(questions);
    });

    // Rota para criar uma resposta para uma questão
    fastify.post('/answers', async (request, reply) => {
        const { content, questionId } = request.body;
        try {
            const answer = await prisma.answer.create({
                data: {
                    content,
                    questionId,
                },
            });
            reply.send(answer);
        } catch (error) {
            reply.status(400).send(error);
        }
    });

    // Rota para listar todas as respostas de uma questão específica
    fastify.get('/questions/:questionId/answers', async (request, reply) => {
        const { questionId } = request.params;
        const answers = await prisma.answer.findMany({
            where: {
                questionId: Number(questionId),
            },
        });
        reply.send(answers);
    });

    // Rota para deletar uma enquete
    fastify.delete('/surveys/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.survey.delete({
                where: { id: Number(id) },
            });
            reply.send({ message: 'Survey deleted successfully' });
        } catch (error) {
            reply.status(400).send(error);
        }
    });

}