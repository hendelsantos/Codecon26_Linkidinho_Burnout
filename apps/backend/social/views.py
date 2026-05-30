from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services import feed_line
from metrics.models import CheckIn


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
