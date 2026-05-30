from django.urls import path

from .views import CheckInHistoryView, CheckInListCreateView

urlpatterns = [
    path("checkins/", CheckInListCreateView.as_view(), name="checkins"),
    path("checkins/history/", CheckInHistoryView.as_view(), name="checkins-history"),
]
