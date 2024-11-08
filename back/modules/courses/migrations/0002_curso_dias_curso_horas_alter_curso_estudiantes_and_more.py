# Generated by Django 5.1.1 on 2024-10-07 23:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
        ('students', '0001_initial'),
        ('teachers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='curso',
            name='dias',
            field=models.CharField(blank=True, choices=[('Lunes', 'Lunes'), ('Martes', 'Martes'), ('Miércoles', 'Miércoles'), ('Jueves', 'Jueves'), ('Viernes', 'Viernes'), ('Sábado', 'Sábado'), ('Domingo', 'Domingo')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='curso',
            name='horas',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='curso',
            name='estudiantes',
            field=models.ManyToManyField(blank=True, related_name='cursos', to='students.estudiante'),
        ),
        migrations.AlterField(
            model_name='curso',
            name='horario',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='curso',
            name='profesor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cursos', to='teachers.profesor'),
        ),
    ]
