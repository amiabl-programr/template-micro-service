import type { FastifyInstance } from 'fastify';
import { healthCheck } from '../controllers/health.controller.ts';

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/health', healthCheck);
}
