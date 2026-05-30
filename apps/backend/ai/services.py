"""Burny AI: gerador de insights satiricos baseado em templates."""

from __future__ import annotations

import random

INSIGHTS: dict[str, list[str]] = {
    "coffees": [
        "Voce ja transcendeu o cafe. Agora o cafe e que depende de voce.",
        "Seu sangue tipo expresso duplo entrou em tendencia regional.",
        "Aviso operacional: substituir agua por cafe nao e biohacking, e desespero documentado.",
    ],
    "useless_meetings": [
        "Voce participou de reunioes suficientes para fundar uma nova religiao corporativa.",
        "Cardio executivo detectado: zero produtividade, alta tolerancia a slides.",
        "A historia vai lembrar dessa daily como o ponto de virada do seu burnout.",
    ],
    "traffic_minutes": [
        "Voce mora oficialmente no transito. O escritorio e so uma escala tecnica.",
        "Tempo no carro suficiente para terminar uma trilogia de podcast existencial.",
        "Seu retrovisor agora tem opiniao formada sobre o seu burnout.",
    ],
    "stress_level": [
        "Nivel de estresse: digno de palestra TEDx que ninguem deveria dar.",
        "Seu sistema nervoso enviou um pull request pedindo demissao.",
        "Alerta industrial: moral abaixo do threshold operacional aceitavel.",
    ],
    "bathroom_revenue_cents": [
        "Bathroom revenue acima da meta trimestral. Investidor anonimo ja te observa.",
        "Voce ganhou mais no banheiro hoje do que muita startup queimou em ads.",
        "Sua produtividade real acontece atras de uma porta trancada. Belissimo.",
    ],
    "buzzwords_endured": [
        "Voce sobreviveu a 'sinergia disruptiva' tres vezes hoje. Heroi nao reconhecido.",
        "Limite de buzzwords excedido. Sistema sugere um silencio terapeutico de 48h.",
        "Hoje voce alinhou, escalou e pivotou. Amanha, talvez, viva.",
    ],
}

FEED_TEMPLATES = [
    "{nickname} sobreviveu a {meetings} reunioes inuteis com apenas {coffees} cafes. Heroi silencioso da {area}.",
    "{nickname} passou {traffic} minutos no transito hoje. O carro virou home office por exaustao.",
    "{nickname} bateu R$ {revenue} de bathroom revenue. Investidores anonimos ja perguntam por uma serie A.",
    "{nickname} aguentou {buzzwords} buzzwords sem rolar os olhos. Tecnica avancada de sobrevivencia corporativa.",
    "{nickname} esta com burny score {score}. Funcional apenas por contrato e cafeina.",
]


def insight_for(metric: str) -> str:
    options = INSIGHTS.get(metric) or INSIGHTS["stress_level"]
    return random.choice(options)


def feed_line(profile, checkin) -> str:
    template = random.choice(FEED_TEMPLATES)
    return template.format(
        nickname=profile.nickname,
        area=profile.get_area_display(),
        coffees=checkin.coffees,
        meetings=checkin.useless_meetings,
        traffic=checkin.traffic_minutes,
        revenue=f"{checkin.bathroom_revenue_cents / 100:.2f}",
        buzzwords=checkin.buzzwords_endured,
        score=checkin.burny_score,
    )
