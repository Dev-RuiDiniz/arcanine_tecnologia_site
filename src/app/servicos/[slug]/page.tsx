import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { getPublicServiceBySlug, listPublicServices } from "@/services/service-content.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await listPublicServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    return buildPublicMetadata({
      title: "Servico nao encontrado",
      description: "A pagina de servico solicitada nao foi encontrada.",
      path: `/servicos/${slug}`,
      noIndex: true,
    });
  }

  return buildPublicMetadata({
    title: service.seoTitle ?? service.name,
    description: service.seoDescription ?? service.summary,
    path: `/servicos/${service.slug}`,
  });
}

export default async function ServicoDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Servico"
          title={service.heroTitle}
          description={service.heroDescription}
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900">Entregaveis principais</h2>
          <ul className="mt-4 space-y-3">
            {service.details.map((detail) => (
              <li key={detail} className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
