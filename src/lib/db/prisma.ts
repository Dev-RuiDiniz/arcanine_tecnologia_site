import { PrismaClient } from "@prisma/client";

import { resolveDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
