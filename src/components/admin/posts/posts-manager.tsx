"use client";

import { useEffect, useMemo, useState } from "react";

import type { ApiResult } from "@/lib/api/contracts";
import { RichTextEditor } from "@/components/admin/posts/rich-text-editor";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  contentHtml: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
  category?: {
    id: string;
    slug: string;
    name: string;
  };
  tags: {
    id: string;
    slug: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

type PostDraft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  contentHtml: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryName: string;
  categorySlug: string;
  tagsRaw: string;
};

const emptyDraft = (): PostDraft => ({
  slug: "novo-artigo",
  title: "",
  excerpt: "",
  coverImageUrl: "",
  contentHtml: "<p>Escreva o conteudo do artigo...</p>",
  status: "DRAFT",
  categoryName: "Geral",
  categorySlug: "geral",
  tagsRaw: "",
});

const parseTags = (raw: string) => {
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      slug: name
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
    }));
};

const toDraft = (post: BlogPost): PostDraft => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  coverImageUrl: post.coverImageUrl || "",
  contentHtml: post.contentHtml,
  status: post.status,
  categoryName: post.category?.name || "Geral",
  categorySlug: post.category?.slug || "geral",
  tagsRaw: post.tags.map((tag) => tag.name).join(", "),
});

type PostsManagerProps = {
  initialPosts: BlogPost[];
};

export const PostsManager = ({ initialPosts }: PostsManagerProps) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedId, setSelectedId] = useState<string>(initialPosts[0]?.id || "new");
  const [draft, setDraft] = useState<PostDraft>(
    initialPosts[0] ? toDraft(initialPosts[0]) : emptyDraft(),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedId === "new") {
      setDraft(emptyDraft());
      return;
    }
    const selected = posts.find((post) => post.id === selectedId);
    if (selected) {
      setDraft(toDraft(selected));
    }
  }, [selectedId, posts]);

  const preview = useMemo(() => ({ ...draft, tags: parseTags(draft.tagsRaw) }), [draft]);

  const refreshPosts = async () => {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    const payload = (await response.json()) as ApiResult<BlogPost[]>;
    if (!response.ok || !payload.ok) {
      throw new Error(payload.ok ? "Falha ao carregar posts." : payload.error);
    }
    setPosts(payload.data);
  };

  const save = async () => {
    setLoading(true);
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          slug: draft.slug,
          title: draft.title,
          excerpt: draft.excerpt,
          coverImageUrl: draft.coverImageUrl || undefined,
          contentHtml: draft.contentHtml,
          status: draft.status,
          categoryName: draft.categoryName,
          categorySlug: draft.categorySlug,
          tags: parseTags(draft.tagsRaw),
        }),
      });
      const payload = (await response.json()) as ApiResult<BlogPost>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao salvar post." : payload.error);
        return;
      }
      await refreshPosts();
      setSelectedId(payload.data.id);
      setFeedback("Post salvo com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao salvar post.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!draft.id) {
      setSelectedId("new");
      setDraft(emptyDraft());
      return;
    }
    setLoading(true);
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id }),
      });
      const payload = (await response.json()) as ApiResult<{ deleted: true }>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao excluir post." : payload.error);
        return;
      }
      await refreshPosts();
      setSelectedId("new");
      setDraft(emptyDraft());
      setFeedback("Post removido com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao excluir post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Admin de posts</h2>
        <p className="mt-1 text-sm text-zinc-600">
          CRUD de artigos com capa, status de publicacao e editor rich text com sanitizacao.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedId("new")}
          className={`rounded-md border px-3 py-2 text-sm font-medium ${
            selectedId === "new"
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-700"
          }`}
        >
          Novo post
        </button>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedId(post.id)}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              selectedId === post.id
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700"
            }`}
          >
            {post.slug}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={draft.slug}
              onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="slug"
            />
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as PostDraft["status"],
                }))
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
          </div>
          <input
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="titulo"
          />
          <textarea
            value={draft.excerpt}
            onChange={(event) => setDraft((prev) => ({ ...prev, excerpt: event.target.value }))}
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="resumo do artigo"
          />
          <input
            value={draft.coverImageUrl}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, coverImageUrl: event.target.value }))
            }
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="url da capa"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={draft.categoryName}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, categoryName: event.target.value }))
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="categoria nome"
            />
            <input
              value={draft.categorySlug}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, categorySlug: event.target.value }))
              }
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="categoria slug"
            />
          </div>
          <input
            value={draft.tagsRaw}
            onChange={(event) => setDraft((prev) => ({ ...prev, tagsRaw: event.target.value }))}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="tags separadas por virgula"
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-zinc-700">Conteudo (rich text)</p>
            <RichTextEditor
              value={draft.contentHtml}
              onChange={(next) => setDraft((prev) => ({ ...prev, contentHtml: next }))}
            />
          </div>
        </article>

        <aside className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Preview rapido</h3>
          <p className="text-xs text-zinc-500 uppercase">{preview.categoryName}</p>
          <h4 className="text-lg font-semibold text-zinc-900">
            {preview.title || "Titulo do artigo"}
          </h4>
          <p className="text-sm text-zinc-600">{preview.excerpt || "Resumo do artigo..."}</p>
          {preview.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.coverImageUrl}
              alt={preview.title || "Capa do artigo"}
              className="h-36 w-full rounded-md object-cover"
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {preview.tags.map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-70"
        >
          {loading ? "Processando..." : "Salvar post"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={loading}
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-70"
        >
          Excluir post
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
