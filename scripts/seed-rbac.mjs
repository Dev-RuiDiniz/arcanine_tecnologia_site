import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleNames = ["ADMIN", "EDITOR", "VIEWER"];

const users = [
  { role: "ADMIN", email: process.env.AUTH_ADMIN_EMAIL, name: "Arcanine Admin" },
  { role: "EDITOR", email: process.env.AUTH_EDITOR_EMAIL, name: "Arcanine Editor" },
  { role: "VIEWER", email: process.env.AUTH_VIEWER_EMAIL, name: "Arcanine Viewer" },
].filter((user) => Boolean(user.email));

try {
  for (const roleName of roleNames) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  for (const user of users) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: { email: user.email, name: user.name },
    });

    const dbRole = await prisma.role.findUnique({
      where: { name: user.role },
    });

    if (!dbRole) {
      throw new Error(`Role not found: ${user.role}`);
    }

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: dbUser.id,
          roleId: dbRole.id,
        },
      },
      update: {},
      create: {
        userId: dbUser.id,
        roleId: dbRole.id,
      },
    });
  }

  console.log("RBAC seed completed.");
} catch (error) {
  console.error("RBAC seed failed.", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
