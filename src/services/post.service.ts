import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { sanitizeRichText } from "@/lib/content/sanitize-rich-text";
import type { BlogPost } from "@/schemas/blog/post";
import type { PostAdminUpsertInput } from "@/schemas/admin/post-admin";

import { prisma } from "@/lib/db/prisma";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  contentHtml: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PostTagRow = {
  postId: string;
  tagId: string;
  tagSlug: string;
  tagName: string;
};

export type BlogListFilters = {
  category?: string;
  tag?: string;
  q?: string;
};

export type BlogListingData = {
  posts: BlogPost[];
  categories: { slug: string; name: string; count: number }[];
  tags: { slug: string; name: string; count: number }[];
};

const fallbackPublicPosts: BlogPost[] = [
  {
    id: "fallback-post-1",
    slug: "como-estruturar-site-corporativo-que-converte",
    title: "Como estruturar um site corporativo que converte em 2026",
    excerpt:
      "Guia pratico sobre arquitetura de conteudo, CTA e performance para aumentar leads qualificados.",
    coverImageUrl:
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/5",
    contentHtml:
      "<h2>Direcionamento</h2><p>Um site corporativo eficaz precisa unir posicionamento de marca, clareza de oferta e jornada de contato objetiva.</p><h2>Checklist essencial</h2><ul><li>Mensagem principal acima da dobra</li><li>CTA de contato visivel</li><li>Paginas de servicos com prova de resultado</li><li>SEO tecnico e performance</li></ul>",
    status: "PUBLISHED",
    publishedAt: new Date("2026-03-01T10:00:00.000Z").toISOString(),
    category: {
      id: "fallback-category-1",
      slug: "estrategia-digital",
      name: "Estrategia Digital",
    },
    tags: [
      { id: "fallback-tag-1", slug: "conversao", name: "Conversao" },
      { id: "fallback-tag-2", slug: "site-corporativo", name: "Site Corporativo" },
    ],
    createdAt: new Date("2026-03-01T10:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-03-01T10:00:00.000Z").toISOString(),
  },
  {
    id: "fallback-post-2",
    slug: "seo-tecnico-nextjs-app-router",
    title: "SEO tecnico em Next.js App Router: pontos que impactam indexacao",
    excerpt:
      "Aprenda a configurar metadata por rota, canonicals e sinais de indexabilidade para blog e paginas comerciais.",
    coverImageUrl:
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/6",
    contentHtml:
      "<h2>Metadata por rota</h2><p>Defina title, description, canonical e open graph por pagina para evitar ambiguidade de indexacao.</p><h2>Monitoramento</h2><p>Valide em preview antes de publicar para reduzir regressao de SEO tecnico.</p>",
    status: "PUBLISHED",
    publishedAt: new Date("2026-02-27T15:30:00.000Z").toISOString(),
    category: {
      id: "fallback-category-2",
      slug: "seo",
      name: "SEO",
    },
    tags: [
      { id: "fallback-tag-3", slug: "nextjs", name: "Next.js" },
      { id: "fallback-tag-4", slug: "indexacao", name: "Indexacao" },
    ],
    createdAt: new Date("2026-02-27T15:30:00.000Z").toISOString(),
    updatedAt: new Date("2026-02-27T15:30:00.000Z").toISOString(),
  },
];

const toBlogPost = (row: PostRow, tags: PostTagRow[]): BlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  coverImageUrl: row.coverImageUrl ?? undefined,
  contentHtml: row.contentHtml,
  status: row.status,
  publishedAt: row.publishedAt?.toISOString(),
  category: row.categoryId
    ? {
        id: row.categoryId,
        slug: row.categorySlug || "",
        name: row.categoryName || "",
      }
    : undefined,
  tags: tags.map((tag) => ({
    id: tag.tagId,
    slug: tag.tagSlug,
    name: tag.tagName,
  })),
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

const buildPublicWhere = (filters: BlogListFilters) => {
  const conditions: Prisma.Sql[] = [Prisma.sql`p."status" = 'PUBLISHED'`];

  if (filters.category) {
    conditions.push(Prisma.sql`c."slug" = ${filters.category}`);
  }

  if (filters.tag) {
    conditions.push(
      Prisma.sql`EXISTS (SELECT 1 FROM "public"."PostTag" ptf JOIN "public"."Tag" tf ON tf."id" = ptf."tagId" WHERE ptf."postId" = p."id" AND tf."slug" = ${filters.tag})`,
    );
  }

  if (filters.q) {
    const like = `%${filters.q}%`;
    conditions.push(
      Prisma.sql`(p."title" ILIKE ${like} OR p."excerpt" ILIKE ${like} OR p."contentHtml" ILIKE ${like})`,
    );
  }

  return Prisma.join(conditions, " AND ");
};

