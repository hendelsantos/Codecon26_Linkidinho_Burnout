from rest_framework import generics, permissions

from .models import CheckIn
from .serializers import CheckInSerializer


class CheckInListCreateView(generics.ListCreateAPIView):
    serializer_class = CheckInSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CheckIn.objects.filter(profile=self.request.user)
