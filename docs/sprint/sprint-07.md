# Sprint 07 - Sobre

## Objetivo

Implementar a pagina Sobre com conteudo institucional completo e preparar sua estrutura dinamica para edicao via CMS interno.

## Escopo executado

- Frontend:
  - Pagina `/sobre` implementada com secoes de:
    - Historia
    - Valores
    - Metodologia
    - Stack
  - Arquivo: `src/app/sobre/page.tsx`
  - Navegacao publica atualizada com link para `/sobre`:
    - `src/components/public/public-header.tsx`
- Backend:
  - Modelagem de conteudo editavel da pagina Sobre:
    - modelo `AboutContent` em `prisma/schema.prisma`
    - migracao `prisma/migrations/20260302173500_about_content/migration.sql`
  - Schema de validacao:
    - `src/schemas/public/about-content.ts`
  - Service de leitura publica com fallback e upsert para CMS:
    - `src/services/about-content.service.ts`
  - Endpoints:
    - publico: `GET /api/public/about-content` em `src/app/api/public/about-content/route.ts`
    - admin: `GET/POST /api/admin/about-content` em `src/app/api/admin/about-content/route.ts`
  - Server Actions para integracao futura do CMS:
    - `src/actions/admin/about-content.ts`
- DevOps:
  - Script de validacao de carregamento/performance em `dev` e `preview` (simulados por `VERCEL_ENV`):
    - `scripts/validate-about-envs.mjs`
    - comando: `npm run about:validate-envs`

## Validacao de carregamento e performance

- Execucao em ambiente `development` (simulado):
  - avg: **17.4ms**
  - min: **10.4ms**
  - max: **22.9ms**
- Execucao em ambiente `preview` (simulado):
  - avg: **9.1ms**
  - min: **5.2ms**
  - max: **13.6ms**

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`
- `npm run about:validate-envs`

## Resultado

A pagina Sobre ficou funcional, responsiva e pronta para evolucao por CMS interno sem alterar a estrutura de frontend.
