# Sprint 17 - Blog/Insights e admin de posts

## Objetivo

Entregar modulo de Blog/Insights com listagem publica, filtros, busca e pagina de artigo, junto com painel admin para CRUD de posts com capa/status e editor rich text sanitizado.

## Escopo executado

- Frontend publico:
  - Listagem de artigos em `/insights` com:
    - filtro por categoria
    - filtro por tag
    - busca por texto
  - Pagina de artigo em `/insights/[slug]`.
  - Metadata/SEO por rota de blog.
  - Arquivos:
    - `src/app/insights/page.tsx`
    - `src/app/insights/[slug]/page.tsx`
    - `src/components/public/public-header.tsx` (link Insights no menu)
- Frontend admin:
  - Tela `/admin/posts` para CRUD de posts com:
    - capa (`coverImageUrl`)
    - status (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
    - categoria
    - tags
    - preview rapido
  - Editor rich text com Tiptap:
    - `src/components/admin/posts/rich-text-editor.tsx`
    - `src/components/admin/posts/posts-manager.tsx`
    - `src/app/admin/posts/page.tsx`
  - Navegacao e RBAC de rota admin para posts:
    - `src/components/admin/admin-nav.tsx`
    - `src/lib/auth/rbac.ts`
- Backend:
  - Modelos de blog:
    - `posts`
    - `categories`
    - `tags`
    - `post_tags`
  - Operacoes de publicacao e CRUD admin de posts:
    - `src/services/post.service.ts`
    - `src/app/api/admin/posts/route.ts`
  - APIs publicas de blog:
    - `src/app/api/public/posts/route.ts`
    - `src/app/api/public/posts/[slug]/route.ts`
  - Sanitizacao de rich text salvo:
    - `src/lib/content/sanitize-rich-text.ts`
  - Schema/admin e blog:
    - `src/schemas/admin/post-admin.ts`
    - `src/schemas/blog/post.ts`
    - `src/schemas/index.ts`
  - Export de service:
    - `src/services/index.ts`
- DevOps:
  - Migration e versionamento de schema para modelos de blog:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260303001500_blog_posts_models/migration.sql`
  - Validacao de indexacao e performance do blog em `preview`:
    - `scripts/validate-blog-preview-indexability.mjs`
    - comando `npm run blog:preview:indexability:validate`

## Dependencias adicionadas

- `@tiptap/react`
- `@tiptap/starter-kit`
- `sanitize-html`
- `@types/sanitize-html` (dev)

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run blog:preview:indexability:validate`

## Resultado

O projeto agora possui Blog/Insights completo com navegacao publica e filtros, mais painel administrativo para gestao de posts com editor rich text sanitizado e fluxo de status/publicacao. As paginas de blog passaram por validacao automatizada de indexacao/performance em `preview`.
