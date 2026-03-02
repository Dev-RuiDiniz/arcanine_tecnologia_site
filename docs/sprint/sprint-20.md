# Sprint 20 - Observabilidade, analytics, testes e entrega

## Objetivo

Concluir a camada operacional de produto com analytics de conversao no frontend, observabilidade backend (Sentry + logging estruturado), testes automatizados (unitarios e E2E basico) e esteira de entrega para preview/producao com documentacao consolidada de operacao.

## Escopo executado

- Frontend analytics:
  - Instrumentacao de eventos:
    - `lead_submit_contact`
    - `lead_submit_budget`
    - `whatsapp_click`
    - `budget_cta_click`
  - Disparo de eventos em pontos de conversao:
    - envio de formulario de contato
    - envio de formulario de orcamento
    - cliques em CTAs de WhatsApp e orcamento
  - Inclusao de scripts de analytics (GA4 e Plausible) quando variaveis de ambiente estiverem configuradas.
  - Endpoint de ingestao de evento (`/api/analytics/events`) para registro backend.
  - Arquivos:
    - `src/lib/analytics/events.ts`
    - `src/components/analytics/analytics-scripts.tsx`
    - `src/components/public/cta-link.tsx`
    - `src/components/contact/contact-form.tsx`
    - `src/components/contact/budget-request-form.tsx`
    - `src/app/page.tsx`
    - `src/app/contato/page.tsx`
    - `src/app/layout.tsx`
    - `src/app/api/analytics/events/route.ts`
- Backend observabilidade:
  - Integracao com Sentry no servidor com inicializacao lazy e captura de erro/mensagem.
  - Logger estruturado em JSON para operacoes criticas.
  - Aplicacao de logging/captura em fluxos criticos do site e admin:
    - envio de contato/orcamento
    - atualizacao de leads
    - gestao de posts admin
    - configuracoes gerais e usuarios/permissoes admin
    - monitoramento de erro de formulario e e-mail
  - Arquivos:
    - `src/lib/monitoring/sentry.ts`
    - `src/lib/monitoring/logger.ts`
    - `src/lib/monitoring/form-errors.ts`
    - `src/lib/monitoring/email-delivery.ts`
    - `src/app/api/contact/route.ts`
    - `src/app/api/budget/route.ts`
    - `src/app/api/admin/leads/route.ts`
    - `src/app/api/admin/posts/route.ts`
    - `src/app/api/admin/settings/general/route.ts`
    - `src/app/api/admin/settings/users/route.ts`
    - `src/services/admin-audit.service.ts`
- Testes:
  - Testes unitarios (Node test runner + `tsx`) para utilitarios e validacoes:
    - sanitizacao de input
    - rate limit
    - schemas de formularios
  - E2E basico automatizado para fluxo:
    - login admin
    - tentativa de criacao de post
    - tentativa de envio de lead
  - Script E2E com fallback explicito para ambientes sem banco/sem contexto de browser completo.
  - Arquivos:
    - `tests/unit/input-sanitization.test.ts`
    - `tests/unit/rate-limit.test.ts`
    - `tests/unit/schemas.test.ts`
    - `scripts/e2e-basic-flow.mjs`
    - `src/lib/security/rate-limit.ts` (hook de reset para testes)
- DevOps e entrega:
  - Evolucao do CI com:
    - quality
    - validacao de matriz de ambientes
    - unit tests
    - build
    - E2E basico
    - validacao de conformidade de seguranca
  - Workflow de deploy Vercel para:
    - preview automatico por PR
    - producao automatica em `main`
  - Validacao de ambientes `dev/preview/prod` via script de matriz de variaveis.
  - Arquivos:
    - `.github/workflows/ci.yml`
    - `.github/workflows/vercel-deploy.yml`
    - `scripts/validate-env-matrix.mjs`
- Documentacao consolidada:
  - Runbook unico com:
    - setup local
    - variaveis de ambiente
    - publicacao de conteudo
    - deploy/CI/CD
    - backups e restauracao
  - README simplificado apontando comandos e docs operacionais.
  - Arquivos:
    - `docs/operations/runbook.md`
    - `README.md`

## Dependencias adicionadas

- `@sentry/node`
- `tsx` (dev)

## Scripts adicionados/atualizados

- `npm run test:unit`
- `npm run test:e2e:basic`
- `npm run env:matrix:validate`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run test:unit`
- `npm run env:matrix:validate`
- `npm run build`
- `npm run test:e2e:basic`
- `npm run security:compliance:validate`
- `npm run admin:sensitive-access:validate`

## Resultado

A plataforma agora possui observabilidade e entrega operacional em nivel de producao: analytics de conversao instrumentado no frontend, monitoramento backend com Sentry e logs estruturados, testes automatizados para utilitarios/validacoes e fluxo E2E basico, pipeline CI fortalecida e deploy Vercel automatizado para preview e producao, com runbook consolidado para operacao e continuidade.
