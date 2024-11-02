'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Communications from '@/views/dashboard/Communications'

const DashCommunications = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} md={10} lg={8} xl={6}>
        <Communications />
      </Grid>
    </Grid>
  )
}

export default DashCommunications
