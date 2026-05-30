import uuid

from django.db import models
from django.utils import timezone


class CheckIn(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        "users.Profile",
        related_name="checkins",
        on_delete=models.CASCADE,
    )
    date = models.DateField(default=timezone.localdate)

    coffees = models.PositiveIntegerField(default=0)
    useless_meetings = models.PositiveIntegerField(default=0)
    traffic_minutes = models.PositiveIntegerField(default=0)
    stress_level = models.PositiveSmallIntegerField(default=5)
    bathroom_revenue_cents = models.PositiveIntegerField(default=0)
    buzzwords_endured = models.PositiveIntegerField(default=0)

    note = models.CharField(max_length=240, blank=True)
    burny_score = models.PositiveSmallIntegerField(default=0)
    burny_insight = models.CharField(max_length=280, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["profile", "date"], name="unique_checkin_per_day"
            )
        ]

    def __str__(self) -> str:
        return f"{self.profile.nickname} @ {self.date} ({self.burny_score})"
