from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db import models as django_models

from .badges import compute_badges
from .models import BURNY_SKILLS, ConviteAmigo, Follow, Profile, SkillEndorsement
from .serializers import ProfileCreateSerializer, ProfileDetailSerializer, ProfilePublicSerializer


class LoginView(APIView):
    """Login com apelido + senha → retorna access_token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        nickname = request.data.get("nickname", "").strip()
        password = request.data.get("password", "")

        if not nickname or not password:
            return Response({"detail": "Apelido e senha são obrigatórios."}, status=400)

        profiles = Profile.objects.filter(nickname=nickname).exclude(password_hash="")
        for profile in profiles:
            if profile.check_password(password):
                return Response({"access_token": str(profile.access_token)})

        return Response({"detail": "Apelido ou senha incorretos."}, status=401)


class ProfileCreateView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileCreateSerializer
    permission_classes = [permissions.AllowAny]


class CurrentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfilePublicSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        """Atualiza campos do perfil próprio (salário mensal, area, region, avatar, nickname)."""
        allowed = {"monthly_salary_cents", "area", "region", "avatar_emoji", "nickname"}
        data = {k: v for k, v in request.data.items() if k in allowed}
        for field, value in data.items():
            setattr(request.user, field, value)
        request.user.save(update_fields=list(data.keys()))
        serializer = ProfilePublicSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class PublicProfileView(APIView):
    """Perfil público de qualquer usuário — o 'linkedin profile' do burnout."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response({"detail": "Profissional em burnout não encontrado."}, status=404)

        serializer = ProfileDetailSerializer(profile, context={"request": request})
        return Response(serializer.data)


class FollowToggleView(APIView):
    """Seguir ou deixar de seguir um profissional em colapso."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if str(request.user.id) == str(pk):
            return Response({"detail": "Você não pode se seguir (já basta o esgotamento)."}, status=400)

        try:
            target = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=404)

        follow, created = Follow.objects.get_or_create(
            follower=request.user, following=target
        )
        if not created:
            follow.delete()
            return Response(
                {
                    "action": "unfollowed",
                    "followers_count": target.followers_set.count(),
                }
            )

        return Response(
            {
                "action": "followed",
                "followers_count": target.followers_set.count(),
            },
            status=201,
        )


class SkillEndorseView(APIView):
    """Endossar (ou remover endosso de) uma Burny Skill de alguém."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if str(request.user.id) == str(pk):
            return Response({"detail": "Você não pode endossar suas próprias habilidades de sofrimento."}, status=400)

        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=404)

        skill = request.data.get("skill")
        valid_skills = [s[0] for s in BURNY_SKILLS]
        if skill not in valid_skills:
            return Response({"detail": f"Skill inválida. Use: {valid_skills}"}, status=400)

        endorsement, created = SkillEndorsement.objects.get_or_create(
            endorser=request.user, profile=profile, skill=skill
        )
        if not created:
            endorsement.delete()
            return Response({"action": "removed", "skill": skill})

        return Response({"action": "endorsed", "skill": skill}, status=201)


class BadgesView(APIView):
    """Badges de conquista do usuário autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        badges = compute_badges(request.user)
        return Response([
            {
                "id": b.id,
                "emoji": b.emoji,
                "name": b.name,
                "description": b.description,
                "earned": b.earned,
            }
            for b in badges
        ])


# ──── Convites ────────────────────────────────────────────────────────────────

TIPOS_RELACAO = {t[0]: t[1] for t in ConviteAmigo.TIPOS}


class ConviteListCreateView(APIView):
    """Lista os convites do usuário ou cria um novo por tipo de relação."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        convites = ConviteAmigo.objects.filter(remetente=request.user)
        data = [
            {
                "codigo": c.codigo,
                "tipo_relacao": c.tipo_relacao,
                "tipo_label": c.get_tipo_relacao_display(),
                "usos": c.usos,
            }
            for c in convites
        ]
        return Response(data)

    def post(self, request):
        tipo = request.data.get("tipo_relacao", "")
        if tipo not in TIPOS_RELACAO:
            return Response(
                {"detail": f"Tipo inválido. Use: {list(TIPOS_RELACAO.keys())}"},
                status=400,
            )
        convite, _ = ConviteAmigo.objects.get_or_create(
            remetente=request.user, tipo_relacao=tipo
        )
        return Response(
            {
                "codigo": convite.codigo,
                "tipo_relacao": convite.tipo_relacao,
                "tipo_label": convite.get_tipo_relacao_display(),
                "usos": convite.usos,
            },
            status=201,
        )


class ConviteInfoView(APIView):
    """Info pública de um convite pelo código — exibida no onboarding."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, codigo):
        try:
            convite = ConviteAmigo.objects.select_related("remetente").get(codigo=codigo)
        except ConviteAmigo.DoesNotExist:
            return Response({"detail": "Convite não encontrado."}, status=404)
        return Response(
            {
                "codigo": convite.codigo,
                "tipo_relacao": convite.tipo_relacao,
                "tipo_label": convite.get_tipo_relacao_display(),
                "remetente_nickname": convite.remetente.nickname,
                "remetente_avatar": convite.remetente.avatar_emoji,
                "usos": convite.usos,
            }
        )


class ConviteUsarView(APIView):
    """Registra o uso de um convite (chamado após cadastro bem-sucedido)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, codigo):
        updated = ConviteAmigo.objects.filter(codigo=codigo).update(
            usos=django_models.F("usos") + 1
        )
        if not updated:
            return Response({"detail": "Convite não encontrado."}, status=404)
        return Response({"ok": True})

