from rest_framework import serializers
from .models import Profesor
from modules.users.models import User
from modules.users.serializers import UserSerializer

class ProfesorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Profesor
        fields = ['id', 'departamento', 'user_details']
