from django.urls import path

from .views import RankingsView

urlpatterns = [
    path("rankings/", RankingsView.as_view(), name="rankings"),
]
