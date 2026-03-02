import { apiRequest } from "@/lib/api/client";
import type { ApiResult } from "@/lib/api/contracts";
import type { BudgetLeadInput } from "@/schemas/forms/budget";
import type { ContactLeadInput } from "@/schemas/forms/contact";

export const submitContactForm = async (input: ContactLeadInput) => {
  return apiRequest<{ id: string; createdAt: string }>("/api/forms/contact", {
    method: "POST",
    body: input,
  });
};

export const submitBudgetForm = async (input: BudgetLeadInput, attachment?: File) => {
  const formData = new FormData();
  formData.set("contactName", input.contactName);
  formData.set("companyName", input.companyName);
  formData.set("email", input.email);
  formData.set("phone", input.phone);
  formData.set("service", input.service);
  formData.set("budgetRange", input.budgetRange);
  formData.set("timeline", input.timeline);
  formData.set("projectBrief", input.projectBrief);
  if (attachment) {
    formData.set("attachment", attachment);
  }

  const response = await fetch("/api/forms/budget", {
    method: "POST",
    body: formData,
  });

  return (await response.json()) as ApiResult<{ id: string; createdAt: string }>;
};
