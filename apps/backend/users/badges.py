"""
Badges de conquista do BurnyOut.

Calculados dinamicamente a partir dos check-ins do usuário — sem model extra.
"""

from __future__ import annotations

from dataclasses import dataclass

from django.db.models import Max, Sum


@dataclass
class Badge:
    id: str
    emoji: str
    name: str
    description: str
    earned: bool


_DEFINITIONS = [
    {
        "id": "cafeista_pro",
        "emoji": "☕",
        "name": "Cafeísta Profissional",
        "description": "Consumiu 50+ cafés no total.",
        "check": lambda s: (s.get("coffees__sum") or 0) >= 50,
    },
    {
        "id": "reuniao_survivor",
        "emoji": "😵",
        "name": "Sobrevivente de Reuniões",
        "description": "Aguentou 30+ reuniões inúteis.",
        "check": lambda s: (s.get("useless_meetings__sum") or 0) >= 30,
    },
    {
        "id": "transito_expert",
        "emoji": "🚗",
        "name": "Expert em Trânsito",
        "description": "2.000+ minutos no trânsito acumulados.",
        "check": lambda s: (s.get("traffic_minutes__sum") or 0) >= 2000,
    },
    {
        "id": "bathroom_king",
        "emoji": "🚽",
        "name": "Bathroom Revenue King",
        "description": "R$20+ em bathroom revenue acumulado.",
        "check": lambda s: (s.get("bathroom_revenue_cents__sum") or 0) >= 2000,
    },
    {
        "id": "buzzword_tank",
        "emoji": "🤖",
        "name": "Buzzword Tank",
        "description": "Sobreviveu a 100+ buzzwords corporativas.",
        "check": lambda s: (s.get("buzzwords_endured__sum") or 0) >= 100,
    },
    {
        "id": "burnout_lendario",
        "emoji": "🔥",
        "name": "Burnout Lendário",
        "description": "Atingiu Burny Score 90+ em algum check-in.",
        "check": lambda s: (s.get("burny_score__max") or 0) >= 90,
    },
    {
        "id": "checkin_streak",
        "emoji": "📅",
        "name": "Presença Obrigatória",
        "description": "Registrou 7+ check-ins. Seu sofrimento está documentado.",
        "check": lambda s: (s.get("count") or 0) >= 7,
    },
    {
        "id": "stress_cronico",
        "emoji": "💀",
        "name": "Estresse Crônico",
        "description": "Stress médio acima de 7 no histórico.",
        "check": lambda s: (s.get("stress_avg") or 0) >= 7,
    },
]


def compute_badges(profile) -> list[Badge]:
    """Retorna lista de badges com earned=True/False para o profile dado."""
    from metrics.models import CheckIn

    agg = CheckIn.objects.filter(profile=profile).aggregate(
        coffees__sum=Sum("coffees"),
        useless_meetings__sum=Sum("useless_meetings"),
        traffic_minutes__sum=Sum("traffic_minutes"),
        bathroom_revenue_cents__sum=Sum("bathroom_revenue_cents"),
        buzzwords_endured__sum=Sum("buzzwords_endured"),
        burny_score__max=Max("burny_score"),
    )
    agg["count"] = CheckIn.objects.filter(profile=profile).count()

    # stress médio manual (evita Avg import extra)
    stress_vals = list(
        CheckIn.objects.filter(profile=profile).values_list("stress_level", flat=True)
    )
    agg["stress_avg"] = sum(stress_vals) / len(stress_vals) if stress_vals else 0

    return [
        Badge(
            id=d["id"],
            emoji=d["emoji"],
            name=d["name"],
            description=d["description"],
            earned=d["check"](agg),
        )
        for d in _DEFINITIONS
    ]
