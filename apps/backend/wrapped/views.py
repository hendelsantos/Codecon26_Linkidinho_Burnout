from django.db.models import Avg, Max, Min, Sum
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from metrics.models import CheckIn


class WrappedView(APIView):
    """Resumo estilo Spotify Wrapped — anual ou mensal (?month=YYYY-MM)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = CheckIn.objects.filter(profile=request.user)

        # Filtro mensal opcional
        month_param = request.query_params.get("month", "")
        period_label = "total"
        if month_param:
            try:
                year, month = int(month_param[:4]), int(month_param[5:7])
                qs = qs.filter(date__year=year, date__month=month)
                period_label = month_param
            except (ValueError, IndexError):
                pass

        total = qs.count()

        if total == 0:
            return Response({"detail": "Nenhum check-in registrado neste período."}, status=404)

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

        coffees_total = agg["coffees"] or 0
        meetings_total = agg["meetings"] or 0
        traffic_minutes = agg["traffic"] or 0

        return Response({
            "period": period_label,
            "checkins_total": total,
            "coffees_total": coffees_total,
            "meetings_total": meetings_total,
            "traffic_hours": round(traffic_minutes / 60, 1),
            "traffic_minutes_total": traffic_minutes,
            "bathroom_revenue_reais": round((agg["bathroom"] or 0) / 100, 2),
            "buzzwords_total": agg["buzzwords"] or 0,
            "burny_score_max": agg["max_score"] or 0,
            "burny_score_min": agg["min_score"] or 0,
            "burny_score_avg": round(agg["avg_score"] or 0, 1),
            "stress_avg": round(agg["avg_stress"] or 0, 1),
            # Equivalências absurdas para exibição
            "equivalencias": {
                "titanic_meetings": round(meetings_total * 1 / 3.3, 1),  # 3h20 cada Titanic
                "netflix_hours": round(traffic_minutes / 60, 1),
                "coffees_litros": round(coffees_total * 0.06, 1),       # 60ml cada
                "buzzwords_musicas": meetings_total * 8,                  # ~8 buzzwords por reunião
            },
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
