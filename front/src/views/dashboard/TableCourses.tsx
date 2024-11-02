'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// Service Imports
import { getCourses } from '@/services/api/courses'
import type { Course } from '@/types/all.types'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import TimeFormatter from '@/components/TimeFormatter'
import { useAuth } from '@/context/AuthContext'

//Components Imports

const TableCourses = () => {
  // States para almacenar los cursos y gestionar la carga de datos
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()

  // Efecto para obtener los cursos del backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses()

        setCourses(coursesData)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
      fetchCourses()
  }, [])

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) return <Typography>Cargando cursos...</Typography>

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Description</th>
              <th>Days</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td className='!plb-1'>
                  <div className='flex items-center gap-3'>
                    <Typography color='text.primary' className='font-medium'>
                      {course.nombre}
                    </Typography>
                  </div>
                </td>
                <td className='!plb-1'>
                  <Typography>{course.descripcion}</Typography>
                </td>
                <td className='!plb-1'>
                  {/* Mostrar los días del curso en Chips */}
                  <Box display='flex' gap={1} flexWrap='wrap'>
                    {course.dias && course.dias.length > 0 ? (
                      course.dias.map((day, index) => (
                        <Chip
                          key={index}
                          label={day}
                          color='success'
                          size='small'
                          variant='tonal'
                          className='capitalize'
                        />
                      ))
                    ) : (
                      <Typography>{course.profesor}</Typography>
                    )}
                  </Box>
                </td>
                <td className='!plb-1'>
                  {/* Mostrar el horario del curso con formato presentable o indicar 'N/A' si no se especifica */}
                  <Typography>
                  {course.horas ? (
                    <span>
                      {/* Usar el componente TimeFormatter para mostrar el tiempo formateado */}
                      <TimeFormatter time={course.horas.start_time} /> - <TimeFormatter time={course.horas.end_time} />
                    </span>
                  ) : (
                    'N/A'
                  )}
                  </Typography>
                </td>
                <td className='!pb-1'>
                  {/* Botón para redirigir al curso */}
                  {user?.role === 'profesor' || user?.role === 'administrativo' ? (
                    <Button variant='contained' onClick={() => router.push(`/teachers/courses/${course.id}`)}>
                      View Course
                    </Button>
                  ) : (
                    <Button variant='contained' onClick={() => router.push(`/students/courses/${course.id}`)}>
                      View Grades
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TableCourses
