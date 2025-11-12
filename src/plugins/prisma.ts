import fp from "fastify-plugin";
import { PrismaClient } from "../generated/prisma/client.ts";

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
  } catch (e) {
    console.error("Prisma connection error:", e);
    throw e;
  }

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
