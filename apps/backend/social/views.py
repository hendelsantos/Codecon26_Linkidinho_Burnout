from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services import feed_line
from metrics.models import CheckIn
from moderation.service import moderate

from .models import Desabafo, Reacao
from .serializers import DesabafoSerializer


class FeedView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        limit = min(int(request.query_params.get("limit", 30)), 100)
        checkins = (
            CheckIn.objects.select_related("profile")
            .order_by("-created_at")[:limit]
        )
        items = []
        for checkin in checkins:
            profile = checkin.profile
            items.append(
                {
                    "id": str(checkin.id),
                    "author": profile.nickname,
                    "avatar_emoji": profile.avatar_emoji,
                    "role": profile.get_area_display(),
                    "region": profile.region,
                    "burny_score": checkin.burny_score,
                    "message": feed_line(profile, checkin),
                    "insight": checkin.burny_insight,
                    "created_at": checkin.created_at.isoformat(),
                }
            )
        return Response({"count": len(items), "results": items})


class DesabafoListCreateView(APIView):
    """Lista desabafos públicos ou cria um novo (requer autenticação)."""

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        limit = min(int(request.query_params.get("limit", 30)), 100)
        qs = (
            Desabafo.objects.select_related("author")
            .prefetch_related("reacoes")
            .order_by("-created_at")[:limit]
        )
        serializer = DesabafoSerializer(qs, many=True, context={"request": request})
        return Response({"count": len(serializer.data), "results": serializer.data})

    def post(self, request):
        serializer = DesabafoSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        texto = serializer.validated_data.get("texto", "")
        result = moderate(texto)
        if not result.safe:
            return Response({"detail": result.reason}, status=400)

        serializer.save(author=request.user)
        return Response(serializer.data, status=201)


class ReacaoToggleView(APIView):
    """Adiciona ou remove uma reação de um Desabafo."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            desabafo = Desabafo.objects.get(pk=pk)
        except Desabafo.DoesNotExist:
            return Response({"detail": "Desabafo não encontrado."}, status=404)

        emoji = request.data.get("emoji")
        valid_emojis = [c[0] for c in Reacao.EMOJI_CHOICES]
        if emoji not in valid_emojis:
            return Response(
                {"detail": f"Emoji inválido. Use: {valid_emojis}"},
                status=400,
            )

        reacao, created = Reacao.objects.get_or_create(
            profile=request.user,
            desabafo=desabafo,
            defaults={"emoji": emoji},
        )

        if not created:
            if reacao.emoji == emoji:
                # Mesma reação → remove (toggle off)
                reacao.delete()
                return Response({"action": "removed", "emoji": emoji})
            else:
                # Troca a reação
                reacao.emoji = emoji
                reacao.save(update_fields=["emoji"])
                return Response({"action": "changed", "emoji": emoji})

        return Response({"action": "added", "emoji": emoji}, status=201)
