from django.db import models


class PageVisit(models.Model):
    path = models.CharField(max_length=512)
    referer = models.CharField(max_length=512, blank=True, default="")
    user_agent = models.CharField(max_length=512, blank=True, default="")
    # IP hasheado (SHA-256 sem salt) — não armazena IP bruto
    ip_hash = models.CharField(max_length=64, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Visita"
        verbose_name_plural = "Visitas"

    def __str__(self):
        return f"{self.path} — {self.created_at:%Y-%m-%d %H:%M}"
