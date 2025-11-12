import type { FastifyInstance } from "fastify";
import templateRoutes from "./templates.route.ts";
import healthRoute from "./health.route.ts";

export default async function routes(app: FastifyInstance) {
  app.register(healthRoute, { prefix: "/health" });
  app.register(templateRoutes, { prefix: "/templates" });
}
