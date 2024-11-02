# school_system/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('modules.users.urls')),
    path('api/students/', include('modules.students.urls')),
    path('api/teachers/', include('modules.teachers.urls')),
    path('api/courses/', include('modules.courses.urls')),
    path('api/grades/', include('modules.grades.urls')),
    path('api/communications/', include('modules.communications.urls')),
    path('api/reports/', include('modules.reports.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
