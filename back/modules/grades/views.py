from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from django.db import transaction

from .models import Calificacion
from .serializers import CalificacionSerializer
from modules.courses.models import Curso  # Importar Curso para la validación
from modules.users.permissions import IsAdmin, IsProfessor, IsOwnerOrAdmin, IsProfessorOrAdmin


@extend_schema(tags=['Grades'])
class CalificacionViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar las calificaciones de los estudiantes.
    - Administrativos: CRUD completo de calificaciones.
    - Profesores: CRUD de calificaciones para sus estudiantes.
    - Estudiantes: Solo lectura de sus propias calificaciones.
    """
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsProfessor]  # Profesores pueden ver las calificaciones de sus estudiantes
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsProfessorOrAdmin]  # Profesores y administrativos pueden gestionar calificaciones
        else:
            self.permission_classes = [IsOwnerOrAdmin]  # Estudiantes pueden ver solo sus calificaciones
        return super().get_permissions()

    def get_queryset(self):
        """
        Filtra las calificaciones según el rol del usuario:
        - Administrativos: Todas las calificaciones.
        - Profesores: Solo las calificaciones de los cursos que imparte.
        - Estudiantes: Solo sus propias calificaciones.
        """
        user = self.request.user
        if user.role == 'profesor':
            return Calificacion.objects.filter(curso__profesor__user=user)
        elif user.role == 'estudiante':
            return Calificacion.objects.filter(estudiante__user=user)
        return super().get_queryset()

    @extend_schema(summary="Obtener calificaciones por curso", description="Devuelve todas las calificaciones de un curso específico")
    @action(detail=False, methods=['get'], url_path='course-grades/(?P<course_id>[^/.]+)')
    def get_grades_by_course(self, request, course_id=None):
        """
        Endpoint personalizado para obtener las calificaciones de un curso específico.
        """
        try:
            curso = Curso.objects.get(id=course_id)
        except Curso.DoesNotExist:
            return Response({"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        calificaciones = Calificacion.objects.filter(curso=curso)
        serializer = self.get_serializer(calificaciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic  # Usar transacciones para garantizar consistencia
    def create(self, request, *args, **kwargs):
        """
        Crear o actualizar calificaciones basadas en la cantidad de notas del curso.
        """
        curso_id = request.data.get('curso')
        grades = request.data.get('grades', [])

        if not curso_id or not grades:
            return Response({"error": "El curso y las calificaciones son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({"error": "El curso especificado no existe."}, status=status.HTTP_404_NOT_FOUND)

        if not isinstance(grades, list) or not grades:
            return Response({"error": "El campo 'grades' debe ser una lista de calificaciones."}, status=status.HTTP_400_BAD_REQUEST)

        calificaciones_creadas = []
        for grade in grades:
            estudiante_id = grade.get('estudiante')
            descripcion = grade.get('descripcion', '')
            fecha_evaluacion = grade.get('fecha_evaluacion')

            if not estudiante_id:
                return Response({"error": "Cada calificación debe tener un 'estudiante' asociado."}, status=status.HTTP_400_BAD_REQUEST)

            calificacion_keys = [f'calificacion{i + 1}' for i in range(curso.cantidad_notas)]
            calificaciones = {}

            for key in calificacion_keys:
                value = grade.get(key, 0)
                try:
                    calificaciones[key] = float(value)
                except ValueError:
                    calificaciones[key] = 0

            try:
                calificacion, created = Calificacion.objects.update_or_create(
                    curso=curso,
                    estudiante_id=estudiante_id,
                    defaults={
                        'notas': calificaciones,
                        'descripcion': descripcion,
                        'fecha_evaluacion': fecha_evaluacion
                    }
                )
                calificaciones_creadas.append(calificacion)
            except Exception as e:
                return Response({"error": f"Error creando la calificación para el estudiante {estudiante_id}: {str(e)}"},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(calificaciones_creadas, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED if calificaciones_creadas else status.HTTP_200_OK)
