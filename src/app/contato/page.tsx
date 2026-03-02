import type { Metadata } from "next";

import { BudgetRequestForm } from "@/components/contact/budget-request-form";
import { ContactForm } from "@/components/contact/contact-form";
import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { resolveLeadAttachmentLimits } from "@/lib/env/upload-limits";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { loadPublicSiteConfig } from "@/services/site-config.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Contato",
  description:
    "Entre em contato com a Arcanine Tecnologia por formulario, WhatsApp ou e-mail para iniciar seu projeto.",
  path: "/contato",
});

export default async function ContatoPage() {
  const siteInfo = await loadPublicSiteConfig();
  const attachmentLimits = resolveLeadAttachmentLimits();
  const whatsappDigits = siteInfo.whatsapp.replace(/[^\d]/g, "");
  const whatsappLink = `https://wa.me/${whatsappDigits}`;

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Contato"
          title="Vamos conversar sobre seu projeto"
          description="Preencha o formulario ou use os canais diretos para falar com nosso time."
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-2">
            <ContactForm />
            <BudgetRequestForm
              maxAttachmentSizeMb={attachmentLimits.maxSizeMb}
              allowedAttachmentMimeTypes={attachmentLimits.allowedMimeTypes}
            />
          </div>

          <aside className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Canais diretos</h2>
              <p className="mt-3 text-sm text-zinc-700">E-mail: {siteInfo.email}</p>
              <p className="mt-1 text-sm text-zinc-700">Telefone: {siteInfo.phone}</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Falar no WhatsApp
              </a>
            </article>

            <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Endereco</h2>
              <p className="mt-3 text-sm text-zinc-700">{siteInfo.address.street}</p>
              <p className="text-sm text-zinc-700">
                {siteInfo.address.city} - {siteInfo.address.state}
              </p>
              <p className="text-sm text-zinc-700">
                {siteInfo.address.zipCode} - {siteInfo.address.country}
              </p>
            </article>
          </aside>
        </div>
      </SectionShell>

      {siteInfo.mapEmbedUrl ? (
        <SectionShell className="bg-zinc-50 pb-16">
          <SectionHeading
            eyebrow="Mapa"
            title="Localizacao"
            description="Bloco opcional habilitado quando `SITE_MAP_EMBED_URL` estiver configurado."
          />
          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <iframe
              title="Mapa de localizacao"
              src={siteInfo.mapEmbedUrl}
              loading="lazy"
              className="h-80 w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </SectionShell>
      ) : null}
    </PublicLayout>
  );
}
