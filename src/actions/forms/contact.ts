"use server";

import { contactLeadSchema, type ContactLeadInput } from "@/schemas/forms/contact";
import { createLead } from "@/services/lead.service";

export const submitContactLeadAction = async (input: ContactLeadInput) => {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid contact payload",
      issues: parsed.error.flatten(),
    };
  }

  const lead = await createLead(parsed.data);

  return {
    ok: true as const,
    data: {
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
    },
  };
};
