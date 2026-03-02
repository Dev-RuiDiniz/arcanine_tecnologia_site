# Site Corporativo - Arcanine Tecnologia

## Status Sprint 20

Projeto com SEO tecnico, seguranca, observabilidade, analytics, testes e pipeline CI/CD ativos.

## Comandos principais

- Dev: `npm run dev`
- Quality: `npm run quality`
- Build: `npm run build`
- Unit tests: `npm run test:unit`
- E2E basico: `npm run test:e2e:basic`
- Env matrix: `npm run env:matrix:validate`
- Security compliance: `npm run security:compliance:validate`

## Documentacao operacional

- Runbook de setup/env/publicacao/deploy/backups:
  - `docs/operations/runbook.md`
- Sprints executadas:
  - `docs/sprint/`
- Plano macro de sprints:
  - `SPRINTS.md`

## Escopo funcional

- Site publico (Home, Sobre, Servicos, Cases, Insights, Contato, paginas legais)
- Painel admin com RBAC e CMS interno
- Captacao de leads com e-mail e WhatsApp
- SEO tecnico (metadata, sitemap, robots, Schema.org, OG dinamica)
- Seguranca (CSRF, rate limit, sanitizacao, headers)
- Observabilidade/analytics (telemetria, Sentry, eventos de conversao)
