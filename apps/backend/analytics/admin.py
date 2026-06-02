from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html

from .models import PageVisit


@admin.register(PageVisit)
class PageVisitAdmin(admin.ModelAdmin):
    list_display = ("path", "created_at", "referer_short", "user_agent_short")
    list_filter = ("created_at",)
    search_fields = ("path", "referer", "user_agent")
    readonly_fields = ("path", "referer", "user_agent", "ip_hash", "created_at")
    date_hierarchy = "created_at"

    def referer_short(self, obj):
        return obj.referer[:60] or "—"
    referer_short.short_description = "Referer"

    def user_agent_short(self, obj):
        return obj.user_agent[:60] or "—"
    user_agent_short.short_description = "User Agent"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        qs = self.get_queryset(request)
        extra_context["total_visitas"] = qs.count()
        extra_context["top_paginas"] = (
            qs.values("path")
            .annotate(total=Count("id"))
            .order_by("-total")[:10]
        )
        return super().changelist_view(request, extra_context=extra_context)
