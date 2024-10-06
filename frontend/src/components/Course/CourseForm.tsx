import React, { useState } from 'react';
import api from '../../api/api';

interface CourseFormData {
  name: string;
  description: string;
  teacher_id: number;
  schedule: string;
}

const CourseForm: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    teacher_id: 0,
    schedule: '',
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

    api.post('courses/', formData)
      .then((response) => {
        setMessage('Curso registrado con éxito');
      })
      .catch((error) => {
        setMessage('Error al registrar curso');
      });
  };

  return (
    <div>
      <h2>Registro de Cursos</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Curso:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID del Profesor:</label>
          <input
            type="number"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Horario:</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Registrar Curso</button>
      </form>
    </div>
  );
};

export default CourseForm;
