from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfesorViewSet

router = DefaultRouter()
router.register(r'', ProfesorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
