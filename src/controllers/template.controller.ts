import type { FastifyReply, FastifyRequest } from "fastify";
import * as TemplateService from "../services/template.service.ts";
import { successResponse } from "../utils/response.ts";

export async function render_template(req: FastifyRequest<{ Params: { template_id: string }; Body: { variables: Record<string, any> } }>,
  reply: FastifyReply) {
    const { template_id } = req.params;
    const { variables } = req.body;

    // check how to get language preference from headers
    const language = req.headers['accept-language'] || 'en';

     const result = await TemplateService.render(template_id, variables);
  return successResponse(result, 'Template rendered successfully');

  }

  export async function get_template(req: FastifyRequest, reply: FastifyReply) {
  const { template_id } = req.params as { template_id: string };
  const data = await TemplateService.get(template_id);
  return successResponse(data, 'Template fetched');
}


// ✅ Define the expected body structure for template creation
interface CreateTemplateBody {
  name: string;
  subject: string;
  body: string;
  language?: string;
  version_number?: number;
}


export async function create_template(
  req: FastifyRequest<{ Body: CreateTemplateBody }>,
  reply: FastifyReply
) {
  const { name, subject, body, language, version_number } = req.body;

  const data = await TemplateService.create({
    name,
    subject,
    body,
    language: language ?? 'en',          
    version_number: version_number ?? 1, 
  });

  return reply.code(201).send(successResponse(data, 'Template created'));
}

