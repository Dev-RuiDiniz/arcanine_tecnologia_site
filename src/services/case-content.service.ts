import { caseContentSchema, type CaseContentInput } from "@/schemas/public/case-content";

import { buildCaseImageUrl } from "@/lib/cdn/case-images";
import { prisma } from "@/lib/db/prisma";

const fallbackCases: CaseContentInput[] = [
  {
    slug: "portal-b2b-industrial",
    title: "Portal B2B industrial com jornada de captura de leads",
    summary:
      "Reestruturacao completa do site institucional com foco em performance e geracao de oportunidades comerciais.",
    challenge:
      "O cliente tinha baixa conversao em formularios, paginas lentas e dificuldade em comunicar diferenciais tecnicos para o mercado B2B.",
    solution:
      "Criamos nova arquitetura de informacao, paginas orientadas por intencao de busca, blocos de prova social e fluxo de contato simplificado.",
    results: [
      "+63% em envio de formularios qualificados",
      "Lighthouse acima de 90",
      "Reducao de 38% na taxa de rejeicao",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Vercel"],
    imageUrls: [
      buildCaseImageUrl("samples/landscapes/1"),
      buildCaseImageUrl("samples/landscapes/2"),
    ],
    testimonialQuote:
      "A nova estrutura trouxe clareza comercial e melhorou muito a qualidade dos contatos recebidos.",
    testimonialAuthor: "Felipe Nogueira",
    testimonialRole: "Head de Marketing",
    showTestimonial: true,
    seoTitle: "Case Portal B2B industrial | Arcanine Tecnologia",
    seoDescription:
      "Veja como reestruturamos um portal B2B e aumentamos a conversao de leads com performance e SEO tecnico.",
    published: true,
  },
  {
    slug: "plataforma-servicos-digitais",
    title: "Plataforma de servicos digitais com operacao automatizada",
    summary:
      "Construcao de plataforma com cadastro de demandas, automacoes e painel interno de acompanhamento.",
    challenge:
      "A operacao dependia de processos manuais e planilhas, gerando atraso na resposta e baixa previsibilidade.",
    solution:
      "Desenvolvemos um fluxo digital ponta a ponta com regras de negocio, notificacoes e trilhas de auditoria para o time interno.",
    results: [
      "-52% no tempo medio operacional",
      "Padronizacao do fluxo de atendimento",
      "Maior rastreabilidade de entregas",
    ],
    stack: ["React", "Node.js", "Prisma", "PostgreSQL"],
    imageUrls: [
      buildCaseImageUrl("samples/landscapes/3"),
      buildCaseImageUrl("samples/landscapes/4"),
    ],
    showTestimonial: false,
    seoTitle: "Case Plataforma de servicos digitais | Arcanine Tecnologia",
    seoDescription:
      "Conheca o case de plataforma digital com automacao de processos e ganhos concretos de produtividade.",
    published: true,
  },
];

export const listPublicCases = async (): Promise<CaseContentInput[]> => {
  try {
    const dbCases = await prisma.caseContent.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });

    if (dbCases.length === 0) {
      return fallbackCases;
    }

    return dbCases.map((caseItem) =>
      caseContentSchema.parse({
        slug: caseItem.slug,
        title: caseItem.title,
        summary: caseItem.summary,
        challenge: caseItem.challenge,
        solution: caseItem.solution,
        results: caseItem.results,
        stack: caseItem.stack,
        imageUrls: caseItem.imageUrls,
        testimonialQuote: caseItem.testimonialQuote ?? undefined,
        testimonialAuthor: caseItem.testimonialAuthor ?? undefined,
        testimonialRole: caseItem.testimonialRole ?? undefined,
        showTestimonial: caseItem.showTestimonial,
        seoTitle: caseItem.seoTitle ?? undefined,
        seoDescription: caseItem.seoDescription ?? undefined,
        published: caseItem.published,
      }),
    );
  } catch {
    return fallbackCases;
  }
};

export const getPublicCaseBySlug = async (slug: string): Promise<CaseContentInput | null> => {
  const cases = await listPublicCases();
  return cases.find((caseItem) => caseItem.slug === slug) ?? null;
};

export const upsertCaseContent = async (input: CaseContentInput) => {
  const parsed = caseContentSchema.parse(input);

  return prisma.caseContent.upsert({
    where: { slug: parsed.slug },
    create: {
      slug: parsed.slug,
      title: parsed.title,
      summary: parsed.summary,
      challenge: parsed.challenge,
      solution: parsed.solution,
      results: parsed.results,
      stack: parsed.stack,
      imageUrls: parsed.imageUrls,
      testimonialQuote: parsed.testimonialQuote,
      testimonialAuthor: parsed.testimonialAuthor,
      testimonialRole: parsed.testimonialRole,
      showTestimonial: parsed.showTestimonial,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      published: parsed.published,
    },
    update: {
      title: parsed.title,
      summary: parsed.summary,
      challenge: parsed.challenge,
      solution: parsed.solution,
      results: parsed.results,
      stack: parsed.stack,
      imageUrls: parsed.imageUrls,
      testimonialQuote: parsed.testimonialQuote,
      testimonialAuthor: parsed.testimonialAuthor,
      testimonialRole: parsed.testimonialRole,
      showTestimonial: parsed.showTestimonial,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      published: parsed.published,
    },
  });
};
