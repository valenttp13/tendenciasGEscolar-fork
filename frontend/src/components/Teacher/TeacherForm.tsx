import React, { useState } from 'react';
import api from '../../api/api';

interface TeacherFormData {
  full_name: string;
  email: string;
  department: string;
  date_of_birth: string;
  gender: string;
}

const TeacherForm: React.FC = () => {
  const [formData, setFormData] = useState<TeacherFormData>({
    full_name: '',
    email: '',
    department: '',
    date_of_birth: '',
    gender: '',
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

    api.post('teachers/', formData)
      .then((response) => {
        setMessage('Profesor registrado con éxito');
      })
      .catch((error) => {
        setMessage('Error al registrar profesor');
      });
  };

  return (
    <div>
      <h2>Registro de Profesores</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Departamento:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Género:</label>
          <select>
            <input type="text"/> 
            <input name="gender"/>
            <input value={formData.gender}/>
            <input onChange={handleChange}/>
            <input  required />

            <option value="">Selecciona una opción</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>



            </select>
        </div>
        <button type="submit">Registrar Profesor</button>
      </form>
    </div>
  );
};

export default TeacherForm;
