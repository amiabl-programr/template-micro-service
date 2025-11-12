import type { FastifyReply, FastifyRequest } from "fastify";

export async function healthCheck(req: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    success: true,
    message: "Template Service is healthy",
    timestamp: new Date().toISOString(),
  });
}
