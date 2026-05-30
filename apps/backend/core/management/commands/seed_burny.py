"""Popula o banco com perfis e check-ins absurdos para a demo."""

from __future__ import annotations

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from ai.services import insight_for
from analytics.services import compute_burny_score, dominant_metric
from metrics.models import CheckIn
from users.models import Profile

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
    help = "Cria perfis e check-ins falsos para demo do Burny Out."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=21)
        parser.add_argument("--reset", action="store_true")

    def handle(self, *args, **options):
        days = options["days"]
        if options["reset"]:
            self.stdout.write(self.style.WARNING("Resetando dados de demo..."))
            CheckIn.objects.all().delete()
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
                },
            )
            profiles.append(profile)

        today = timezone.localdate()
        created = 0
        for profile in profiles:
            chaos = random.uniform(0.4, 1.4)
            for offset in range(days):
                date = today - timedelta(days=offset)
                if CheckIn.objects.filter(profile=profile, date=date).exists():
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
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed completo: {len(profiles)} perfis e {created} check-ins."
            )
        )
