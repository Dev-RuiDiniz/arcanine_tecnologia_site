# Sprint 18 - Leads no admin e configuracoes gerais

## Objetivo

Entregar gestao operacional de leads no painel administrativo com filtros/exportacao, configuracoes gerais do sistema e gestao de usuarios/permissoes com protecao de dados sensiveis.

## Escopo executado

- Frontend admin:
  - Listagem de leads com filtros por:
    - periodo (`dateFrom`/`dateTo`)
    - status
    - servico
    - busca textual
  - Acao de exportacao CSV da listagem filtrada.
  - Atualizacao de status do lead com registro opcional de observacao interna.
  - Arquivos:
    - `src/components/admin/leads/leads-manager.tsx`
    - `src/app/admin/leads/page.tsx`
- Frontend admin de configuracoes:
  - Tela de configuracoes gerais:
    - empresa
    - contatos
    - endereco
    - redes sociais
    - integracoes
  - Tela de usuarios/permissoes com override de role e ativacao para usuarios administrativos.
  - Arquivos:
    - `src/components/admin/settings/settings-manager.tsx`
    - `src/app/admin/settings/page.tsx`
- Backend de leads:
  - Modelo de observacoes internas por lead (`LeadNote`).
  - Consultas administrativas com filtros e retorno de notas.
  - Atualizacao de status com persistencia de observacao interna.
  - Exportacao CSV no backend.
  - Arquivos:
    - `src/services/lead-admin.service.ts`
    - `src/app/api/admin/leads/route.ts`
    - `src/app/api/admin/leads/export/route.ts`
    - `src/schemas/admin/lead-admin.ts`
- Backend de configuracoes e usuarios/permissoes:
  - Persistencia de configuracoes gerais (`AppSetting`).
  - Persistencia de override de permissao por usuario (`AdminUserPermission`).
  - Endpoints admin para leitura/escrita de configuracoes e usuarios/permissoes.
  - Integracao no auth para aplicar override de role/active no login de credenciais.
  - Arquivos:
    - `src/services/settings-admin.service.ts`
    - `src/app/api/admin/settings/general/route.ts`
    - `src/app/api/admin/settings/users/route.ts`
    - `src/schemas/admin/settings-admin.ts`
    - `src/lib/auth/options.ts`
    - `src/lib/auth/guards.ts`
- Schema/migracao e integracoes:
  - Novos modelos/tabelas:
    - `LeadNote`
    - `AppSetting`
    - `AdminUserPermission`
  - Relacao de notas dentro de `Lead`.
  - Integracao do `site-config` para priorizar configuracoes gerais persistidas.
  - Arquivos:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260303013000_leads_settings_users/migration.sql`
    - `src/services/site-config.service.ts`
    - `src/services/index.ts`
    - `src/actions/admin/leads.ts`
    - `src/actions/admin/settings.ts`
    - `src/actions/index.ts`
- DevOps:
  - Script de validacao de acesso sensivel no painel com verificacao de negacao para endpoints administrativos anonimos.
  - Script robustecido para ambiente Windows, porta dinamica e secret de auth para execucao em modo `start`.
  - Arquivos:
    - `scripts/validate-admin-sensitive-access.mjs`
    - `package.json` (script `admin:sensitive-access:validate`)

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run admin:sensitive-access:validate`

## Resultado

O painel administrativo agora possui fluxo de operacao de leads com filtros e exportacao, atualizacao de status com historico interno, configuracoes gerais editaveis e gestao de usuarios/permissoes com override controlado. A validacao automatizada confirmou protecao de acesso para endpoints sensiveis do admin.
