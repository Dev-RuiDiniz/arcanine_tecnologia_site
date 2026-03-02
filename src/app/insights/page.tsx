import type { Metadata } from "next";
import Link from "next/link";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { listPublicPosts } from "@/services/post.service";

type InsightsPageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
  }>;
};

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Insights",
  description:
    "Artigos tecnicos e estrategicos sobre desenvolvimento web, SEO, produto digital e automacao.",
  path: "/insights",
});

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const filters = await searchParams;
  const { posts, categories, tags } = await listPublicPosts(filters);

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Blog / Insights"
          title="Conteudo tecnico para decisao digital"
          description="Artigos publicados com filtro por categoria, tag e busca textual."
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100 pb-16">
        <form className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Buscar por titulo, resumo ou conteudo"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <select
            name="category"
            defaultValue={filters.category || ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">Todas categorias</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="tag"
            defaultValue={filters.tag || ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">Todas tags</option>
            {tags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Filtrar
          </button>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              {post.category ? (
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  {post.category.name}
                </p>
              ) : null}
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">{post.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
              <Link
                href={`/insights/${post.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
              >
                Ler artigo
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Nenhum artigo encontrado para os filtros aplicados.
          </p>
        ) : null}
      </SectionShell>
    </PublicLayout>
  );
}
