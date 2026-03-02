import type { Metadata } from "next";

import { CtaLink } from "@/components/public/cta-link";
import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";
import { buildPublicMetadata } from "@/lib/seo/public-metadata";
import { loadPublicHomeContent } from "@/services/home-content.service";
import { loadPublicSiteConfig } from "@/services/site-config.service";

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: "Home",
  description:
    "Arcanine Tecnologia: desenvolvimento de sites, sistemas, automacoes, integracoes e IA aplicada com foco em resultado.",
  path: "/",
});

export default async function Home() {
  const [homeContent, siteConfig] = await Promise.all([
    loadPublicHomeContent(),
    loadPublicSiteConfig(),
  ]);
  const whatsappDigits = siteConfig.whatsapp.replace(/[^\d]/g, "");
  const whatsappLink = `https://wa.me/${whatsappDigits}`;

  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-teal-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-100 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-teal-700 uppercase">
              {homeContent.heroEyebrow}
            </p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {homeContent.heroTitle}
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg">
              {homeContent.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <CtaLink
                href="#contato"
                analyticsEvent="budget_cta_click"
                analyticsLabel="home-hero-budget"
              >
                {homeContent.ctaBudgetLabel}
              </CtaLink>
              <CtaLink
                href={whatsappLink}
                variant="secondary"
                analyticsEvent="whatsapp_click"
                analyticsLabel="home-hero-whatsapp"
              >
                {homeContent.ctaWhatsappLabel}
              </CtaLink>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500 uppercase">Status do projeto</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
              <li>✅ Sprint 1: setup base</li>
              <li>✅ Sprint 2: arquitetura backend e banco</li>
              <li>✅ Sprint 3: autenticacao admin</li>
              <li>✅ Sprint 4: RBAC e protecao</li>
              <li>✅ Sprint 5: estrutura global publica</li>
              <li>🚀 Sprint 6: Home dinamica</li>
            </ul>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="servicos" className="bg-zinc-100">
        <SectionHeading
          eyebrow="Servicos"
          title="Base pronta para escalar produto digital"
          description="Componentes e arquitetura preparados para evoluir o site institucional, CMS e captação de leads."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeContent.services.map((service) => (
            <article
              key={service}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm"
            >
              {service}
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="diferenciais" className="bg-zinc-50">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Padrao tecnico para crescimento sustentavel"
          description="Estrutura pensada para manutencao simples, deploy continuo e governanca de acesso."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {homeContent.differentials.map((differential) => (
            <div
              key={differential}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700"
            >
              {differential}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-zinc-100">
        <SectionHeading
          eyebrow="Cases em destaque"
          title="Resultados orientados a impacto de negocio"
          description="Projetos com foco em performance, integracao e conversao."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {homeContent.featuredCases.map((featuredCase) => (
            <article
              key={featuredCase.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{featuredCase.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{featuredCase.result}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredCase.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      {homeContent.showTestimonials &&
      homeContent.testimonials &&
      homeContent.testimonials.length > 0 ? (
        <SectionShell className="bg-zinc-50">
          <SectionHeading
            eyebrow="Depoimentos"
            title="Percepcao de quem ja evoluiu com a Arcanine"
            description="Bloco opcional habilitado via configuracao dinamica da Home."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {homeContent.testimonials.map((testimonial) => (
              <article
                key={`${testimonial.author}-${testimonial.role}`}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <p className="text-sm text-zinc-700">&quot;{testimonial.quote}&quot;</p>
                <p className="mt-4 text-sm font-semibold text-zinc-900">{testimonial.author}</p>
                <p className="text-xs text-zinc-500">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      ) : null}

      <SectionShell id="contato" className="bg-zinc-100 pb-16">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <SectionHeading
            eyebrow="Contato"
            title="Pronto para iniciar o projeto?"
            description="Use os canais diretos para solicitar orcamento ou iniciar atendimento no WhatsApp."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink
              href={whatsappLink}
              analyticsEvent="whatsapp_click"
              analyticsLabel="home-contact-whatsapp"
            >
              {homeContent.ctaWhatsappLabel}
            </CtaLink>
            <CtaLink
              href="#servicos"
              variant="secondary"
              analyticsEvent="budget_cta_click"
              analyticsLabel="home-contact-budget"
            >
              {homeContent.ctaBudgetLabel}
            </CtaLink>
          </div>
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
