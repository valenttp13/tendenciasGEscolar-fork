'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import TableStudents from '@/views/dashboard/TableStudents'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableStudents />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
