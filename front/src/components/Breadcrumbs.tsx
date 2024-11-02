'use client'

// React Imports
import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// MUI Imports
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const CustomBreadcrumbs: React.FC = () => {
  const pathname = usePathname()
  const pathArray = pathname ? pathname.split('/').filter(Boolean) : []

  return (
    <Box sx={{ padding: '16px' }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/" passHref>
          {/* Aplicar el estilo al contenedor de Link para aumentar el área de clic */}
          <Box
            sx={{
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo suave al pasar el ratón
                textDecoration: 'underline', // Subrayado
              }
            }}
          >
            <Typography color="text.primary">Home</Typography>
          </Box>
        </Link>
        {pathArray.map((path, index) => {
          const href = `/${pathArray.slice(0, index + 1).join('/')}`
          const isLast = index === pathArray.length - 1

          return isLast ? (
            <Box
              key={href}
              sx={{
                cursor: 'default',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              <Typography color="text.secondary">
                {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
              </Typography>
            </Box>
          ) : (
            <Link key={href} href={href} passHref>
              <Box
                sx={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    textDecoration: 'underline',
                  }
                }}
              >
                <Typography color="text.primary">
                  {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
                </Typography>
              </Box>
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default CustomBreadcrumbs
