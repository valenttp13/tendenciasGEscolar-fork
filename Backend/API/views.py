# backend/API/views.py
from ..app.Students.models import Students  # Asegúrate de importar el modelo correcto
from reportlab.pdfgen import canvas
from django.http import HttpResponse

def generar_reporte_estudiantes(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_estudiantes.pdf"'

    p = canvas.Canvas(response)
    p.drawString(100, 750, "Reporte de Estudiantes")

    # Asegúrate de que estás llamando al modelo correcto
    estudiantes = Students.objects.all()  # Cambié Students a Estudiante
    y = 700
    for estudiante in estudiantes:
        p.drawString(100, y, f"{estudiante.nombre_completo} - {estudiante.grado}")
        y -= 30

    p.showPage()
    p.save()

    return response
