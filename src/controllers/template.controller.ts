// src/controllers/template.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';

interface GetTemplatesQuery {
  page?: string;
  limit?: string;
  language?: string;
  query?: string;
}


interface CreateTemplateBody {
  name: string;
  subject: string;
  body: string;
  language: string;
  version_number: number;
}

export const get_templates = async (
  request: FastifyRequest<{ Querystring: GetTemplatesQuery }>,
  reply: FastifyReply
) => {
  try {
    // Extract query parameters with defaults
    const page = Math.max(1, parseInt(request.query.page || '1') || 1);
    const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '10') || 10));
    const language = request.query.language;
    const searchQuery = request.query.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {};

    // Filter by language if provided
    if (language) {
      where.language = language;
    }

    // Search by name or subject if query provided
    if (searchQuery) {
      where.OR = [
        {
          name: {
            contains: searchQuery,
            mode: 'insensitive', // Case-insensitive search
          },
        },
        {
          subject: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Fetch total count for pagination metadata
    const total = await request.server.prisma.template.count({ where });

    // Fetch templates with pagination and sorting
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
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });

    // Calculate pagination metadata
    const total_pages = Math.ceil(total / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    // Send response
    reply.code(200).send({
      success: true,
      data: templates,
      message: 'Templates fetched successfully',
      meta: {
        total,
        limit,
        page,
        total_pages,
        has_next,
        has_previous,
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


export const create_template = async (
  request: FastifyRequest<{ Body: CreateTemplateBody }>,
  reply: FastifyReply
) => {
  try {
    const { name, subject, body, language, version_number } = request.body;

    // Validate required fields
    if (!name || !subject || !body || !language || version_number === undefined) {
      return reply.code(400).send({
        success: false,
        message: 'Missing required fields: name, subject, body, language, version_number',
      });
    }

    // Validate version_number is a positive integer
    if (!Number.isInteger(version_number) || version_number < 1) {
      return reply.code(400).send({
        success: false,
        message: 'version_number must be a positive integer',
      });
    }

    // Check if template with same name and language already exists
    const existingTemplate = await request.server.prisma.template.findFirst({
      where: {
        name,
        language,
      },
    });

    if (existingTemplate) {
      return reply.code(409).send({
        success: false,
        message: 'Template with this name and language already exists',
      });
    }

    // Create template
    const template = await request.server.prisma.template.create({
      data: {
        name,
        subject,
        body,
        language,
        version_number,
      },
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

    // Send response
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