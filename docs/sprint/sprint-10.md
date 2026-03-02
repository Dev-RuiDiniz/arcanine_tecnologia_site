# Sprint 10 - Contato

## Objetivo

Entregar pagina de Contato com formulario funcional, canais diretos (WhatsApp/e-mail), mapa opcional e monitoramento de erro no envio.

## Escopo executado

- Frontend:
  - Pagina `/contato` com:
    - formulario de contato
    - canais diretos de WhatsApp e e-mail
    - dados de endereco
    - bloco opcional de mapa via `SITE_MAP_EMBED_URL`
  - Arquivo:
    - `src/app/contato/page.tsx`
  - Componente de formulario:
    - `src/components/contact/contact-form.tsx`
  - Navegacao publica atualizada para `/contato`:
    - `src/components/public/public-header.tsx`
- Backend:
  - Endpoint dedicado de recebimento de contato:
    - `POST /api/contact` em `src/app/api/contact/route.ts`
  - Endpoint legado `/api/forms/contact` atualizado para mesma camada de submissao.
  - Action de contato atualizada (alias mantido):
    - `src/actions/forms/contact.ts`
  - Service unificado de submissao:
    - `src/services/contact-form.service.ts`
- DevOps:
  - Monitoramento de erro no envio do formulario:
    - `src/lib/monitoring/form-errors.ts`
    - log estruturado no servidor
    - webhook opcional via `FORM_ERRORS_WEBHOOK_URL`
  - Variaveis de ambiente:
    - `SITE_MAP_EMBED_URL`
    - `FORM_ERRORS_WEBHOOK_URL`
    - atualizadas em `.env.example`
  - Validacao automatizada do endpoint de contato:
    - `scripts/validate-contact-endpoint.mjs`
    - comando: `npm run contact:endpoint:validate`

## Validacao executada

- `npm run quality`
- `npm run build`
- `npm run contact:endpoint:validate`

## Resultado da validacao de endpoint

- Payload invalido retorna `400` com contrato de erro.
- Payload valido retorna:
  - sucesso quando persistencia funciona, ou
  - erro `500` com contrato monitorado quando a persistencia falha (sem quebrar observabilidade).

## Resultado

A pagina de Contato esta pronta para uso publico, com fluxo de submissao padronizado e monitoramento operacional para falhas de envio.
