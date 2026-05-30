from django.http import JsonResponse
from django.utils import timezone


def health_check(_request):
	return JsonResponse(
		{
			"status": "operational",
			"service": "burny-out-backend",
			"tagline": "Your burnout has charts now.",
			"timestamp": timezone.now().isoformat(),
		}
	)


def product_snapshot(_request):
	return JsonResponse(
		{
			"network": "BurnyOut",
			"mode": "corporate suffering analytics",
			"features": [
				"burny-score",
				"global-rankings",
				"burny-ai-insights",
				"wrapped-corporativo",
			],
			"safety": "satira sem ataques pessoais",
		}
	)

# Create your views here.
