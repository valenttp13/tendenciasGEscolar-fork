'use client'

// React imports
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

// Hook imports
import { useAuth } from '@/context/AuthContext' // Importa el contexto de autenticación

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth() // Obtener `loading` y `user` del contexto
  const router = useRouter()

  useEffect(() => {
    // Si no está cargando y no hay usuario autenticado, redirigir a la página de login
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Mostrar un spinner o cualquier otro indicador mientras `loading` es true
  if (loading) {
    return <div>Loading...</div>
  }

  // Mostrar el contenido solo si el usuario está autenticado
  return <>{user ? children : null}</>
}

export default ProtectedRoute