const fetchTagsByPostIds = async (postIds: string[]): Promise<PostTagRow[]> => {
  if (postIds.length === 0) {
    return [];
  }
  return prisma.$queryRaw<PostTagRow[]>(Prisma.sql`
    SELECT
      pt."postId",
      t."id" as "tagId",
      t."slug" as "tagSlug",
      t."name" as "tagName"
    FROM "public"."PostTag" pt
    JOIN "public"."Tag" t ON t."id" = pt."tagId"
    WHERE pt."postId" IN (${Prisma.join(postIds)})
  `);
};

const mapPosts = async (rows: PostRow[]) => {
  const tags = await fetchTagsByPostIds(rows.map((row) => row.id));
  const tagsByPostId = tags.reduce<Record<string, PostTagRow[]>>((acc, row) => {
    if (!acc[row.postId]) {
      acc[row.postId] = [];
    }
    acc[row.postId].push(row);
    return acc;
  }, {});

  return rows.map((row) => toBlogPost(row, tagsByPostId[row.id] || []));
};

export const listPublicPosts = async (filters: BlogListFilters = {}): Promise<BlogListingData> => {
  try {
    const whereClause = buildPublicWhere(filters);

    const postRows = await prisma.$queryRaw<PostRow[]>(Prisma.sql`
      SELECT
        p."id",
        p."slug",
        p."title",
        p."excerpt",
        p."coverImageUrl",
        p."contentHtml",
        p."status",
        p."publishedAt",
        c."id" as "categoryId",
        c."slug" as "categorySlug",
        c."name" as "categoryName",
        p."createdAt",
        p."updatedAt"
      FROM "public"."Post" p
      LEFT JOIN "public"."Category" c ON c."id" = p."categoryId"
      WHERE ${whereClause}
      ORDER BY COALESCE(p."publishedAt", p."createdAt") DESC
      LIMIT 30
    `);

    const [categoryRows, tagRows, posts] = await Promise.all([
      prisma.$queryRaw<{ slug: string; name: string; count: number }[]>(Prisma.sql`
        SELECT c."slug", c."name", COUNT(p."id")::int as "count"
        FROM "public"."Category" c
        LEFT JOIN "public"."Post" p ON p."categoryId" = c."id" AND p."status" = 'PUBLISHED'
        GROUP BY c."slug", c."name"
        HAVING COUNT(p."id") > 0
        ORDER BY c."name" ASC
      `),
      prisma.$queryRaw<{ slug: string; name: string; count: number }[]>(Prisma.sql`
        SELECT t."slug", t."name", COUNT(pt."postId")::int as "count"
        FROM "public"."Tag" t
        JOIN "public"."PostTag" pt ON pt."tagId" = t."id"
        JOIN "public"."Post" p ON p."id" = pt."postId" AND p."status" = 'PUBLISHED'
        GROUP BY t."slug", t."name"
        ORDER BY COUNT(pt."postId") DESC, t."name" ASC
        LIMIT 20
      `),
      mapPosts(postRows),
    ]);

    if (posts.length > 0) {
      return {
        posts,
        categories: categoryRows,
        tags: tagRows,
      };
    }
  } catch {
    // fallback to local content when database is unavailable
  }

  const fallbackFiltered = fallbackPublicPosts.filter((post) => {
    const byCategory = filters.category ? post.category?.slug === filters.category : true;
    const byTag = filters.tag ? post.tags.some((tag) => tag.slug === filters.tag) : true;
    const byQuery = filters.q
      ? `${post.title} ${post.excerpt} ${post.contentHtml}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      : true;
    return byCategory && byTag && byQuery;
  });

  const fallbackCategories = Array.from(
    fallbackPublicPosts
      .reduce<Map<string, { slug: string; name: string; count: number }>>((acc, post) => {
        if (!post.category) {
          return acc;
        }
        const current = acc.get(post.category.slug);
        acc.set(post.category.slug, {
          slug: post.category.slug,
          name: post.category.name,
          count: (current?.count || 0) + 1,
        });
        return acc;
      }, new Map())
      .values(),
  );

  const fallbackTags = Array.from(
    fallbackPublicPosts
      .reduce<Map<string, { slug: string; name: string; count: number }>>((acc, post) => {
        for (const tag of post.tags) {
          const current = acc.get(tag.slug);
          acc.set(tag.slug, {
            slug: tag.slug,
            name: tag.name,
            count: (current?.count || 0) + 1,
          });
        }
        return acc;
      }, new Map())
      .values(),
  );

  return {
    posts: fallbackFiltered,
    categories: fallbackCategories,
    tags: fallbackTags,
  };
};

export const getPublicPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const rows = await prisma.$queryRaw<PostRow[]>(Prisma.sql`
      SELECT
        p."id",
        p."slug",
        p."title",
        p."excerpt",
        p."coverImageUrl",
        p."contentHtml",
        p."status",
        p."publishedAt",
        c."id" as "categoryId",
        c."slug" as "categorySlug",
        c."name" as "categoryName",
        p."createdAt",
        p."updatedAt"
      FROM "public"."Post" p
      LEFT JOIN "public"."Category" c ON c."id" = p."categoryId"
      WHERE p."slug" = ${slug} AND p."status" = 'PUBLISHED'
      LIMIT 1
    `);
    if (rows.length === 0) {
      return fallbackPublicPosts.find((post) => post.slug === slug) || null;
    }
    const mapped = await mapPosts(rows);
    return mapped[0] || null;
  } catch {
    return fallbackPublicPosts.find((post) => post.slug === slug) || null;
  }
};

export const listAdminPosts = async (): Promise<BlogPost[]> => {
  const rows = await prisma.$queryRaw<PostRow[]>(Prisma.sql`
    SELECT
      p."id",
      p."slug",
      p."title",
      p."excerpt",
      p."coverImageUrl",
      p."contentHtml",
      p."status",
      p."publishedAt",
      c."id" as "categoryId",
      c."slug" as "categorySlug",
      c."name" as "categoryName",
      p."createdAt",
      p."updatedAt"
    FROM "public"."Post" p
    LEFT JOIN "public"."Category" c ON c."id" = p."categoryId"
    ORDER BY p."updatedAt" DESC
  `);
  return mapPosts(rows);
};

const ensureCategory = async (slug: string, name: string) => {
  const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT "id" FROM "public"."Category" WHERE "slug" = ${slug} LIMIT 1
  `);
  if (rows.length > 0) {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE "public"."Category" SET "name" = ${name}, "updatedAt" = NOW() WHERE "id" = ${rows[0].id}
    `);
    return rows[0].id;
  }

  const id = randomUUID();
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "public"."Category" ("id", "slug", "name", "updatedAt")
    VALUES (${id}, ${slug}, ${name}, NOW())
  `);
  return id;
};

const ensureTag = async (slug: string, name: string) => {
  const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT "id" FROM "public"."Tag" WHERE "slug" = ${slug} LIMIT 1
  `);
  if (rows.length > 0) {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE "public"."Tag" SET "name" = ${name}, "updatedAt" = NOW() WHERE "id" = ${rows[0].id}
    `);
    return rows[0].id;
  }

  const id = randomUUID();
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "public"."Tag" ("id", "slug", "name", "updatedAt")
    VALUES (${id}, ${slug}, ${name}, NOW())
  `);
  return id;
};

export const saveAdminPost = async (input: PostAdminUpsertInput): Promise<BlogPost> => {
  const categoryId = await ensureCategory(input.categorySlug, input.categoryName);
  const sanitizedContent = sanitizeRichText(input.contentHtml);

  const postId = await prisma.$transaction(async (tx) => {
    const existing = input.id
      ? await tx.$queryRaw<{ id: string }[]>(
          Prisma.sql`SELECT "id" FROM "public"."Post" WHERE "id" = ${input.id} LIMIT 1`,
        )
      : await tx.$queryRaw<{ id: string }[]>(
          Prisma.sql`SELECT "id" FROM "public"."Post" WHERE "slug" = ${input.slug} LIMIT 1`,
        );

    const resolvedPostId = existing[0]?.id || randomUUID();
    const publishedAt = input.status === "PUBLISHED" ? new Date() : null;

    if (existing.length > 0) {
      await tx.$executeRaw(Prisma.sql`
        UPDATE "public"."Post"
        SET
          "slug" = ${input.slug},
          "title" = ${input.title},
          "excerpt" = ${input.excerpt},
          "coverImageUrl" = ${input.coverImageUrl ?? null},
          "contentHtml" = ${sanitizedContent},
          "status" = ${input.status}::"public"."PostStatus",
          "publishedAt" = ${publishedAt},
          "categoryId" = ${categoryId},
          "updatedAt" = NOW()
        WHERE "id" = ${resolvedPostId}
      `);
    } else {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "public"."Post" (
          "id", "slug", "title", "excerpt", "coverImageUrl", "contentHtml",
          "status", "publishedAt", "categoryId", "updatedAt"
        )
        VALUES (
          ${resolvedPostId}, ${input.slug}, ${input.title}, ${input.excerpt},
          ${input.coverImageUrl ?? null}, ${sanitizedContent},
          ${input.status}::"public"."PostStatus", ${publishedAt}, ${categoryId}, NOW()
        )
      `);
    }

    await tx.$executeRaw(
      Prisma.sql`DELETE FROM "public"."PostTag" WHERE "postId" = ${resolvedPostId}`,
    );
    for (const tag of input.tags) {
      const tagId = await ensureTag(tag.slug, tag.name);
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "public"."PostTag" ("postId", "tagId")
        VALUES (${resolvedPostId}, ${tagId})
      `);
    }

    return resolvedPostId;
  });

  const posts = await listAdminPosts();
  return posts.find((post) => post.id === postId) as BlogPost;
};

export const deleteAdminPostById = async (id: string) => {
  await prisma.$executeRaw(Prisma.sql`DELETE FROM "public"."Post" WHERE "id" = ${id}`);
};
