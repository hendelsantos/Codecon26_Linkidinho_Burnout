# 🔥 Burny Out
### The Corporate Suffering Analytics Network™

> *"Your burnout has charts now."*

**[🚀 Ver ao vivo →](https://frontend-production-db69.up.railway.app)**

---

## O que é

Burny Out é uma **rede social satírica de analytics corporativo** onde café, reuniões inúteis, trânsito, bathroom revenue e sofrimento operacional viram dashboards, rankings globais e insights gerados por IA — dramaticamente exagerados, absurdamente precisos.

Construído em 48h para a **CODECON 2026**.

---

## ✨ Features ao vivo

| Feature | Status |
|---------|--------|
| 🔐 Onboarding com nickname + avatar emoji | ✅ |
| 📊 Dashboard com Burny Score™ em tempo real | ✅ |
| 🤖 Insights sarcásticos gerados por IA (OpenAI) | ✅ |
| 📈 Histórico de check-ins e evolução do burnout | ✅ |
| 🏆 Ranking global de sofrimento | ✅ |
| 💬 Feed social com desabafos e reações | ✅ |
| 🎬 Burny Wrapped™ — seu resumo anual de burnout | ✅ |
| 🔗 Compartilhar resultados (Web Share + clipboard) | ✅ |
| 🧠 Badges de conquista ("Burnout Lendário", "Bathroom Revenue King") | ✅ |

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Dashboard com Burny Score™
![Dashboard](docs/screenshots/dashboard.png)

### Ranking Global
![Ranking](docs/screenshots/ranking.png)

### Burny Wrapped™
![Wrapped](docs/screenshots/wrapped.png)

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| **Frontend** | https://frontend-production-db69.up.railway.app |
| **Backend API** | https://backend-production-7444f.up.railway.app/api |
| **Plataforma** | Railway (Frontend + Backend + PostgreSQL) |

---

## 🛠️ Stack

### Frontend
- **Next.js 15** (App Router, TypeScript, Static Export)
- **Tailwind CSS 4** com tema personalizado (enterprise noir / cyberpunk corporativo)
- **Framer Motion** para animações
- **Recharts** para visualizações de dados
- **Lucide React** para ícones

### Backend
- **Django 5 + Django REST Framework**
- **PostgreSQL** (Railway)
- **OpenAI API** para insights sarcásticos gerados por IA
- **drf-spectacular** para OpenAPI/Swagger automático

---

## 🗂️ Estrutura do projeto

```
Burnout/
├── apps/
│   ├── backend/
│   │   ├── ai/          # insights por IA
│   │   ├── analytics/   # cálculo do Burny Score™
│   │   ├── metrics/     # check-ins diários
│   │   ├── rankings/    # ranking global
│   │   ├── social/      # feed + desabafos
│   │   ├── users/       # perfis e auth
│   │   └── wrapped/     # Burny Wrapped™
│   └── frontend/
│       └── src/app/     # páginas Next.js
├── docs/
└── Dados exemplo/
```

---

## ⚡ Como rodar localmente

### Pré-requisitos
- Python 3.12+
- Node.js 20+
- PostgreSQL (ou SQLite para dev)

### Backend

```bash
cd apps/backend
cp .env.example .env
# edite .env com suas credenciais
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_burny   # 20 perfis + 21 dias de check-ins
python manage.py runserver
```

API disponível em `http://localhost:8000/api/`

### Frontend

```bash
cd apps/frontend
cp .env.example .env.local
# edite NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev
```

App disponível em `http://localhost:3000`

---

## 🔢 Métricas do Burny Score™

O Burny Score™ é calculado a partir de:

| Métrica | Peso |
|---------|------|
| ☕ Cafés consumidos | 5 pts/unidade |
| 😵 Reuniões inúteis | 10 pts/unidade |
| 🚗 Minutos no trânsito | 0.1 pt/minuto |
| 💀 Stress level (0–10) | 7 pts/unidade |
| 🚽 Bathroom Revenue | indireto |
| 🤖 Buzzwords aguentadas | 2 pts/unidade |

Score máximo: 100 (colapso total). Score típico de uma segunda-feira: 87.

---

## 👥 Seed de dados

O banco de produção tem **21 perfis** e **421 check-ins** reais. Execute `seed_burny` para popular localmente:

```bash
python manage.py seed_burny --days 21 --reset
```

---

*Feito com 🔥 e sofrimento corporativo estruturado para a CODECON 2026.*

