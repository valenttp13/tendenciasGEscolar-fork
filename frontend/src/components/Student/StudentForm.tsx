import React, { useState } from 'react';

// Definición de las interfaces
interface StudentFormProps {
  onSubmit: (data: StudentData) => void; // Función para manejar el envío
}

interface StudentData {
  fullName: string; 
  birthDate: string; 
  gender: 'masculino' | 'femenino' | 'otro'; 
  address: string; 
  phoneNumber: string; // Cambiado a string
  email: string; 
  grade: number; 
}

// Componente funcional
const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StudentData>({
    fullName: '',
    birthDate: '',
    gender: 'masculino', // Valor por defecto
    address: '',
    phoneNumber: '', // Cambiado a string
    email: '',
    grade: 0, // Cambiado a número
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData); // Envía los datos al componente padre
    setFormData({
      fullName: '',
      birthDate: '',
      gender: 'masculino', // Valor por defecto
      address: '',
      phoneNumber: '',
      email: '',
      grade: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullName">Nombre Completo:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="birthDate">Fecha de Nacimiento:</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="gender">Género:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="address">Dirección:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="phoneNumber">Número de Teléfono:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="grade">Grado:</label>
        <input
          type="number"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
};

export default StudentForm;
