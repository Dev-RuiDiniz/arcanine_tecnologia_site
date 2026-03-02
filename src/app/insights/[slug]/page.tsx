import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/schema-org";
import { getPublicPostBySlug, listPublicPosts } from "@/services/post.service";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const { posts } = await listPublicPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    return buildPublicMetadata({
      title: "Artigo nao encontrado",
      description: "O artigo solicitado nao foi encontrado.",
      path: `/insights/${slug}`,
      noIndex: true,
    });
  }

  return buildPublicMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    imageUrl:
      post.coverImageUrl ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt)}`,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ]);

  return (
    <PublicLayout>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading eyebrow="Insights" title={post.title} description={post.excerpt} />
      </SectionShell>

      <SectionShell className="bg-zinc-100 pb-16">
        <article className="mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <div
            className="prose prose-zinc mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </SectionShell>
    </PublicLayout>
  );
}
