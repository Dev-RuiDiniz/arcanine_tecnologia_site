"use client";

import { useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/lib/api/contracts";
import type { AboutContentInput } from "@/schemas/public/about-content";
import type { HomeContentInput } from "@/schemas/public/home-content";
import type { ServiceContentInput } from "@/schemas/public/service-content";

type CmsPageSlug = "home" | "sobre" | "servicos";

type ServicesCmsContent = {
  services: ServiceContentInput[];
};

type CmsPageData = {
  id: string;
  slug: CmsPageSlug;
  title: string;
  description?: string;
  published: boolean;
  content: unknown;
  updatedAt: string;
};

type CmsPagesEditorProps = {
  initialPages: CmsPageData[];
};

const defaultHomeContent: HomeContentInput = {
  heroEyebrow: "Engenharia digital",
  heroTitle: "Site corporativo premium para acelerar leads e autoridade digital.",
  heroDescription:
    "Entrega rapida com foco em performance, SEO forte e base administrativa para evolucao continua.",
  ctaBudgetLabel: "Solicitar orcamento",
  ctaWhatsappLabel: "Falar no WhatsApp",
  services: [],
  differentials: [],
  featuredCases: [],
  testimonials: [],
  showTestimonials: true,
};

const defaultAboutContent: AboutContentInput = {
  title: "Sobre a Arcanine Tecnologia",
  subtitle: "",
  historyTitle: "Historia",
  historyText: "",
  values: [],
  methodology: [],
  stack: [],
};

const defaultServiceContent: ServiceContentInput = {
  slug: "novo-servico",
  name: "Novo servico",
  summary: "",
  heroTitle: "",
  heroDescription: "",
  details: [],
  seoTitle: "",
  seoDescription: "",
  published: true,
};

const defaultServicesContent: ServicesCmsContent = {
  services: [defaultServiceContent],
};

const parseStringList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const toStringList = (value: string[]) => value.join("\n");

const asHomeContent = (input: unknown): HomeContentInput => {
  if (!input || typeof input !== "object") {
    return defaultHomeContent;
  }

  const content = input as Partial<HomeContentInput>;
  return {
    ...defaultHomeContent,
    ...content,
    services: Array.isArray(content.services) ? content.services : [],
    differentials: Array.isArray(content.differentials) ? content.differentials : [],
    featuredCases: Array.isArray(content.featuredCases) ? content.featuredCases : [],
    testimonials: Array.isArray(content.testimonials) ? content.testimonials : [],
  };
};

const asAboutContent = (input: unknown): AboutContentInput => {
  if (!input || typeof input !== "object") {
    return defaultAboutContent;
  }

  const content = input as Partial<AboutContentInput>;
  return {
    ...defaultAboutContent,
    ...content,
    values: Array.isArray(content.values) ? content.values : [],
    methodology: Array.isArray(content.methodology) ? content.methodology : [],
    stack: Array.isArray(content.stack) ? content.stack : [],
  };
};

const asServicesContent = (input: unknown): ServicesCmsContent => {
  if (!input || typeof input !== "object") {
    return defaultServicesContent;
  }

  const content = input as Partial<ServicesCmsContent>;
  const services = Array.isArray(content.services)
    ? content.services.map((service) => ({
        ...defaultServiceContent,
        ...service,
        details: Array.isArray(service.details) ? service.details : [],
      }))
    : [defaultServiceContent];

  return { services };
};

export const CmsPagesEditor = ({ initialPages }: CmsPagesEditorProps) => {
  const [pages, setPages] = useState<CmsPageData[]>(initialPages);
  const [selectedSlug, setSelectedSlug] = useState<CmsPageSlug>("home");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [drafts, setDrafts] = useState<{
    home: HomeContentInput;
    sobre: AboutContentInput;
    servicos: ServicesCmsContent;
  }>({
    home: defaultHomeContent,
    sobre: defaultAboutContent,
    servicos: defaultServicesContent,
  });

  useEffect(() => {
    const nextDrafts = {
      home: defaultHomeContent,
      sobre: defaultAboutContent,
      servicos: defaultServicesContent,
    };

    for (const page of pages) {
      if (page.slug === "home") {
        nextDrafts.home = asHomeContent(page.content);
      }
      if (page.slug === "sobre") {
        nextDrafts.sobre = asAboutContent(page.content);
      }
      if (page.slug === "servicos") {
        nextDrafts.servicos = asServicesContent(page.content);
      }
    }

    setDrafts(nextDrafts);
  }, [pages]);

  const currentPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug) || pages[0],
    [pages, selectedSlug],
  );

  const refreshPages = async () => {
    const response = await fetch("/api/admin/pages", {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json()) as ApiResult<CmsPageData[]>;
    if (!response.ok || !payload.ok) {
      throw new Error(payload.ok ? "Erro ao carregar paginas do CMS." : payload.error);
    }
    setPages(payload.data);
  };

  const saveDraft = async () => {
    if (!currentPage) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    setIsError(false);

    try {
      const content =
        selectedSlug === "home"
          ? drafts.home
          : selectedSlug === "sobre"
            ? drafts.sobre
            : drafts.servicos;

      const response = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
          title: currentPage.title,
          description: currentPage.description,
          content,
        }),
      });

      const payload = (await response.json()) as ApiResult<CmsPageData>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao salvar rascunho." : payload.error);
        return;
      }

      await refreshPages();
      setFeedback("Rascunho salvo com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao salvar rascunho.");
    } finally {
      setLoading(false);
    }
  };

  const publishPage = async () => {
    setLoading(true);
    setFeedback(null);
    setIsError(false);

    try {
      await saveDraft();

      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
        }),
      });
      const payload = (await response.json()) as ApiResult<CmsPageData>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao publicar pagina." : payload.error);
        return;
      }

      await refreshPages();
      setFeedback("Pagina publicada com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao publicar pagina.");
    } finally {
      setLoading(false);
    }
  };

  const updateHome = (patch: Partial<HomeContentInput>) =>
    setDrafts((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        ...patch,
      },
    }));

  const updateAbout = (patch: Partial<AboutContentInput>) =>
    setDrafts((prev) => ({
      ...prev,
      sobre: {
        ...prev.sobre,
        ...patch,
      },
    }));

  const updateService = (index: number, patch: Partial<ServiceContentInput>) =>
    setDrafts((prev) => ({
      ...prev,
      servicos: {
        services: prev.servicos.services.map((service, serviceIndex) =>
          serviceIndex === index
            ? {
                ...service,
                ...patch,
              }
            : service,
        ),
      },
    }));

  const addService = () =>
    setDrafts((prev) => ({
      ...prev,
      servicos: {
        services: [...prev.servicos.services, defaultServiceContent],
      },
    }));

  const removeService = (index: number) =>
    setDrafts((prev) => ({
      ...prev,
      servicos: {
        services: prev.servicos.services.filter((_, serviceIndex) => serviceIndex !== index),
      },
    }));

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">CMS de paginas</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Edicao estruturada de Home, Sobre e Servicos com fluxo de preview antes de publicar.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["home", "sobre", "servicos"] as const).map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => setSelectedSlug(slug)}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              selectedSlug === slug
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {slug}
          </button>
        ))}
      </div>

      {selectedSlug === "home" ? (
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Home</h3>
          <input
            value={drafts.home.heroEyebrow}
            onChange={(event) => updateHome({ heroEyebrow: event.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Eyebrow"
          />
          <input
            value={drafts.home.heroTitle}
            onChange={(event) => updateHome({ heroTitle: event.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Titulo principal"
          />
          <textarea
            value={drafts.home.heroDescription}
            onChange={(event) => updateHome({ heroDescription: event.target.value })}
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Descricao"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <textarea
              value={toStringList(drafts.home.services)}
              onChange={(event) => updateHome({ services: parseStringList(event.target.value) })}
              className="min-h-28 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Servicos (um por linha)"
            />
            <textarea
              value={toStringList(drafts.home.differentials)}
              onChange={(event) =>
                updateHome({ differentials: parseStringList(event.target.value) })
              }
              className="min-h-28 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Diferenciais (um por linha)"
            />
          </div>
        </article>
      ) : null}

      {selectedSlug === "sobre" ? (
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Sobre</h3>
          <input
            value={drafts.sobre.title}
            onChange={(event) => updateAbout({ title: event.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <textarea
            value={drafts.sobre.subtitle}
            onChange={(event) => updateAbout({ subtitle: event.target.value })}
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Subtitulo"
          />
          <input
            value={drafts.sobre.historyTitle}
            onChange={(event) => updateAbout({ historyTitle: event.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Titulo da historia"
          />
          <textarea
            value={drafts.sobre.historyText}
            onChange={(event) => updateAbout({ historyText: event.target.value })}
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Historia"
          />
          <div className="grid gap-3 md:grid-cols-3">
            <textarea
              value={toStringList(drafts.sobre.values)}
              onChange={(event) => updateAbout({ values: parseStringList(event.target.value) })}
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Valores (um por linha)"
            />
            <textarea
              value={toStringList(drafts.sobre.methodology)}
              onChange={(event) =>
                updateAbout({ methodology: parseStringList(event.target.value) })
              }
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Metodologia (um por linha)"
            />
            <textarea
              value={toStringList(drafts.sobre.stack)}
              onChange={(event) => updateAbout({ stack: parseStringList(event.target.value) })}
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Stack (um por linha)"
            />
          </div>
        </article>
      ) : null}

      {selectedSlug === "servicos" ? (
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Servicos</h3>
            <button
              type="button"
              onClick={addService}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Adicionar servico
            </button>
          </div>
          <div className="space-y-3">
            {drafts.servicos.services.map((service, index) => (
              <div key={`${service.slug}-${index}`} className="space-y-2 rounded-md border p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={service.slug}
                    onChange={(event) => updateService(index, { slug: event.target.value })}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    placeholder="slug"
                  />
                  <input
                    value={service.name}
                    onChange={(event) => updateService(index, { name: event.target.value })}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    placeholder="nome"
                  />
                </div>
                <textarea
                  value={service.summary}
                  onChange={(event) => updateService(index, { summary: event.target.value })}
                  className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="resumo"
                />
                <input
                  value={service.heroTitle}
                  onChange={(event) => updateService(index, { heroTitle: event.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="titulo hero"
                />
                <textarea
                  value={service.heroDescription}
                  onChange={(event) =>
                    updateService(index, { heroDescription: event.target.value })
                  }
                  className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="descricao hero"
                />
                <textarea
                  value={toStringList(service.details)}
                  onChange={(event) =>
                    updateService(index, { details: parseStringList(event.target.value) })
                  }
                  className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="detalhes (um por linha)"
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={service.seoTitle || ""}
                    onChange={(event) => updateService(index, { seoTitle: event.target.value })}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    placeholder="seo title"
                  />
                  <input
                    value={service.seoDescription || ""}
                    onChange={(event) =>
                      updateService(index, { seoDescription: event.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    placeholder="seo description"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-xs text-zinc-600">
                    <input
                      type="checkbox"
                      checked={service.published}
                      onChange={(event) =>
                        updateService(index, { published: event.target.checked })
                      }
                    />
                    publicado
                  </label>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveDraft}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-70"
        >
          {loading ? "Processando..." : "Salvar rascunho"}
        </button>
        <button
          type="button"
          onClick={publishPage}
          disabled={loading}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-70"
        >
          Publicar
        </button>
        <button
          type="button"
          onClick={() => setPreviewEnabled((prev) => !prev)}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          {previewEnabled ? "Ocultar preview" : "Exibir preview"}
        </button>
      </div>

      {feedback ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback}
        </p>
      ) : null}

      {previewEnabled ? (
        <section className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4">
          <h4 className="text-sm font-semibold text-zinc-900">Preview ({selectedSlug})</h4>
          {selectedSlug === "home" ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-zinc-500 uppercase">{drafts.home.heroEyebrow}</p>
              <h5 className="text-lg font-semibold text-zinc-900">{drafts.home.heroTitle}</h5>
              <p className="text-sm text-zinc-600">{drafts.home.heroDescription}</p>
            </div>
          ) : null}
          {selectedSlug === "sobre" ? (
            <div className="mt-3 space-y-2">
              <h5 className="text-lg font-semibold text-zinc-900">{drafts.sobre.title}</h5>
              <p className="text-sm text-zinc-600">{drafts.sobre.subtitle}</p>
              <p className="text-sm text-zinc-700">{drafts.sobre.historyText}</p>
            </div>
          ) : null}
          {selectedSlug === "servicos" ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {drafts.servicos.services.map((service, index) => (
                <article key={`${service.slug}-preview-${index}`} className="rounded border p-3">
                  <h5 className="text-sm font-semibold text-zinc-900">{service.name}</h5>
                  <p className="mt-1 text-xs text-zinc-600">{service.summary}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
};
