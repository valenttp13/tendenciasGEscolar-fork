from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Users
from .serializers import UsersSerializer

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        # Puedes personalizar la queryset si es necesario (p.ej., filtrar por rol)
        return Users.objects.all()
