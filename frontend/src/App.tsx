import React from 'react';
import StudentForm from './components/Student/StudentForm'; // Ajusta la ruta según sea necesario
import StudentContainer from './components/Student/StudentContainer'; // Ajusta la ruta según sea necesario

const App: React.FC = () => {
  const handleSubmit = async (data: any) => {
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
      <h1>Registrar Estudiante</h1>
      <StudentForm onSubmit={handleSubmit} />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Gestión Escolar</h1>
        <StudentContainer /> {/* Aquí renderizas el contenedor de estudiantes */}
      </div>
    </div>
  );
};

export default App;
