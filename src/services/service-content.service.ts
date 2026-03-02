import { serviceContentSchema, type ServiceContentInput } from "@/schemas/public/service-content";

import { prisma } from "@/lib/db/prisma";

const fallbackServices: ServiceContentInput[] = [
  {
    slug: "sites-institucionais",
    name: "Sites institucionais",
    summary: "Sites corporativos premium com foco em performance, autoridade e conversao.",
    heroTitle: "Sites institucionais para posicionamento e geracao de leads",
    heroDescription:
      "Projetamos e desenvolvemos sites institucionais com arquitetura escalavel, UX orientada a conversao e SEO tecnico desde a base.",
    details: [
      "Arquitetura mobile-first e desempenho otimizado",
      "Conteudo orientado a negocio e prova social",
      "Base pronta para evolucao via CMS interno",
    ],
    seoTitle: "Sites institucionais premium | Arcanine Tecnologia",
    seoDescription:
      "Desenvolvimento de sites institucionais com alta performance, SEO tecnico e foco em conversao de leads.",
    published: true,
  },
  {
    slug: "sistemas-web",
    name: "Sistemas web",
    summary: "Aplicacoes sob medida para operacoes internas, atendimento e escala de servicos.",
    heroTitle: "Sistemas web sob demanda com governanca e escalabilidade",
    heroDescription:
      "Construimos sistemas web customizados com modelagem robusta, seguranca e experiencia consistente para usuarios internos e externos.",
    details: [
      "Modelagem de dominio e fluxos de negocio",
      "Autenticacao, autorizacao e trilhas de auditoria",
      "Arquitetura pronta para integracoes futuras",
    ],
    seoTitle: "Sistemas web sob medida | Arcanine Tecnologia",
    seoDescription:
      "Construimos sistemas web personalizados para digitalizar processos e sustentar crescimento operacional.",
    published: true,
  },
  {
    slug: "automacoes",
    name: "Automacoes",
    summary: "Automatizamos processos para reduzir custo operacional e acelerar produtividade.",
    heroTitle: "Automacoes para eliminar gargalos operacionais",
    heroDescription:
      "Mapeamos e automatizamos tarefas repetitivas com integracoes seguras e monitoramento para garantir ganho real de eficiencia.",
    details: [
      "Mapeamento de processos e pontos de friccao",
      "Orquestracao de tarefas e eventos",
      "Monitoramento de execucao e confiabilidade",
    ],
    seoTitle: "Automacoes de processos | Arcanine Tecnologia",
    seoDescription:
      "Implementacao de automacoes para reduzir retrabalho, aumentar produtividade e melhorar SLA operacional.",
    published: true,
  },
  {
    slug: "integracoes-api",
    name: "Integracoes e API",
    summary: "Conectamos sistemas e plataformas para fluxo de dados consistente e seguro.",
    heroTitle: "Integracoes e APIs para unificar a operacao digital",
    heroDescription:
      "Implementamos integracoes entre ferramentas, CRMs e ERPs com contratos claros, observabilidade e resiliencia.",
    details: [
      "Design e consumo de APIs REST/HTTP",
      "Webhooks, filas e sincronizacao de dados",
      "Tratamento de falhas e retentativas",
    ],
    seoTitle: "Integracoes e APIs | Arcanine Tecnologia",
    seoDescription:
      "Desenvolvimento de integracoes e APIs para conectar sistemas com seguranca, rastreabilidade e performance.",
    published: true,
  },
  {
    slug: "ia-aplicada",
    name: "IA aplicada",
    summary: "Aplicamos IA em fluxos reais de negocio para ampliar produtividade e decisao.",
    heroTitle: "IA aplicada com foco em impacto operacional",
    heroDescription:
      "Estruturamos casos de uso de IA com governanca de dados, integracao com sistemas e medicao de resultados.",
    details: [
      "Casos de uso priorizados por ROI",
      "Integracao de modelos em fluxos existentes",
      "Monitoramento de qualidade e melhoria continua",
    ],
    seoTitle: "IA aplicada a negocios | Arcanine Tecnologia",
    seoDescription:
      "Aplicacao de IA em processos reais com foco em produtividade, automacao inteligente e ganho de eficiencia.",
    published: true,
  },
];

const parseService = (input: unknown) => serviceContentSchema.parse(input);

export const listPublicServices = async (): Promise<ServiceContentInput[]> => {
  try {
    const dbServices = await prisma.serviceContent.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });

    if (dbServices.length === 0) {
      return fallbackServices;
    }

    return dbServices.map((service) =>
      parseService({
        slug: service.slug,
        name: service.name,
        summary: service.summary,
        heroTitle: service.heroTitle,
        heroDescription: service.heroDescription,
        details: service.details,
        seoTitle: service.seoTitle ?? undefined,
        seoDescription: service.seoDescription ?? undefined,
        published: service.published,
      }),
    );
  } catch {
    return fallbackServices;
  }
};

export const getPublicServiceBySlug = async (slug: string): Promise<ServiceContentInput | null> => {
  const allServices = await listPublicServices();
  return allServices.find((service) => service.slug === slug) ?? null;
};

export const upsertServiceContent = async (input: ServiceContentInput) => {
  const parsed = serviceContentSchema.parse(input);

  return prisma.serviceContent.upsert({
    where: { slug: parsed.slug },
    create: {
      slug: parsed.slug,
      name: parsed.name,
      summary: parsed.summary,
      heroTitle: parsed.heroTitle,
      heroDescription: parsed.heroDescription,
      details: parsed.details,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      published: parsed.published,
    },
    update: {
      name: parsed.name,
      summary: parsed.summary,
      heroTitle: parsed.heroTitle,
      heroDescription: parsed.heroDescription,
      details: parsed.details,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      published: parsed.published,
    },
  });
};
