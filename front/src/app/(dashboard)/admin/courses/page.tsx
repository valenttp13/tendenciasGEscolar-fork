'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Reports from '@/views/dashboard/Reports'

const DashReports = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Reports />
      </Grid>
    </Grid>
  )
}

export default DashReports
