import type { FastifyInstance } from 'fastify';

export default async function healthRoute(fastify: FastifyInstance) {
  fastify.get('/', async () => ({
    success: true,
    message: 'Template Service healthy'
  }));
}
