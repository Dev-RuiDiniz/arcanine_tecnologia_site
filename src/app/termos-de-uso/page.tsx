import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { loadLegalPageBySlug } from "@/services/legal-pages.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Termos de Uso",
  description:
    "Regras e condicoes de uso dos conteudos e servicos digitais disponibilizados pela Arcanine Tecnologia.",
  path: "/termos-de-uso",
});

export default async function TermosDeUsoPage() {
  const content = await loadLegalPageBySlug("termos-de-uso");
  return <LegalPageTemplate content={content} />;
}
