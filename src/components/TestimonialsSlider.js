'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Rodriguez',
    badge: 'SR',
    role: 'Verified Buyer',
    rating: 5,
    text: '"The quality is absolutely exceptional! I\'ve been a customer for over a year and every piece I\'ve purchased has exceeded my expectations. The fit, fabric, and attention to detail are unmatched."',
    items: 'Purchased 3 items • Rated 5 stars',
    color: 'from-gold-400 to-gold-600',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    badge: 'MJ',
    role: 'Verified Buyer',
    rating: 5,
    text: '"Finally found a brand that gets unisex fashion right! The styles are versatile and timeless. Customer service was incredibly helpful when I had questions. Highly recommend TIM\'S GLAM!"',
    items: 'Purchased 2 items • Rated 5 stars',
    color: 'from-primary-400 to-primary-600',
  },
  {
    id: 3,
    name: 'Elena Kim',
    badge: 'EK',
    role: 'Verified Buyer',
    rating: 5,
    text: '"As a mom of two, finding quality pieces that work for the whole family is a dream! The kids love their outfits and everything washes perfectly. Worth every penny!"',
    items: 'Purchased 8 items • Rated 5 stars',
    color: 'from-gold-400 to-primary-600',
  },
  {
    id: 4,
    name: 'David Lee',
    badge: 'DL',
    role: 'Verified Buyer',
    rating: 5,
    text: '"The styles are contemporary yet timeless. I appreciate the attention to sustainability and ethical production. Fast shipping and excellent packaging too!"',
    items: 'Purchased 4 items • Rated 5 stars',
    color: 'from-primary-500 to-gold-500',
  },
  {
    id: 5,
    name: 'Aisha Cohen',
    badge: 'AC',
    role: 'Verified Buyer',
    rating: 5,
    text: '"Best online shopping experience I\'ve had! The website is easy to navigate, checkout is smooth, and the products arrived in perfect condition. Will definitely order again!"',
    items: 'Purchased 5 items • Rated 5 stars',
    color: 'from-gold-500 to-primary-500',
  },
  {
    id: 6,
    name: 'Thomas Park',
    badge: 'TP',
    role: 'Verified Buyer',
    rating: 5,
    text: '"Comfortable, stylish, and affordable! I\'ve recommended TIM\'S GLAM to all my friends. The quality speaks for itself. Keep up the great work!"',
    items: 'Purchased 6 items • Rated 5 stars',
    color: 'from-primary-600 to-gold-400',
  },
]

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIdx = Math.max(0, testimonials.length - itemsPerView)
      return prev >= maxIdx ? 0 : prev + 1
    })
  }, [itemsPerView])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIdx = Math.max(0, testimonials.length - itemsPerView)
      return prev <= 0 ? maxIdx : prev - 1
    })
  }, [itemsPerView])

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(timer)
  }, [nextSlide])

  const translateValue = -(currentIndex * (100 / itemsPerView))

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${translateValue}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-shrink-0 px-3 md:px-4"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 h-full flex flex-col">
                {/* Avatar and Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 flex-1">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {testimonial.badge}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-gold-500">★</span>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed mb-4 flex-grow text-sm md:text-base">
                  {testimonial.text}
                </p>

                {/* Footer */}
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
                  {testimonial.items}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 z-10 group"
            aria-label="Previous testimonials"
          >
            <FiChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 z-10 group"
            aria-label="Next testimonials"
          >
            <FiChevronRight size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {testimonials.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-primary-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
