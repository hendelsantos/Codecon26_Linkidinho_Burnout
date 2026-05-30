from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("nickname", "area", "region", "created_at")
    search_fields = ("nickname", "region")
    list_filter = ("area", "region")
