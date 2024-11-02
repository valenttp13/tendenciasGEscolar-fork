from django.db import models
from modules.teachers.models import Profesor
from modules.students.models import Estudiante

# Opciones de días de la semana
DAYS_OF_WEEK = [
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
    ('saturday', 'Saturday'),
    ('sunday', 'Sunday'),
]

class Curso(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    profesor = models.ForeignKey(Profesor, related_name='cursos', on_delete=models.SET_NULL, null=True, blank=True)
    estudiantes = models.ManyToManyField(Estudiante, related_name='cursos', blank=True)
    
    # Campo para almacenar los días como JSON (ej. ["monday", "wednesday", "friday"])
    dias = models.JSONField(default=list, blank=True, help_text="Días de la semana en los que se imparte el curso")

    # Campo para representar las horas del curso en un formato JSON
    # Ejemplo: {"start_time": "08:00:00", "end_time": "10:00:00"}
    horas = models.JSONField(default=dict, blank=True, help_text="Horario del curso en formato JSON")

    # Campo para definir la cantidad de notas que puede tener cada curso
    cantidad_notas = models.PositiveIntegerField(default=1, help_text="Cantidad de notas que se deben registrar para cada estudiante en este curso.")

    def __str__(self):
        return self.nombre
