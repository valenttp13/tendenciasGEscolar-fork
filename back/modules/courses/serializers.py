from rest_framework import serializers
from .models import Curso, DAYS_OF_WEEK
from modules.teachers.models import Profesor
from modules.students.models import Estudiante
from modules.teachers.serializers import ProfesorSerializer
from modules.students.serializers import EstudianteSerializer

class CursoSerializer(serializers.ModelSerializer):
    # Usar PrimaryKeyRelatedField para el campo profesor (ID)
    profesor = serializers.PrimaryKeyRelatedField(
        queryset=Profesor.objects.all(),
        required=False,
        allow_null=True
    )

    # Incluir los detalles del profesor usando ProfesorSerializer
    profesor_details = ProfesorSerializer(source='profesor', read_only=True)
    estudiantes = serializers.PrimaryKeyRelatedField(
        queryset=Estudiante.objects.all(),
        many=True,
        required=False,
        allow_null=True
    )

    # Campos para manejar los días
    dias = serializers.ListField(
        child=serializers.ChoiceField(choices=[day[0] for day in DAYS_OF_WEEK]),
        required=False,
        allow_empty=True,
        help_text="Lista de días de la semana en los que se imparte el curso"
    )

    # Cambiar el campo `horas` a un `JSONField`
    horas = serializers.JSONField(required=False, help_text="Horario del curso en formato JSON")

    # Nuevo campo para la cantidad de notas
    cantidad_notas = serializers.IntegerField(required=True, min_value=1, help_text="Cantidad de notas que se deben registrar para cada estudiante en este curso.")

    # Detalles de los estudiantes para la lectura
    estudiantes_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Curso
        fields = [
            'id',
            'nombre',
            'descripcion',
            'profesor',  # Devuelve solo el ID del profesor
            'profesor_details',  # Devuelve los detalles completos del profesor
            'dias',
            'horas',
            'cantidad_notas',
            'estudiantes',
            'estudiantes_details',
        ]

    def get_estudiantes_details(self, obj):
        """
        Obtener los detalles completos de los estudiantes.
        """
        if obj.estudiantes.exists():
            return EstudianteSerializer(obj.estudiantes.all(), many=True).data
        return []

    def validate_horas(self, value):
        """
        Validar la estructura de las horas antes de guardar.
        """
        if value:
            if not isinstance(value, dict):
                raise serializers.ValidationError("El campo 'horas' debe ser un objeto JSON con 'start_time' y 'end_time'.")

            # Verificar que existan las claves correctas en el JSON de horas
            if 'start_time' not in value or 'end_time' not in value:
                raise serializers.ValidationError("El horario debe contener 'start_time' y 'end_time'.")

            # Asegurarse de que 'start_time' sea anterior a 'end_time'
            start_time = value.get('start_time')
            end_time = value.get('end_time')
            if start_time >= end_time:
                raise serializers.ValidationError("La hora de inicio debe ser anterior a la hora de fin.")
        
        return value
