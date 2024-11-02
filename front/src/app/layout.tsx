'use client'

/* eslint-disable import/order */
// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import ProtectedRoute from '@/components/ProtectedRoute'

import { AuthProvider } from '@/context/AuthContext'

import { usePathname } from 'next/navigation'

// Importar el `ToastProvider`
import ToastProvider from '@/components/ToastProvider'

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const pathname = usePathname()
  const direction = 'ltr'
  const unprotectedRoutes = ['/login']
  const isUnprotectedRoute = unprotectedRoutes.includes(pathname)

  return (
    <html id='__next' dir={direction}>
      <head>
        <title>School App</title>
        <meta name='description' content='School for administration' />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <AuthProvider>
          {isUnprotectedRoute ? (
            children
          ) : (
            <ProtectedRoute>
              <ToastProvider />
              {children}
            </ProtectedRoute>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
