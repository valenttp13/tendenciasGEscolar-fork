'use client'

// Importar React y `react-hot-toast`
import React from 'react'
import { Toaster } from 'react-hot-toast'

const ToastProvider = () => {
  return (
    <Toaster
      position='bottom-left'
      reverseOrder={false}
      toastOptions={{
        duration: 5000, // Duración predeterminada de cada toast (5 segundos)
        style: {
          background: '#363636',
          color: '#fff'
        },
        success: {
          duration: 3000,
          icon: '✔️'
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#FF4545',
            secondary: '#fff'
          }
        }
      }}
    />
  )
}

export default ToastProvider
