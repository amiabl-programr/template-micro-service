import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import prisma from "./plugins/prisma.ts";
import healthRoute from "./routes/health.route.ts";
import templatesRoute from "./routes/templates.route.ts";
import dotenv from "dotenv";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { loggerOptions } from './config/logger.ts';
dotenv.config();

export const fastify_app = (): FastifyInstance => {
  const app = Fastify({ logger: loggerOptions });

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
        {
          url: "https://template-micro-service-production.up.railway.app",
          description: "Live server",
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
