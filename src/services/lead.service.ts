import { prisma } from "@/lib/db/prisma";
import type { ContactLeadInput } from "@/schemas/forms/contact";

export const createLead = async (input: ContactLeadInput) => {
  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      projectType: input.projectType,
      message: input.message,
      source: "CONTACT_FORM",
    },
  });
};

export const listLeads = async () => {
  return prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
