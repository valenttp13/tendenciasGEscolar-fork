'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

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
import { getCourses } from '@/services/api/courses'
import { createUser } from '@/services/api/users'

// Import `react-hot-toast`
import toast from 'react-hot-toast'

// Tipado de los datos
import type { Course, UserRole } from '@/types/all.types'

const CreateUser = () => {
  const router = useRouter()

  // States
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'estudiante' as UserRole,
    courses: [] as number[]
  })
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (error) {
        toast.error('Failed to fetch courses')
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [])

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica de la contraseña
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await createUser({
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        courses: formData.courses
      })
      toast.success('User created successfully!')
      router.push('/admin/users') // Redirigir a la página de usuarios o cualquier otra página después de la creación
    } catch (error) {
      toast.error('Failed to create user')
      console.error('Error creating user:', error)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' component='h2' className='mb-4'>
          Create New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Username'
                value={formData.username}
                placeholder='Username'
                onChange={e => handleFormChange('username', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='First Name'
                value={formData.firstName}
                placeholder='First Name'
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Last Name'
                value={formData.lastName}
                placeholder='Last Name'
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                value={formData.email}
                placeholder='example@example.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Password'
                type='password'
                value={formData.password}
                placeholder='Password'
                onChange={e => handleFormChange('password', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={formData.role} onChange={e => handleFormChange('role', e.target.value as UserRole)}>
                  <MenuItem value='estudiante'>Estudiante</MenuItem>
                  <MenuItem value='profesor'>Profesor</MenuItem>
                  <MenuItem value='administrativo'>Administrativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Courses</InputLabel>
                <Select
                  multiple
                  value={formData.courses}
                  onChange={e => handleFormChange('courses', e.target.value as number[])}
                  renderValue={selected =>
                    courses
                      .filter(course => selected.includes(course.id))
                      .map(course => course.nombre)
                      .join(', ')
                  }
                >
                  {courses.map(course => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Create User
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateUser
