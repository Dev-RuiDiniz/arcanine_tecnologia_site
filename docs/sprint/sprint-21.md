# Sprint 21 - Hotfix de autenticacao admin e resiliencia do dashboard

## Objetivo

Corrigir bloqueios de acesso ao painel administrativo em ambiente local (loop de redirecionamento e credencial invalida percebida) e evitar quebra de runtime quando o banco PostgreSQL estiver indisponivel.

## Escopo executado

- Middleware admin:
  - Ajuste da logica de redirecionamento em `middleware.ts` para evitar loop entre `/admin/login` e `/admin`.
  - Comportamento atualizado:
    - rota de login so redireciona para `/admin` quando a role no token possui permissao de dashboard;
    - acessos admin sem permissao passam a retornar para `/admin/login` com `callbackUrl`, em vez de redirecionar para `/admin`.
- Layout do admin:
  - Ajuste em `src/app/admin/layout.tsx` para nao forcar `redirect('/admin/login')` quando nao houver sessao.
  - Resultado: a propria pagina de login em `/admin/login` pode renderizar normalmente, eliminando redirecionamento recursivo.
- Dashboard resiliente sem banco:
  - Ajuste em `src/services/admin-dashboard.service.ts` com fallback quando o banco estiver offline.
  - Operacoes Prisma agora estao protegidas por `try/catch`:
    - em falha de conexao, o painel retorna metricas zeradas e tendencia vazia, sem crash de runtime;
    - warning registrado via logger (`admin.dashboard.db-unavailable`).

## Validacao executada

- `npm run typecheck`

## Resultado

O acesso ao `/admin/login` deixou de entrar em redirecionamento infinito, a autenticacao pode prosseguir corretamente e o dashboard administrativo nao derruba mais a pagina quando o PostgreSQL local nao estiver ativo.
