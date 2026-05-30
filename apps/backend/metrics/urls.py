from django.urls import path

from .views import CheckInListCreateView

urlpatterns = [
    path("checkins/", CheckInListCreateView.as_view(), name="checkins"),
]
