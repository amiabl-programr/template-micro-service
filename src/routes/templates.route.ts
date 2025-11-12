import type { FastifyInstance } from "fastify";
import * as TemplateController from "../controllers/template.controller.ts";

export default async function templateRoutes(app: FastifyInstance) {
  app.get("/templates", {
    schema: {
      description: 'Get all templates',
      tags: ['templates'],
      response: {
        200: {
          description: 'List of templates',
          type: 'object'
        }
      }
    }
  }, TemplateController.get_templates);
  app.get("/templates/:id", TemplateController.get_template_by_id);
  app.post("/templates", TemplateController.create_template);
  app.patch("/templates/:id", TemplateController.update_template);
}
