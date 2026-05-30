from django.urls import path

from .views import CurrentProfileView, ProfileCreateView

urlpatterns = [
    path("profiles/", ProfileCreateView.as_view(), name="profiles-create"),
    path("profiles/me/", CurrentProfileView.as_view(), name="profiles-me"),
]
