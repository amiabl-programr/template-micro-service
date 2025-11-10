import type { FastifyInstance } from "fastify";
import * as TemplateController from "../controllers/template.controller.ts";

export default async function templateRoutes(app: FastifyInstance) {
  app.post('/:template_id/render', TemplateController.render_template);
  app.get('/:template_id', TemplateController.get_template);
  app.post('/', TemplateController.create_template);
}