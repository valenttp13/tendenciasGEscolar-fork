from django.urls import path
from .views import GenerateCourseReportView

urlpatterns = [
    path('generate/', GenerateCourseReportView.as_view(), name='generate-course-report'),
    path('download/<int:student_id>/<int:course_id>/', GenerateCourseReportView.as_view(), name='download-student-report'),
]