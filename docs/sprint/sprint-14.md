# Sprint 14 - Dashboard do admin

## Objetivo

Entregar dashboard administrativo com metricas de leads, posts e alertas operacionais, incluindo visualizacoes condicionais quando analytics estiver integrado e telemetria basica para erros de formularios/e-mail.

## Escopo executado

- Frontend:
  - Dashboard `/admin` refeito com cards de:
    - leads do dia
    - leads da semana
    - leads do mes
    - posts publicados/total
    - alertas das ultimas 24h
  - Bloco de visualizacao de tendencia de leads (ultimos 7 dias) exibido somente quando analytics estiver integrado (`NEXT_PUBLIC_GA_ID` ou `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`).
  - Bloco de alertas recentes do painel com categoria, contexto, mensagem e timestamp.
  - Arquivo:
    - `src/app/admin/page.tsx`
- Backend:
  - Service de agregacoes e consultas do painel:
    - `src/services/admin-dashboard.service.ts`
    - contagens de leads por periodo (dia/semana/mes)
    - contagem de posts totais/publicados
    - tendencia de leads por dia
    - leitura de alertas de telemetria
  - Export do novo service:
    - `src/services/index.ts`
  - Telemetria persistente baseada em eventos (JSONL):
    - `src/lib/telemetry/events.ts`
  - Integracao da telemetria no monitoramento de erro de formulario e e-mail:
    - `src/lib/monitoring/form-errors.ts`
    - `src/lib/monitoring/email-delivery.ts`
- DevOps:
  - Configuracao basica de telemetria em ambiente:
    - `TELEMETRY_ENABLED`
    - `TELEMETRY_LOG_PATH`
    - atualizadas em `.env.example`
  - Script de validacao de configuracao de telemetria:
    - `scripts/validate-telemetry-config.mjs`
    - comando `npm run telemetry:validate-config`
  - Manutencao do script de validacao SMTP/transacional da sprint anterior para observabilidade de falha de entrega.

## Validacao executada

- `npm run format`
- `npm run quality`
- `npm run build`
- `npm run telemetry:validate-config`
- `npm run email:delivery:validate-config` (com envs de teste definidos no comando)

## Resultado

O painel administrativo agora possui visao executiva de leads/posts e alertas operacionais, com visualizacoes de tendencia quando analytics esta configurado. Erros de formulario e envio de e-mail passam a gerar eventos de telemetria basica para acompanhamento no dashboard.
