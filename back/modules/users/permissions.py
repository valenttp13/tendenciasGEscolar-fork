# modules/users/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permiso para el rol administrativo.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'administrativo'


class IsProfessor(permissions.BasePermission):
    """
    Permiso para el rol profesor.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'profesor'


class IsStudent(permissions.BasePermission):
    """
    Permiso para el rol estudiante.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'estudiante'


class IsProfessorOrAdmin(permissions.BasePermission):
    """
    Permiso para el rol profesor o administrativo.
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.role == 'profesor') or (request.user.role == 'administrativo')


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso para el estudiante dueño de los datos o un usuario administrativo.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user or request.user.role == 'administrativo'
