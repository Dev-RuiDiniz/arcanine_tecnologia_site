import { Prisma } from "@prisma/client";
import { z } from "zod";

import type { CmsPageSlug, CmsPageUpsertInput } from "@/schemas/admin/cms-page";
import { aboutContentSchema, type AboutContentInput } from "@/schemas/public/about-content";
import { homeContentSchema, type HomeContentInput } from "@/schemas/public/home-content";
import { serviceContentSchema, type ServiceContentInput } from "@/schemas/public/service-content";
import { loadPublicAboutContent, upsertAboutContent } from "@/services/about-content.service";
import { loadPublicHomeContent, upsertHomeContent } from "@/services/home-content.service";
import { listPublicServices, upsertServiceContent } from "@/services/service-content.service";

import { prisma } from "@/lib/db/prisma";

const cmsServicesContentSchema = z.object({
  services: z.array(serviceContentSchema).min(1),
});

type CmsPageContentBySlug = {
  home: HomeContentInput;
  sobre: AboutContentInput;
  servicos: { services: ServiceContentInput[] };
};

export type CmsPageRecord = {
  id: string;
  slug: CmsPageSlug;
  title: string;
  description?: string;
  published: boolean;
  content: unknown;
  updatedAt: string;
};

const cmsPageMeta: Record<CmsPageSlug, { title: string; description: string }> = {
  home: {
    title: "Home",
    description: "Configuracao estruturada da pagina inicial.",
  },
  sobre: {
    title: "Sobre",
    description: "Conteudo institucional e metodologia.",
  },
  servicos: {
    title: "Servicos",
    description: "Lista e detalhes dos servicos publicados.",
  },
};

const parseCmsContent = <S extends CmsPageSlug>(
  slug: S,
  content: unknown,
): CmsPageContentBySlug[S] => {
  if (slug === "home") {
    return homeContentSchema.parse(content) as CmsPageContentBySlug[S];
  }
  if (slug === "sobre") {
    return aboutContentSchema.parse(content) as CmsPageContentBySlug[S];
  }

  return cmsServicesContentSchema.parse(content) as CmsPageContentBySlug[S];
};

const loadContentFromPublicSources = async <S extends CmsPageSlug>(
  slug: S,
): Promise<CmsPageContentBySlug[S]> => {
  if (slug === "home") {
    return (await loadPublicHomeContent()) as CmsPageContentBySlug[S];
  }
  if (slug === "sobre") {
    return (await loadPublicAboutContent()) as CmsPageContentBySlug[S];
  }

  return { services: await listPublicServices() } as CmsPageContentBySlug[S];
};

const toCmsRecord = (row: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  content: unknown;
  updatedAt: Date;
}): CmsPageRecord => ({
  id: row.id,
  slug: row.slug as CmsPageSlug,
  title: row.title,
  description: row.description || undefined,
  published: row.published,
  content: row.content,
  updatedAt: row.updatedAt.toISOString(),
});

const ensureCmsPage = async (slug: CmsPageSlug) => {
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return existing;
  }

  const content = await loadContentFromPublicSources(slug);
  const meta = cmsPageMeta[slug];
  return prisma.page.create({
    data: {
      slug,
      title: meta.title,
      description: meta.description,
      content: content as Prisma.InputJsonValue,
      published: false,
    },
  });
};

export const listCmsPages = async (): Promise<CmsPageRecord[]> => {
  const slugs: CmsPageSlug[] = ["home", "sobre", "servicos"];
  await Promise.all(slugs.map((slug) => ensureCmsPage(slug)));

  const rows = await prisma.page.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map(toCmsRecord);
};

export const getCmsPageBySlug = async (slug: CmsPageSlug): Promise<CmsPageRecord> => {
  const row = await ensureCmsPage(slug);
  return toCmsRecord(row);
};

export const saveCmsPageDraft = async (input: CmsPageUpsertInput): Promise<CmsPageRecord> => {
  const validatedContent = parseCmsContent(input.slug, input.content);

  const row = await prisma.page.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: validatedContent as Prisma.InputJsonValue,
      published: false,
    },
    update: {
      title: input.title,
      description: input.description,
      content: validatedContent as Prisma.InputJsonValue,
    },
  });

  return toCmsRecord(row);
};

export const publishCmsPage = async (slug: CmsPageSlug): Promise<CmsPageRecord> => {
  const row = await ensureCmsPage(slug);
  const content = parseCmsContent(slug, row.content);

  if (slug === "home") {
    await upsertHomeContent(content as HomeContentInput, true);
  }

  if (slug === "sobre") {
    await upsertAboutContent(content as AboutContentInput, true);
  }

  if (slug === "servicos") {
    const servicesContent = content as { services: ServiceContentInput[] };
    for (const service of servicesContent.services) {
      await upsertServiceContent({
        ...service,
        published: true,
      });
    }
  }

  const updated = await prisma.page.update({
    where: { slug },
    data: {
      published: true,
    },
  });

  return toCmsRecord(updated);
};
