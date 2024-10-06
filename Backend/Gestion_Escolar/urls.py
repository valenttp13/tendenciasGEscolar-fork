from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from app.Courses.views import CoursesViewSet
from app.Grades.views import GradesViewSet
from app.Students.views import StudentsViewSet
from app.Teachers.views import TeachersViewSet
from app.Users.views import UsersViewSet

router = DefaultRouter()
router.register(r'usuarios', UsersViewSet)
router.register(r'estudiantes', StudentsViewSet)
router.register(r'profesores', TeachersViewSet)
router.register(r'cursos', CoursesViewSet)
router.register(r'calificaciones', GradesViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls), 
]