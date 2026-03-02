# Plano em Sprints (20 sprints)

## Sprint 1 - Setup base

- Frontend: inicializar projeto Next.js 14+ com App Router e configurar Tailwind CSS.
- Frontend: instalar e configurar `shadcn/ui` e `Framer Motion`.
- Backend: organizar estrutura inicial de pastas para `actions`, `lib`, `schemas` e `services`.
- DevOps: configurar ESLint + Prettier, scripts de qualidade e arquivo de variaveis `.env.example`.

## Sprint 2 - Arquitetura backend e banco

- Frontend: preparar camada de consumo de Server Actions/Route Handlers para formularios e admin.
- Backend: criar base de Server Actions/Route Handlers para operacoes de escrita e leitura.
- Backend: configurar ORM (Prisma ou Drizzle), conexao PostgreSQL e primeira migracao.
- DevOps: configurar variaveis de ambiente de banco para `dev`, `preview` e `prod`.

## Sprint 3 - Autenticacao do admin

- Frontend: criar telas de login e estados de autenticacao no painel administrativo.
- Backend: configurar NextAuth (Auth.js) com provider de credenciais e sessoes seguras.
- Backend: implementar callbacks e protecao basica de sessao para rotas privadas.
- DevOps: configurar segredos de autenticacao e rotacao em variaveis de ambiente.

## Sprint 4 - RBAC e protecao de rotas

- Frontend: adaptar navegacao do admin para exibir recursos conforme `Admin`, `Editor` e `Viewer`.
- Backend: modelar `roles` e `user_roles`, com middlewares de autorizacao por papel.
- Backend: proteger rotas/paginas do painel por permissao de acesso.
- DevOps: validar politicas de acesso em `dev` e `preview` com usuarios de teste por role.

## Sprint 5 - Estrutura global publica

- Frontend: implementar layout responsivo mobile-first, Header com CTA e Footer completo.
- Frontend: criar sistema base de componentes reutilizaveis para secoes publicas.
- Backend: preparar fonte de dados para informacoes globais do site (contatos, redes, endereco).
- DevOps: configurar padrao de build para assets estaticos e validacao de responsividade no pipeline.

## Sprint 6 - Home

- Frontend: construir Hero, cards de servicos, diferenciais e destaque de cases.
- Frontend: implementar bloco opcional de depoimentos e CTAs de orcamento/WhatsApp.
- Backend: estruturar dados da Home para renderizacao dinamica no CMS interno.
- DevOps: medir desempenho inicial da Home e ajustar configuracoes para meta de Lighthouse.

## Sprint 7 - Sobre

- Frontend: implementar pagina Sobre com historia, valores, metodologia e stack.
- Backend: criar estrutura de dados para conteudo editavel da pagina Sobre.
- DevOps: validar carregamento e performance da pagina em ambientes `dev` e `preview`.

## Sprint 8 - Servicos com SEO por pagina

- Frontend: criar pagina principal de Servicos e paginas individuais por servico.
- Frontend: aplicar estrutura de URL amigavel por slug e metadata por rota.
- Backend: modelar conteudo por servico para edicao no CMS.
- DevOps: validar indexabilidade basica das paginas de servicos.

## Sprint 9 - Portfolio/Cases publico

- Frontend: implementar listagem de cases e pagina de detalhe com resultados, stack e imagens.
- Frontend: habilitar bloco opcional de depoimento por case.
- Backend: criar consulta e modelo para dados de case no publico.
- DevOps: otimizar entrega de imagens dos cases com estrategia de CDN.

## Sprint 10 - Contato

- Frontend: construir pagina de Contato com formulario, canais de WhatsApp e e-mail.
- Frontend: adicionar mapa como bloco opcional.
- Backend: criar endpoint/action de recebimento do formulario de contato.
- DevOps: configurar monitoramento de erro no envio do formulario.

## Sprint 11 - Paginas legais e SEO base

- Frontend: criar paginas de Politica de Privacidade e Termos de Uso (se necessario).
- Frontend: padronizar metadata por rota e estrutura de links amigaveis.
- Backend: organizar fonte de conteudo das paginas legais para manutencao.
- DevOps: validar geracao de paginas legais no build e rotas em `preview`.

