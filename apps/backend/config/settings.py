"""Django settings for the Burny Out backend."""

import os
from pathlib import Path

from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-burny-out-dev-key-change-me",
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"

# Railway injeta RAILWAY_PUBLIC_DOMAIN automaticamente
_railway_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN", "")
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]
if _railway_domain:
    ALLOWED_HOSTS.append(_railway_domain)
# Aceita qualquer subdomínio .up.railway.app em produção
ALLOWED_HOSTS += [".up.railway.app", ".railway.app"]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "drf_spectacular",
    "core",
    "users",
    "metrics",
    "analytics",
    "social",
    "ai",
    "moderation",
    "rankings",
    "wrapped",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

# Suporte a DATABASE_URL (Railway, Heroku, etc.)
_db_url = os.getenv("DATABASE_URL", "")
if _db_url:
    import urllib.parse as _up
    _u = _up.urlparse(_db_url)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": _u.path.lstrip("/"),
            "USER": _u.username or "",
            "PASSWORD": _u.password or "",
            "HOST": _u.hostname or "",
            "PORT": str(_u.port or 5432),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("POSTGRES_ENGINE", "django.db.backends.sqlite3"),
            "NAME": os.getenv("POSTGRES_DB", BASE_DIR / "db.sqlite3"),
            "USER": os.getenv("POSTGRES_USER", ""),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
            "HOST": os.getenv("POSTGRES_HOST", ""),
            "PORT": os.getenv("POSTGRES_PORT", ""),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Sao_Paulo"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
    ).split(",")
    if origin.strip()
]

from corsheaders.defaults import default_headers  # noqa: E402

CORS_ALLOW_HEADERS = [*default_headers, "x-access-token"]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "users.authentication.AccessTokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "UNAUTHENTICATED_USER": None,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Burny Out API",
    "DESCRIPTION": "API da rede social satirica de analytics corporativo Burny Out.",
    "VERSION": "0.1.0",
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ---------------------------------------------------------------------------
# Moderação de conteúdo
# ---------------------------------------------------------------------------

# Chave da OpenAI — usada pela Moderation API (gratuita).
# Sem chave: apenas a lista de palavras bloqueadas é aplicada.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Palavras adicionais a bloquear além da lista padrão em moderation/service.py
MODERATION_BLOCKED_WORDS: list[str] = []
