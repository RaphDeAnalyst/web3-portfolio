'use client'

// Removed framer-motion for performance optimization
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  User,
  ImageIcon,
  LogOut,
  ChevronLeft,
  ChevronRight
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
}


export default function AdminDock({
  onLogout,
  className = ''
}: AdminDockProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    // Auto-close sidebar on desktop when item is clicked
    setIsSidebarOpen(false)

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
    <>
      {/* Responsive Sidebar for All Devices */}
      <div>
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 animate-in"
          />
        )}

        {/* Responsive Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-1/2 left-0 z-50 w-8 h-12 sm:h-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-r-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 md:top-1/2"
          style={{ transform: 'translateY(-50%)' }}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Responsive Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-56 sm:w-60 md:w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 sm:p-4 pt-20 sm:pt-24">
            <div className="space-y-1 sm:space-y-2">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-4 md:py-3 rounded-lg transition-all duration-200 text-left hover:scale-105 active:scale-95 ${
                    item.href && isActiveRoute(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : item.isLogout
                      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm sm:text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}