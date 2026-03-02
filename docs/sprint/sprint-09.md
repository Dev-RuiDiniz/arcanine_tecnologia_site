# Sprint 09 - Portfolio/Cases publico

## Objetivo

Implementar o portfolio publico com listagem e detalhe de cases, incluindo resultados, stack, imagens, bloco opcional de depoimento e base dinamica para CMS.

## Escopo executado

- Frontend:
  - Pagina de listagem de cases:
    - `src/app/cases/page.tsx`
  - Pagina de detalhe por slug:
    - `src/app/cases/[slug]/page.tsx`
  - Conteudo exibido no detalhe:
    - desafio
    - solucao
    - resultados
    - stack
    - galeria de imagens
  - Bloco opcional de depoimento por case:
    - controlado por `showTestimonial`
  - Navegacao publica atualizada para rota de cases:
    - `src/components/public/public-header.tsx`
- Backend:
  - Modelo de dados de case para CMS interno:
    - `CaseContent` em `prisma/schema.prisma`
    - migracao `prisma/migrations/20260302191500_cases_content/migration.sql`
  - Schema de validacao:
    - `src/schemas/public/case-content.ts`
  - Service com consultas publicas por lista/slug:
    - `src/services/case-content.service.ts`
  - Endpoints publicos:
    - `GET /api/public/cases`
    - `GET /api/public/cases/[slug]`
  - Endpoint admin para edicao (RBAC):
    - `GET/POST /api/admin/cases`
  - Server Actions para CMS interno:
    - `src/actions/admin/case-content.ts`
- DevOps:
  - Estrategia de CDN para imagens de case:
    - helper de URLs: `src/lib/cdn/case-images.ts`
    - base configuravel via `CASES_CDN_BASE_URL` em `.env.example`
  - Otimizacao do `next/image` para CDN:
    - `remotePatterns` em `next.config.ts`
    - `minimumCacheTTL` configurado
  - Validacao automatizada de entrega por CDN:
    - `scripts/validate-cases-cdn-delivery.mjs`
    - comando: `npm run cases:cdn:validate`

## Validacao de CDN

- Resultado:
  - `CDN delivery validation passed for 2 case(s).`

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`
- `npm run cases:cdn:validate`

## Resultado

Portfolio/Cases publico entregue com base de dados editavel, SEO por rota e entrega de imagens otimizada com estrategia de CDN.
