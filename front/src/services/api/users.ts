import api from './api'
import { User } from '@/types/all.types'

// Servicio para actualizar un usuario existente
export const updateUser = async (userId: number, updatedUser: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/users/${userId}/`, updatedUser)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    throw error
  }
}

// Obtener la lista de cursos desde el backend
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const getMessages = async () => {
  try {
    const response = await api.get('/communications/messages/')
    return response.data
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}
