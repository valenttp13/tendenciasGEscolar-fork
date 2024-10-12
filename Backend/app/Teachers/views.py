from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Teachers
from .serializers import TeachersSerializer

class TeachersViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.all()
    serializer_class = TeachersSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        return Teachers.objects.all()
