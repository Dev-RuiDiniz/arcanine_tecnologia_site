# Sprint 08 - Servicos com SEO por pagina

## Objetivo

Criar a estrutura completa de servicos com pagina principal e paginas individuais por slug, incluindo metadata por rota e base de conteudo editavel para CMS interno.

## Escopo executado

- Frontend:
  - Pagina principal de servicos:
    - `src/app/servicos/page.tsx`
  - Paginas individuais por servico com slug amigavel:
    - `src/app/servicos/[slug]/page.tsx`
  - URLs amigaveis no formato:
    - `/servicos/{slug}`
  - Metadata por rota:
    - `title`, `description` e `canonical` em `/servicos`
    - `generateMetadata` por slug em `/servicos/[slug]`
  - Navegacao publica atualizada para rota de servicos:
    - `src/components/public/public-header.tsx`
- Backend:
  - Modelagem de conteudo por servico para edicao no CMS:
    - modelo `ServiceContent` em `prisma/schema.prisma`
    - migracao `prisma/migrations/20260302182000_services_content/migration.sql`
  - Schema de validacao:
    - `src/schemas/public/service-content.ts`
  - Service com fallback de servicos padrao:
    - `src/services/service-content.service.ts`
  - Endpoints:
    - publico (lista): `GET /api/public/services`
    - publico (detalhe): `GET /api/public/services/[slug]`
    - admin (leitura/escrita): `GET/POST /api/admin/services`
  - Server Actions para CMS interno:
    - `src/actions/admin/service-content.ts`
- DevOps:
  - Script de validacao de indexabilidade basica:
    - `scripts/validate-services-indexability.mjs`
    - comando: `npm run services:indexability:validate`
  - Checklist validado:
    - status HTTP 200 para listagem e paginas individuais
    - presenca de `<title>`
    - presenca de `meta description`
    - ausencia de `noindex`

## Validacao de indexabilidade (resultado)

- `Indexability OK: /servicos`
- `Indexability OK: /servicos/sites-institucionais`
- `Indexability OK: /servicos/sistemas-web`
- `Indexability OK: /servicos/automacoes`
- `Indexability OK: /servicos/integracoes-api`
- `Indexability OK: /servicos/ia-aplicada`

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`
- `npm run services:indexability:validate`

## Resultado

Estrutura de servicos ficou pronta para SEO por pagina, com conteudo dinamico por slug e base de edicao para CMS interno.
