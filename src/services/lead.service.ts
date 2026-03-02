import { prisma } from "@/lib/db/prisma";
import type { BudgetAttachmentInput, BudgetLeadInput, ContactLeadInput } from "@/schemas";

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

const buildBudgetLeadMessage = (input: BudgetLeadInput, attachment?: BudgetAttachmentInput) => {
  const lines = [
    `[ORCAMENTO] Empresa: ${input.companyName}`,
    `[ORCAMENTO] Faixa de investimento: ${input.budgetRange}`,
    `[ORCAMENTO] Prazo estimado: ${input.timeline}`,
    `[ORCAMENTO] Escopo inicial: ${input.projectBrief}`,
  ];

  if (attachment) {
    lines.push(
      `[ANEXO] ${attachment.filename} (${attachment.contentType}, ${attachment.sizeBytes} bytes)`,
    );
  }

  return lines.join("\n");
};

export const createBudgetLead = async (
  input: BudgetLeadInput,
  attachment?: BudgetAttachmentInput,
) => {
  return prisma.lead.create({
    data: {
      name: input.contactName,
      email: input.email,
      phone: input.phone,
      projectType: input.service,
      message: buildBudgetLeadMessage(input, attachment),
      source: "BUDGET_FORM",
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
