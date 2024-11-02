from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from .models import Estudiante
from .serializers import EstudianteSerializer
from modules.users.permissions import IsAdmin, IsProfessorOrAdmin

@extend_schema(tags=['Students'])
class EstudianteViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar los estudiantes del sistema.
    - Administrativos: CRUD completo de estudiantes.
    - Profesores: Solo lectura de estudiantes asignados.
    """
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsProfessorOrAdmin]  # Profesores y administrativos pueden ver la lista de estudiantes
        else:
            self.permission_classes = [IsAdmin]  # Solo los administrativos pueden crear, actualizar y eliminar
        return super().get_permissions()
