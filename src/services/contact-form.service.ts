import { contactLeadSchema, type ContactLeadInput } from "@/schemas/forms/contact";

import { createLead } from "@/services/lead.service";

export type ContactSubmissionResult =
  | {
      ok: true;
      data: { id: string; createdAt: string };
    }
  | {
      ok: false;
      error: string;
      issues?: unknown;
    };

export const submitContactForm = async (
  input: ContactLeadInput,
): Promise<ContactSubmissionResult> => {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid contact payload",
      issues: parsed.error.flatten(),
    };
  }

  const lead = await createLead(parsed.data);
  return {
    ok: true,
    data: {
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
    },
  };
};
