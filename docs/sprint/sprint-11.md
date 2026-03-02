# Sprint 11 - Paginas legais e SEO base

## Objetivo

Entregar paginas legais publicas, padronizar metadata por rota e validar rotas legais no fluxo de build e ambiente `preview`.

## Escopo executado

- Frontend:
  - Pagina publica de Politica de Privacidade:
    - `src/app/politica-de-privacidade/page.tsx`
  - Pagina publica de Termos de Uso:
    - `src/app/termos-de-uso/page.tsx`
  - Template reutilizavel para paginas legais:
    - `src/components/legal/legal-page-template.tsx`
  - Links amigaveis de paginas legais no footer publico:
    - `src/components/public/public-footer.tsx`
  - Padronizacao de metadata por rota publica com helper central:
    - `src/lib/seo/public-metadata.ts`
  - Rotas atualizadas para usar metadata padronizada:
    - `src/app/page.tsx`
    - `src/app/sobre/page.tsx`
    - `src/app/contato/page.tsx`
    - `src/app/servicos/page.tsx`
    - `src/app/servicos/[slug]/page.tsx`
    - `src/app/cases/page.tsx`
    - `src/app/cases/[slug]/page.tsx`
- Backend:
  - Fonte centralizada de conteudo legal para manutencao:
    - `src/content/legal-pages.ts`
  - Service para leitura de conteudo legal:
    - `src/services/legal-pages.service.ts`
    - exportacao em `src/services/index.ts`
  - Endpoint publico para consumo de conteudo legal por slug:
    - `src/app/api/public/legal/[slug]/route.ts`
- DevOps:
  - Validacao automatizada das rotas legais em contexto `preview`:
    - `scripts/validate-legal-preview-routes.mjs`
    - comando `npm run legal:preview:validate`
  - Base canônica de metadata no layout raiz:
    - `src/app/layout.tsx` com `metadataBase` via `NEXT_PUBLIC_APP_URL`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run legal:preview:validate`

## Resultado

As paginas legais estao publicas com URLs amigaveis, metadata padronizada por rota e validacao automatizada de geracao/renderizacao no build e ambiente `preview`.
