import type { FastifyInstance } from "fastify";
import * as TemplateController from "../controllers/template.controller.ts";

export default async function templateRoutes(app: FastifyInstance) {
  app.get(
    "/templates",
    {
      schema: {
        description: "Get all templates with pagination and filtering",
        tags: ["templates"],
        querystring: {
          type: "object",
          properties: {
            page: { type: "string", description: "Page number (default: 1)" },
            limit: {
              type: "string",
              description: "Items per page, max 100 (default: 10)",
            },
            language: { type: "string", description: "Filter by language" },
            query: {
              type: "string",
              description: "Search in name and subject",
            },
          },
        },
        response: {
          200: {
            description: "Templates fetched successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    subject: { type: "string" },
                    body: { type: "string" },
                    language: { type: "string" },
                    version_number: { type: "number" },
                    createdAt: { type: "string" },
                  },
                },
              },
              meta: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  limit: { type: "number" },
                  page: { type: "number" },
                  total_pages: { type: "number" },
                  has_next: { type: "boolean" },
                  has_previous: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
    TemplateController.get_templates,
  );

  app.get(
    "/templates/:id",
    {
      schema: {
        description: "Get a template by ID",
        tags: ["templates"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "Template ID" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Template fetched successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  subject: { type: "string" },
                  body: { type: "string" },
                  language: { type: "string" },
                  version_number: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
          },
          404: {
            description: "Template not found",
          },
        },
      },
    },
    TemplateController.get_template_by_id,
  );

  app.post(
    "/templates",
    {
      schema: {
        description: "Create a new template",
        tags: ["templates"],
        body: {
          type: "object",
          properties: {
            name: { type: "string", description: "Template name" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body" },
            language: { type: "string", description: "Template language" },
            version_number: {
              type: "number",
              description: "Version number (must be positive integer)",
            },
          },
          required: ["name", "subject", "body", "language", "version_number"],
        },
        response: {
          201: {
            description: "Template created successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  subject: { type: "string" },
                  body: { type: "string" },
                  language: { type: "string" },
                  version_number: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
          },
          409: {
            description: "Template with this name and language already exists",
          },
        },
      },
    },
    TemplateController.create_template,
  );

  app.patch(
    "/templates/:id",
    {
      schema: {
        description: "Update a template",
        tags: ["templates"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "Template ID" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string", description: "Template name" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body" },
            language: { type: "string", description: "Template language" },
            version_number: {
              type: "number",
              description: "Version number (must be positive integer)",
            },
          },
        },
        response: {
          200: {
            description: "Template updated successfully",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  subject: { type: "string" },
                  body: { type: "string" },
                  language: { type: "string" },
                  version_number: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
          },
          404: {
            description: "Template not found",
          },
          409: {
            description: "Template with this name and language already exists",
          },
        },
      },
    },
    TemplateController.update_template,
  );
}
