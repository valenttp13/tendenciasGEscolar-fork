// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CourseEdit from '@/views/dashboard/CourseEdit'

const CourseDetails = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CourseEdit />
      </Grid>
    </Grid>
  )
}

export default CourseDetails
