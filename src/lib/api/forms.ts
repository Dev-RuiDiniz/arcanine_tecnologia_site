import { apiRequest } from "@/lib/api/client";
import type { ContactLeadInput } from "@/schemas/forms/contact";

export const submitContactForm = async (input: ContactLeadInput) => {
  return apiRequest<{ id: string; createdAt: string }>("/api/forms/contact", {
    method: "POST",
    body: input,
  });
};
