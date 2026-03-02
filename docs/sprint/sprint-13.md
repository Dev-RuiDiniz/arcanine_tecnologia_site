# Sprint 13 - Fluxo de lead e e-mails

## Objetivo

Implementar o fluxo de lead com status inicial, notificacoes por e-mail (interna + confirmacao ao cliente), link opcional de WhatsApp e observabilidade de falha de entrega.

## Escopo executado

- Frontend:
  - Formularios de contato e orcamento com estados de envio (`aria-busy`) e mensagens de sucesso/erro refinadas:
    - `src/components/contact/contact-form.tsx`
    - `src/components/contact/budget-request-form.tsx`
  - Exibicao opcional de CTA para continuar atendimento por WhatsApp quando o backend retorna link pre-pronto.
- Backend:
  - Fluxo de persistencia de lead mantido na tabela `Lead`, com `status` inicial definido como `NEW` no retorno da API.
  - Modelo Prisma atualizado para `LeadStatus`:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260302213000_lead_status/migration.sql`
  - Envio de notificacao interna e confirmacao ao cliente por SMTP/transacional:
    - `src/lib/notifications/lead-email.ts`
  - Integracao do envio de e-mail nos fluxos de submissao:
    - `src/services/contact-form.service.ts`
    - `src/services/budget-form.service.ts`
  - Link opcional de WhatsApp com mensagem pre-pronta:
    - `src/lib/whatsapp/lead-whatsapp-link.ts`
  - APIs atualizadas para retornar metadados do fluxo de entrega:
    - `src/app/api/contact/route.ts`
    - `src/app/api/forms/contact/route.ts`
    - `src/app/api/budget/route.ts`
    - `src/lib/api/forms.ts`
- DevOps:
  - Variaveis de ambiente para SMTP/transacional e webhook de observabilidade de falha:
    - `.env.example`
  - Monitoramento de falha de entrega de e-mail:
    - `src/lib/monitoring/email-delivery.ts`
  - Script de validacao de configuracao SMTP:
    - `scripts/validate-email-delivery-config.mjs`
    - comando `npm run email:delivery:validate-config`

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run lead:upload-limits:validate`
- `npm run email:delivery:validate-config` (com envs de teste definidos no comando)

## Resultado

Leads sao registrados com status inicial `NEW`, com tentativa automatica de notificacao interna e confirmacao ao cliente. Falhas de entrega ficam observaveis por logs estruturados e webhook opcional, e o fluxo pode sugerir continuidade via WhatsApp quando configurado.
