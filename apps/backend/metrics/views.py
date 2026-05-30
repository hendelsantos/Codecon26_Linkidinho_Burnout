from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from moderation.service import moderate

from .models import CheckIn
from .serializers import CheckInSerializer


class CheckInListCreateView(generics.ListCreateAPIView):
    serializer_class = CheckInSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CheckIn.objects.filter(profile=self.request.user)

    def create(self, request, *args, **kwargs):
        note = request.data.get("note", "")
        if note:
            result = moderate(note)
            if not result.safe:
                return Response({"detail": result.reason}, status=400)
        return super().create(request, *args, **kwargs)


class CheckInHistoryView(APIView):
    """Últimos 30 check-ins do usuário formatados para gráfico."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = (
            CheckIn.objects.filter(profile=request.user)
            .order_by("date")
            .values("date", "burny_score", "coffees", "useless_meetings", "traffic_minutes", "stress_level")[:30]
        )
        return Response(list(qs))
