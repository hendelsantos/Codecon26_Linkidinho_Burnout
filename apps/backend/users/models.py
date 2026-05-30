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


BURNY_SKILLS = [
    ("reunioes_survival", "Sobrevivência em Reuniões de 2h"),
    ("cafe_pro", "Consumo Avançado de Café"),
    ("tudo_bem", "Arte de Fingir que Está Tudo Bem"),
    ("crise_1759", "Gestão de Crises às 17h59"),
    ("banheiro", "Otimização de Tempo no Banheiro"),
    ("email_urgente", "Leitura de E-mail como se Fosse Urgente"),
    ("procrastinacao", "Procrastinação Estratégica"),
    ("pos_daily", "Resiliência Pós-Daily"),
    ("reuniao_email", "Especialista em Reuniões que Poderiam ser E-mail"),
    ("git_blame", "Mestre do Git Blame Criativo"),
    ("deadline_ninja", "Ninja de Deadlines de última Hora"),
    ("slack_offline", "Expert em Parecer Offline no Slack"),
]


class Follow(models.Model):
    """Seguir outro profissional em colapso."""

    follower = models.ForeignKey(
        Profile,
        related_name="following_set",
        on_delete=models.CASCADE,
    )
    following = models.ForeignKey(
        Profile,
        related_name="followers_set",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["follower", "following"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.follower.nickname} → {self.following.nickname}"


class SkillEndorsement(models.Model):
    """Endosso de uma Burny Skill."""

    endorser = models.ForeignKey(
        Profile,
        related_name="endorsements_given",
        on_delete=models.CASCADE,
    )
    profile = models.ForeignKey(
        Profile,
        related_name="endorsements_received",
        on_delete=models.CASCADE,
    )
    skill = models.CharField(max_length=32, choices=BURNY_SKILLS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [["endorser", "profile", "skill"]]

    def __str__(self) -> str:
        return f"{self.endorser.nickname} endossou {self.skill} de {self.profile.nickname}"

