from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken  # Usar JWT en lugar de Token
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from .models import User
from .serializers import UserSerializer, LoginSerializer

import json

@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Permitir que cualquier usuario pueda acceder a las vistas de login y registro.
        """
        if self.action in ['login', 'create']:
            self.permission_classes = [AllowAny]  # Permitir acceso sin autenticación a login y register
        return super().get_permissions()

    @extend_schema(
        description="Permite a un usuario autenticarse y obtener un token JWT.",
        request=LoginSerializer,
        responses={200: 'Login successful, returns tokens'},
        tags=['Authentication']
    )
    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='login')
    def login(self, request):
        """
        Endpoint para que los usuarios se logueen y obtengan un token JWT.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Generar un nuevo par de tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        user_serializer = UserSerializer(user)

        # Retornar solo los tokens en la respuesta
        return Response({
            'refresh': str(refresh),  # Token de refresco
            'access': access_token,  # Token de acceso
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Endpoint para obtener la información del usuario autenticado.
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
