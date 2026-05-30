from datetime import timedelta

from django.db.models import Avg, Sum
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
