import { prisma } from "@/lib/db/prisma";
import { sanitizeOptionalPlainText, sanitizePlainText } from "@/lib/security/input-sanitization";
import type { BudgetAttachmentInput, BudgetLeadInput, ContactLeadInput } from "@/schemas";

export const createLead = async (input: ContactLeadInput) => {
  return prisma.lead.create({
    data: {
      name: sanitizePlainText(input.name),
      email: sanitizePlainText(input.email).toLowerCase(),
      phone: sanitizeOptionalPlainText(input.phone),
      projectType: sanitizeOptionalPlainText(input.projectType),
      message: sanitizePlainText(input.message),
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
  const sanitizedInput: BudgetLeadInput = {
    contactName: sanitizePlainText(input.contactName),
    companyName: sanitizePlainText(input.companyName),
    email: sanitizePlainText(input.email).toLowerCase(),
    phone: sanitizePlainText(input.phone),
    service: sanitizePlainText(input.service),
    budgetRange: sanitizePlainText(input.budgetRange),
    timeline: sanitizePlainText(input.timeline),
    projectBrief: sanitizePlainText(input.projectBrief),
  };

  return prisma.lead.create({
    data: {
      name: sanitizedInput.contactName,
      email: sanitizedInput.email,
      phone: sanitizedInput.phone,
      projectType: sanitizedInput.service,
      message: buildBudgetLeadMessage(sanitizedInput, attachment),
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
