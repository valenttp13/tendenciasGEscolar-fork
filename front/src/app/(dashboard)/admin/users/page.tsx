'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import TableUsers from '@/views/dashboard/TableUsers'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableUsers />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
