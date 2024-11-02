'use client'

// Librerías de React y utilidades
import React, { createContext, useContext, useState, useEffect } from 'react'

// Librerías de Next.js y servicios de la API
import { useRouter } from 'next/navigation'

import { login as apiLogin, register as apiRegister, getCurrentUser } from '@/services/api/auth'

// Tipos y constantes
import type { AuthContextType, User } from '@/types/all.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Estado de carga
  const router = useRouter()

  // Validar usuario en localStorage y obtener detalles
  const validateUser = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)

    return
    }

    try {
      const userData = await getCurrentUser()

      setUser(userData)
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    validateUser()
  }, [])

  useEffect(() => {
    if (!user) {
      validateUser()
    }
  }, [user])

  const login = async (username: string, password: string) => {
    setLoading(true)

    try {
      const { user, access } = await apiLogin(username, password)

      localStorage.setItem('token', access)
      setUser(user)

      return true
    } catch (error) {
      console.error('Login error:', error)

      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    username: string,
    password: string,
    email: string,
    firstName = 'ND',
    lastName = 'ND',
    role = 'estudiante'
  ) => {
    setLoading(true)

    try {
      const { user, access } = await apiRegister(username, password, email, firstName, lastName, role)

      localStorage.setItem('token', access)
      setUser(user)

      return true
    } catch (error) {
      console.error('Register error:', error)

      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para utilizar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
