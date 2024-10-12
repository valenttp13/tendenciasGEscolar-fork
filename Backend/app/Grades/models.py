from django.db import models
from ..Students.models import Students
from ..Courses.models import Courses

class Grades (models.Model):
    identificacion = models.AutoField(primary_key=True)
    estudiante = models.ForeignKey(Students, on_delete=models.CASCADE, related_name='calificaciones')
    curso = models.ForeignKey(Courses , on_delete=models.CASCADE, related_name='calificaciones')
    calificacion = models.DecimalField(max_digits=5, decimal_places=2)
    fecha_evaluacion = models.DateField()

    def __str__(self):
        return f'{self.estudiante.nombre_completo} - {self.curso.nombre_curso} ({self.calificacion})'
