'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { logger } from '@/lib/logger'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (typeof window !== 'undefined') {
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
        const isIOSStandalone = (navigator as any).standalone === true
        setIsInstalled(isInStandaloneMode || isIOSStandalone)
      }
    }

    checkInstalled()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)

      // Show prompt after user has been on site for a bit
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
          logger.info('PWA install prompt available')
        }
      }, 3000)
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      logger.success('PWA installed successfully')
      setIsInstalled(true)
      setShowPrompt(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice

      logger.info(`PWA install prompt result: ${outcome}`)

      if (outcome === 'accepted') {
        logger.success('User accepted PWA installation')
      } else {
        logger.info('User dismissed PWA installation')
      }
    } catch (error) {
      logger.error('Error during PWA installation:', error)
    } finally {
      setShowPrompt(false)
      setInstallPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    logger.info('PWA install prompt dismissed by user')
  }

  // Don't show if already installed or no install prompt available
  if (isInstalled || !showPrompt || !installPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Install App</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-foreground/70 mb-4">
          Install Matthew Raphael&apos;s Web3 Portfolio for quick access and offline reading.
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg font-medium text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}