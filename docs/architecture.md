# Arquitetura

## Visao geral

O repositorio segue um formato de monorepo com separacao clara entre experiencia web e plataforma de dados.

- apps/frontend concentra a experiencia de produto em Next.js.
- apps/backend concentra a API e as regras de dominio em Django.
- docs centraliza as decisoes de produto, UX e arquitetura.

## Frontend

### Objetivo

Entregar uma experiencia visual premium, mobile-friendly e com personalidade forte para a demo da Codecon 2026.

### Estrutura base

- src/app para rotas do App Router.
- src/components para componentes reutilizaveis e blocos de interface.
- src/lib para mocks, config e utilitarios de produto.

### Diretrizes

- Priorizar composicao por secoes de pagina.
- Isolar dados mockados de componentes visuais.
- Usar motion apenas em pontos que gerem presenca, nao ruido.
- Evoluir a landing para dashboard real sem refazer a base.

## Backend

### Objetivo

Oferecer uma API organizada por dominio, pronta para crescer de MVP para plataforma com analytics, social e IA.

### Apps de dominio

- core: health checks, config transversal, rotas base.
- users: identidade anonima, perfis, preferencias.
- metrics: check-ins, cafe, reunioes, transito, bathroom revenue.
- analytics: Burny Score, agregacoes, benchmarks e series temporais.
- social: feed, amigos, reacoes e compartilhamento.
- ai: insights, narrativas e copy satirica assistida.
- moderation: regras de seguranca de linguagem e filtros de tom.
- rankings: rankings globais, por area, por empresa e por regiao.
- wrapped: consolidacoes periodicas e cards resumidos.

### Camadas recomendadas

- models para persistencia.
- selectors para leitura complexa.
- services para regras de negocio.
- api para serializers, views e routers.
- tasks para processamento assincrono.

## Fluxo de dados esperado

1. Usuario faz check-in corporativo.
2. Backend persiste evento bruto em metrics.
3. analytics recalcula Burny Score e benchmarks.
4. ai gera um insight seguro e comico.
5. social publica snapshot no feed.
6. rankings atualiza comparativos.
7. frontend reflete dashboards, ranking e cards.

## Infra sugerida para a fase seguinte

- PostgreSQL como banco principal.
- Redis como cache e broker.
- Celery para processamento de wrapped, rankings e insights.
- Railway para deploy rapido da demo.

## Convencoes iniciais

- Portugues no produto, com slogans pontuais em ingles.
- Naming de codigo em ingles, naming de conteudo em pt-BR.
- Humor centrado em situacoes corporativas, nunca em humilhacao pessoal.