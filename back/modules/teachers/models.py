from django.db import models
from modules.users.models import User

class Profesor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profesor')
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} - {self.departamento}"
