import { fastify_app } from '../app.ts';
import type { FastifyError, FastifyInstance } from 'fastify';
import Handlebars from 'handlebars';
import type { TemplateModel } from '../generated/prisma/models/Template.ts';

let app: FastifyInstance;

async function initializeApp() {
  try {
    app = await fastify_app();
  } catch (err) {
    console.error('Failed to initialize Fastify app:', err);
    process.exit(1);
  }
}
interface TemplateVariables {
  [key: string]: string | number | boolean;
}

export async function list() {
  initializeApp();
  return app.prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function get(id: string) {
  const template = await app.prisma.template.findUnique({ where: { id } });
  if (!template) {
    throw new Error('Template not found');
  }
  return template;
}

export async function create(data: Partial<TemplateModel>) {
  return app.prisma.template.create({
    data: {
      name: data.name!,
      subject: data.subject!,
      body: data.body!,
      language: data.language ?? 'en',          // default here
      version_number: data.version_number ?? 1, // default here
    },
  });
}


export async function render(id: string, variables: TemplateVariables) {
  const template = await get(id);
  try {
    const subject = Handlebars.compile(template.subject)(variables);
    const body = Handlebars.compile(template.body)(variables);
    return {
      subject,
      body,
      language: template.language,
      version: template.version_number,
    };
  } catch (error) {
    throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const templateService = { list, get, create, render };