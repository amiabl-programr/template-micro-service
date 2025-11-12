import type { FastifyInstance } from "fastify";
import templateRoutes from "./templates.route.ts";
import healthRoute from "./health.route.ts";
import home from "./home.route.ts";

export default async function routes(app: FastifyInstance) {
  app.register(home, { prefix: "/" });
  app.register(healthRoute, { prefix: "/health" });
  app.register(templateRoutes, { prefix: "/templates" });
}
