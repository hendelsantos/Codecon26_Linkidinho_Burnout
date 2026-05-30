from django.urls import path

from .views import BrasilAnalyticsView, MeuComparativoView, MyScoreView

urlpatterns = [
    path("score/", MyScoreView.as_view(), name="my-score"),
    path("analytics/brasil/", BrasilAnalyticsView.as_view(), name="brasil-analytics"),
    path("analytics/comparativo/", MeuComparativoView.as_view(), name="meu-comparativo"),
]
