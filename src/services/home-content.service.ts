import { Prisma } from "@prisma/client";

import { homeContentSchema, type HomeContentInput } from "@/schemas/public/home-content";

import { prisma } from "@/lib/db/prisma";

const fallbackHomeContent: HomeContentInput = {
  heroEyebrow: "Engenharia digital",
  heroTitle: "Site corporativo premium para acelerar leads e autoridade digital.",
  heroDescription:
    "Entrega rapida com foco em performance, SEO forte e base administrativa para evolucao continua.",
  ctaBudgetLabel: "Solicitar orcamento",
  ctaWhatsappLabel: "Falar no WhatsApp",
  services: [
    "Sites institucionais premium",
    "Sistemas web sob demanda",
    "Automacoes de processo",
    "Integracoes e APIs",
    "IA aplicada ao negocio",
  ],
  differentials: [
    "Arquitetura orientada a performance",
    "SEO tecnico desde a primeira entrega",
    "Painel administrativo com governanca",
    "Design responsivo mobile-first",
  ],
  featuredCases: [
    {
      title: "Plataforma institucional B2B",
      result: "Aumento de 43% nas conversoes de contato em 90 dias",
      stack: ["Next.js", "PostgreSQL", "Vercel"],
    },
    {
      title: "Portal de servicos com automacao",
      result: "Reducao de 58% no tempo operacional interno",
      stack: ["React", "Node.js", "APIs"],
    },
  ],
  testimonials: [
    {
      author: "Mariana Souza",
      role: "Diretora de Operacoes",
      quote:
        "A entrega trouxe clareza comercial e um ganho real de produtividade no time de atendimento.",
    },
  ],
  showTestimonials: true,
};

type DbHomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  ctaBudgetLabel: string;
  ctaWhatsappLabel: string;
  services: string[];
  differentials: string[];
  featuredCases: unknown;
  testimonials: unknown;
  showTestimonials: boolean;
};

const mapDbToInput = (content: DbHomeContent): HomeContentInput => {
  return homeContentSchema.parse({
    heroEyebrow: content.heroEyebrow,
    heroTitle: content.heroTitle,
    heroDescription: content.heroDescription,
    ctaBudgetLabel: content.ctaBudgetLabel,
    ctaWhatsappLabel: content.ctaWhatsappLabel,
    services: content.services,
    differentials: content.differentials,
    featuredCases: content.featuredCases,
    testimonials: content.testimonials ?? undefined,
    showTestimonials: content.showTestimonials,
  });
};

export const loadPublicHomeContent = async (): Promise<HomeContentInput> => {
  try {
    const publishedContent = await prisma.homeContent.findFirst({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!publishedContent) {
      return fallbackHomeContent;
    }

    return mapDbToInput(publishedContent);
  } catch {
    return fallbackHomeContent;
  }
};

export const upsertHomeContent = async (input: HomeContentInput, published = false) => {
  const parsed = homeContentSchema.parse(input);

  return prisma.homeContent.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      heroEyebrow: parsed.heroEyebrow,
      heroTitle: parsed.heroTitle,
      heroDescription: parsed.heroDescription,
      ctaBudgetLabel: parsed.ctaBudgetLabel,
      ctaWhatsappLabel: parsed.ctaWhatsappLabel,
      services: parsed.services,
      differentials: parsed.differentials,
      featuredCases: parsed.featuredCases as Prisma.InputJsonValue,
      testimonials: parsed.testimonials
        ? (parsed.testimonials as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      showTestimonials: parsed.showTestimonials,
      published,
    },
    update: {
      heroEyebrow: parsed.heroEyebrow,
      heroTitle: parsed.heroTitle,
      heroDescription: parsed.heroDescription,
      ctaBudgetLabel: parsed.ctaBudgetLabel,
      ctaWhatsappLabel: parsed.ctaWhatsappLabel,
      services: parsed.services,
      differentials: parsed.differentials,
      featuredCases: parsed.featuredCases as Prisma.InputJsonValue,
      testimonials: parsed.testimonials
        ? (parsed.testimonials as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      showTestimonials: parsed.showTestimonials,
      published,
    },
  });
};
