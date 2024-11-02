'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import CustomCard from '@/views/dashboard/CustomCard'

const DashAdmin = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <CustomCard imageUrl='' title='Courses' description='Show the courses' redirectUrl='/admin/courses' />
      </Grid>
      <Grid item xs={12} md={8} lg={4}>
        <CustomCard imageUrl='' title='Users' description='Show the users' redirectUrl='/admin/users' />
      </Grid>
    </Grid>
  )
}

export default DashAdmin
