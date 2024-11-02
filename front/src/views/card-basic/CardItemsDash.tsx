// Importaciones de MUI
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Definición de la interfaz para los props
interface CardItemsDashProps {
  imageUrl: string
  title: string
  price: string
  description: string
  buttonText: string
  onButtonClick?: () => void // Opcional: callback para manejar clics en el botón
}

const CardItemsDash: React.FC<CardItemsDashProps> = ({
  imageUrl,
  title,
  price,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <Card>
      <CardMedia image={imageUrl} className='bs-[140px]' />
      <CardContent>
        <Typography variant='h5' className='mbe-2'>
          {title}
        </Typography>
        <Typography className='mbe-2'>{price}</Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <Button variant='contained' fullWidth className='rounded-none' onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Card>
  )
}

export default CardItemsDash
