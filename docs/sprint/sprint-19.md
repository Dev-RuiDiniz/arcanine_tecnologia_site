# Sprint 19 - SEO tecnico e seguranca

## Objetivo

Elevar a base tecnica do projeto com entregas de SEO tecnico e hardening de seguranca em frontend, backend e deploy: sitemap/robots/OG dinamica, dados estruturados Schema.org, protecoes de CSRF e rate limit em formularios, sanitizacao server-side e trilha de auditoria administrativa.

## Escopo executado

- Frontend SEO tecnico:
  - Geracao de `sitemap.xml` com rotas estaticas e dinamicas de servicos, cases e insights.
  - Geracao de `robots.txt` com referencia de sitemap e bloqueio de rotas admin/API admin.
  - OG images dinamicas via endpoint `ImageResponse` (`/api/og`).
  - Evolucao de metadata publica para incluir imagem OG dinamica e card Twitter por rota.
  - Arquivos:
    - `src/app/sitemap.ts`
    - `src/app/robots.ts`
    - `src/app/api/og/route.tsx`
    - `src/lib/seo/public-metadata.ts`
- Frontend Schema.org:
  - `Organization` global via JSON-LD no layout.
  - `Article` + `BreadcrumbList` em `/insights/[slug]`.
  - `BreadcrumbList` em `/servicos/[slug]` e `/cases/[slug]`.
  - Utilitarios e componente de serializacao JSON-LD.
  - Arquivos:
    - `src/lib/seo/schema-org.ts`
    - `src/components/seo/json-ld.tsx`
    - `src/app/layout.tsx`
    - `src/app/insights/[slug]/page.tsx`
    - `src/app/servicos/[slug]/page.tsx`
    - `src/app/cases/[slug]/page.tsx`
- Backend seguranca:
  - Camada de CSRF com cookie/token e validacao de origem para formularios.
  - Endpoint dedicado para emissao/refresh de token CSRF (`/api/csrf`).
  - Rate limit server-side por IP/rota em endpoints de formularios.
  - Validacao adicional de `content-type` no endpoint JSON de contato.
  - Sanitizacao XSS server-side para campos textuais de leads, observacoes internas e configuracoes gerais.
  - Arquivos:
    - `src/lib/security/csrf-shared.ts`
    - `src/lib/security/csrf.ts`
    - `src/lib/security/csrf-client.ts`
    - `src/lib/security/rate-limit.ts`
    - `src/lib/security/form-guards.ts`
    - `src/lib/security/input-sanitization.ts`
    - `src/app/api/csrf/route.ts`
    - `src/app/api/contact/route.ts`
    - `src/app/api/budget/route.ts`
    - `src/app/api/forms/contact/route.ts`
    - `src/lib/api/client.ts`
    - `src/lib/api/forms.ts`
    - `src/services/lead.service.ts`
    - `src/services/lead-admin.service.ts`
    - `src/services/settings-admin.service.ts`
- Backend auditoria admin:
  - Inclusao de categoria de telemetria `ADMIN_AUDIT`.
  - Novo servico de auditoria administrativa.
  - Registro de eventos em operacoes sensiveis:
    - atualizacao de status de lead
    - atualizacao de configuracoes gerais
    - atualizacao de usuarios/permissoes
  - Arquivos:
    - `src/lib/telemetry/events.ts`
    - `src/services/admin-audit.service.ts`
    - `src/services/index.ts`
    - `src/app/api/admin/leads/route.ts`
    - `src/app/api/admin/settings/general/route.ts`
    - `src/app/api/admin/settings/users/route.ts`
    - `src/services/admin-dashboard.service.ts`
- DevOps:
  - Headers de seguranca globais no `next.config.ts`:
    - `Content-Security-Policy`
    - `Referrer-Policy`
    - `X-Content-Type-Options`
    - `X-Frame-Options`
    - `Permissions-Policy`
    - `Strict-Transport-Security`
  - Script de conformidade de seguranca/deploy para validar headers + `robots.txt` + `sitemap.xml`.
  - Atualizacao de script de validacao do endpoint de contato para incluir fluxo CSRF.
  - Variaveis de ambiente para limite de taxa de formularios.
  - Arquivos:
    - `next.config.ts`
    - `scripts/validate-security-compliance.mjs`
    - `scripts/validate-contact-endpoint.mjs`
    - `package.json`
    - `.env.example`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run admin:sensitive-access:validate`
- `npm run security:compliance:validate`

## Resultado

O projeto passa a entregar SEO tecnico completo (sitemap, robots e OG dinamica), estruturacao Schema.org para organizacao/artigo/breadcrumb e um baseline de seguranca fortalecido em runtime e deploy: CSRF + rate limit nos formularios, sanitizacao server-side contra XSS, trilha de auditoria no admin e headers de seguranca aplicados globalmente.
