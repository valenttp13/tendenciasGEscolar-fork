# Generated by Django 5.1.1 on 2024-10-09 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calificacion',
            name='calificacion',
        ),
        migrations.AddField(
            model_name='calificacion',
            name='notas',
            field=models.JSONField(blank=True, default=dict, help_text='Calificaciones del estudiante en el curso.'),
        ),
    ]
