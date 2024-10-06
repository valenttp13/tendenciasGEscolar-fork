from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Courses
from .serializers import CoursesSerializer

class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        return Courses.objects.all()
