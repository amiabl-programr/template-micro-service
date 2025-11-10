import Fastify from 'fastify';
import type {FastifyInstance} from 'fastify';
// import logger from "./config/logger.ts";
import prisma from './plugins/prisma.ts';
import healthRoute from './routes/health.route.ts';
import templatesRoute from './routes/templates.route.ts';
import dotenv from 'dotenv';
dotenv.config();

export const fastify_app = (): FastifyInstance => {
    const app = Fastify({logger: true})

    // register plugins
    app.register(prisma);
    app.register(healthRoute);
    app.register(templatesRoute);

    // register routes

    return app;

}