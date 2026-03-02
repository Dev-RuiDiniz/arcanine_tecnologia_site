# Site Corporativo - Arcanine Tecnologia

## 1) Objetivo do projeto

Construir um site institucional premium (rápido, bonito, responsivo e com SEO forte) com uma área administrativa para gerenciar:

- Conteúdos do site (páginas, textos, imagens)
- Blog/artigos (opcional, mas recomendado)
- Leads (formulários/contatos)
- Portfólio/cases
- Configurações gerais (dados da empresa, redes, WhatsApp, etc.)

## 2) Stack e padrão de arquitetura

### Frontend (UI)

- Next.js 14+ (App Router)
- Tailwind CSS
- shadcn/ui (Radix + acessibilidade)
- Framer Motion (animações leves e premium)
- React Hook Form + Zod (forms robustos + validação)
- TanStack Query (quando houver consumo de APIs externas, opcional)

### Backend (no próprio Next.js)

- Server Actions / Route Handlers para operações de admin e formulários
- Prisma ORM (ou Drizzle, mas Prisma é mais comum e maduro)
- PostgreSQL (recomendado) via Neon / Supabase / RDS
- Upload de mídia: Cloudinary ou S3-compatible (ex.: Cloudflare R2)

### Auth (Admin)

- NextAuth (Auth.js) com login por e-mail/senha (credentials) ou Google (opcional)
- Sessões seguras
- RBAC (controle por papéis): Admin, Editor, Viewer

### Deploy & Infra

- Vercel (preview deployments + CI/CD automático)
- Observabilidade: Sentry e log/monitoramento básico
- Analytics: Plausible/GA4 + eventos (lead, clique no WhatsApp, orçamento)

## 3) Módulos do site (público)

### 3.1 Páginas principais

- Home: Hero com proposta de valor, serviços (cards), diferenciais, cases/portfólio (destaques), depoimentos (opcional), CTA de orçamento/WhatsApp
- Sobre: história, valores, metodologia, stack
- Serviços: páginas por serviço (SEO): Sites institucionais, Sistemas web, Automações, Integrações/API, IA aplicada
- Portfólio / Cases: listagem + página do case, resultados, stack, imagens, depoimento (opcional)
- Blog / Insights (recomendado): listagem, categoria, tag, busca, página de artigo com schema/SEO
- Contato: formulário + WhatsApp + e-mail + mapa (opcional)
- Páginas legais: Política de Privacidade e Termos de Uso (se necessário)

### 3.2 Componentes globais

- Header com navegação e CTA
- Footer completo (contatos, redes, links, endereço)
- Componentes de SEO: meta tags e OG image dinâmica por página/case/artigo
- Tema (light/dark opcional)
- Layout responsivo (mobile-first)

## 4) Captação de leads (core do site)

### 4.1 Formulários

- Contato geral
- Solicitar orçamento: nome, e-mail, telefone/WhatsApp, tipo de projeto (site/sistema/automação/IA), mensagem, anexo opcional (briefing/imagem/pdf)
- Newsletter (se usar blog)

### 4.2 Fluxo do lead

- Salvar no banco (tabela `leads`)
- Enviar e-mail de notificação (equipe)
- Enviar e-mail de confirmação para o cliente (template)
- Integrações opcionais: link de WhatsApp com mensagem pré-pronta e CRM (HubSpot/Pipedrive) via webhook

## 5) Área Administrativa (Admin Panel)

### 5.1 Acesso e permissões

- Login
- Roles: Admin (tudo), Editor (conteúdo), Viewer (leitura e exportação)

### 5.2 Dashboard

- Leads do dia/semana/mês
- Posts publicados e rascunhos
- Visualizações (se integrado ao analytics)
- Alertas: formulário com erro, falha de e-mail, etc.

### 5.3 Gestão de conteúdo (CMS interno)

- Páginas: edição de seções (Home/Sobre/Serviços), campos estruturados e preview antes de publicar
- Blog: CRUD de posts, editor rich text (ex.: Tiptap), slug, tags, categorias, imagem de capa, status (rascunho/publicado/agendado), SEO por post
- Cases/Portfólio: CRUD, galeria de imagens, stack usada, desafio, solução, resultados, CTA para contato
- Mídia: upload e biblioteca, otimização automática de imagens
- Leads: listagem com filtros (data/status/serviço), status (novo/em contato/fechado/perdido), observações internas, exportação CSV
- Configurações: dados da empresa, redes sociais, WhatsApp e mensagem padrão, integrações (chaves/webhooks), usuários e permissões

## 6) Modelo de dados (mínimo recomendado)

- `users` (admin)
- `roles` / `user_roles` (RBAC)
- `pages` (conteúdo estruturado)
- `posts` (blog)
- `categories`, `tags`, `post_tags`
- `cases` (portfólio)
- `media` (arquivos)
- `leads`
- `audit_logs` (ações no admin: criou/alterou/apagou)

## 7) Requisitos não-funcionais (padrão ouro)

### Performance e UX

- Lighthouse alto (meta: 90+)
- Imagens otimizadas (Next/Image + CDN)
- Fontes otimizadas
- Loading states (suspense) e skeletons

### SEO técnico

- `sitemap.xml` e `robots.txt`
- Metadata por rota
- Schema.org (Organization, Article, Breadcrumb)
- URLs amigáveis (slug)
- OG images dinâmicas

### Segurança

- CSRF e validação server-side
- Rate limit nos forms
- Sanitização do conteúdo (XSS)
- Headers de segurança
- Logs de auditoria no admin

### Qualidade e manutenção

- ESLint + Prettier
- Testes mínimos: unit (utilitários/validações) e E2E básico (login, criar post, enviar lead)
- Ambientes: dev / preview / prod

## 8) Entregáveis

- Site institucional completo (páginas + componentes)
- Admin funcional com login e permissões
- CMS interno (páginas, blog, cases)
- Gestão de leads + exportação
- Deploy na Vercel + pipeline (preview por PR)
- Documentação: setup local, variáveis de ambiente, guia de conteúdo, guia de deploy e backups

## 9) Roadmap sugerido (MVP → Growth)

### MVP (rápido e já vendável)

- Home, Sobre, Serviços, Cases, Contato
- Formulário salvando leads + e-mail
- Admin: login + leads + cases + páginas básicas

### Growth (v1.1+)

- Blog completo
- SEO avançado e OG dinâmico
- Integrações com CRM/WhatsApp
- Dashboard com métricas
- Agendamento de posts, rascunhos e revisão

## Plano em Sprints

O plano completo e exclusivo das sprints está em `SPRINTS.md`.
