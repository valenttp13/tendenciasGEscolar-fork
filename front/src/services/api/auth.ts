// src/services/api/auth.ts
import api from './api'

// Función para login
export const login = async (username: string, password: string) => {
  const response = await api.post('/users/login/', { username, password })


return {
    user: response.data.user,
    access: response.data.access
  }
}

// Función para registro
export const register = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string
) => {
  const response = await api.post('/users/', {
    username,
    password,
    email,
    first_name: firstName,
    last_name: lastName,
    role
  })


return {
    user: response.data.user,
    access: response.data.access
  }
}

// Función para obtener los datos del usuario autenticado
export const getCurrentUser = async () => {
  const response = await api.get('/users/me/')

return response.data
}
