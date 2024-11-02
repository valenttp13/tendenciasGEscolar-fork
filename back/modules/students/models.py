from django.db import models
from modules.users.models import User

class Estudiante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='estudiante')
    grado = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.grado}"
