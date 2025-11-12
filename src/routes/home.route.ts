import type { FastifyInstance } from "fastify";
import { homeController } from "../controllers/home.contollers.ts";

export default async function homeRoute(app: FastifyInstance) {
  app.get("/", homeController);
}
