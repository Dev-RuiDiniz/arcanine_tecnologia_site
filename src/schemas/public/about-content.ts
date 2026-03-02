import { z } from "zod";

export const aboutContentSchema = z.object({
  title: z.string().min(5).max(120),
  subtitle: z.string().min(10).max(260),
  historyTitle: z.string().min(4).max(120),
  historyText: z.string().min(30).max(1200),
  values: z.array(z.string().min(2).max(120)).min(3).max(10),
  methodology: z.array(z.string().min(2).max(160)).min(3).max(10),
  stack: z.array(z.string().min(2).max(60)).min(3).max(20),
});

export type AboutContentInput = z.infer<typeof aboutContentSchema>;