## Sprint 12 - Formularios de leads

- Frontend: implementar formulario de contato geral com validacao de campos.
- Frontend: implementar formulario de solicitar orcamento com campos completos e anexo opcional.
- Backend: validar payload com schema server-side e preparar persistencia de lead.
- DevOps: configurar limites operacionais para upload de anexos no ambiente.

## Sprint 13 - Fluxo de lead e e-mails

- Frontend: exibir mensagens de sucesso/erro e estados de envio nos formularios.
- Backend: salvar leads na tabela `leads` e registrar status inicial.
- Backend: enviar e-mail de notificacao interna e e-mail de confirmacao ao cliente.
- Backend: montar link de WhatsApp com mensagem pre-pronta (opcional).
- DevOps: configurar servico SMTP/transacional e observabilidade de falha de entrega.

## Sprint 14 - Dashboard do admin

- Frontend: construir dashboard com cards de leads (dia/semana/mes), posts e alertas.
- Frontend: exibir visualizacoes quando analytics estiver integrado.
- Backend: criar agregacoes e consultas para metricas e alertas do painel.
- DevOps: configurar telemetria basica para erros de formulario e envio de e-mail.

## Sprint 15 - CMS de paginas

- Frontend: criar interface de edicao estruturada para Home, Sobre e Servicos.
- Frontend: implementar fluxo de preview antes de publicar.
- Backend: criar operacoes de leitura/escrita para `pages` com validacao.
- DevOps: configurar versionamento de schema e migracoes para campos estruturados.

## Sprint 16 - Admin de cases e midia

- Frontend: criar telas de CRUD de cases com campos de desafio, solucao, resultados e CTA.
- Frontend: implementar galeria de imagens e biblioteca de midia no painel.
- Backend: criar CRUD de `cases` e `media`, com associacao de imagens por case.
- Backend: integrar upload de midia (Cloudinary ou S3-compatible) com otimização automatica.
- DevOps: configurar credenciais e politicas de armazenamento para servico de midia.

## Sprint 17 - Blog/Insights e admin de posts

- Frontend: implementar listagem de artigos, filtro por categoria/tag, busca e pagina de artigo.
- Frontend: implementar telas do admin para CRUD de posts com capa e status.
- Backend: criar modelos `posts`, `categories`, `tags`, `post_tags` e operacoes de publicacao.
- Backend: integrar editor rich text (ex.: Tiptap) com sanitizacao do conteudo salvo.
- DevOps: validar performance e indexacao das paginas de blog em `preview`.

## Sprint 18 - Leads no admin e configuracoes gerais

- Frontend: criar listagem de leads com filtros por data/status/servico e acao de exportacao CSV.
- Frontend: criar telas de configuracoes (empresa, redes, WhatsApp, integracoes, usuarios/permissoes).
- Backend: implementar atualizacao de status de lead e registro de observacoes internas.
- Backend: implementar endpoints/actions para configuracoes gerais e gestao de usuarios/permissoes.
- DevOps: validar exportacao CSV e protecao de acesso para dados sensiveis no painel.

## Sprint 19 - SEO tecnico e seguranca

- Frontend: configurar geracao de `sitemap.xml`, `robots.txt` e OG images dinamicas.
- Frontend: aplicar dados estruturados Schema.org (Organization, Article, Breadcrumb).
- Backend: implementar validacao server-side, sanitizacao XSS e logs de auditoria no admin.
- Backend: aplicar medidas de CSRF e rate limit em formularios.
- DevOps: configurar headers de seguranca e checagens de conformidade no deploy.

## Sprint 20 - Observabilidade, analytics, testes e entrega

- Frontend: instrumentar eventos de analytics (lead, clique no WhatsApp, orcamento).
- Backend: integrar Sentry e logging para operacoes criticas do site e admin.
- Backend: implementar testes unitarios para utilitarios/validacoes e E2E basico (login, criar post, enviar lead).
- DevOps: configurar Vercel com preview por PR, fluxo CI/CD e validacao de ambientes `dev/preview/prod`.
- DevOps: consolidar documentacao de setup local, variaveis de ambiente, publicacao de conteudo, deploy e backups.
