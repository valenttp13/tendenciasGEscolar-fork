from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Grades 
from .serializers import GradesSerializer

class GradesViewSet(viewsets.ModelViewSet):
    queryset = Grades.objects.all()
    serializer_class = GradesSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        return Grades.objects.all()
