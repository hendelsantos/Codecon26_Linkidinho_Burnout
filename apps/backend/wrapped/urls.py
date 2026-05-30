from django.urls import path

from .views import WrappedView

urlpatterns = [
    path("wrapped/", WrappedView.as_view(), name="wrapped"),
]
