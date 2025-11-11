// src/controllers/template.controller.ts (UPDATED)
import type { FastifyRequest, FastifyReply } from 'fastify';
import { create_template_version } from './template-version.controller.ts';

interface CreateTemplateBody {
  name: string;
  subject: string;
  body: string;
  language: string;
  version_number: number;
}

interface UpdateTemplateBody {
  name?: string;
  subject?: string;
  body?: string;
  language?: string;
  version_number?: number;
}

export const get_templates = async (
  request: FastifyRequest<{ Querystring: { page?: string; limit?: string; language?: string; query?: string } }>,
  reply: FastifyReply
) => {
  try {
    const page = Math.max(1, parseInt(request.query.page || '1') || 1);
    const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '10') || 10));
    const language = request.query.language;
    const searchQuery = request.query.query;

    const offset = (page - 1) * limit;
    const where: any = {};

    if (language) {
      where.language = language;
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { subject: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const total = await request.server.prisma.template.count({ where });

    const templates = await request.server.prisma.template.findMany({
      where,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        subject: true,
        body: true,
        language: true,
        version_number: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total_pages = Math.ceil(total / limit);

    reply.code(200).send({
      success: true,
      data: templates,
      message: 'Templates fetched successfully',
      meta: {
        total,
        limit,
        page,
        total_pages,
        has_next: page < total_pages,
        has_previous: page > 1,
      },
    });
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({
      success: false,
      message: 'Failed to fetch templates',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const get_template_by_id = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    if (!id || id.trim() === '') {
      return reply.code(400).send({
        success: false,
        message: 'Template ID is required',
      });
    }

    const template = await request.server.prisma.template.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        subject: true,
        body: true,
        language: true,
        version_number: true,
        createdAt: true,
      },
    });

    if (!template) {
      return reply.code(404).send({
        success: false,
        message: 'Template not found',
      });
    }

    reply.code(200).send({
      success: true,
      data: template,
      message: 'Template fetched successfully',
    });
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({
      success: false,
      message: 'Failed to fetch template',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const create_template = async (
  request: FastifyRequest<{ Body: CreateTemplateBody }>,
  reply: FastifyReply
) => {
  try {
    const { name, subject, body, language, version_number } = request.body;

    if (!name || !subject || !body || !language || version_number === undefined) {
      return reply.code(400).send({
        success: false,
        message: 'Missing required fields: name, subject, body, language, version_number',
      });
    }

    if (!Number.isInteger(version_number) || version_number < 1) {
      return reply.code(400).send({
        success: false,
        message: 'version_number must be a positive integer',
      });
    }

    const existingTemplate = await request.server.prisma.template.findFirst({
      where: { name, language },
    });

    if (existingTemplate) {
      return reply.code(409).send({
        success: false,
        message: 'Template with this name and language already exists',
      });
    }

    // Create template and version in a transaction
    const template = await request.server.prisma.$transaction(async (tx) => {
      const newTemplate = await tx.template.create({
        data: { name, subject, body, language, version_number },
        select: {
          id: true,
          name: true,
          subject: true,
          body: true,
          language: true,
          version_number: true,
          createdAt: true,
        },
      });

      // Create version entry (passing tx for transaction context)
      await create_template_version(tx, newTemplate.id, subject, body, version_number);

      return newTemplate;
    });

    reply.code(201).send({
      success: true,
      data: template,
      message: 'Template created successfully',
    });
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({
      success: false,
      message: 'Failed to create template',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const update_template = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateTemplateBody }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    if (!id || id.trim() === '') {
      return reply.code(400).send({
        success: false,
        message: 'Template ID is required',
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return reply.code(400).send({
        success: false,
        message: 'At least one field must be provided for update',
      });
    }

    if (updates.version_number !== undefined) {
      if (!Number.isInteger(updates.version_number) || updates.version_number < 1) {
        return reply.code(400).send({
          success: false,
          message: 'version_number must be a positive integer',
        });
      }
    }

    const existingTemplate = await request.server.prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return reply.code(404).send({
        success: false,
        message: 'Template not found',
      });
    }

    if ((updates.name || updates.language) &&
        (updates.name !== existingTemplate.name || updates.language !== existingTemplate.language)) {
      const duplicate = await request.server.prisma.template.findFirst({
        where: {
          name: updates.name || existingTemplate.name,
          language: updates.language || existingTemplate.language,
          id: { not: id },
        },
      });

      if (duplicate) {
        return reply.code(409).send({
          success: false,
          message: 'Template with this name and language already exists',
        });
      }
    }

    // Update template and create version in a transaction
    const updatedTemplate = await request.server.prisma.$transaction(async (tx) => {
      const template = await tx.template.update({
        where: { id },
        data: updates,
        select: {
          id: true,
          name: true,
          subject: true,
          body: true,
          language: true,
          version_number: true,
          createdAt: true,
        },
      });

      // Create version entry if subject, body, or version_number changed
      if (updates.subject || updates.body || updates.version_number) {
        await create_template_version(
          tx,
          id,
          updates.subject || existingTemplate.subject,
          updates.body || existingTemplate.body,
          updates.version_number || existingTemplate.version_number
        );
      }

      return template;
    });

    reply.code(200).send({
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully',
    });
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({
      success: false,
      message: 'Failed to update template',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};