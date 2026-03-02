# Sprint 01 - Setup base

## Objetivo

Entregar a base tecnica do projeto com Next.js + Tailwind, `shadcn/ui`, `framer-motion`, organizacao inicial de backend, padrao de qualidade e variaveis de ambiente.

## Escopo executado

- Inicializacao de projeto Next.js (App Router + TypeScript) com Tailwind CSS.
- Configuracao inicial do `shadcn/ui`.
- Instalacao do `framer-motion`.
- Estrutura inicial de backend criada:
  - `src/actions`
  - `src/lib`
  - `src/schemas`
  - `src/services`
- Padrao de qualidade configurado:
  - ESLint (ja provisionado pelo template)
  - Prettier + plugin Tailwind
  - Scripts de qualidade no `package.json`
- Criacao de `.env.example`.

## Validacao tecnica

- `npm run lint`
- `npm run typecheck`
- `npm run format:check`
- `npm run build`

## Evidencias (arquivos principais)

- `package.json`
- `.prettierrc.json`
- `.prettierignore`
- `.env.example`
- `components.json`
- `src/actions/index.ts`
- `src/lib/utils.ts`
- `src/schemas/index.ts`
- `src/services/index.ts`

## Observacoes

- O template criado pelo `create-next-app` foi gerado em pasta temporaria e mesclado para preservar os arquivos de planejamento existentes no repositorio.
