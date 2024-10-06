from django.db import models

class Teachers(models.Model):
    GENEROS = [
        ('Masculino', 'Masculino'),
        ('Femenino', 'Femenino'),
        ('Otro', 'Otro'),
    ]
    
    identificacion = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=10, choices=GENEROS)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    numero_telefono = models.CharField(max_length=15, blank=True, null=True)
    correo_electronico = models.EmailField(max_length=255, unique=True)
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_completo
