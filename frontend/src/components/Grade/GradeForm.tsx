import React, { useState } from 'react';
import api from '../../api/api';

interface GradeFormData {
  student_id: number;
  course_id: number;
  grade: number;
  evaluation_date: string;
}

const GradeForm: React.FC = () => {
  const [formData, setFormData] = useState<GradeFormData>({
    student_id: 0,
    course_id: 0,
    grade: 0,
    evaluation_date: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    api.post('grades/', formData)
      .then((response) => {
        setMessage('Calificación registrada con éxito');
      })
      .catch((error) => {
        setMessage('Error al registrar calificación');
      });
  };

  return (
    <div>
      <h2>Registro de Calificaciones</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID del Estudiante:</label>
          <input
            type="number"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID del Curso:</label>
          <input
            type="number"
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Calificación:</label>
          <input
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fecha de Evaluación:</label>
          <input
            type="date"
            name="evaluation_date"
            value={formData.evaluation_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Registrar Calificación</button>
      </form>
    </div>
  );
};

export default GradeForm;
