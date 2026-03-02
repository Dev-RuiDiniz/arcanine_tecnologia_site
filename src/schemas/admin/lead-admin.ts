import { z } from "zod";

export const leadFiltersSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST"]).optional(),
  service: z.string().optional(),
  q: z.string().optional(),
});

export const leadStatusUpdateSchema = z.object({
  leadId: z.string().min(2),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST"]),
  note: z.string().trim().min(2).max(1500).optional(),
});

export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>;
