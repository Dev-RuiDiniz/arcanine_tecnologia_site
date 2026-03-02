import type { Metadata } from "next";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { loadPublicAboutContent } from "@/services/about-content.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Sobre",
  description: "Conheca a historia, valores, metodologia e stack da Arcanine Tecnologia.",
  path: "/sobre",
});

export default async function SobrePage() {
  const aboutContent = await loadPublicAboutContent();

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Sobre"
          title={aboutContent.title}
          description={aboutContent.subtitle}
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-zinc-900">{aboutContent.historyTitle}</h2>
          <p className="mt-4 text-zinc-600">{aboutContent.historyText}</p>
        </article>
      </SectionShell>

      <SectionShell className="bg-zinc-50">
        <SectionHeading
          eyebrow="Valores"
          title="Principios que orientam cada entrega"
          description="Base cultural aplicada em produto, arquitetura e relacionamento."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {aboutContent.values.map((value) => (
            <article
              key={value}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700"
            >
              {value}
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <SectionHeading
          eyebrow="Metodologia"
          title="Fluxo de trabalho orientado a resultado"
          description="Etapas claras para reduzir risco e aumentar previsibilidade."
        />
        <ol className="mt-8 space-y-3">
          {aboutContent.methodology.map((step, index) => (
            <li
              key={step}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm"
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell className="bg-zinc-50 pb-16">
        <SectionHeading
          eyebrow="Stack"
          title="Tecnologias aplicadas no desenvolvimento"
          description="Escolhas tecnicas alinhadas com performance, manutencao e escalabilidade."
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {aboutContent.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white px-3 py-1.5 text-sm text-zinc-700 ring-1 ring-zinc-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
