from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Profile


class AccessTokenAuthentication(BaseAuthentication):
    """Autenticacao por header X-Access-Token vinculado a um Profile."""

    keyword = "X-Access-Token"

    def authenticate(self, request):
        token = request.headers.get(self.keyword)
        if not token:
            return None
        try:
            profile = Profile.objects.get(access_token=token)
        except (Profile.DoesNotExist, ValueError):
            raise AuthenticationFailed("Token invalido ou expirado.")
        return (profile, None)

    def authenticate_header(self, request):
        return self.keyword
