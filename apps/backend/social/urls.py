from django.urls import path

from .views import DesabafoListCreateView, FeedView, ReacaoToggleView

urlpatterns = [
    path("feed/", FeedView.as_view(), name="feed"),
    path("desabafos/", DesabafoListCreateView.as_view(), name="desabafos-list"),
    path("desabafos/<uuid:pk>/react/", ReacaoToggleView.as_view(), name="desabafo-react"),
]
