import React from 'react'


type TimeFormatterProps = {
  time: string
}


const TimeFormatter: React.FC<TimeFormatterProps> = ({ time }) => {
  // Función para formatear la hora en formato 12 horas con AM/PM
  const formatTime = (time: string) => {
    const [hour, minute, second] = time.split(':')
    const date = new Date()

    date.setHours(Number(hour), Number(minute), Number(second))


    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date)
  }


  return <span>{formatTime(time)}</span>
}

export default TimeFormatter
