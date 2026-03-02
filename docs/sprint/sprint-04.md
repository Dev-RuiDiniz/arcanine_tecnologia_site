# Sprint 04 - RBAC e protecao de rotas

## Objetivo

Implementar RBAC com papeis `ADMIN`, `EDITOR` e `VIEWER`, aplicando autorizacao por permissao em rotas, paginas e endpoints administrativos.

## Escopo executado

- Frontend:
  - Navegacao do painel adaptada por papel em `src/components/admin/admin-nav.tsx`.
  - Layout administrativo com sessao e menu RBAC em `src/app/admin/layout.tsx`.
  - Paginas protegidas por permissao:
    - `src/app/admin/page.tsx` (`dashboard:view`)
    - `src/app/admin/pages/page.tsx` (`pages:view`)
    - `src/app/admin/leads/page.tsx` (`leads:view`)
    - `src/app/admin/settings/page.tsx` (`settings:manage`)
  - Tela de login atualizada para uso por todos os papeis de painel.
- Backend:
  - Modelagem de RBAC no banco com Prisma:
    - `RoleName` enum (`ADMIN`, `EDITOR`, `VIEWER`)
    - `User`
    - `Role`
    - `UserRole`
  - Migracao criada: `prisma/migrations/20260302152000_rbac_roles/migration.sql`.
  - Regras centrais de RBAC em `src/lib/auth/rbac.ts`.
  - Guard de autorizacao por permissao em `src/lib/auth/guards.ts`.
  - Auth atualizado para autenticar `ADMIN`, `EDITOR` e `VIEWER` via env:
    - `src/lib/auth/users.ts`
    - `src/lib/auth/options.ts`
  - Middleware com autorizacao por papel/rota: `middleware.ts`.
  - Endpoints/acoes protegidos por permissao:
    - `src/app/api/admin/pages/route.ts`
    - `src/actions/admin/page.ts`
- DevOps:
  - Variaveis de ambiente por papel adicionadas ao `.env.example`.
  - Script de validacao de env RBAC:
    - `npm run rbac:validate-env`
  - Script de seed RBAC para `roles`, `users` e `user_roles`:
    - `npm run rbac:seed`

## Matriz de acesso

- ADMIN:
  - `dashboard:view`, `pages:view`, `pages:edit`, `leads:view`, `settings:manage`
- EDITOR:
  - `dashboard:view`, `pages:view`, `pages:edit`
- VIEWER:
  - `dashboard:view`, `pages:view`, `leads:view`

## Validacao em dev e preview

1. Configurar usuarios de teste por papel (`AUTH_ADMIN_*`, `AUTH_EDITOR_*`, `AUTH_VIEWER_*`).
2. Executar `npm run rbac:validate-env`.
3. Aplicar migracoes (`npm run prisma:migrate:dev` em dev e `npm run prisma:migrate:deploy` em preview/prod).
4. Executar seed RBAC (`npm run rbac:seed`) para criar `roles` e `user_roles`.
5. Validar login com cada papel e conferir acessos:
   - ADMIN acessa `/admin/settings`.
   - EDITOR bloqueado em `/admin/settings`.
   - VIEWER bloqueado em `/admin/settings` e sem acao de edicao de paginas.

## Validacao tecnica

- `npm run prisma:generate`
- `npm run quality`
- `npm run build`
