"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/lib/api/contracts";

type MediaAsset = {
  id: string;
  provider: string;
  storageKey: string;
  url: string;
  optimizedUrl: string;
  bytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  createdAt: string;
  updatedAt: string;
};

type AdminCase = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  ctaLabel?: string;
  ctaUrl?: string;
  results: string[];
  stack: string[];
  imageUrls: string[];
  mediaIds: string[];
  media: MediaAsset[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  showTestimonial: boolean;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  updatedAt: string;
};

type CasesMediaManagerProps = {
  initialCases: AdminCase[];
  initialMedia: MediaAsset[];
};

const emptyCaseDraft = (): AdminCase => ({
  id: "",
  slug: "novo-case",
  title: "",
  summary: "",
  challenge: "",
  solution: "",
  ctaLabel: "",
  ctaUrl: "",
  results: ["", ""],
  stack: ["", ""],
  imageUrls: [],
  mediaIds: [],
  media: [],
  showTestimonial: false,
  published: false,
  updatedAt: new Date().toISOString(),
});

const parseList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const toList = (value: string[]) => value.join("\n");

export const CasesMediaManager = ({ initialCases, initialMedia }: CasesMediaManagerProps) => {
  const [cases, setCases] = useState<AdminCase[]>(initialCases);
  const [media, setMedia] = useState<MediaAsset[]>(initialMedia);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCases[0]?.id || "new");
  const [draft, setDraft] = useState<AdminCase>(initialCases[0] || emptyCaseDraft());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedCaseId === "new") {
      setDraft(emptyCaseDraft());
      return;
    }
    const selected = cases.find((item) => item.id === selectedCaseId);
    if (selected) {
      setDraft(selected);
    }
  }, [selectedCaseId, cases]);

  const selectedMedia = useMemo(
    () => media.filter((item) => draft.mediaIds.includes(item.id)),
    [media, draft.mediaIds],
  );

  const refresh = async () => {
    const [casesResponse, mediaResponse] = await Promise.all([
      fetch("/api/admin/cases", { cache: "no-store" }),
      fetch("/api/admin/media", { cache: "no-store" }),
    ]);
    const casesPayload = (await casesResponse.json()) as ApiResult<AdminCase[]>;
    const mediaPayload = (await mediaResponse.json()) as ApiResult<MediaAsset[]>;

    if (!casesResponse.ok || !casesPayload.ok) {
      throw new Error(casesPayload.ok ? "Falha ao carregar cases." : casesPayload.error);
    }
    if (!mediaResponse.ok || !mediaPayload.ok) {
      throw new Error(mediaPayload.ok ? "Falha ao carregar midias." : mediaPayload.error);
    }

    setCases(casesPayload.data);
    setMedia(mediaPayload.data);
  };

  const saveCase = async () => {
    setLoading(true);
    setFeedback(null);
    setIsError(false);

    try {
      const response = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          id: draft.id || undefined,
          ctaLabel: draft.ctaLabel || undefined,
          ctaUrl: draft.ctaUrl || undefined,
          results: draft.results.filter(Boolean),
          stack: draft.stack.filter(Boolean),
        }),
      });
      const payload = (await response.json()) as ApiResult<AdminCase>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao salvar case." : payload.error);
        return;
      }

      await refresh();
      setSelectedCaseId(payload.data.id);
      setFeedback("Case salvo com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao salvar case.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCase = async () => {
    if (!draft.id) {
      setSelectedCaseId("new");
      setDraft(emptyCaseDraft());
      return;
    }

    setLoading(true);
    setFeedback(null);
    setIsError(false);

    try {
      const response = await fetch("/api/admin/cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id }),
      });
      const payload = (await response.json()) as ApiResult<{ deleted: true }>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao excluir case." : payload.error);
        return;
      }

      await refresh();
      setSelectedCaseId("new");
      setDraft(emptyCaseDraft());
      setFeedback("Case removido com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao excluir case.");
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file: File) => {
    setUploading(true);
    setFeedback(null);
    setIsError(false);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("altText", file.name);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as ApiResult<MediaAsset>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao enviar midia." : payload.error);
        return;
      }

      await refresh();
      setDraft((prev) => ({
        ...prev,
        mediaIds: [payload.data.id, ...prev.mediaIds],
      }));
      setFeedback("Midia enviada com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao enviar midia.");
    } finally {
      setUploading(false);
    }
  };

  const toggleMediaSelection = (mediaId: string) => {
    setDraft((prev) => ({
      ...prev,
      mediaIds: prev.mediaIds.includes(mediaId)
        ? prev.mediaIds.filter((item) => item !== mediaId)
        : [...prev.mediaIds, mediaId],
    }));
  };

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Admin de cases e midia</h2>
        <p className="mt-1 text-sm text-zinc-600">
          CRUD de cases com desafio, solucao, resultados, CTA e associacao de imagens pela
          biblioteca de midia.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCaseId("new")}
          className={`rounded-md border px-3 py-2 text-sm font-medium ${
            selectedCaseId === "new"
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          Novo case
        </button>
        {cases.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCaseId(item.id)}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              selectedCaseId === item.id
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {item.slug}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Dados do case</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={draft.slug}
              onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="slug"
            />
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="titulo"
            />
          </div>
          <textarea
            value={draft.summary}
            onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="resumo"
          />
          <textarea
            value={draft.challenge}
            onChange={(event) => setDraft((prev) => ({ ...prev, challenge: event.target.value }))}
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="desafio"
          />
          <textarea
            value={draft.solution}
            onChange={(event) => setDraft((prev) => ({ ...prev, solution: event.target.value }))}
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="solucao"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={draft.ctaLabel || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, ctaLabel: event.target.value }))}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="label CTA"
            />
            <input
              value={draft.ctaUrl || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, ctaUrl: event.target.value }))}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="url CTA"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <textarea
              value={toList(draft.results)}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, results: parseList(event.target.value) }))
              }
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="resultados (um por linha)"
            />
            <textarea
              value={toList(draft.stack)}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, stack: parseList(event.target.value) }))
              }
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="stack (um por linha)"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, published: event.target.checked }))
              }
            />
            Publicado
          </label>
        </article>

        <aside className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Biblioteca de midia</h3>
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-600">Upload de imagem</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadMedia(file);
                }
              }}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid max-h-96 gap-2 overflow-auto sm:grid-cols-2">
            {media.map((asset) => (
              <button
                type="button"
                key={asset.id}
                onClick={() => toggleMediaSelection(asset.id)}
                className={`rounded-md border p-2 text-left ${
                  draft.mediaIds.includes(asset.id)
                    ? "border-zinc-900 bg-zinc-900/5"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <img
                  src={asset.optimizedUrl}
                  alt={asset.altText || asset.storageKey}
                  className="h-20 w-full rounded object-cover"
                />
                <p className="mt-1 truncate text-[11px] text-zinc-600">{asset.storageKey}</p>
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-700">Galeria associada ao case</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {selectedMedia.map((asset) => (
                <img
                  key={`selected-${asset.id}`}
                  src={asset.optimizedUrl}
                  alt={asset.altText || asset.storageKey}
                  className="h-24 w-full rounded border border-zinc-200 object-cover"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveCase}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-70"
        >
          {loading ? "Salvando..." : "Salvar case"}
        </button>
        <button
          type="button"
          onClick={deleteCase}
          disabled={loading}
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-70"
        >
          Excluir case
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
    </section>
  );
};
