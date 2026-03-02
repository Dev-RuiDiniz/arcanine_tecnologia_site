"use server";

import { reportContactFormError } from "@/lib/monitoring/form-errors";
import type { ContactLeadInput } from "@/schemas/forms/contact";
import { submitContactForm } from "@/services/contact-form.service";

export const submitContactLeadAction = async (input: ContactLeadInput) => {
  try {
    const result = await submitContactForm(input);
    return result;
  } catch (error) {
    await reportContactFormError("contact-action", error, { input });
    return {
      ok: false as const,
      error: "Unexpected error while creating lead",
    };
  }
};

export const submitContactFormAction = submitContactLeadAction;
