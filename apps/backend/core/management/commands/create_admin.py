"""
Cria um superuser Django a partir das variáveis de ambiente.

Uso no Railway shell:
    DJANGO_ADMIN_EMAIL=seu@email.com DJANGO_ADMIN_PASSWORD=suasenha python manage.py create_admin

Ou defina as variáveis de ambiente no Railway dashboard e rode:
    python manage.py create_admin
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Cria superuser Django a partir de DJANGO_ADMIN_EMAIL e DJANGO_ADMIN_PASSWORD"

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.environ.get("DJANGO_ADMIN_EMAIL")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")

        if not email or not password:
            self.stderr.write(
                self.style.ERROR(
                    "Defina as variáveis DJANGO_ADMIN_EMAIL e DJANGO_ADMIN_PASSWORD"
                )
            )
            return

        username = email.split("@")[0]

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f"Usuário {email} já existe. Nada alterado."))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Superuser criado: {email}"))
