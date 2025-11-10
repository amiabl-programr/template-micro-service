import Fastify from 'fastify';
import type {FastifyInstance} from 'fastify';
// import logger from "./config/logger.ts";
import prisma from './plugins/prisma.ts';

export const fastify_app = (): FastifyInstance => {
    const app = Fastify({logger: true})

    // register plugins
    app.register(prisma);

    // register routes

    return app;

}