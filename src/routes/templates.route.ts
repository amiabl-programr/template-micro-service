import type { FastifyInstance } from "fastify";
import * as TemplateController from "../controllers/template.controller.ts";

export default async function templateRoutes(app: FastifyInstance) {
  app.get('/templates', TemplateController.get_templates);
  app.post('/templates', TemplateController.create_template);
}
