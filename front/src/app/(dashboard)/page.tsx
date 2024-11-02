'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomCard from '@/views/dashboard/CustomCard'

// Auth Context
import { useAuth } from '@/context/AuthContext'

const DashboardAnalytics = () => {
  // Obtener el usuario y el rol desde el contexto de autenticación
  const { user } = useAuth()

  // Mostrar un mensaje si no hay usuario autenticado
  if (!user) {
    return <Typography variant='h5'>No estás autenticado</Typography>
  }

  // Mostrar las tarjetas según el rol del usuario
  const renderCardsByRole = () => {
    switch (user.role) {
      case 'administrativo':
        return (
          <>
            <Grid item xs={12} md={4}>
              <CustomCard imageUrl='' title='Admin' description='Administrative site' redirectUrl='/admin' />
            </Grid>
            <Grid item xs={12} md={8} lg={4}>
              <CustomCard imageUrl='' title='Teacher' description='Teacher site' redirectUrl='/teachers' />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <CustomCard imageUrl='' title='Student' description='Students site' redirectUrl='/students' />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <CustomCard imageUrl='' title='Users' description='Users administration' redirectUrl='/admin/users' />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <CustomCard imageUrl='' title='Course' description='Course administration' redirectUrl='#' />
            </Grid>
          </>
        )
      case 'profesor':
        return (
          <Grid item xs={12} md={8} lg={4}>
            <CustomCard imageUrl='' title='Teacher' description='Teacher site' redirectUrl='/teachers' />
          </Grid>
        )
      case 'estudiante':
        return (
          <Grid item xs={12} md={6} lg={4}>
            <CustomCard imageUrl='' title='Student' description='Students site' redirectUrl='/students' />
          </Grid>
        )
      default:
        return null
    }
  }

  return (
    <Grid container spacing={6}>
      {renderCardsByRole()}
    </Grid>
  )
}

export default DashboardAnalytics
