from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from .models import Profesor
from .serializers import ProfesorSerializer
from modules.users.permissions import IsAdmin

@extend_schema(tags=['Teachers'])
class ProfesorViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar los profesores del sistema.
    Solo los usuarios administrativos pueden gestionar profesores.
    """
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer
    permission_classes = [IsAdmin]
