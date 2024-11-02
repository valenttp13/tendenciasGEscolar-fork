'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import CustomCard from '@/views/dashboard/CustomCard'

const DashStudents = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <CustomCard imageUrl='' title='Courses' description='Show the courses' redirectUrl='/students/courses' />
      </Grid>
      <Grid item xs={12} md={8} lg={4}>
        <CustomCard
          imageUrl=''
          title='Notifications'
          description='Show the notifications'
          redirectUrl='/students/communications'
        />
      </Grid>
    </Grid>
  )
}

export default DashStudents
