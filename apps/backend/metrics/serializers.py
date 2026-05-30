from rest_framework import serializers

from ai.services import insight_for
from analytics.services import compute_burny_score, dominant_metric

from .models import CheckIn


class CheckInSerializer(serializers.ModelSerializer):
    burny_score = serializers.IntegerField(read_only=True)
    burny_insight = serializers.CharField(read_only=True)

    class Meta:
        model = CheckIn
        fields = [
            "id",
            "date",
            "coffees",
            "useless_meetings",
            "traffic_minutes",
            "stress_level",
            "bathroom_revenue_cents",
            "buzzwords_endured",
            "note",
            "burny_score",
            "burny_insight",
            "created_at",
        ]
        read_only_fields = ["id", "burny_score", "burny_insight", "created_at"]

    def validate_stress_level(self, value: int) -> int:
        if not 0 <= value <= 10:
            raise serializers.ValidationError("stress_level deve estar entre 0 e 10.")
        return value

    def create(self, validated_data):
        profile = self.context["request"].user
        breakdown = compute_burny_score(validated_data)
        validated_data["burny_score"] = breakdown.total
        validated_data["burny_insight"] = insight_for(dominant_metric(validated_data))
        validated_data["profile"] = profile
        return super().create(validated_data)
