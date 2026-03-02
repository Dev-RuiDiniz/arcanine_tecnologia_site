# Sprint 05 - Estrutura global publica

## Objetivo

Implementar a estrutura publica base do site com layout responsivo mobile-first, componentes reutilizaveis e fonte de dados backend para informacoes globais.

## Escopo executado

- Frontend:
  - Layout publico com `Header` + `Footer` + CTA:
    - `src/components/public/public-layout.tsx`
    - `src/components/public/public-header.tsx`
    - `src/components/public/public-footer.tsx`
  - Home publica refatorada para estrutura de secoes:
    - `src/app/page.tsx`
  - Sistema base de componentes reutilizaveis para secoes:
    - `src/components/public/section-shell.tsx`
    - `src/components/public/section-heading.tsx`
    - `src/components/public/cta-link.tsx`
- Backend:
  - Fonte de dados global para informacoes institucionais:
    - `src/lib/site/global-site-info.ts`
    - `src/services/site-config.service.ts`
  - Endpoint publico para consumo de configuracao:
    - `GET /api/public/site-config` em `src/app/api/public/site-config/route.ts`
- DevOps:
  - Padrao de build/otimizacao para assets estaticos:
    - formatos de imagem no `next.config.ts`
    - cache headers para assets estaticos no `next.config.ts`
  - Validacao de responsividade no pipeline:
    - `scripts/validate-responsive-layout.mjs`
    - script `npm run responsive:validate`
  - Pipeline CI com qualidade + responsividade + build:
    - `.github/workflows/ci.yml`
  - Variaveis de configuracao global adicionadas ao `.env.example`.

## Validacao tecnica

- `npm run responsive:validate`
- `npm run quality`
- `npm run build`

## Resultado

A base publica ficou pronta para evolucao das paginas principais, mantendo um padrao unico de layout, secoes reutilizaveis e fonte centralizada de dados institucionais.
