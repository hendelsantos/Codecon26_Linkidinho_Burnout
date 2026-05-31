"""Popula o banco com perfis, check-ins, desabafos e follows para a demo."""

from __future__ import annotations

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from ai.services import insight_for
from analytics.services import compute_burny_score, dominant_metric
from metrics.models import CheckIn
from social.models import Desabafo
from users.models import Follow, Profile

# Desabafos de fallback (usados quando não há OPENAI_API_KEY)
DESABAFOS_FALLBACK = [
    "Daily de 45 minutos para informar que nada mudou desde ontem. Produtividade pura.",
    "Alguém pode me explicar por que precisamos de uma reunião para agendar outra reunião?",
    "Terceiro alinhamento estratégico da semana. Estratégia: sobreviver até sexta.",
    "PR aprovado após 3 semanas, 47 comentários e uma crise existencial.",
    "O slide está quase pronto desde segunda-feira. Hoje é quinta.",
    "Meu burny score bateu recorde histórico. Orgulho corporativo.",
    "Feedback da liderança: precisamos ser mais ágeis. Próxima reunião: amanhã, 3 horas.",
    "Café número 6. O sistema nervoso central já entrou em modo econômico.",
    "Refatorei código legado hoje. Agora é legado novo. Progresso.",
    "Home office é ótimo: troco o estresse do trânsito pelo estresse das chamadas sem câmera.",
    "Deadline adiado pela quarta vez. Mas dessa vez é definitivo.",
    "Participei de uma daily, uma planning, uma retro e uma review. Escrevi zero linhas de código.",
    "O escopo cresceu 300% mas o prazo continua igual. Matemática corporativa.",
    "Buzzword do dia: cultura de ownership. Tradução: você faz, você resolve, você explica.",
    "Cinco reuniões hoje. Em nenhuma fui necessário. Essencial.",
    "Entrei no flow às 16h58. Daily às 17h. Perfeito.",
    "Ticket criado, atribuído, em progresso, bloqueado, em revisão, bloqueado de novo. Missão cumprida.",
    "Minha câmera quebrou convenientemente para a all-hands de duas horas.",
    "Sprint planning: 40 pontos. Sprint review: 12 entregues. Sprint retro: culpa do ambiente.",
    "Recebi elogio no 1:1. Não há aumento. Mas o reconhecimento é muito importante.",
    "Hotfix em produção às 23h. O burnout está se democratizando.",
    "Perguntei o porquê de um processo. Me convidaram para liderar o comitê de revisão do processo.",
    "Slack com 847 mensagens não lidas. Marquei tudo como lido. Problema resolvido.",
    "Squads, tribos, chapters e guildas. Somos uma empresa ou um RPG?",
    "Meu one-on-one foi cancelado pela quarta semana seguida. Feedback adiado indefinidamente.",
]

NIVEIS = ["funcional", "funcional", "alerta", "alerta", "critico", "colapso"]

NICKNAMES = [
    ("dev_em_chamas", "\U0001f525", "dev"),
    ("design_cansado", "\U0001f3a8", "design"),
    ("pm_em_crise", "\U0001f4ca", "product"),
    ("ops_lendario", "\U0001f6e0", "ops"),
    ("qa_revoltado", "\U0001f41b", "qa"),
    ("data_zumbi", "\U0001f4c8", "data"),
    ("agile_evangelist", "\U0001f4dc", "management"),
    ("scrum_sobrevivente", "\u26a1", "management"),
    ("frontend_noturno", "\U0001f311", "dev"),
    ("backend_estoico", "\U0001f5ff", "dev"),
    ("ux_sem_dormir", "\U0001f4a4", "design"),
    ("sre_em_chamas", "\U0001f6a8", "ops"),
    ("growth_otimista", "\U0001f680", "marketing"),
    ("vendas_no_limite", "\U0001f4b8", "sales"),
    ("cliente_perdido", "\U0001f9ed", "other"),
    ("estagiario_lendario", "\U0001f9ca", "dev"),
    ("pleno_resiliente", "\U0001f3cb", "dev"),
    ("senior_cinico", "\U0001f9d9", "dev"),
    ("tech_lead_silencioso", "\U0001f47b", "management"),
    ("cto_de_si_mesmo", "\U0001f451", "management"),
]

REGIONS = [
    "Sao Paulo",
    "Rio de Janeiro",
    "Belo Horizonte",
    "Porto Alegre",
    "Recife",
    "Curitiba",
    "Brasilia",
    "Florianopolis",
    "Remoto Total",
    "Remoto com camera off",
]


