from django.db import models

class Students(models.Model):
    GENEROS = [
        ('masculino', 'Masculino'),
        ('femenino', 'Femenino'),
        ('otro', 'Otro'),
    ]
    
    id = models.AutoField(primary_key=True)
    fullName = models.CharField(max_length=255)
    birthDate = models.DateField()
    gender = models.CharField(max_length=10, choices=GENEROS)
    address = models.CharField(max_length=255, blank=True, null=True)
    phoneNumber = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True)
    grade = models.IntegerField()  

    def __str__(self):
        return self.fullName
