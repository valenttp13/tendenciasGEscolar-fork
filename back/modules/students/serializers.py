# modules/students/serializers.py

from rest_framework import serializers
from modules.students.models import Estudiante
from modules.users.models import User
from modules.users.serializers import UserSerializer  # Importar el serializer del usuario

class EstudianteSerializer(serializers.ModelSerializer):
    # Hacer que el campo user sea editable permitiendo seleccionar un usuario existente
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        required=True,
        help_text="ID del usuario existente que se asignará como estudiante"
    )
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Estudiante
        fields = ['id', 'user', 'user_details', 'grado']
