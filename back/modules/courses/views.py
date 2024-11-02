# modules/courses/views.py

from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from modules.students.serializers import EstudianteSerializer
from .models import Curso
from .serializers import CursoSerializer
from modules.students.models import Estudiante
from modules.teachers.models import Profesor
from modules.users.models import User
from modules.users.serializers import UserSerializer
from modules.users.permissions import IsAdmin, IsProfessorOrAdmin


@extend_schema(tags=['Courses'])
class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_students', 'update_user_and_assign_courses']:
            self.permission_classes = [IsAuthenticated]  # Permitir a cualquier usuario autenticado
        else:
            self.permission_classes = [IsAdmin]  # Solo los administrativos pueden crear, actualizar y eliminar
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'profesor':
            queryset = Curso.objects.filter(profesor__user=user).distinct()
        elif user.role == 'estudiante':
            estudiante = Estudiante.objects.get(user=user)
            queryset = Curso.objects.filter(estudiantes=estudiante).distinct()
        elif user.role == 'administrativo':
            queryset = Curso.objects.all()
        else:
            queryset = Curso.objects.none()
        return queryset

    @extend_schema(
        summary="Actualizar usuario y asignar cursos (profesor o estudiante)",
        description="Actualiza la información del usuario y asigna un profesor o un estudiante a cursos en un solo request.",
        responses={200: "Datos y roles actualizados correctamente"}
    )
    @action(detail=False, methods=['post'], url_path='update-user-and-assign-courses', permission_classes=[IsAdmin])
    def update_user_and_assign_courses(self, request):
        print(request.data['roles'].get('user_data'))

        data = request.data['roles']
        role_type = data.get('role_type')
        cursos_ids = data.get('cursos', [])
        user_id = data.get('user_id')
        user_data = data.get('user_data')

        if role_type not in ['estudiante', 'profesor']:
                return Response({"error": f"El tipo de rol '{role_type}' no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
                # Actualizar los datos del usuario
                user = User.objects.get(pk=user_id)
                serializer = UserSerializer(user, data=user_data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                if role_type == 'estudiante':
                    estudiante = Estudiante.objects.get(user=user)
                    cursos = Curso.objects.filter(id__in=cursos_ids)
                    
                    for curso in cursos:
                        if estudiante not in curso.estudiantes.all():
                            curso.estudiantes.add(estudiante)

                elif role_type == 'profesor':
                    profesor = Profesor.objects.get(user=user)
                    cursos = Curso.objects.filter(id__in=cursos_ids)

                    for curso in cursos:
                        curso.profesor = profesor
                        curso.save()
                    
                elif role_type == 'administrativo':
                    return Response({"message": "Datos y roles actualizados correctamente."}, status=status.HTTP_200_OK)
                
                else:
                    return Response({"error": f"El usuario con ID {user_id} no existe o no está asignado como {role_type} 2."}, status=status.HTTP_404_NOT_FOUND)

        except (Estudiante.DoesNotExist, Profesor.DoesNotExist, User.DoesNotExist):
            return Response({"error": f"El usuario con ID {user_id} no existe o no está asignado como {role_type}."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Datos y roles actualizados correctamente."}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Obtener estudiantes por ID de curso",
        description="Devuelve la lista de estudiantes asignados a un curso específico.",
        responses={200: EstudianteSerializer(many=True)}
    )
    @action(detail=True, methods=['get'], url_path='students', permission_classes=[IsAuthenticated])
    def get_students(self, request, pk=None):
        curso = self.get_object()
        estudiantes = curso.estudiantes.select_related('user').all()
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        dias = self.request.data.get('dias', [])
        horas = self.request.data.get('horas', {})

        if dias and len(dias) != len(set(dias)):
            raise serializer.ValidationError({"error": "Los días no deben repetirse."})

        if horas:
            if not isinstance(horas, dict) or 'start_time' not in horas or 'end_time' not in horas:
                raise serializer.ValidationError(
                    {"error": "El campo 'horas' debe ser un objeto JSON con 'start_time' y 'end_time'."}
                )
            if horas['start_time'] >= horas['end_time']:
                raise serializer.ValidationError(
                    {"error": "La hora de inicio debe ser anterior a la hora de fin."}
                )

        serializer.save()

    def perform_update(self, serializer):
        dias = self.request.data.get('dias', [])
        horas = self.request.data.get('horas', {})

        if dias and len(dias) != len(set(dias)):
            raise serializer.ValidationError({"error": "Los días no deben repetirse."})

        if horas:
            if not isinstance(horas, dict) or 'start_time' not in horas or 'end_time' not in horas:
                raise serializer.ValidationError(
                    {"error": "El campo 'horas' debe ser un objeto JSON con 'start_time' y 'end_time'."}
                )
            if horas['start_time'] >= horas['end_time']:
                raise serializer.ValidationError(
                    {"error": "La hora de inicio debe ser anterior a la hora de fin."}
                )

        serializer.save()
