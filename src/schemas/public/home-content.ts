import { z } from "zod";

export const featuredCaseSchema = z.object({
  title: z.string().min(2).max(120),
  result: z.string().min(2).max(200),
  stack: z.array(z.string().min(1).max(40)).min(1).max(8),
});

export const testimonialSchema = z.object({
  author: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  quote: z.string().min(10).max(350),
});

export const homeContentSchema = z.object({
  heroEyebrow: z.string().min(2).max(80),
  heroTitle: z.string().min(10).max(160),
  heroDescription: z.string().min(20).max(400),
  ctaBudgetLabel: z.string().min(2).max(50),
  ctaWhatsappLabel: z.string().min(2).max(50),
  services: z.array(z.string().min(2).max(80)).min(3).max(8),
  differentials: z.array(z.string().min(2).max(100)).min(3).max(8),
  featuredCases: z.array(featuredCaseSchema).min(2).max(6),
  testimonials: z.array(testimonialSchema).max(6).optional(),
  showTestimonials: z.boolean().default(false),
});

export type HomeContentInput = z.infer<typeof homeContentSchema>;
