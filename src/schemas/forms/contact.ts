import { z } from "zod";

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(40).optional(),
  projectType: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(3000),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
