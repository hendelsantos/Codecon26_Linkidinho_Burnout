from django.db.models import Avg, Max, Min, Sum
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from metrics.models import CheckIn


class WrappedView(APIView):
    """Resumo anual estilo Spotify Wrapped."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = CheckIn.objects.filter(profile=request.user)
        total = qs.count()

        if total == 0:
            return Response({"detail": "Nenhum check-in registrado ainda."}, status=404)

        agg = qs.aggregate(
            coffees=Sum("coffees"),
            meetings=Sum("useless_meetings"),
            traffic=Sum("traffic_minutes"),
            bathroom=Sum("bathroom_revenue_cents"),
            buzzwords=Sum("buzzwords_endured"),
            max_score=Max("burny_score"),
            min_score=Min("burny_score"),
            avg_score=Avg("burny_score"),
            avg_stress=Avg("stress_level"),
        )

        worst = qs.order_by("-burny_score").first()
        best = qs.order_by("burny_score").first()

        return Response({
            "checkins_total": total,
            "coffees_total": agg["coffees"] or 0,
            "meetings_total": agg["meetings"] or 0,
            "traffic_hours": round((agg["traffic"] or 0) / 60, 1),
            "bathroom_revenue_reais": round((agg["bathroom"] or 0) / 100, 2),
            "buzzwords_total": agg["buzzwords"] or 0,
            "burny_score_max": agg["max_score"] or 0,
            "burny_score_min": agg["min_score"] or 0,
            "burny_score_avg": round(agg["avg_score"] or 0, 1),
            "stress_avg": round(agg["avg_stress"] or 0, 1),
            "worst_day": {
                "date": str(worst.date),
                "score": worst.burny_score,
                "insight": worst.burny_insight,
            } if worst else None,
            "best_day": {
                "date": str(best.date),
                "score": best.burny_score,
                "insight": best.burny_insight,
            } if best else None,
            "profile": {
                "nickname": request.user.nickname,
                "emoji": request.user.avatar_emoji,
                "area": request.user.get_area_display(),
                "region": request.user.region,
            },
        })

