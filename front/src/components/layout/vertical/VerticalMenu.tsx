'use client'

// React Imports
import React, { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Auth Context Import
import { useAuth } from '@/context/AuthContext' // Importar el contexto de autenticación

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const { user } = useAuth() // Obtener el usuario desde el contexto de autenticación

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Verificar que el usuario esté autenticado y tenga un rol
  if (!user || !user.role) {
    return null // Si no hay usuario autenticado o no hay rol, no renderizar el menú
  }

  // Configuración dinámica de las rutas del menú según el rol del usuario
  const menuConfig = [
    {
      label: 'Students',
      roles: ['estudiante'],
      subMenu: [
        { label: 'Dashboard', href: '/students', icon: <i className='ri-home-smile-line' /> },
        { label: 'Courses', href: '/students/courses' },
      ]
    },
    {
      label: 'Teachers',
      roles: ['profesor'],
      subMenu: [
        { label: 'Courses', href: '/teachers/courses' },
      ]
    },
    {
      label: 'Administration',
      roles: ['administrativo'],
      subMenu: [
        { label: 'Admin', href: '/admin' },
        { label: 'Users', href: '/admin/users' }
      ]
    }
  ]

  // Estado para mantener todos los menús expandidos por defecto
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>(
    () =>
      menuConfig.reduce((acc, item) => {
        if (item.subMenu) {
          acc[item.label] = true // Iniciar todos los submenús como expandidos
        }
        return acc
      }, {})
  )

  // Función para manejar la expansión de los menús de manera manual
  const handleSubMenuToggle = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  // Función recursiva para renderizar el menú
  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      // Verificar si el ítem debe mostrarse según el rol del usuario
      if (item.roles && !item.roles.includes(user.role)) {
        return null
      }

      // Obtener el estado de expansión actual para el submenú
      const isExpanded = expandedMenus[item.label] ?? true

      // Si hay un submenú, se renderiza recursivamente
      if (item.subMenu) {
        return (
          <SubMenu
            key={index}
            label={item.label}
            icon={item.icon || <i className='ri-menu-line' />}
            open={isExpanded}
            onToggle={() => handleSubMenuToggle(item.label)}
          >
            {renderMenuItems(item.subMenu)}
          </SubMenu>
        )
      }

      // Renderizar un ítem de menú simple si no tiene submenú
      return (
        <MenuItem key={index} href={item.href} icon={item.icon}>
          {item.label}
        </MenuItem>
      )
    })
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        {renderMenuItems(menuConfig)}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
