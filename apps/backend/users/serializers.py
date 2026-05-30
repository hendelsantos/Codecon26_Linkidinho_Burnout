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

    class Meta(ProfilePublicSerializer.Meta):
        fields = ProfilePublicSerializer.Meta.fields + ["skills", "is_following"]
        read_only_fields = ProfilePublicSerializer.Meta.read_only_fields + ["skills", "is_following"]

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
