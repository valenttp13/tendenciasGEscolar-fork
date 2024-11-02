'use client'

import React, { useEffect, useState } from 'react'
import { getMessages } from '@/services/api/users'
import { Card, Typography, List, ListItem, ListItemText } from '@mui/material'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'

type Message = {
  id: number
  asunto: string
  contenido: string
  leido: boolean
  destinatario: {
    id: number
    username: string
  }
}

const Communications = () => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages()
        setMessages(data)
      } catch (error) {
        toast.error('Error loading messages')
      }
    }
    fetchMessages()
  }, [])

  if (messages.length === 0) {
    return <Typography>No messages available</Typography>
  }

  return (
    <Card>
      <Typography variant='h5' style={{ margin: '1rem' }}>
        Communications
      </Typography>
      <List>
        {messages.map(message => (
          <ListItem key={message.id}>
            <ListItemText primary={message.asunto} secondary={message.contenido} />
            {message.contenido.includes('Descarga tu informe aquí') && (
              <Button
                variant='outlined'
                color='primary'
                onClick={() => window.open(message.contenido.match(/https?:\/\/\S+/g)?.[0], '_blank')}
              >
                Download Report
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

export default Communications
