'use client'

import { useState, useEffect } from 'react'
import { profileService } from '@/lib/service-switcher'
import type { ProfileData } from '@/lib/profile-service'

interface ProfileAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showName?: boolean
  showTitle?: boolean
  showStatus?: boolean
  className?: string
  onClick?: () => void
  priority?: boolean // For Next.js Image optimization
}

export function ProfileAvatar({ 
  size = 'md', 
  showName = false,
  showTitle = false,
  showStatus = false,
  className = "",
  onClick,
  priority = false
}: ProfileAvatarProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  }

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }

  const nameTextSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  }

  const titleTextSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-sm',
    '2xl': 'text-base'
  }

  useEffect(() => {
    setIsHydrated(true)
    const updateProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    
    updateProfile()
    
    // Listen for storage changes to update profile in real-time
    const handleStorageChange = () => updateProfile()
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom profile update events
    const handleProfileUpdate = () => updateProfile()
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [])

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const hasCustomAvatar = isHydrated && profile?.avatar && profile.avatar !== '/avatar.jpg' && profile.avatar.startsWith('http') && !imageError
  const initials = (profile?.name || 'Matthew Raphael').split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2)

  return (
    <div className={`flex items-center space-x-3 ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {/* Avatar Image/Fallback */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {hasCustomAvatar ? (
          <div className="relative w-full h-full">
            {/* Loading Skeleton */}
            {imageLoading && (
              <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse`}></div>
            )}
            
            {/* Actual Image */}
            <img
              src={profile?.avatar}
              alt={`${profile?.name || 'Matthew Raphael'} - Web3 Data Analyst and Blockchain Analytics Expert profile picture`}
              className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary-500/30 shadow-lg shadow-primary-500/10 transition-all duration-300 hover:shadow-primary-500/20 hover:scale-105 ${
                imageLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading={priority ? 'eager' : 'lazy'}
            />
          </div>
        ) : (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white font-bold ${textSizeClasses[size]} shadow-lg shadow-primary-500/20 transition-all duration-300 hover:shadow-primary-500/30 hover:scale-105`}>
            {initials}
          </div>
        )}

        {/* Status Indicator */}
        {showStatus && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
        )}
      </div>

      {/* Name and Title */}
      {(showName || showTitle) && (
        <div className="flex-1 min-w-0">
          {showName && (
            <div className={`font-bold text-foreground ${nameTextSizeClasses[size]} truncate`}>
              {profile?.name || 'Matthew Raphael'}
            </div>
          )}
          {showTitle && (
            <div className={`text-foreground/60 ${titleTextSizeClasses[size]} truncate`}>
              {profile?.name === 'Matthew Raphael' || !profile?.name ? 
                'RaphdeAnalyst • Web3 Data & AI Specialist' : 
                (profile?.title || 'Web3 Data & AI Specialist')
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Utility hook for profile data
export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const updateProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    
    updateProfile()
    
    const handleStorageChange = () => updateProfile()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profileUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleStorageChange)
    }
  }, [])

  return { profile: profile || { name: 'Matthew Raphael', title: 'Web3 Data & AI Specialist', avatar: '/avatar.jpg' }, isHydrated }
}

// Predefined avatar variations for common use cases
export function NavbarAvatar(props: Omit<ProfileAvatarProps, 'size'>) {
  return <ProfileAvatar size="sm" {...props} />
}

export function CardAvatar(props: Omit<ProfileAvatarProps, 'size' | 'showName' | 'showTitle'>) {
  return <ProfileAvatar size="md" showName showTitle {...props} />
}

export function HeroAvatar(props: Omit<ProfileAvatarProps, 'size'>) {
  return <ProfileAvatar size="2xl" priority {...props} />
}

export function ContactAvatar(props: Omit<ProfileAvatarProps, 'size' | 'showName' | 'showTitle' | 'showStatus'>) {
  return <ProfileAvatar size="lg" showName showTitle showStatus {...props} />
}