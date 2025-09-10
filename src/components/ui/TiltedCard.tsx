'use client'

import { useState, useRef, useEffect } from 'react'

interface TiltedCardProps {
  imageSrc?: string
  altText?: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  rotateAmplitude?: number
  scaleOnHover?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  displayOverlayContent?: boolean
  overlayContent?: React.ReactNode
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function TiltedCard({
  imageSrc,
  altText = '',
  captionText,
  containerHeight = '300px',
  containerWidth = '300px',
  imageHeight = '300px',
  imageWidth = '300px',
  rotateAmplitude = 12,
  scaleOnHover = 1.1,
  showMobileWarning = false,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent,
  children,
  className = '',
  onClick
}: TiltedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const rotateXValue = ((e.clientY - centerY) / rect.height) * -rotateAmplitude
    const rotateYValue = ((e.clientX - centerX) / rect.width) * rotateAmplitude
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  const cardStyle = {
    height: containerHeight,
    width: containerWidth,
    transform: isMobile 
      ? `scale(${isHovered ? scaleOnHover : 1})` 
      : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? scaleOnHover : 1})`,
    transition: 'transform 0.1s ease-out',
    transformStyle: 'preserve-3d' as const,
  }

  return (
    <div className="relative inline-block">
      {/* Mobile Warning */}
      {showMobileWarning && isMobile && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500/10 text-yellow-600 text-xs p-2 rounded-t-lg border border-yellow-500/20">
          Best viewed on desktop for 3D effect
        </div>
      )}

      <div
        ref={cardRef}
        className={`relative cursor-pointer select-none ${className}`}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Card Content */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          {/* Image */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover"
              style={{
                height: imageHeight,
                width: imageWidth,
              }}
              draggable={false}
            />
          )}
          
          {/* Children Content */}
          {children && (
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          )}

          {/* Overlay Content */}
          {displayOverlayContent && overlayContent && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="text-white text-center p-4">
                {overlayContent}
              </div>
            </div>
          )}

          {/* Caption */}
          {captionText && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white font-medium text-sm">
                {captionText}
              </p>
            </div>
          )}

          {/* Shine Effect */}
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`
            }}
          />
        </div>

        {/* Tooltip */}
        {showTooltip && isHovered && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
            {captionText || altText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    </div>
  )
}