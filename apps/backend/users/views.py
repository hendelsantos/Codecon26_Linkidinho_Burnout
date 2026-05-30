from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BURNY_SKILLS, Follow, Profile, SkillEndorsement
from .serializers import ProfileCreateSerializer, ProfileDetailSerializer, ProfilePublicSerializer


class ProfileCreateView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileCreateSerializer
    permission_classes = [permissions.AllowAny]


class CurrentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
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
