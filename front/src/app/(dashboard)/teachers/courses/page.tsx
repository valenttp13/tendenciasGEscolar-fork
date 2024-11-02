'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import TableCourses from '@/views/dashboard/TableCourses'
import { useAuth } from '@/context/AuthContext'

const DashboardAnalytics = () => {
  const { user } = useAuth() // Obtener el usuario desde el contexto de autenticación
  const userId = user?.id || 0
  const userType = user?.role || ''
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableCourses userId={userId} userType={userType} />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
