import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { listPublicCases } from "@/services/case-content.service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cases | Arcanine Tecnologia",
  description:
    "Conheca cases da Arcanine Tecnologia com foco em resultado, stack aplicada e impacto de negocio.",
  alternates: {
    canonical: "/cases",
  },
};

export default async function CasesPage() {
  const cases = await listPublicCases();

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Portfolio"
          title="Cases com foco em impacto de negocio"
          description="Projetos que combinam performance tecnica, design funcional e conversao orientada a resultado."
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100 pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {cases.map((caseItem) => (
            <article
              key={caseItem.slug}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={caseItem.imageUrls[0]}
                  alt={`Capa do case ${caseItem.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-zinc-900">{caseItem.title}</h2>
                <p className="mt-2 text-sm text-zinc-600">{caseItem.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {caseItem.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/cases/${caseItem.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-600"
                >
                  Ver case completo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
