# Sprint 16 - Admin de cases e midia

## Objetivo

Entregar painel administrativo de cases com CRUD completo e biblioteca de midia, incluindo upload integrado ao servico de armazenamento com otimizacao automatica e associacao de imagens por case.

## Escopo executado

- Frontend:
  - Nova tela `/admin/cases` com CRUD de cases:
    - campos de desafio, solucao, resultados e CTA
    - selecao de publicacao
    - selecao de imagens associadas por biblioteca de midia
  - Componente principal:
    - `src/components/admin/cases/cases-media-manager.tsx`
  - Rota admin:
    - `src/app/admin/cases/page.tsx`
  - Navegacao admin atualizada:
    - `src/components/admin/admin-nav.tsx`
- Backend:
  - CRUD de cases no admin com associacao de midia:
    - `src/app/api/admin/cases/route.ts`
    - `src/services/admin-case.service.ts`
    - `src/schemas/admin/case-admin.ts`
  - CRUD de media no admin:
    - `src/app/api/admin/media/route.ts`
    - `src/services/media.service.ts`
    - `src/schemas/admin/media.ts`
  - Integracao de upload de midia com Cloudinary:
    - `src/lib/media/storage.ts`
  - Otimizacao automatica de entrega de imagem:
    - geracao de `optimizedUrl` com transformacoes `f_auto,q_auto`
  - Ajustes de schemas/export:
    - `src/schemas/index.ts`
    - `src/services/index.ts`
  - Controle de acesso para rota admin de cases:
    - `src/lib/auth/rbac.ts`
- DevOps:
  - Versionamento de schema/migration para suporte a media e associacao por case:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260302233000_cases_media_admin/migration.sql`
  - Configuracao de credenciais e politicas de armazenamento:
    - `.env.example`
      - `MEDIA_STORAGE_PROVIDER`
      - `MEDIA_UPLOAD_FOLDER`
      - `MEDIA_ALLOWED_MIME_TYPES`
      - `MEDIA_MAX_FILE_SIZE_MB`
      - `CLOUDINARY_CLOUD_NAME`
      - `CLOUDINARY_UPLOAD_PRESET`
  - Script de validacao de config de storage:
    - `scripts/validate-media-storage-config.mjs`
    - comando `npm run media:storage:validate-config`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run media:storage:validate-config` (com envs de teste definidos no comando)

## Resultado

O painel agora possui administracao completa de cases e biblioteca de midia, com upload integrado ao provider de storage, politicas de arquivo no backend e associacao de imagens por case para publicacao estruturada.
