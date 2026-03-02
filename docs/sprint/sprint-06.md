# Sprint 06 - Home

## Objetivo

Construir a Home completa com blocos principais de conversao (hero, servicos, diferenciais, cases, depoimentos opcionais e CTAs) e estruturar o conteudo para renderizacao dinamica no CMS interno.

## Escopo executado

- Frontend:
  - Home implementada com:
    - Hero com valor principal e CTAs de orcamento e WhatsApp
    - Cards de servicos
    - Diferenciais
    - Cases em destaque
    - Bloco opcional de depoimentos (controlado por `showTestimonials`)
    - Bloco final de contato com CTAs
  - Arquivo: `src/app/page.tsx`
- Backend:
  - Estrutura de dados da Home no Prisma:
    - modelo `HomeContent` em `prisma/schema.prisma`
    - migracao `prisma/migrations/20260302164000_home_content/migration.sql`
  - Schema de validacao:
    - `src/schemas/public/home-content.ts`
  - Service para leitura publica com fallback e upsert para CMS:
    - `src/services/home-content.service.ts`
  - Endpoint publico:
    - `GET /api/public/home-content` em `src/app/api/public/home-content/route.ts`
  - Endpoint admin para CMS interno:
    - `GET/POST /api/admin/home-content` em `src/app/api/admin/home-content/route.ts`
  - Server Actions para integracao futura do CMS interno:
    - `src/actions/admin/home-content.ts`
- DevOps:
  - Ajustes de performance no `next.config.ts`:
    - `compress: true`
    - `poweredByHeader: false`
  - Home com `revalidate = 300` para cache ISR:
    - `src/app/page.tsx`
  - Script de medicao Lighthouse para Home:
    - `scripts/measure-home-lighthouse.mjs`
    - comando: `npm run perf:home:lighthouse`

## Medicao inicial de performance (Home)

- Execucao Lighthouse realizada com sucesso e relatorio salvo em `reports/lighthouse-home.json`.
- Resultado coletado:
  - Performance Score: **97**
  - FCP: **0.8s**
  - LCP: **2.5s**
  - TBT: **100ms**
  - CLS: **0**

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`

## Observacoes

- A leitura publica da Home possui fallback seguro caso o banco esteja indisponivel no build.
- A estrutura ja esta pronta para que o CMS interno edite e publique a Home dinamicamente nas proximas sprints.
