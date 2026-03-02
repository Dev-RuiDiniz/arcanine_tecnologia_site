# Sprint 03 - Autenticacao do admin

## Objetivo

Implementar autenticacao do painel administrativo com Auth.js (NextAuth), credenciais seguras, protecao de rotas privadas e preparacao de segredos para operacao/rotacao.

## Escopo executado

- Frontend:
  - Tela de login do admin em `src/app/admin/login/page.tsx`.
  - Tela inicial do painel em `src/app/admin/page.tsx`.
  - Estados de autenticacao (`loading`, `authenticated`, `unauthenticated`) em `src/components/auth/admin-session-status.tsx`.
  - Acao de logout em `src/components/auth/logout-button.tsx`.
  - `SessionProvider` global em `src/components/providers/auth-session-provider.tsx` e `src/app/layout.tsx`.
- Backend:
  - Configuracao do Auth.js/NextAuth em `src/lib/auth/options.ts` com provider de credenciais.
  - Verificacao de senha com hash bcrypt (`src/lib/auth/password.ts`).
  - Callbacks implementados:
    - `jwt` para persistir role.
    - `session` para expor role na sessao.
  - Endpoint Auth.js em `src/app/api/auth/[...nextauth]/route.ts`.
  - Protecao de sessao/role `ADMIN` em rotas privadas:
    - `src/app/api/admin/pages/route.ts`
    - `src/actions/admin/page.ts`
  - Middleware de protecao para `/admin/*` em `middleware.ts`.
- DevOps:
  - Variaveis de ambiente de autenticacao no `.env.example`:
    - `AUTH_SECRET`
    - `NEXTAUTH_SECRET`
    - `AUTH_URL`
    - `NEXTAUTH_URL`
    - `AUTH_ADMIN_EMAIL`
    - `AUTH_ADMIN_PASSWORD_HASH_CURRENT`
    - `AUTH_ADMIN_PASSWORD_HASH_NEXT`
  - Script para gerar hash de senha:
    - `npm run auth:hash-password -- "sua-senha"`
    - arquivo: `scripts/hash-password.mjs`

## Validacao tecnica

- `npm run quality`
- `npm run build`

## Observacoes operacionais

- Fluxo de rotacao recomendado:
  1. Gerar novo hash e definir em `AUTH_ADMIN_PASSWORD_HASH_NEXT`.
  2. Validar login com senha nova.
  3. Promover hash novo para `AUTH_ADMIN_PASSWORD_HASH_CURRENT`.
  4. Limpar `AUTH_ADMIN_PASSWORD_HASH_NEXT`.
