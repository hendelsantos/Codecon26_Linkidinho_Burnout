# Generated manually 2026-05-30

import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_password_hash"),
    ]

    operations = [
        migrations.CreateModel(
            name="ConviteAmigo",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                (
                    "remetente",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="convites_enviados",
                        to="users.profile",
                    ),
                ),
                ("codigo", models.CharField(editable=False, max_length=12, unique=True)),
                (
                    "tipo_relacao",
                    models.CharField(
                        choices=[
                            ("amigo", "🫂 Amigo"),
                            ("colega_trabalho", "💼 Colega de trabalho"),
                            ("conhecido_almoco", "🍽️ Conhecido do almoço"),
                            ("colega_profissao", "🤝 Colega de profissão"),
                            ("conhecido", "👋 Conhecido"),
                        ],
                        max_length=20,
                    ),
                ),
                ("usos", models.PositiveIntegerField(default=0)),
                ("criado_em", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-criado_em"],
            },
        ),
        migrations.AddConstraint(
            model_name="conviteamigo",
            constraint=models.UniqueConstraint(
                fields=["remetente", "tipo_relacao"],
                name="unique_convite_por_tipo",
            ),
        ),
    ]
