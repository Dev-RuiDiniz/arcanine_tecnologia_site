import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type { CreatePageInput } from "@/schemas/admin/page";

export const createPage = async (input: CreatePageInput) => {
  return prisma.page.create({
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content as Prisma.InputJsonValue | undefined,
      published: input.published ?? false,
    },
  });
};

export const listPages = async () => {
  return prisma.page.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
};
