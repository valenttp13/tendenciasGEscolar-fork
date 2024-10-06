// StudentContainer.tsx

import React from 'react';
import StudentForm from './StudentForm'; // Asegúrate de que la ruta sea correcta

const StudentContainer: React.FC = () => {
  const handleSubmit = async (data: any) => {
    console.log('Datos a enviar:', data); // Imprime los datos en la consola
    try {
      const response = await fetch('http://127.0.0.1:8000/api/estudiantes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al guardar los datos:', errorData);
      } else {
        const result = await response.json();
        console.log('Datos guardados con éxito:', result);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div>
      <h1>Agregar Estudiante</h1>
      <StudentForm onSubmit={handleSubmit} /> {/* Aquí se pasa la función handleSubmit */}
    </div>
  );
};

export default StudentContainer;
