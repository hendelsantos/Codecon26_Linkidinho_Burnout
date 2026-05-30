import uuid

from django.db import models


class Desabafo(models.Model):
    """Post de burnout — o 'artigo' do BurnyOut."""

    NIVEL_CHOICES = [
        ("funcional", "Funcional demais para meu próprio bem"),
        ("alerta", "Em alerta laranja"),
        ("critico", "Nível crítico"),
        ("colapso", "Colapso iminente 🔥"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(
        "users.Profile",
        related_name="desabafos",
        on_delete=models.CASCADE,
    )
    content = models.CharField(max_length=500)
    nivel = models.CharField(max_length=16, choices=NIVEL_CHOICES, default="funcional")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.author.nickname}: {self.content[:50]}"


class Reacao(models.Model):
    """Reações emocionais a um Desabafo."""

    EMOJI_CHOICES = [
        ("choro", "😭"),
        ("morto", "💀"),
        ("cafe", "☕"),
        ("fogo", "🔥"),
        ("abraco", "🤝"),
    ]

    profile = models.ForeignKey(
        "users.Profile",
        related_name="reacoes",
        on_delete=models.CASCADE,
    )
    desabafo = models.ForeignKey(
        Desabafo,
        related_name="reacoes",
        on_delete=models.CASCADE,
    )
    emoji = models.CharField(max_length=8, choices=EMOJI_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["profile", "desabafo"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.profile.nickname} {self.emoji} em desabafo de {self.desabafo.author.nickname}"

