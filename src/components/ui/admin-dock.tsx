'use client'

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'framer-motion'
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  User,
  ImageIcon,
  LogOut
} from 'lucide-react'

export type AdminDockItemData = {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  className?: string
  isLogout?: boolean
}

export type AdminDockProps = {
  onLogout: () => void
  className?: string
  distance?: number
  panelHeight?: number
  baseItemSize?: number
  dockHeight?: number
  magnification?: number
  spring?: SpringOptions
}

type DockItemProps = {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  mouseX: MotionValue
  spring: SpringOptions
  distance: number
  baseItemSize: number
  magnification: number
  isActive?: boolean
  isLogout?: boolean
}

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isActive = false,
  isLogout = false
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    }
    return val - rect.x - baseItemSize / 2
  })

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className} ${isActive ? 'dock-item-active' : ''} ${isLogout ? 'dock-item-logout' : ''}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => cloneElement(child as React.ReactElement, { isHovered }))}
    </motion.div>
  )
}

type DockLabelProps = {
  className?: string
  children: React.ReactNode
}

function DockLabel({ children, className = '', ...rest }: DockLabelProps) {
  const { isHovered } = rest as { isHovered: MotionValue<number> }
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1)
    })
    return () => unsubscribe()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type DockIconProps = {
  className?: string
  children: React.ReactNode
}

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>
}

export default function AdminDock({
  onLogout,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 150,
  panelHeight = 60,
  dockHeight = 200,
  baseItemSize = 44
}: AdminDockProps) {
  const pathname = usePathname()
  const router = useRouter()
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  )
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)

  // Navigation items with Lucide icons
  const items: AdminDockItemData[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      href: '/admin'
    },
    {
      icon: <FileText size={20} />,
      label: 'Blog Posts',
      href: '/admin/posts'
    },
    {
      icon: <FolderOpen size={20} />,
      label: 'Projects',
      href: '/admin/projects'
    },
    {
      icon: <User size={20} />,
      label: 'Profile',
      href: '/admin/profile'
    },
    {
      icon: <ImageIcon size={20} />,
      label: 'Media',
      href: '/admin/media'
    },
    {
      icon: <LogOut size={20} />,
      label: 'Logout',
      onClick: onLogout,
      isLogout: true
    }
  ]

  const handleItemClick = (item: AdminDockItemData) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      router.push(item.href)
    }
  }

  const isActiveRoute = (href: string): boolean => {
    if (!pathname || !href) return false
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ position: 'fixed' }}>
      <motion.div
        style={{ height, scrollbarWidth: 'none' }}
        className="dock-outer pointer-events-auto"
      >
        <motion.div
          onMouseMove={({ pageX }) => {
            isHovered.set(1)
            mouseX.set(pageX)
          }}
          onMouseLeave={() => {
            isHovered.set(0)
            mouseX.set(Infinity)
          }}
          className={`dock-panel ${className}`}
          style={{ height: panelHeight }}
          role="toolbar"
          aria-label="Admin navigation dock"
        >
          {items.map((item, index) => (
            <DockItem
              key={index}
              onClick={() => handleItemClick(item)}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              isActive={item.href ? isActiveRoute(item.href) : false}
              isLogout={item.isLogout}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </motion.div>
      </motion.div>

      <style jsx>{`
        .dock-outer {
          margin: 0 0.5rem;
          display: flex;
          max-width: 100%;
          align-items: center;
          padding-bottom: 1rem;
          position: relative;
          bottom: 0;
        }

        .dock-panel {
          position: relative;
          display: flex;
          align-items: flex-end;
          width: fit-content;
          gap: 0.75rem;
          border-radius: 1rem;
          background-color: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding: 0 0.75rem 0.5rem;
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }

        :global(.dark) .dock-panel {
          background-color: rgba(17, 24, 39, 0.98);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        :global(.dock-item) {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          color: rgba(75, 85, 99, 1);
        }

        :global(.dark .dock-item) {
          background-color: rgba(31, 41, 55, 0.9);
          border-color: rgba(255, 255, 255, 0.12);
          color: rgba(209, 213, 219, 1);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.25), 0 1px 2px -1px rgba(0, 0, 0, 0.15);
        }

        :global(.dock-item:hover) {
          background-color: rgba(249, 250, 251, 1);
          border-color: rgba(0, 0, 0, 0.15);
          color: rgba(17, 24, 39, 1);
        }

        :global(.dark .dock-item:hover) {
          background-color: rgba(55, 65, 81, 1);
          border-color: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 1);
        }

        :global(.dock-item-active) {
          background-color: rgba(59, 130, 246, 0.1) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          color: rgba(59, 130, 246, 1) !important;
        }

        :global(.dark .dock-item-active) {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
          color: rgba(147, 197, 253, 1) !important;
        }

        :global(.dock-item-logout:hover) {
          background-color: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
          color: rgba(239, 68, 68, 1) !important;
        }

        :global(.dark .dock-item-logout:hover) {
          background-color: rgba(239, 68, 68, 0.2) !important;
          border-color: rgba(239, 68, 68, 0.4) !important;
          color: rgba(248, 113, 113, 1) !important;
        }

        :global(.dock-icon) {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.dock-label) {
          position: absolute;
          top: -2rem;
          left: 50%;
          width: fit-content;
          white-space: pre;
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: rgba(17, 24, 39, 0.95);
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 1);
          transform: translateX(-50%);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        :global(.dark .dock-label) {
          background-color: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(17, 24, 39, 1);
        }
      `}</style>
    </div>
  )
}