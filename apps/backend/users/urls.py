from django.urls import path

from .views import CurrentProfileView, FollowToggleView, LoginView, ProfileCreateView, PublicProfileView, SkillEndorseView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("profiles/", ProfileCreateView.as_view(), name="profiles-create"),
    path("profiles/me/", CurrentProfileView.as_view(), name="profiles-me"),
    path("profiles/<uuid:pk>/", PublicProfileView.as_view(), name="profiles-detail"),
    path("profiles/<uuid:pk>/follow/", FollowToggleView.as_view(), name="profiles-follow"),
    path("profiles/<uuid:pk>/endorse/", SkillEndorseView.as_view(), name="profiles-endorse"),
]
