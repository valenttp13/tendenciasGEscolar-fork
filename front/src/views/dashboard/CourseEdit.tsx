'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Service Imports
import { getCourseById, updateCourseById } from '@/services/api/courses' // Asegúrate de tener estas funciones en tu servicio

// Types
import type { Course } from '@/types/all.types'
import toast from 'react-hot-toast'

// Vars
const initialData: Course = {
  id: 0,
  nombre: '',
  descripcion: '',
  dias: [],
  horas: { start_time: '', end_time: '' },
  estudiantes: [],
  profesor: null,
  cantidad_notas: null,
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const CourseEdit = () => {
  // States
  const [formData, setFormData] = useState<Course>(initialData)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const params = useParams()
  const id = typeof params?.id === 'string' ? params.id : params?.id?.[0]


  // Obtener los datos del curso y establecer el estado
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await getCourseById(id)

        setFormData(courseData)
      } catch (error) {
        console.error('Error fetching course details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseDetails()
    }
  }, [id])

  // Manejador para actualizar los cambios en el formulario
  const handleFormChange = (field: keyof Course, value: Course[keyof Course]) => {
    setFormData({ ...formData, [field]: value })
  }

  // Manejador para actualizar los días seleccionados
  const handleDaysChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, dias: event.target.value as string[] })
  }

  // Manejador para actualizar la hora en el estado con el formato `HH:mm:ss`
  const handleTimeChange = (field: 'start_time' | 'end_time', event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value.length === 5 ? `${event.target.value}:00` : event.target.value

    // Asegurarse de que horas siempre tenga un objeto con `start_time` y `end_time`
    setFormData({
      ...formData,
      horas: {
        ...formData.horas,
        [field]: timeValue || '' // Asegurarse de que no se asigne `undefined`
      }
    })
  }

  // Manejador para el envío del formulario
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await updateCourseById(Number(id), formData) // Llamada a la API para actualizar el curso
      const toastId = toast.loading('Saving Course...')
      router.push(`/teachers/courses/${id}`) // Redirigir a la lista de cursos después de guardar
      toast.success('Course saved successfully!', { id: toastId })
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  // Mostrar mensaje de carga mientras se obtienen los datos del curso
  if (loading) return <Typography>Cargando datos del curso...</Typography>

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            {/* Campo de nombre del curso */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Course Name'
                value={formData.nombre}
                placeholder='Course Name'
                onChange={e => handleFormChange('nombre', e.target.value)}
              />
            </Grid>
            {/* Campo de descripción del curso */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Description'
                value={formData.descripcion}
                placeholder='Course Description'
                onChange={e => handleFormChange('descripcion', e.target.value)}
              />
            </Grid>

            {/* Campo de selección de días de la semana */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Días</InputLabel>
                <Select
                  multiple
                  value={formData.dias}
                  onChange={handleDaysChange}
                  renderValue={selected => (selected as string[]).join(', ')}
                >
                  {daysOfWeek.map(day => (
                    <MenuItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)} {/* Capitalizar cada día */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Campo de selección de hora de inicio */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Start Time'
                type='time'
                value={formData.horas?.start_time || ''}
                onChange={e => handleTimeChange('start_time', e)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 minutos
                }}
              />
            </Grid>

            {/* Campo de selección de hora de fin */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='End Time'
                type='time'
                value={formData.horas?.end_time || ''}
                onChange={e => handleTimeChange('end_time', e)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 minutos
                }}
              />
            </Grid>

            {/* Campo de descripción del curso */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Grades QTY'
                value={formData.cantidad_notas}
                placeholder='Grades QTY'
                onChange={e => handleFormChange('cantidad_notas', e.target.value)}
              />
            </Grid>

            {/* Botones de guardar y resetear */}
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={() => setFormData(initialData)}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CourseEdit
