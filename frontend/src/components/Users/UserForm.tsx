import React, { useState } from 'react';
import api from '../../api/api';
import styles from './UserForm.module.css';

interface UserFormData {
  full_name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    username: '',
    password: '',
    role: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    api.post('users/', formData)
      .then((response) => {
        setMessage('Usuario registrado con éxito');
      })
      .catch((error) => {
        setMessage('Error al registrar usuario');
      });
  };

  return (
    <div className={styles.main}>
      <h2>Registro de Usuarios</h2>
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
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>
        <button type="submit">Registrar Usuario</button>
      </form>
    </div>
  );
};

export default UserForm;
