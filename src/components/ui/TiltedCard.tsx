'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

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
  const boundsRef = useRef<DOMRect | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      // Clean up animation frame on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const updateRotation = (clientX: number, clientY: number) => {
    if (!boundsRef.current) return

    const centerX = boundsRef.current.left + boundsRef.current.width / 2
    const centerY = boundsRef.current.top + boundsRef.current.height / 2

    // Improved calculation with better sensitivity
    const rotateXValue = ((clientY - centerY) / boundsRef.current.height) * -rotateAmplitude * 1.2
    const rotateYValue = ((clientX - centerX) / boundsRef.current.width) * rotateAmplitude * 1.2

    // Clamp values to prevent over-rotation
    const clampedRotateX = Math.max(-rotateAmplitude, Math.min(rotateAmplitude, rotateXValue))
    const clampedRotateY = Math.max(-rotateAmplitude, Math.min(rotateAmplitude, rotateYValue))

    setRotateX(clampedRotateX)
    setRotateY(clampedRotateY)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Use requestAnimationFrame for smooth performance
    animationFrameRef.current = requestAnimationFrame(() => {
      updateRotation(e.clientX, e.clientY)
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    // Cache the bounding rect on mouse enter for performance
    if (cardRef.current) {
      boundsRef.current = cardRef.current.getBoundingClientRect()
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
    boundsRef.current = null

    // Clean up animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const cardStyle = {
    height: containerHeight,
    width: containerWidth,
    transform: isMobile
      ? `scale(${isHovered ? scaleOnHover : 1})`
      : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? scaleOnHover : 1})`,
    transition: isHovered && !isMobile
      ? 'transform 0.03s ease-out' // Fast transition for smooth real-time tracking
      : 'transform 0.3s ease-out', // Smooth transition for enter/leave
    transformStyle: 'preserve-3d' as const,
    transformOrigin: 'center center',
    willChange: 'transform', // GPU acceleration hint
  }

  return (
    <div className="relative inline-block">
      {/* Mobile Warning */}
      {showMobileWarning && isMobile && (
        <div className="absolute top-0 left-0 right-0 bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs p-2 rounded-t-lg border border-gray-500/20">
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
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
          style={{
            boxShadow: isHovered && !isMobile
              ? `${rotateY * 0.5}px ${Math.abs(rotateX) * 0.5 + 10}px ${Math.abs(rotateX) + Math.abs(rotateY) + 15}px rgba(0, 0, 0, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)`
              : undefined
          }}
        >
          {/* Image */}
          {imageSrc && (
            <div className="relative w-full h-full">
              <Image
                src={imageSrc}
                alt={altText || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                draggable={false}
              />
            </div>
          )}

          {/* Children Content */}
          {children && !imageSrc && (
            <div className="w-full h-full">
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