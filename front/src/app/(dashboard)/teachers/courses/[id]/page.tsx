'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Service Imports
import { getCourseById } from '@/services/api/courses'
import type { Course } from '@/types/all.types'

import TimeFormatter from '@/components/TimeFormatter'

const CourseDetails = () => {
  // Estado para almacenar los detalles del curso
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  const params = useParams() // Obtener los parámetros de la URL
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : params?.id?.[0] // Asegurar que el ID sea un string

  // Función para capitalizar la primera letra de cada palabra
  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }

  useEffect(() => {
    if (id) {
      // Función para obtener los detalles del curso
      const fetchCourseDetails = async () => {
        try {
          const courseData = await getCourseById(id) // Asegurarse de pasar un string aquí

          setCourse(courseData) // Almacenar los detalles del curso en el estado
        } catch (error) {
          console.error('Error fetching course details:', error)
          router.push('/teachers/courses') // Redirigir a la lista de cursos si no se encuentra el curso
        } finally {
          setLoading(false) // Cambiar el estado de carga
        }
      }

      fetchCourseDetails()
    }
  }, [id, router])

  // Mostrar un spinner de carga mientras se obtienen los detalles
  if (loading) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  // Mostrar un mensaje si no se encuentra el curso
  if (!course) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <Typography>Course not found.</Typography>
      </Grid>
    )
  }

  // Funciones para manejar los clics en los botones
  const handleEditClick = () => {
    router.push(`/teachers/courses/${id}/edit`) // Redirigir a la página de edición del curso
  }

  const handleViewStudentsClick = () => {
    router.push(`/teachers/courses/${id}/students`) // Redirigir a la lista de estudiantes del curso
  }

  // Renderizar los detalles del curso
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h4' gutterBottom>
              {course.nombre}
            </Typography>
            <Typography variant='body1'>{course.descripcion}</Typography>
            <Typography variant='h6' mt={2}>Days:</Typography>
            <div className='flex flex-wrap gap-2'>
              {/* Mostrar los días como chips con solo la primera letra en mayúscula */}
              {course.dias.map((day, index) => (
                <Chip key={index} label={capitalizeFirstLetter(day)} color='success' variant='outlined' />
              ))}
            </div>
            <Typography variant='h6' mt={2}>Schedule:</Typography>
            <Typography variant='body2'>
              {course.horas ? (
                <span>
                  {/* Usar el componente TimeFormatter para mostrar el tiempo formateado */}
                  <TimeFormatter time={course.horas.start_time} /> - <TimeFormatter time={course.horas.end_time} />
                </span>
              ) : (
                'N/A'
              )}
            </Typography>
            <Typography variant='h6' mt={2}>Teacher:</Typography>
            <Typography variant='body2'>
            {course.profesor_details && course.profesor_details.user_details ? `${course.profesor_details.user_details.first_name} ${course.profesor_details.user_details.last_name}`
              : 'N/A'}
            </Typography>
            <Typography variant='h6' mt={2}>Grades QTY:</Typography>
            <Typography variant='body2'>
              {course.cantidad_notas ? `${course.cantidad_notas}` : 'N/A'}
            </Typography>

            {/* Botones de acción */}
            <Box display='flex' gap={2} mt={4}>
              <Button variant='contained' color='primary' onClick={handleEditClick}>
                Edit Course
              </Button>
              <Button variant='contained' color='secondary' onClick={handleViewStudentsClick}>
                View Students
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CourseDetails
