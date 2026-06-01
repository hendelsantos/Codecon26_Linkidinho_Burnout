from rest_framework import serializers

from .models import BURNY_SKILLS, Profile, SkillEndorsement


class ProfilePublicSerializer(serializers.ModelSerializer):
    area_label = serializers.CharField(source="get_area_display", read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "id",
            "nickname",
            "avatar_emoji",
            "region",
            "area",
            "area_label",
            "followers_count",
            "following_count",
            "monthly_salary_cents",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "area_label", "followers_count", "following_count"]

    def get_followers_count(self, obj):
        return obj.followers_set.count()

    def get_following_count(self, obj):
        return obj.following_set.count()


class ProfileDetailSerializer(ProfilePublicSerializer):
    """Perfil público completo com skills e stats de desabafos."""

    skills = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    burnout_stats = serializers.SerializerMethodField()

    class Meta(ProfilePublicSerializer.Meta):
        fields = ProfilePublicSerializer.Meta.fields + ["skills", "is_following", "burnout_stats"]
        read_only_fields = ProfilePublicSerializer.Meta.read_only_fields + ["skills", "is_following", "burnout_stats"]

    def get_skills(self, obj):
        from django.db.models import Count
        endorsements = (
            SkillEndorsement.objects.filter(profile=obj)
            .values("skill")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        skill_map = dict(BURNY_SKILLS)
        return [
            {"key": e["skill"], "label": skill_map.get(e["skill"], e["skill"]), "count": e["count"]}
            for e in endorsements
        ]

    def get_is_following(self, obj):
        request = self.context.get("request")
        if not request or not getattr(request.user, "is_authenticated", False):
            return False
        from .models import Follow
        return Follow.objects.filter(follower=request.user, following=obj).exists()

    def get_burnout_stats(self, obj):
        from datetime import date, timedelta

        from django.db.models import Avg, Max, Sum
        from metrics.models import CheckIn

        qs = CheckIn.objects.filter(profile=obj)
        total = qs.count()
        if total == 0:
            return {
                "checkins_total": 0, "coffees_total": 0, "meetings_total": 0,
                "bathroom_revenue_reais": 0, "burny_score_avg": 0,
                "burny_score_max": 0, "xp_total": 0, "streak": 0,
            }
        agg = qs.aggregate(
            coffees=Sum("coffees"),
            meetings=Sum("useless_meetings"),
            bathroom=Sum("bathroom_revenue_cents"),
            avg_score=Avg("burny_score"),
            max_score=Max("burny_score"),
            xp=Sum("burny_score"),
        )

        # Streak: dias consecutivos de check-in até hoje
        dates = sorted(qs.values_list("date", flat=True), reverse=True)
        streak = 0
        today = date.today()
        for i, d in enumerate(dates):
            if d == today - timedelta(days=i):
                streak += 1
            else:
                break

        return {
            "checkins_total": total,
            "coffees_total": agg["coffees"] or 0,
            "meetings_total": agg["meetings"] or 0,
            "bathroom_revenue_reais": round((agg["bathroom"] or 0) / 100, 2),
            "burny_score_avg": round(agg["avg_score"] or 0, 1),
            "burny_score_max": agg["max_score"] or 0,
            "xp_total": agg["xp"] or 0,
            "streak": streak,
        }


class ProfileCreateSerializer(serializers.ModelSerializer):
    access_token = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True, min_length=6, required=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "nickname",
            "avatar_emoji",
            "region",
            "area",
            "access_token",
            "created_at",
            "password",
        ]
        read_only_fields = ["id", "access_token", "created_at"]

    def create(self, validated_data):
        raw = validated_data.pop("password")
        profile = Profile(**validated_data)
        profile.set_password(raw)
        profile.save()
        return profile
