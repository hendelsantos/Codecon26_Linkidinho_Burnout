from datetime import timedelta

from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from metrics.models import CheckIn


class MyScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user
        last_7 = timezone.localdate() - timedelta(days=6)
        qs = CheckIn.objects.filter(profile=profile, date__gte=last_7)
        latest = qs.order_by("-date").first()
        agg = qs.aggregate(
            avg_score=Avg("burny_score"),
            total_coffees=Sum("coffees"),
            total_meetings=Sum("useless_meetings"),
            total_traffic=Sum("traffic_minutes"),
            total_revenue=Sum("bathroom_revenue_cents"),
        )
        return Response(
            {
                "current_score": latest.burny_score if latest else 0,
                "current_insight": latest.burny_insight if latest else "",
                "week_average": round(agg["avg_score"] or 0),
                "week_totals": {
                    "coffees": agg["total_coffees"] or 0,
                    "useless_meetings": agg["total_meetings"] or 0,
                    "traffic_minutes": agg["total_traffic"] or 0,
                    "bathroom_revenue_cents": agg["total_revenue"] or 0,
                },
                "history": [
                    {"date": c.date.isoformat(), "score": c.burny_score}
                    for c in qs.order_by("date")
                ],
            }
        )


class BrasilAnalyticsView(APIView):
    """Agregados públicos do Brasil corporativo — sem autenticação."""
    permission_classes = []

    def get(self, request):
        from users.models import Profile

        total_usuarios = Profile.objects.count()
        total_checkins = CheckIn.objects.count()

        nacional = CheckIn.objects.aggregate(
            avg_score=Avg("burny_score"),
            avg_cafes=Avg("coffees"),
            avg_reunioes=Avg("useless_meetings"),
            avg_transito=Avg("traffic_minutes"),
            avg_stress=Avg("stress_level"),
            avg_buzzwords=Avg("buzzwords_endured"),
        )

        por_area = (
            CheckIn.objects.select_related("profile")
            .values("profile__area")
            .annotate(
                avg_score=Avg("burny_score"),
                avg_cafes=Avg("coffees"),
                avg_reunioes=Avg("useless_meetings"),
                total=Count("id"),
            )
            .order_by("-avg_score")
        )

        AREA_LABELS = {
            "dev": "Desenvolvimento",
            "design": "Design",
            "product": "Produto",
            "ops": "Operações",
            "data": "Dados",
            "qa": "QA",
            "management": "Gestão",
            "sales": "Vendas",
            "marketing": "Marketing",
            "other": "Outros",
        }

        return Response(
            {
                "total_usuarios": total_usuarios,
                "total_checkins": total_checkins,
                "media_nacional": {
                    "burny_score": round(nacional["avg_score"] or 0),
                    "cafes_por_dia": round(nacional["avg_cafes"] or 0, 1),
                    "reunioes_por_dia": round(nacional["avg_reunioes"] or 0, 1),
                    "minutos_transito": round(nacional["avg_transito"] or 0),
                    "stress": round(nacional["avg_stress"] or 0, 1),
                    "buzzwords": round(nacional["avg_buzzwords"] or 0, 1),
                },
                "por_area": [
                    {
                        "area": a["profile__area"],
                        "area_label": AREA_LABELS.get(a["profile__area"] or "other", "Outros"),
                        "avg_score": round(a["avg_score"] or 0),
                        "avg_cafes": round(a["avg_cafes"] or 0, 1),
                        "avg_reunioes": round(a["avg_reunioes"] or 0, 1),
                        "total_checkins": a["total"],
                    }
                    for a in por_area
                    if a["profile__area"]
                ],
            }
        )


class MeuComparativoView(APIView):
    """Compara o usuário logado com a média nacional e da sua área."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user
        last_7 = timezone.localdate() - timedelta(days=6)

        user_agg = CheckIn.objects.filter(
            profile=profile, date__gte=last_7
        ).aggregate(
            avg_score=Avg("burny_score"),
            avg_cafes=Avg("coffees"),
            avg_reunioes=Avg("useless_meetings"),
            avg_stress=Avg("stress_level"),
        )

        nacional = CheckIn.objects.aggregate(
            avg_score=Avg("burny_score"),
            avg_cafes=Avg("coffees"),
            avg_reunioes=Avg("useless_meetings"),
        )

        area_agg = CheckIn.objects.filter(profile__area=profile.area).aggregate(
            avg_score=Avg("burny_score"),
            avg_cafes=Avg("coffees"),
            avg_reunioes=Avg("useless_meetings"),
        )

        user_score = round(user_agg["avg_score"] or 0)
        nacional_score = round(nacional["avg_score"] or 0)
        area_score = round(area_agg["avg_score"] or 0)

        return Response(
            {
                "usuario": {
                    "avg_score": user_score,
                    "avg_cafes": round(user_agg["avg_cafes"] or 0, 1),
                    "avg_reunioes": round(user_agg["avg_reunioes"] or 0, 1),
                    "avg_stress": round(user_agg["avg_stress"] or 0, 1),
                    "area": profile.area,
                    "area_label": profile.get_area_display(),
                },
                "media_nacional": {
                    "avg_score": nacional_score,
                    "avg_cafes": round(nacional["avg_cafes"] or 0, 1),
                    "avg_reunioes": round(nacional["avg_reunioes"] or 0, 1),
                },
                "media_area": {
                    "avg_score": area_score,
                    "avg_cafes": round(area_agg["avg_cafes"] or 0, 1),
                    "avg_reunioes": round(area_agg["avg_reunioes"] or 0, 1),
                },
                "vs_nacional": user_score - nacional_score,
                "vs_area": user_score - area_score,
            }
        )