class Command(BaseCommand):
    help = "Cria perfis, check-ins, desabafos e follows falsos para demo do BurnyOut."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=21)
        parser.add_argument("--reset", action="store_true")
        parser.add_argument(
            "--ai",
            action="store_true",
            help="Usa OpenAI para gerar desabafos realistas (requer OPENAI_API_KEY)",
        )

    def _gerar_desabafos_ai(self, profiles: list[Profile]) -> list[str]:
        """Gera desabafos variados via GPT-4o-mini em batch."""
        from django.conf import settings
        api_key = getattr(settings, "OPENAI_API_KEY", "")
        if not api_key:
            self.stdout.write(self.style.WARNING("OPENAI_API_KEY não configurada. Usando fallback."))
            return []

        try:
            import openai
            client = openai.OpenAI(api_key=api_key)

            areas = list({p.area for p in profiles})
            prompt = (
                "Você é um profissional brasileiro exausto trabalhando em tech. "
                "Gere 30 desabafos curtos (máx 200 caracteres cada) sobre sofrimento corporativo. "
                "Tom: irônico, passivo-agressivo, satírico. Use gírias brasileiras. "
                "Contextos: reuniões inúteis, deadlines, código legado, métricas sem sentido, "
                "buzzwords, home office, 1:1s inúteis, sprints impossíveis. "
                "Retorne APENAS uma lista JSON de strings, sem numeração, sem explicações.\n"
                "Exemplo: [\"Frase 1\", \"Frase 2\", ...]"
            )
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2000,
                temperature=1.0,
                response_format={"type": "json_object"},
            )
            import json
            raw = resp.choices[0].message.content
            data = json.loads(raw)
            # O modelo pode retornar {"desabafos": [...]} ou {"items": [...]} ou a lista diretamente
            if isinstance(data, list):
                return data
            for v in data.values():
                if isinstance(v, list):
                    return v
        except Exception as exc:
            self.stdout.write(self.style.WARNING(f"Erro na OpenAI: {exc}. Usando fallback."))
        return []

    def handle(self, *args, **options):
        days = options["days"]
        use_ai = options["ai"]

        if options["reset"]:
            self.stdout.write(self.style.WARNING("Resetando dados de demo..."))
            CheckIn.objects.all().delete()
            Desabafo.objects.all().delete()
            Follow.objects.all().delete()
            Profile.objects.all().delete()

        random.seed(2026)
        profiles = []
        for nickname, emoji, area in NICKNAMES:
            profile, _ = Profile.objects.get_or_create(
                nickname=nickname,
                defaults={
                    "avatar_emoji": emoji,
                    "area": area,
                    "region": random.choice(REGIONS),
                    "monthly_salary_cents": random.randint(500_000, 3_000_000),  # R$5k–R$30k
                },
            )
            profiles.append(profile)

        # ── Check-ins ──────────────────────────────────────────────────────
        today = timezone.localdate()
        created_ci = 0
        for profile in profiles:
            chaos = random.uniform(0.4, 1.4)
            for offset in range(days):
                date = today - timedelta(days=offset)
                if CheckIn.objects.filter(profile=profile, date=date).exists():
                    continue
                # Nem todo usuário registra todo dia (realismo)
                if random.random() < 0.25:
                    continue
                payload = {
                    "coffees": int(random.gauss(6, 2) * chaos),
                    "useless_meetings": int(random.gauss(5, 2) * chaos),
                    "traffic_minutes": int(random.gauss(75, 35) * chaos),
                    "stress_level": min(10, max(1, int(random.gauss(7, 2) * chaos))),
                    "bathroom_revenue_cents": int(random.gauss(280, 120) * chaos),
                    "buzzwords_endured": int(random.gauss(12, 6) * chaos),
                }
                payload = {k: max(0, v) for k, v in payload.items()}
                breakdown = compute_burny_score(payload)
                CheckIn.objects.create(
                    profile=profile,
                    date=date,
                    burny_score=breakdown.total,
                    burny_insight=insight_for(dominant_metric(payload)),
                    **payload,
                )
                created_ci += 1

        # ── Desabafos ──────────────────────────────────────────────────────
        ai_texts = []
        if use_ai:
            self.stdout.write("Gerando desabafos via OpenAI...")
            ai_texts = self._gerar_desabafos_ai(profiles)
            if ai_texts:
                self.stdout.write(self.style.SUCCESS(f"  {len(ai_texts)} desabafos gerados pela IA."))

        pool = ai_texts if ai_texts else DESABAFOS_FALLBACK
        created_d = 0
        for profile in profiles:
            n = random.randint(1, 3)
            for _ in range(n):
                if Desabafo.objects.filter(author=profile).count() >= n:
                    break
                Desabafo.objects.get_or_create(
                    author=profile,
                    content=random.choice(pool),
                    defaults={"nivel": random.choice(NIVEIS)},
                )
                created_d += 1

        # ── Follows ────────────────────────────────────────────────────────
        created_f = 0
        for profile in profiles:
            targets = random.sample([p for p in profiles if p != profile], k=random.randint(2, 6))
            for target in targets:
                _, new = Follow.objects.get_or_create(follower=profile, following=target)
                if new:
                    created_f += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed completo: {len(profiles)} perfis, {created_ci} check-ins, "
                f"{created_d} desabafos, {created_f} follows."
            )
        )
