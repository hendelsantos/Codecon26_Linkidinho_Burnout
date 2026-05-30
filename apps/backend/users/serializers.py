from rest_framework import serializers

from .models import Profile


class ProfilePublicSerializer(serializers.ModelSerializer):
    area_label = serializers.CharField(source="get_area_display", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "nickname",
            "avatar_emoji",
            "region",
            "area",
            "area_label",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "area_label"]


class ProfileCreateSerializer(serializers.ModelSerializer):
    access_token = serializers.UUIDField(read_only=True)

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
        ]
        read_only_fields = ["id", "access_token", "created_at"]
