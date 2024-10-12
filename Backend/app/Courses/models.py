from django.db import models
#from .models import Teachers
from ..Teachers.models import Teachers
class Courses(models.Model):
    identificacion = models.AutoField(primary_key=True)
    nombre_curso = models.CharField(max_length=255)
    descripcion = models.TextField()
    profesor = models.ForeignKey(Teachers, on_delete=models.CASCADE, related_name='cursos')  # Usamos 'Teachers' en cadena
    horario = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_curso
