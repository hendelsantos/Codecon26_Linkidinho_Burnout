"""Servicos de calculo do Burny Score."""

from __future__ import annotations

from dataclasses import dataclass

# Pesos somam 100. Cada metrica tem um teto razoavel para normalizacao.
WEIGHTS = {
    "coffees": (10, 20),
    "useless_meetings": (10, 20),
    "traffic_minutes": (180, 15),
    "stress_level": (10, 25),
    "bathroom_revenue_cents": (500, 10),
    "buzzwords_endured": (30, 10),
}


@dataclass
class ScoreBreakdown:
    total: int
    components: dict[str, int]


def compute_burny_score(payload: dict) -> ScoreBreakdown:
    """Recebe um dict com as metricas brutas e devolve o score 0-100."""
    components: dict[str, int] = {}
    total = 0.0
    for field, (cap, weight) in WEIGHTS.items():
        raw = float(payload.get(field, 0) or 0)
        ratio = min(raw / cap, 1.0) if cap else 0
        contribution = ratio * weight
        components[field] = round(contribution)
        total += contribution
    return ScoreBreakdown(total=round(min(total, 100)), components=components)


def dominant_metric(payload: dict) -> str:
    breakdown = compute_burny_score(payload)
    if not breakdown.components:
        return "stress_level"
    return max(breakdown.components, key=breakdown.components.get)
