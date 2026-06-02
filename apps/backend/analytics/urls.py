from django.urls import path

from .views import (
    BathroomRankingView,
    BrasilAnalyticsView,
    MeuComparativoView,
    MyScoreView,
    PageViewPingView,
    PageViewSummaryView,
)

urlpatterns = [
    path("score/", MyScoreView.as_view(), name="my-score"),
    path("analytics/brasil/", BrasilAnalyticsView.as_view(), name="brasil-analytics"),
    path("analytics/comparativo/", MeuComparativoView.as_view(), name="meu-comparativo"),
    path("analytics/bathroom/", BathroomRankingView.as_view(), name="bathroom-ranking"),
    # Page view tracking
    path("pageviews/ping/", PageViewPingView.as_view(), name="pageview-ping"),
    path("pageviews/summary/", PageViewSummaryView.as_view(), name="pageview-summary"),
]
