from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.db.models import Q
from .models import Mensaje
from .serializers import MensajeSerializer

@extend_schema(tags=['Communications']) 
class MensajeViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar los mensajes entre usuarios del sistema.
    """
    queryset = Mensaje.objects.all()
    serializer_class = MensajeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra los mensajes según si el usuario es remitente o destinatario.
        """
        user = self.request.user
        return Mensaje.objects.filter(Q(remitente=user) | Q(destinatario=user))
