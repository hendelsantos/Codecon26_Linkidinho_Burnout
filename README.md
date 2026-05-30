# Burny Out

Burny Out e uma rede social satirica de analytics corporativo onde cafe, reunioes, transito, bathroom revenue e sofrimento operacional viram dashboards, rankings e insights dramaticamente exagerados.

O projeto foi concebido para a Codecon 2026 como uma demo memoravel: absurda, comica, visualmente premium e segura no tom. A direcao visual parte das referencias de Likidinho, mas a identidade final foi reinterpretada para um universo proprio de enterprise noir, cyberpunk corporativo e humor de sobrevivencia.

## Elevator pitch

Burny Out transforma dor corporativa em metricas acionaveis.

Ou, em termos mais honestos:

Your burnout has charts now.

## O que ja existe neste scaffold

- Monorepo organizado em apps/backend e apps/frontend.
- Backend em Django com DRF, OpenAPI, CORS e dominios separados.
- Frontend em Next.js com App Router, tema visual proprio e landing premium.
- Documentacao central de produto, arquitetura e direcao visual.
- Arquivos de ambiente de exemplo e dependencias registradas.

## Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Recharts
- Lucide React

### Backend
- Django
- Django REST Framework
- drf-spectacular
- PostgreSQL ready
- Redis ready
- Celery ready

## Estrutura do repositorio

```txt
Burnout/
├── apps/
│   ├── backend/
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── config/
│   │   ├── core/
│   │   ├── metrics/
│   │   ├── moderation/
│   │   ├── rankings/
│   │   ├── social/
│   │   ├── users/
│   │   ├── wrapped/
│   │   ├── .env.example
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/app/
│       ├── src/components/
│       ├── src/lib/
│       └── .env.example
├── docs/
│   ├── architecture.md
│   ├── product.md
│   └── ui-direction.md
├── Dados exemplo/
├── burny_out_blueprint.md
└── README.md
```

## Como rodar

### Backend

```bash
cd apps/backend
cp .env.example .env
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver
```

API disponivel em http://localhost:8000/api/health/

Schema OpenAPI em http://localhost:8000/api/schema/

Docs Swagger em http://localhost:8000/api/docs/

### Frontend

```bash
cd apps/frontend
cp .env.example .env.local
npm install
npm run dev
```

Aplicacao disponivel em http://localhost:3000

## Endpoints iniciais

- GET /api/health/
- GET /api/snapshot/
- GET /api/schema/
- GET /api/docs/

## Principios do produto

- Humor sem atacar pessoas reais.
- Satira de cultura corporativa, nao de sofrimento real.
- Comedia exagerada com linguagem de produto premium.
- Interface cinematografica, nao um dashboard generico qualquer.
- Arquitetura organizada desde o primeiro commit.

## Roadmap sugerido

1. Criar onboarding anonimo e check-in corporativo.
2. Modelar Burny Score, snapshots diarios e metricas comparativas.
3. Implementar feed social, reacoes, rankings e rede de amigos.
4. Adicionar Burny AI para insights, cards e wrapped corporativo.
5. Fechar deploy, assets de marca e narrativa de demo para palco.

## Documentacao complementar

- [docs/architecture.md](docs/architecture.md)
- [docs/product.md](docs/product.md)
- [docs/ui-direction.md](docs/ui-direction.md)