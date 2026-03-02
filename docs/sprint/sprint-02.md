# Sprint 02 - Arquitetura backend e banco

## Objetivo

Estabelecer a arquitetura inicial de backend com Server Actions/Route Handlers, configurar ORM com PostgreSQL e versionar a primeira migracao.

## Escopo executado

- Camada de consumo no frontend para APIs de formularios e admin:
  - `src/lib/api/client.ts`
  - `src/lib/api/forms.ts`
  - `src/lib/api/admin.ts`
  - `src/lib/api/contracts.ts`
- Base de Server Actions:
  - `src/actions/forms/contact.ts`
  - `src/actions/admin/page.ts`
- Base de Route Handlers (leitura e escrita):
  - `POST /api/forms/contact`
  - `GET /api/admin/pages`
  - `POST /api/admin/pages`
- ORM e banco:
  - Prisma configurado com provider PostgreSQL
  - Modelos iniciais: `Lead` e `Page`
  - Primeira migracao SQL versionada em `prisma/migrations/20260302133000_init/migration.sql`
- Camadas backend de suporte:
  - Cliente Prisma singleton em `src/lib/db/prisma.ts`
  - Resolucao de URL por ambiente em `src/lib/env.ts`
  - Schemas Zod para payloads de formulario/admin
  - Services para `Lead` e `Page`
- DevOps:
  - Variaveis de banco por ambiente em `.env.example`:
    - `DATABASE_URL_DEV`
    - `DATABASE_URL_PREVIEW`
    - `DATABASE_URL_PROD`
    - `DATABASE_URL` fallback
  - Scripts Prisma no `package.json`.

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`

## Observacoes

- A migracao inicial foi gerada a partir do schema usando `prisma migrate diff` para manter o versionamento mesmo sem dependencia de banco ativo durante a sprint.
