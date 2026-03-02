import { aboutContentSchema, type AboutContentInput } from "@/schemas/public/about-content";

import { prisma } from "@/lib/db/prisma";

const fallbackAboutContent: AboutContentInput = {
  title: "Sobre a Arcanine Tecnologia",
  subtitle:
    "Transformamos objetivos de negocio em produtos digitais performaticos, escalaveis e orientados a conversao.",
  historyTitle: "Historia",
  historyText:
    "A Arcanine nasceu para unir engenharia de software e estrategia digital em um unico fluxo de entrega. Atuamos desde o planejamento tecnico ate a publicacao e evolucao continua, sempre com foco em performance, SEO e geracao de valor para o cliente.",
  values: [
    "Clareza tecnica",
    "Compromisso com resultado",
    "Qualidade sustentavel",
    "Evolucao continua",
  ],
  methodology: [
    "Diagnostico de contexto e metas",
    "Arquitetura e backlog priorizado",
    "Entregas iterativas com validacao",
    "Monitoramento e melhoria continua",
  ],
  stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"],
};

export const loadPublicAboutContent = async (): Promise<AboutContentInput> => {
  try {
    const published = await prisma.aboutContent.findFirst({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!published) {
      return fallbackAboutContent;
    }

    return aboutContentSchema.parse({
      title: published.title,
      subtitle: published.subtitle,
      historyTitle: published.historyTitle,
      historyText: published.historyText,
      values: published.values,
      methodology: published.methodology,
      stack: published.stack,
    });
  } catch {
    return fallbackAboutContent;
  }
};

export const upsertAboutContent = async (input: AboutContentInput, published = false) => {
  const parsed = aboutContentSchema.parse(input);

  return prisma.aboutContent.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      title: parsed.title,
      subtitle: parsed.subtitle,
      historyTitle: parsed.historyTitle,
      historyText: parsed.historyText,
      values: parsed.values,
      methodology: parsed.methodology,
      stack: parsed.stack,
      published,
    },
    update: {
      title: parsed.title,
      subtitle: parsed.subtitle,
      historyTitle: parsed.historyTitle,
      historyText: parsed.historyText,
      values: parsed.values,
      methodology: parsed.methodology,
      stack: parsed.stack,
      published,
    },
  });
};
