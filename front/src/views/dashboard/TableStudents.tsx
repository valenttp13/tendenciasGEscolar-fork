'use client'

// React Imports
import React, { useState, useEffect, useContext } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Service Imports
import tableStyles from '@core/styles/table.module.css'
import { getStudentsByCourseId, saveGradesForCourse, getCourseById, getGradesByCourseId } from '@/services/api/courses'

// Import `react-hot-toast`
import toast from 'react-hot-toast'

// Tipado de los datos de cada fila y de las calificaciones
import type { Student, StudentRowType, GradeInput } from '@/types/all.types'
import { useAuth } from '@/context/AuthContext'


const TableStudents = () => {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentRowType[]>([])
  const [courseGrades, setCourseGrades] = useState<GradeInput[]>([])
  const [loading, setLoading] = useState(true)
  const [numOfGrades, setNumOfGrades] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')

  const params = useParams()
  const router = useRouter()
  const { id } = params || {}

  useEffect(() => {
    const fetchCourseAndStudents = async () => {
      try {
        setLoading(true)

        const courseData = await getCourseById(Number(id))
        setNumOfGrades(courseData.cantidad_notas)

        const studentsData = await getStudentsByCourseId(Number(id))

        // Filtrar los estudiantes si el usuario es estudiante
        const filteredStudents = user?.role === 'estudiante'
          ? studentsData.filter((student: Student) => student.user_details.id === user.id)
          : studentsData

        const savedGradesResponse = await getGradesByCourseId(Number(id))
        const savedGrades = savedGradesResponse || []

        const formattedStudents = filteredStudents.map((student: Student) => {
          const studentGrades = savedGrades.find((grade) => grade.estudiante === student.id) || {}
          const initialGrades = {}
          for (let i = 1; i <= courseData.cantidad_notas; i++) {
            initialGrades[`calificacion${i}`] = studentGrades[`notas`]?.[`calificacion${i}`] !== undefined
              ? studentGrades[`notas`]?.[`calificacion${i}`]
              : ''
          }
          return {
            id: student.id,
            avatarSrc: '/images/avatars/default.png',
            name: `${student.user_details.first_name} ${student.user_details.last_name}`,
            username: `${student.user_details.username}`,
            email: student.user_details.email,
            iconClass: 'text-primary',
            roleIcon: 'ri-user-line',
            role: student.user_details.role,
            calificaciones: initialGrades,
            descripcion: studentGrades.descripcion || '',
            fecha_evaluacion: studentGrades.fecha_evaluacion || new Date().toISOString().split('T')[0]
          }
        })

        setStudents(formattedStudents)

        const initialGrades = formattedStudents.map((student) => ({
          estudiante: student.id,
          descripcion: student.descripcion,
          fecha_evaluacion: student.fecha_evaluacion,
          ...student.calificaciones
        }))

        setCourseGrades(initialGrades)
      } catch (error) {
        toast.error('Failed to fetch course or students data')
        console.error('Error fetching course and students data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseAndStudents()
    }
  }, [id, user])

  const handleGradeChange = (index: number, gradeIndex: number, value: string) => {
    setCourseGrades((prevGrades) =>
      prevGrades.map((grade, i) =>
        i === index ? { ...grade, [`calificacion${gradeIndex + 1}`]: value } : grade
      )
    )
  }

  const handleSaveGrades = async () => {
    try {
      const toastId = toast.loading('Saving grades...')

      const completedGrades = courseGrades.map((grade) => {
        const { calificacion, ...filteredGrade } = grade
        for (let i = 1; i <= numOfGrades; i++) {
          if (filteredGrade[`calificacion${i}`] === '' || filteredGrade[`calificacion${i}`] === undefined) {
            filteredGrade[`calificacion${i}`] = 0
          }
        }
        return filteredGrade
      })

      await saveGradesForCourse(Number(id), completedGrades)
      toast.success('Grades saved successfully!', { id: toastId })

      setCourseGrades((prevGrades) =>
        prevGrades.map((grade) => {
          const updatedGrade = completedGrades.find((g) => g.estudiante === grade.estudiante) || grade
          return updatedGrade
        })
      )

    } catch (error) {
      toast.error('Failed to save grades')
      console.error('Error saving grades:', error)
    }
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <Typography>Cargando estudiantes...</Typography>

  return (
    <Card>
      <div className='flex items-center p-4 gap-4'>
        <TextField
          label='Student search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant='outlined'
          fullWidth
          size='small'
          disabled={user?.role === 'estudiante'}
        />
        <IconButton onClick={() => setSearchQuery('')} className='text-textPrimary'>
          <i className='ri-close-line' />
        </IconButton>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Student</th>
              {Array.from({ length: numOfGrades }).map((_, index) => (
                <th key={`grade-${index}`}>Grade {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <div className='flex items-center gap-3'>
                      <CustomAvatar src={row.avatarSrc} size={34} />
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                          {row.name}
                        </Typography>
                        <Typography variant='body2'>{row.username}</Typography>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: numOfGrades }).map((_, gradeIndex) => (
                    <td key={`grade-input-${index}-${gradeIndex}`} className='!plb-1'>
                      <Tooltip title={courseGrades[index]?.descripcion || 'No description'} arrow>
                        <TextField
                          type='number'
                          label={`Grade ${gradeIndex + 1}`}
                          value={courseGrades[index]?.[`calificacion${gradeIndex + 1}`] ?? ''}
                          onChange={(e) => handleGradeChange(index, gradeIndex, e.target.value)}
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          disabled={user?.role === 'estudiante'}
                        />
                      </Tooltip>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={numOfGrades + 1}>
                  <Typography>No students found for this course.</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {user?.role !== 'estudiante' && (
          <div className='flex justify-end m-4'>
            <Button variant='contained' color='primary' onClick={handleSaveGrades}>
              Save
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TableStudents
