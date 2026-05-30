from django.contrib import admin

from .models import CheckIn


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ("profile", "date", "burny_score", "coffees", "useless_meetings")
    list_filter = ("date",)
    search_fields = ("profile__nickname",)
