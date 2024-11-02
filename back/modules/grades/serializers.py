from rest_framework import serializers
from .models import Calificacion

class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = ['id', 'curso', 'estudiante', 'notas', 'descripcion', 'fecha_evaluacion']
