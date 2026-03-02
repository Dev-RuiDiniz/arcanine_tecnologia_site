# Sprint 15 - CMS de paginas

## Objetivo

Implementar CMS estruturado para Home, Sobre e Servicos com preview antes da publicacao, operacoes de leitura/escrita validadas para `pages` e versionamento de schema/migracoes para campos estruturados.

## Escopo executado

- Frontend:
  - Nova interface de edicao estruturada para Home, Sobre e Servicos no admin:
    - `src/components/admin/pages/cms-pages-editor.tsx`
  - Pagina `/admin/pages` conectada ao novo editor:
    - `src/app/admin/pages/page.tsx`
  - Fluxo de preview no editor antes de publicar, com alternancia de visualizacao por pagina.
  - Fluxo de salvar rascunho e publicar com feedback de status.
- Backend:
  - Operacoes de leitura/escrita/publicacao para CMS de `pages` com validacao:
    - `src/services/page.service.ts`
    - `src/app/api/admin/pages/route.ts`
    - `src/actions/admin/page.ts`
  - Validacao de payload da camada CMS:
    - `src/schemas/admin/cms-page.ts`
    - export em `src/schemas/index.ts`
  - Integracao de publicacao com conteudo publico (Home, Sobre e Servicos) via services existentes.
- DevOps:
  - Versionamento de schema para campos estruturados do CMS em `pages`:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260302224500_pages_structured_fields/migration.sql`
  - Script de validacao de schema/migration para CMS:
    - `scripts/validate-cms-schema-versioning.mjs`
    - comando `npm run cms:schema-versioning:validate`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run cms:schema-versioning:validate`

## Resultado

O projeto agora possui um CMS funcional para Home, Sobre e Servicos com edicao estruturada, preview antes de publicar e operacoes backend validadas para `pages`. O schema do banco e migracoes foram versionados para suportar campos estruturados de evolucao do CMS.
