# Runbook Operacional

## 1) Setup local

### Pre-requisitos

- Node.js 22+
- npm 10+
- PostgreSQL 15+

### Passos

1. Instalar dependencias:
   - `npm ci`
2. Copiar variaveis:
   - `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`)
3. Ajustar `DATABASE_URL` e credenciais de auth/smtp conforme ambiente local.
4. Gerar cliente Prisma:
   - `npm run prisma:generate`
5. Rodar migracoes:
   - `npm run prisma:migrate:dev`
6. Subir aplicacao:
   - `npm run dev`

## 2) Variaveis de ambiente

### Blocos principais

- App/base URL: `NEXT_PUBLIC_APP_URL`
- Banco por ambiente: `DATABASE_URL`, `DATABASE_URL_DEV`, `DATABASE_URL_PREVIEW`, `DATABASE_URL_PROD`
- Auth admin: `AUTH_SECRET`, `NEXTAUTH_SECRET`, `AUTH_*`
- Upload/media: `MEDIA_*`, `CLOUDINARY_*`
- Formularios e limites: `LEAD_ATTACHMENT_*`, `FORM_RATE_LIMIT_*`
- Observabilidade: `TELEMETRY_*`, `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`
- Analytics: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

### Validacao

- Validar matriz de ambientes:
  - `npm run env:matrix:validate`

## 3) Publicacao de conteudo

### Fluxo recomendado

1. Login no painel admin (`/admin/login`).
2. Atualizar conteudos:
   - Paginas CMS (`/admin/pages`)
   - Cases (`/admin/cases`)
   - Posts (`/admin/posts`)
3. Revisar SEO por item (titulo, descricao, slug, cover quando aplicavel).
4. Confirmar visibilidade publica:
   - servicos: `/servicos/[slug]`
   - cases: `/cases/[slug]`
   - insights: `/insights/[slug]`
5. Validar integridade rapida:
   - `npm run services:indexability:validate`
   - `npm run blog:preview:indexability:validate`

## 4) Deploy e CI/CD

### CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`

Pipeline executa:

- qualidade (`npm run quality`)
- validacao de matriz de env (`npm run env:matrix:validate`)
- testes unitarios (`npm run test:unit`)
- validacoes tecnicas (responsivo)
- build de CI
- E2E basico (`npm run test:e2e:basic`)
- conformidade de seguranca (`npm run security:compliance:validate`)

### Vercel (preview e producao)

Arquivo: `.github/workflows/vercel-deploy.yml`

- PR: deploy preview automatico
- `main`: deploy producao automatico

Secrets obrigatorios no GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 5) Backups e recuperacao

### Banco

- Recomendado: backup automatico diario no provedor PostgreSQL.
- Politica minima sugerida:
  - RPO: 24h
  - RTO: 4h
  - Retencao: 7 a 30 dias

### Midia

- Cloudinary/S3: habilitar versionamento e retencao.
- Garantir export periodico de referencias da tabela de midia (`MediaAsset`).

### Procedimento de restauracao (resumo)

1. Restaurar snapshot do banco no ambiente alvo.
2. Validar migracoes: `npm run prisma:migrate:deploy`.
3. Validar dados criticos:
   - usuarios/permissoes admin
   - paginas/cases/posts publicados
   - leads e configuracoes gerais
4. Rodar checks pos-restauracao:
   - `npm run quality`
   - `npm run build`
   - `npm run security:compliance:validate`
