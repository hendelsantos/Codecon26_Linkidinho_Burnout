from django.urls import path

from .views import health_check, product_snapshot

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("snapshot/", product_snapshot, name="product-snapshot"),
]