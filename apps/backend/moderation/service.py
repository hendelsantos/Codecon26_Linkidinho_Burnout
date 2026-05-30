"""
Serviço de moderação de conteúdo.

Camada 1 — Lista de palavras bloqueadas (sem custo, imediato).
Camada 2 — OpenAI Moderation API (gratuita, detecta ódio/racismo/violência/assédio).

Uso:
    from moderation.service import moderate

    result = moderate("texto do usuário")
    if not result.safe:
        raise ValidationError(result.reason)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from django.conf import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Resultado da moderação
# ---------------------------------------------------------------------------

@dataclass
class ModerationResult:
    safe: bool
    reason: str = ""


# ---------------------------------------------------------------------------
# Camada 1 — palavras bloqueadas (PT-BR + EN)
# ---------------------------------------------------------------------------

_DEFAULT_BLOCKED: list[str] = [
    # Ofensas raciais e étnicas
    "macaco", "negão", "crioulo", "judeu", "viado",
    # Homofobia / transfobia
    "sapatão", "traveco", "bicha", "baitola",
    # Misoginia grave
    "vadia", "vagabunda", "piranha",
    # Capacitismo
    "retardado", "mongoloide", "aleijado",
    # Violência explícita
    "matar", "estuprar", "pedofilia", "pedófilo",
    # Spam / ódio genérico
    "nazista", "fascista",
]


def _blocked_words() -> list[str]:
    extra: list[str] = getattr(settings, "MODERATION_BLOCKED_WORDS", [])
    return _DEFAULT_BLOCKED + [w.lower() for w in extra]


def _check_blocked_words(text: str) -> ModerationResult:
    lower = text.lower()
    for word in _blocked_words():
        if word in lower:
            return ModerationResult(safe=False, reason="Conteúdo contém linguagem inapropriada.")
    return ModerationResult(safe=True)


# ---------------------------------------------------------------------------
# Camada 2 — OpenAI Moderation API
# ---------------------------------------------------------------------------

def _check_openai(text: str) -> ModerationResult:
    api_key: str = getattr(settings, "OPENAI_API_KEY", "")
    if not api_key:
        # Sem chave configurada → pula silenciosamente
        return ModerationResult(safe=True)

    try:
        import openai

        client = openai.OpenAI(api_key=api_key)
        response = client.moderations.create(input=text, model="omni-moderation-latest")
        result = response.results[0]

        if result.flagged:
            # Descobre quais categorias foram ativadas
            cats = result.categories.model_dump()
            flagged_cats = [k for k, v in cats.items() if v]
            logger.info("OpenAI moderation flagged categories: %s", flagged_cats)
            return ModerationResult(
                safe=False,
                reason="Conteúdo não permitido pela política da plataforma.",
            )
    except Exception as exc:  # noqa: BLE001
        # Falha na API não bloqueia o usuário — apenas loga
        logger.warning("OpenAI moderation API error: %s", exc)

    return ModerationResult(safe=True)


# ---------------------------------------------------------------------------
# Função pública
# ---------------------------------------------------------------------------

def moderate(text: str) -> ModerationResult:
    """
    Modera um texto passando pelas duas camadas.
    Retorna ModerationResult(safe=False, reason=...) se reprovado.
    """
    if not text or not text.strip():
        return ModerationResult(safe=True)

    result = _check_blocked_words(text)
    if not result.safe:
        return result

    return _check_openai(text)
