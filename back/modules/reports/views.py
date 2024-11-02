import os
import hashlib
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse, Http404
from reportlab.pdfgen import canvas
from io import BytesIO
from modules.courses.models import Curso
from modules.grades.models import Calificacion
from modules.communications.models import Mensaje

class GenerateCourseReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id, course_id):
        if request.user.id != student_id:
            raise Http404("No access to this report.")

        # Buscar el archivo del informe usando hash
        hashed_filename = f"reports/course_{course_id}_student_{student_id}.pdf"
        file_path = os.path.join(settings.MEDIA_ROOT, hashed_filename)
        if not default_storage.exists(file_path):
            raise Http404("Report not found.")

        with default_storage.open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{request.user.username}_report.pdf"'
            return response

    def post(self, request):
        course_id = request.data.get("course_id")
        profesor = request.user

        # Obtener el curso y los estudiantes
        try:
            curso = Curso.objects.get(pk=course_id)
        except Curso.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        estudiantes = curso.estudiantes.all()

        # Generar informe consolidado para el curso
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer)
        pdf.drawString(100, 800, f"Informe Consolidado del Curso: {curso.nombre}")
        y = 780

        for estudiante in estudiantes:
            calificaciones = Calificacion.objects.filter(curso=curso, estudiante=estudiante)
            pdf.drawString(100, y, f"Estudiante: {estudiante.user.username}")
            y -= 20

            total_notas = 0
            cantidad_notas = 0

            for calificacion in calificaciones:
                pdf.drawString(100, y, f"Fecha de evaluación: {calificacion.fecha_evaluacion}")
                y -= 20
                for evaluacion, nota in calificacion.notas.items():
                    pdf.drawString(120, y, f"{evaluacion}: {nota}")
                    y -= 20
                    total_notas += nota
                    cantidad_notas += 1

            promedio = total_notas / cantidad_notas if cantidad_notas > 0 else 0
            pdf.drawString(100, y, f"Promedio Total: {promedio:.2f}")
            y -= 40  # Espacio extra entre estudiantes para legibilidad

            # Generar y guardar el informe individual
            individual_buffer = BytesIO()
            individual_pdf = canvas.Canvas(individual_buffer)
            individual_pdf.drawString(100, 800, f"Informe de {estudiante.user.username} - {curso.nombre}")
            y_individual = 780

            for calificacion in calificaciones:
                individual_pdf.drawString(100, y_individual, f"Fecha de evaluación: {calificacion.fecha_evaluacion}")
                y_individual -= 20
                for evaluacion, nota in calificacion.notas.items():
                    individual_pdf.drawString(120, y_individual, f"{evaluacion}: {nota}")
                    y_individual -= 20

            individual_pdf.drawString(100, y_individual, f"Promedio Total: {promedio:.2f}")
            individual_pdf.showPage()
            individual_pdf.save()

            individual_buffer.seek(0)

            # Crear un hash para el nombre del archivo
            unique_string = f"{curso.nombre}_{estudiante.user.username}"
            hashed_filename = hashlib.md5(unique_string.encode('utf-8')).hexdigest() + ".pdf"
            file_path = os.path.join("reports", hashed_filename)

            # Guardar el archivo en el almacenamiento
            with default_storage.open(file_path, 'wb') as f:
                f.write(individual_buffer.getbuffer())

            # Crear URL de descarga usando build_absolute_uri y MEDIA_URL
            relative_file_url = f"{settings.MEDIA_URL}{file_path}"
            file_url = request.build_absolute_uri(relative_file_url)

            # Enviar mensaje con enlace al informe individual
            Mensaje.objects.create(
                remitente=profesor,
                destinatario=estudiante.user,
                asunto="Informe de calificaciones",
                contenido=f"Descarga tu informe aquí: {file_url}",
                leido=False
            )

        # Finalizar y devolver el informe consolidado
        pdf.showPage()
        pdf.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{curso.nombre}_reporte_consolidado.pdf"'
        return response
