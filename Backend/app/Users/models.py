from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UsersManager(BaseUserManager):
    def create_user(self, nombre_usuario, correo_electronico, contrasena=None, **extra_fields):
        if not correo_electronico:
            raise ValueError('El usuario debe tener un correo electrónico')
        if not nombre_usuario:
            raise ValueError('El usuario debe tener un nombre de usuario')
        
        correo_electronico = self.normalize_email(correo_electronico)
        user = self.model(nombre_usuario=nombre_usuario, correo_electronico=correo_electronico, **extra_fields)
        user.set_password(contrasena)
        user.save(using=self._db)
        return user

    def create_superuser(self, nombre_usuario, correo_electronico, contrasena=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(nombre_usuario, correo_electronico, contrasena, **extra_fields)


class Users(AbstractBaseUser):
    ROLES = [
        ('Estudiante', 'Estudiante'),
        ('Profesor', 'Profesor'),
        ('Administrativo', 'Administrativo'),
        ('Otro', 'Otro'),
    ]
    
    identificacion = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=255)
    correo_electronico = models.EmailField(max_length=255, unique=True)
    numero_telefono = models.CharField(max_length=15, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    rol = models.CharField(max_length=15, choices=ROLES)
    nombre_usuario = models.CharField(max_length=50, unique=True)
    contrasena = models.CharField(max_length=255)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    objects = UsersManager()

    USERNAME_FIELD = 'nombre_usuario'
    REQUIRED_FIELDS = ['correo_electronico']

    def __str__(self):
        return self.nombre_completo
