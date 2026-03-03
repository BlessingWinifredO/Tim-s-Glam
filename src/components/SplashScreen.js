'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Check if splash screen has already been shown in this session
    const hasSeenSplash = sessionStorage.getItem('splashScreenShown')
    
    if (hasSeenSplash) {
      setIsVisible(false)
      return
    }

    // Show splash screen for 3.5 seconds
    const timer = setTimeout(() => {
      setIsFading(true)
      
      // Hide splash screen after fade animation
      const fadeTimer = setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem('splashScreenShown', 'true')
      }, 600)

      return () => clearTimeout(fadeTimer)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 flex items-center justify-center transition-opacity duration-600 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Logo Badge */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center animate-[bounce_2s_ease-in-out_infinite]">
          {/* Background Circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-full shadow-2xl"></div>
          
          {/* Inner Circle */}
          <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full"></div>
          
          {/* TG Text */}
          <span className="relative text-4xl md:text-5xl font-playfair font-bold text-gold-300 drop-shadow-lg">TG</span>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-baseline gap-2 justify-center">
            <span className="text-3xl md:text-4xl font-playfair font-bold" style={{
              background: 'linear-gradient(135deg, #f0e68c 0%, #ffd700 50%, #daa520 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TIM&apos;S
            </span>
            <span className="text-3xl md:text-4xl font-playfair font-bold text-white">GLAM</span>
          </div>
          <p className="text-gold-300 text-sm md:text-base font-medium tracking-widest">YOUR STYLE • YOUR SIGNATURE</p>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 bg-gold-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Tagline */}
        <p className="text-white/70 text-xs md:text-sm mt-4 tracking-wide">PREMIUM FASHION FOR EVERYONE</p>
      </div>
    </div>
  )
}
