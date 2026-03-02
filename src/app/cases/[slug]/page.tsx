import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { getPublicCaseBySlug, listPublicCases } from "@/services/case-content.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const cases = await listPublicCases();
  return cases.map((caseItem) => ({ slug: caseItem.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = await getPublicCaseBySlug(slug);

  if (!caseItem) {
    return {
      title: "Case nao encontrado | Arcanine Tecnologia",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: caseItem.seoTitle ?? `${caseItem.title} | Arcanine Tecnologia`,
    description: caseItem.seoDescription ?? caseItem.summary,
    alternates: {
      canonical: `/cases/${caseItem.slug}`,
    },
  };
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const caseItem = await getPublicCaseBySlug(slug);

  if (!caseItem) {
    notFound();
  }

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading eyebrow="Case" title={caseItem.title} description={caseItem.summary} />
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Desafio</h2>
            <p className="mt-2 text-sm text-zinc-700">{caseItem.challenge}</p>

            <h2 className="mt-6 text-lg font-semibold text-zinc-900">Solucao</h2>
            <p className="mt-2 text-sm text-zinc-700">{caseItem.solution}</p>

            <h2 className="mt-6 text-lg font-semibold text-zinc-900">Resultados</h2>
            <ul className="mt-2 space-y-2">
              {caseItem.results.map((result) => (
                <li key={result} className="rounded-lg bg-zinc-50 px-4 py-2 text-sm text-zinc-700">
                  {result}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-lg font-semibold text-zinc-900">Stack utilizada</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {caseItem.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            {caseItem.imageUrls.map((imageUrl, index) => (
              <div
                key={imageUrl}
                className="relative h-52 overflow-hidden rounded-xl border border-zinc-200 bg-white"
              >
                <Image
                  src={imageUrl}
                  alt={`Imagem ${index + 1} do case ${caseItem.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </aside>
        </div>
      </SectionShell>

      {caseItem.showTestimonial &&
      caseItem.testimonialQuote &&
      caseItem.testimonialAuthor &&
      caseItem.testimonialRole ? (
        <SectionShell className="bg-zinc-50 pb-16">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900">Depoimento</h2>
            <p className="mt-3 text-sm text-zinc-700">&quot;{caseItem.testimonialQuote}&quot;</p>
            <p className="mt-4 text-sm font-semibold text-zinc-900">{caseItem.testimonialAuthor}</p>
            <p className="text-xs text-zinc-500">{caseItem.testimonialRole}</p>
          </div>
        </SectionShell>
      ) : null}
    </PublicLayout>
  );
}
