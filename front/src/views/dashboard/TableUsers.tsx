'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Service Imports
import { getCourses, updateUserAndAssignCourses } from '@/services/api/courses'
import { getAllUsers } from '@/services/api/users'

// Import `react-hot-toast`
import toast from 'react-hot-toast'

// Tipado de los datos
import type { User, Course, UserRole } from '@/types/all.types'

// Import Styles
import styles from '@core/styles/table.module.css' // Asegúrate de que esta ruta sea la correcta para tu archivo de estilos

const TableUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]) // Nuevo estado para los usuarios filtrados
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()

  useEffect(() => {
    const fetchUsersAndCourses = async () => {
      try {
        setLoading(true)

        const usersData = await getAllUsers()
        const coursesData = await getCourses()

        // Enlazar los cursos a los usuarios si son estudiantes o profesores
        const usersWithCourses = usersData.map((user) => {
          const userCourses = coursesData.filter((course) =>
            course.estudiantes_details?.some((student) => student.user_details.id === user.id) ||
            (course.profesor_details && course.profesor_details.user_details.id === user.id)
          ).map((course) => course.id)

          return {
            ...user,
            courses: userCourses
          }
        })

        setCourses(coursesData)
        setUsers(usersWithCourses)
        setFilteredUsers(usersWithCourses) // Inicializar los usuarios filtrados con todos los usuarios
      } catch (error) {
        toast.error('Failed to fetch users or courses data')
        console.error('Error fetching users and courses data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersAndCourses()
  }, [])

  const handleInputChange = (index: number, field: string, value: any) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) => (i === index ? { ...user, [field]: value } : user))
    )
  }

  const handleUpdateUser = async (index: number) => {
    try {
      const user = users[index]

      // Preparar los datos del usuario y cursos para el payload
      const userData = {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      }

      const roleType = user.role === 'estudiante' ? 'estudiante' : 'profesor'
      const specificId = user.id

      // Crear el payload para el endpoint
      const payload = {
        user_id: specificId,
        cursos: user.courses,
        role_type: roleType,
        user_data: userData,
      }

      // Llamar al servicio API con el payload
      await updateUserAndAssignCourses(payload)
      toast.success('User and courses updated successfully!')
    } catch (error) {
      toast.error('Failed to update user or assign courses')
      console.error('Error updating user or assigning courses:', error)
    }
  }

  const handleBlur = (index: number) => {
    handleUpdateUser(index)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    )

    setFilteredUsers(filtered) // Actualizar los usuarios filtrados
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setFilteredUsers(users) // Restaurar todos los usuarios
  }

  // Función para manejar la redirección al hacer clic en el botón
  const handleRedirect = () => {
    router.push('/admin/users/create') // Reemplaza '/new-page' con la ruta a la que quieres redirigir
  }

  if (loading) return <Typography>Loading users...</Typography>

  return (
    <Card>
      <Box display="flex" justifyContent="space-between" alignItems="center" margin="normal">
        <TextField
          label='User search'
          value={searchQuery}
          onChange={handleSearchChange}
          variant='outlined'
          fullWidth
          size='small'
        />
        <IconButton onClick={handleClearSearch} className='text-textPrimary'>
          <i className='ri-close-line' />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handleRedirect}>
          NEW USER
        </Button>
      </Box>

      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className='!plb-1'>
                    <CustomAvatar src='/images/avatars/default.png' size={34} />
                  </td>
                  <td className='!plb-1'>
                    <TextField
                      value={user.username}
                      onChange={(e) => handleInputChange(index, 'username', e.target.value)}
                      onBlur={() => handleBlur(index)}
                    />
                  </td>
                  <td className='!plb-1'>
                    <TextField
                      value={user.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      onBlur={() => handleBlur(index)}
                    />
                  </td>
                  <td className='!plb-1'>
                    <TextField
                      value={user.first_name}
                      onChange={(e) => handleInputChange(index, 'first_name', e.target.value)}
                      onBlur={() => handleBlur(index)}
                    />
                  </td>
                  <td className='!plb-1'>
                    <TextField
                      value={user.last_name}
                      onChange={(e) => handleInputChange(index, 'last_name', e.target.value)}
                      onBlur={() => handleBlur(index)}
                    />
                  </td>
                  <td className='!plb-1'>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={user.role}
                        onChange={(e) => handleInputChange(index, 'role', e.target.value as UserRole)}
                        onBlur={() => handleBlur(index)}
                      >
                        <MenuItem value="estudiante">Estudiante</MenuItem>
                        <MenuItem value="profesor">Profesor</MenuItem>
                        <MenuItem value="administrativo">Administrativo</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                  <td className='!plb-1'>
                    <FormControl fullWidth disabled={!(user.role === 'estudiante' || user.role === 'profesor')}>
                      <InputLabel>Courses</InputLabel>
                      <Select
                        multiple
                        value={user.courses || []}
                        onChange={(e) => handleInputChange(index, 'courses', e.target.value)}
                        onBlur={() => handleBlur(index)}
                        renderValue={(selected) =>
                          courses
                            .filter((course) => selected.includes(course.id))
                            .map((course) => course.nombre)
                            .join(', ')
                        }
                      >
                        {courses.map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <Typography>No users found.</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TableUsers
