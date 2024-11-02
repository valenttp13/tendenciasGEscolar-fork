import api from './api'
import type { Course, Student, Grade, GradeInput, User } from '@/types/all.types'

// Obtener la lista de cursos desde el backend
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/courses/')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await api.get(`/courses/${id}/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching course details for ID ${id}:`, error)
    throw error
  }
}

export const updateCourseById = async (id: number, data: any) => {
  try {
    const response = await api.put(`/courses/${id}/`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating course details for ID ${id}:`, error)
    throw error
  }
}

export const getStudentsByCourseId = async (courseId: number): Promise<Student[]> => {
  try {
    const response = await api.get(`/courses/${courseId}/students/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching students for course ${courseId}:`, error)
    throw error
  }
}

// Servicio para obtener las calificaciones de un curso específico
export const getGradesByCourseId = async (courseId: number): Promise<Grade[]> => {
  try {
    const response = await api.get(`/grades/course-grades/${courseId}/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching grades for course ${courseId}:`, error)
    throw error
  }
}

// Servicio para agregar una nueva calificación
export const addGrade = async (gradeData: Partial<Grade>): Promise<Grade> => {
  try {
    const response = await api.post('/grades/', gradeData)
    return response.data
  } catch (error) {
    console.error('Error adding new grade:', error)
    throw error
  }
}

// Servicio para actualizar una calificación existente
export const updateGrade = async (gradeId: number, updatedGrade: Partial<Grade>): Promise<Grade> => {
  try {
    const response = await api.put(`/grades/${gradeId}/`, updatedGrade)
    return response.data
  } catch (error) {
    console.error(`Error updating grade ${gradeId}:`, error)
    throw error
  }
}

// Servicio para eliminar una calificación por ID
export const deleteGrade = async (gradeId: number): Promise<void> => {
  try {
    await api.delete(`/grades/${gradeId}/`)
  } catch (error) {
    console.error(`Error deleting grade ${gradeId}:`, error)
    throw error
  }
}

// Servicio para guardar múltiples calificaciones de un curso
export const saveGradesForCourse = async (courseId: number, grades: GradeInput[]): Promise<Grade[]> => {
  try {
    const response = await api.post(`/grades/`, { curso: courseId, grades })
    return response.data
  } catch (error) {
    console.error(`Error saving grades for course ${courseId}:`, error)
    throw error
  }
}

export const updateUserAndAssignCourses = async (
  rolesData: {
    user_id: number
    cursos: number[]
    role_type: 'estudiante' | 'profesor'
    user_data: {
      username: string
      email: string
      first_name: string
      last_name: string
      role: string
    }
  }[]
) => {
  try {
    const response = await api.post('/courses/update-user-and-assign-courses/', {
      roles: rolesData
    })
    return response.data
  } catch (error) {
    console.error('Error updating user and assigning courses:', error)
    throw error
  }
}

export const generateCourseReport = async (courseId: any) => {
  try {
    const response = await api.post(
      `/reports/generate/`,
      { course_id: courseId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        responseType: 'blob'
      }
    )
    return response
  } catch (error) {
    console.error(`Error generating report for course ${courseId}:`, error)
    throw error
  }
}
