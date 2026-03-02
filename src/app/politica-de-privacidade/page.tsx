import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { loadLegalPageBySlug } from "@/services/legal-pages.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Politica de Privacidade",
  description:
    "Informacoes sobre coleta, uso e protecao de dados pessoais nos canais digitais da Arcanine Tecnologia.",
  path: "/politica-de-privacidade",
});

export default async function PoliticaDePrivacidadePage() {
  const content = await loadLegalPageBySlug("politica-de-privacidade");
  return <LegalPageTemplate content={content} />;
}
