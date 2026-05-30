import uuid

from django.db import models


class Profile(models.Model):
    AREAS = [
        ("dev", "Desenvolvimento"),
        ("design", "Design"),
        ("product", "Produto"),
        ("ops", "Operacoes"),
        ("data", "Dados"),
        ("qa", "QA"),
        ("management", "Gestao"),
        ("sales", "Vendas"),
        ("marketing", "Marketing"),
        ("other", "Outros"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nickname = models.CharField(max_length=64)
    avatar_emoji = models.CharField(max_length=8, default="\U0001f525")
    region = models.CharField(max_length=64, default="Brasil")
    area = models.CharField(max_length=32, choices=AREAS, default="dev")
    access_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.nickname} ({self.get_area_display()})"

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False
