'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import TableCourses from '@/views/dashboard/TableCourses'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableCourses />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
