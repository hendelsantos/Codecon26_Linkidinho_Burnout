from django.urls import path

from .views import (
    BadgesView,
    ConviteInfoView,
    ConviteListCreateView,
    ConviteUsarView,
    CurrentProfileView,
    FollowToggleView,
    LoginView,
    ProfileCreateView,
    PublicProfileView,
    SkillEndorseView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("profiles/", ProfileCreateView.as_view(), name="profiles-create"),
    path("profiles/me/", CurrentProfileView.as_view(), name="profiles-me"),
    path("profiles/me/badges/", BadgesView.as_view(), name="profiles-badges"),
    path("profiles/<uuid:pk>/", PublicProfileView.as_view(), name="profiles-detail"),
    path("profiles/<uuid:pk>/follow/", FollowToggleView.as_view(), name="profiles-follow"),
    path("profiles/<uuid:pk>/endorse/", SkillEndorseView.as_view(), name="profiles-endorse"),
    # Convites
    path("convites/", ConviteListCreateView.as_view(), name="convites-list-create"),
    path("convites/<str:codigo>/", ConviteInfoView.as_view(), name="convites-info"),
    path("convites/<str:codigo>/usar/", ConviteUsarView.as_view(), name="convites-usar"),
]
