from rest_framework import viewsets
from .models import Students
from .serializers import StudentsSerializer

class StudentsViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all()
    serializer_class = StudentsSerializer
