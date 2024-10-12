import axios from 'axios';

// Configuración base de Axios para el backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // URL de tu API de Django
});

export default api;
