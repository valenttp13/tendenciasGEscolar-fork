from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Crear un router para registrar las vistas de usuario
router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
