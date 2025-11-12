import { Prisma, PrismaClient } from "../generated/prisma/client.ts";
type PrismaTransactionClient = Prisma.TransactionClient;

/**
 * Create a version entry when template is created or updated
 * Called from template controller with the prisma instance from request
 */
export const create_template_version = async (
  prisma: PrismaClient | PrismaTransactionClient,
  templateId: string,
  subject: string,
  body: string,
  versionNumber: number,
) => {
  try {
    const version = await prisma.templateVersion.create({
      data: {
        templateId,
        subject,
        body,
        version_number: versionNumber,
      },
      select: {
        id: true,
        version_number: true,
        subject: true,
        body: true,
        createdAt: true,
      },
    });
    return version;
  } catch (error) {
    console.error("Error creating template version:", error);

    throw error;
  }
};
