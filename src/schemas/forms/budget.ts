import { z } from "zod";

export const budgetLeadSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(8).max(40),
  service: z.string().trim().min(2).max(120),
  budgetRange: z.string().trim().min(2).max(80),
  timeline: z.string().trim().min(2).max(80),
  projectBrief: z.string().trim().min(20).max(4000),
});

export const budgetAttachmentSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(15 * 1024 * 1024),
});

export const budgetLeadSubmissionSchema = budgetLeadSchema.extend({
  attachment: budgetAttachmentSchema.optional(),
});

export type BudgetLeadInput = z.infer<typeof budgetLeadSchema>;
export type BudgetAttachmentInput = z.infer<typeof budgetAttachmentSchema>;
export type BudgetLeadSubmissionInput = z.infer<typeof budgetLeadSubmissionSchema>;
