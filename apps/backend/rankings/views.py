from datetime import timedelta

from django.db.models import Avg, Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Profile


class RankingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        since = timezone.localdate() - timedelta(days=6)
        category = request.query_params.get("category", "burnout")

        agg_field = {
            "burnout": ("avg_score", Avg("checkins__burny_score")),
            "coffees": ("total", Sum("checkins__coffees")),
            "meetings": ("total", Sum("checkins__useless_meetings")),
            "traffic": ("total", Sum("checkins__traffic_minutes")),
            "bathroom": ("total", Sum("checkins__bathroom_revenue_cents")),
        }.get(category, ("avg_score", Avg("checkins__burny_score")))

        alias, expression = agg_field
        profiles = (
            Profile.objects.filter(checkins__date__gte=since)
            .annotate(**{alias: expression})
            .order_by(f"-{alias}")[:10]
        )

        return Response(
            {
                "category": category,
                "since": since.isoformat(),
                "results": [
                    {
                        "id": str(profile.id),
                        "nickname": profile.nickname,
                        "avatar_emoji": profile.avatar_emoji,
                        "area": profile.get_area_display(),
                        "region": profile.region,
                        "value": round(getattr(profile, alias) or 0),
                    }
                    for profile in profiles
                ],
            }
        )
