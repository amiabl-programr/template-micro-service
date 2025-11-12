import type { FastifyReply, FastifyRequest } from "fastify";


export async function homeController(req: FastifyRequest, reply: FastifyReply) {
   return reply.send({  success: true, message: "Welcome to the Template Service Microservice!" });
}