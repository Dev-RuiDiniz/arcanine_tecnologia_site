import type { Metadata } from "next";
import Link from "next/link";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { listPublicServices } from "@/services/service-content.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Servicos",
  description:
    "Conheca os servicos da Arcanine Tecnologia: sites institucionais, sistemas web, automacoes, integracoes e IA aplicada.",
  path: "/servicos",
});

export default async function ServicosPage() {
  const services = await listPublicServices();

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Servicos"
          title="Solucoes digitais para operacao, escala e conversao"
          description="Cada servico possui pagina dedicada com contexto de aplicacao, entregaveis e proposta de valor."
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{service.name}</h2>
              <p className="mt-2 text-sm text-zinc-600">{service.summary}</p>
              <Link
                href={`/servicos/${service.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-600"
              >
                Ver detalhes
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
