import { CtaLink } from "@/components/public/cta-link";
import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";

const services = [
  "Sites institucionais premium",
  "Sistemas web sob demanda",
  "Automacoes de processo",
  "Integrações e APIs",
  "IA aplicada ao negocio",
];

const differentials = [
  "Arquitetura orientada a performance",
  "SEO tecnico desde a primeira entrega",
  "Painel administrativo com governanca",
  "Design responsivo mobile-first",
];

export default async function Home() {
  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-teal-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-100 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-teal-700 uppercase">
              Engenharia digital
            </p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Site corporativo premium para acelerar leads e autoridade digital.
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg">
              Entrega rapida com foco em performance, SEO forte e base administrativa para evolucao
              continua.
            </p>
            <div className="flex flex-wrap gap-3">
              <CtaLink href="#contato">Solicitar orcamento</CtaLink>
              <CtaLink href="/admin/login" variant="secondary">
                Acessar painel
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
              <li>🚀 Sprint 5: estrutura global publica</li>
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
          {services.map((service) => (
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
          {differentials.map((differential) => (
            <div
              key={differential}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700"
            >
              {differential}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="contato" className="bg-zinc-100 pb-16">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <SectionHeading
            eyebrow="Contato"
            title="Pronto para iniciar o projeto?"
            description="Use o painel para operacao interna ou siga para o fluxo de orcamento nas proximas sprints."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink href="/admin/login">Entrar no admin</CtaLink>
            <CtaLink href="#servicos" variant="secondary">
              Ver servicos
            </CtaLink>
          </div>
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
