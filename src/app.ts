import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
// import logger from "./config/logger.ts";
import prisma from "./plugins/prisma.ts";
import healthRoute from "./routes/health.route.ts";
import templatesRoute from "./routes/templates.route.ts";
import dotenv from "dotenv";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
dotenv.config();

export const fastify_app = (): FastifyInstance => {
  const app = Fastify({ logger: true });

  // register swagger
  app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "My API",
        description: "API documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [{ name: "templates", description: "Email templates endpoint" }],
    },
  });

  app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  // register plugins
  app.register(prisma);
  app.register(healthRoute);
  app.register(templatesRoute);

  return app;
};
