'use client'

import { memo } from 'react'

export const ParticleBackground = memo(function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* CSS-only animated particles - no JavaScript execution */}
      <div className="particle-container">
        {/* Floating particles using CSS animations */}
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
        <div className="particle particle-6" />
        <div className="particle particle-7" />
        <div className="particle particle-8" />
        <div className="particle particle-9" />
        <div className="particle particle-10" />

        {/* Connection lines using CSS pseudo-elements - Temporarily removed to fix X-pattern */}
        {/* <div className="particle-connections" /> */}
      </div>

      {/* Animated gradient overlay for depth */}
      <div className="particle-gradient-overlay" />
    </div>
  )
})