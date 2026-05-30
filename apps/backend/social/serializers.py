from rest_framework import serializers

from users.serializers import ProfilePublicSerializer

from .models import Desabafo, Reacao

EMOJI_MAP = {
    "choro": "😭",
    "morto": "💀",
    "cafe": "☕",
    "fogo": "🔥",
    "abraco": "🤝",
}


class DesabafoSerializer(serializers.ModelSerializer):
    author = ProfilePublicSerializer(read_only=True)
    nivel_label = serializers.CharField(source="get_nivel_display", read_only=True)
    reaction_counts = serializers.SerializerMethodField()
    viewer_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Desabafo
        fields = [
            "id",
            "author",
            "content",
            "nivel",
            "nivel_label",
            "reaction_counts",
            "viewer_reaction",
            "created_at",
        ]
        read_only_fields = ["id", "author", "nivel_label", "reaction_counts", "viewer_reaction", "created_at"]

    def get_reaction_counts(self, obj):
        qs = obj.reacoes.all()
        counts = {key: 0 for key in EMOJI_MAP}
        for r in qs:
            if r.emoji in counts:
                counts[r.emoji] += 1
        # Converte para lista de objetos com emoji unicode
        return [{"key": k, "emoji": EMOJI_MAP[k], "count": counts[k]} for k in counts]

    def get_viewer_reaction(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not getattr(request.user, "is_authenticated", False):
            return None
        try:
            r = obj.reacoes.get(profile=request.user)
            return r.emoji
        except Reacao.DoesNotExist:
            return None
