from django.db import models
from modules.courses.models import Curso
from modules.students.models import Estudiante

class Calificacion(models.Model):
    curso = models.ForeignKey(Curso, related_name='calificaciones', on_delete=models.CASCADE)
    estudiante = models.ForeignKey(Estudiante, related_name='calificaciones', on_delete=models.CASCADE)
    
    # Almacenar las calificaciones como un JSONField para manejar múltiples notas por curso.
    # Ejemplo: { "evaluacion_1": 5.0, "evaluacion_2": 4.0, ... }
    notas = models.JSONField(default=dict, blank=True, help_text="Calificaciones del estudiante en el curso.")
    
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    fecha_evaluacion = models.DateField()

    def __str__(self):
        return f"{self.curso.nombre} - {self.estudiante.user.username} - {self.notas}"
