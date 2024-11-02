// src/services/api/api.ts
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DIR

// Crear una instancia de Axios con configuración predeterminada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores para manejar el token de autenticación y errores globales
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    
return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    
return Promise.reject(error)
  }
)

export default api
