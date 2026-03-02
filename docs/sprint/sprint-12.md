# Sprint 12 - Formularios de leads

## Objetivo

Implementar formularios de leads com validacao completa, incluindo fluxo de solicitacao de orcamento com anexo opcional e limites operacionais por ambiente.

## Escopo executado

- Frontend:
  - Formulario de contato geral com validacao de campos no cliente usando schema compartilhado:
    - `src/components/contact/contact-form.tsx`
  - Novo formulario de solicitacao de orcamento com campos completos:
    - `src/components/contact/budget-request-form.tsx`
  - Campo de anexo opcional com validacao de tamanho e tipo no cliente.
  - Pagina de contato atualizada para exibir os dois formularios:
    - `src/app/contato/page.tsx`
- Backend:
  - Schema server-side para payload de orcamento e metadados de anexo:
    - `src/schemas/forms/budget.ts`
    - exportado em `src/schemas/index.ts`
  - Endpoint para recebimento de orcamento via multipart/form-data:
    - `src/app/api/budget/route.ts`
    - alias legado em `src/app/api/forms/budget/route.ts`
  - Service dedicado para submissao de orcamento:
    - `src/services/budget-form.service.ts`
    - exportado em `src/services/index.ts`
  - Persistencia de lead de orcamento preparada no mesmo modelo de leads, com `source = BUDGET_FORM` e mensagem estruturada:
    - `src/services/lead.service.ts`
- DevOps:
  - Configuracao de limites operacionais de upload por ambiente (`dev`, `preview`, `prod`) via env:
    - `src/lib/env/upload-limits.ts`
    - `.env.example`
  - Script de validacao de limites de upload:
    - `scripts/validate-lead-upload-limits.mjs`
    - comando `npm run lead:upload-limits:validate`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run lead:upload-limits:validate`

## Resultado

O site agora possui dois fluxos de captacao de lead com validacao consistente no cliente e no servidor. O envio de orcamento aceita anexo opcional com controle operacional por ambiente, reduzindo risco de upload fora de politica em `dev`, `preview` e `prod`.
