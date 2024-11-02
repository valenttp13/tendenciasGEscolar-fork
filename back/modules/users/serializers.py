from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

# Serializer para crear y gestionar usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},  # Hacemos opcional el email para simplificar
            'first_name': {'required': False},
            'last_name': {'required': False},
            'role': {'required': False}
        }

    def create(self, validated_data):
        """
        Crear un nuevo usuario con una contraseña encriptada.
        """
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'student')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Serializer para el login del usuario
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validar que las credenciales sean correctas.
        """
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                data['user'] = user
            else:
                raise serializers.ValidationError('Credenciales incorrectas. Verifique su usuario y contraseña.')
        else:
            raise serializers.ValidationError('Debe proporcionar un nombre de usuario y una contraseña.')
        
        return data
