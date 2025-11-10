import {fastify_app} from './app.ts';

const start = async () => {
    const app = fastify_app();

    try {
        await app.listen({port: 3000, host: '0.0.0.0'});
        app.log.info(`Server listening at http://localhost:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();