'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// Service Imports
import { getCourses, generateCourseReport } from '@/services/api/courses'

// Import `react-hot-toast`
import toast from 'react-hot-toast'

// Tipado de los datos
import type { Course } from '@/types/all.types'

// Import Styles
import styles from '@core/styles/table.module.css'

const Reports = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)

        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (error) {
        toast.error('Failed to fetch courses data')
        console.error('Error fetching courses data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleGenerateReport = async (courseId: number, courseName: string) => {
    try {
      const response = await generateCourseReport(courseId)

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${courseName}_report.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success(`Informe del curso "${courseName}" generado exitosamente`)
    } catch (error) {
      toast.error('Error generating course report')
      console.error('Error generating course report:', error)
    }
  }

  if (loading) return <Typography>Loading courses...</Typography>

  return (
    <Card>
      <Box display='flex' justifyContent='space-between' alignItems='center' margin='normal'>
        <Typography variant='h5'>Course Reports</Typography>
      </Box>

      <Grid container spacing={3} className={styles.table}>
        {courses.map(course => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card className={styles.card}>
              <Typography variant='h6'>{course.nombre}</Typography>
              <Typography variant='body2'>{`Grado: ${course.grado}`}</Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleGenerateReport(course.id, course.nombre)}
              >
                Generar Informe
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default Reports
