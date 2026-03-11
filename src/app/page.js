'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiTruck, FiShield, FiRefreshCw, FiAward, FiArrowRight, FiCheckCircle, FiUsers, FiBriefcase, FiMail, FiStar, FiTrendingUp, FiHeart, FiGlobe, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { isProductPubliclyAvailable } from '@/lib/productAvailability'
import { blogPosts } from '@/data/blog'
import ProductCard from '@/components/ProductCard'
import ImageSlider from '@/components/ImageSlider'
import FeaturedProductSlider from '@/components/FeaturedProductSlider'
import TestimonialsSlider from '@/components/TestimonialsSlider'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterError, setNewsletterError] = useState('')
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const categorySliderRef = useRef(null)
  
  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productsData.filter(isProductPubliclyAvailable))
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  
  const featuredProducts = products.filter(p => p.featured).slice(0, 12)
  const latestBlogs = blogPosts.slice(0, 3)
  const featuredDesigners = [
    { name: 'Aurelia House', mark: 'AH' },
    { name: 'Street Loom', mark: 'SL' },
    { name: 'Ivory Thread', mark: 'IT' },
    { name: 'Urban Silhouette', mark: 'US' },
    { name: 'Noble Wardrobe', mark: 'NW' },
    { name: 'Kulture Lab', mark: 'KL' },
  ]

  const trendingCategories = [
    { name: 'Women', href: '/shop/women', image: '/home/home-5.jpg' },
    { name: 'Men', href: '/shop/men', image: '/home/home-1.jpg' },
    { name: 'Kids', href: '/shop?category=kids', image: '/home/home-6.jpg' },
    { name: 'Accessories', href: '/shop', image: '/home/home-2.jpg' },
    { name: 'Streetwear', href: '/shop', image: '/home/home-3.jpg' },
    { name: 'Luxury', href: '/shop', image: '/home/home-4.jpg' },
  ]

  const scrollCategories = (direction) => {
    if (!categorySliderRef.current) return
    const nextIndex =
      direction === 'next'
        ? (activeCategoryIndex + 1) % trendingCategories.length
        : (activeCategoryIndex - 1 + trendingCategories.length) % trendingCategories.length

    categorySliderRef.current.scrollTo({
      left: nextIndex * categorySliderRef.current.clientWidth,
      behavior: 'smooth',
    })
    setActiveCategoryIndex(nextIndex)
  }

  const handleCategoryScroll = () => {
    if (!categorySliderRef.current) return
    const nextIndex = Math.round(
      categorySliderRef.current.scrollLeft / categorySliderRef.current.clientWidth
    )
    if (nextIndex !== activeCategoryIndex && nextIndex >= 0 && nextIndex < trendingCategories.length) {
      setActiveCategoryIndex(nextIndex)
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    const email = newsletterEmail.trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError('Please enter a valid email address.')
      setNewsletterMessage('')
      return
    }

    try {
      setNewsletterSubmitting(true)
      setNewsletterError('')
      setNewsletterMessage('')

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Subscription failed. Please try again.')
      }

      setNewsletterMessage(result?.message || 'Thanks for subscribing!')
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterError(error?.message || 'Subscription failed. Please try again.')
    } finally {
      setNewsletterSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section with Image Slider */}
      <section className="relative overflow-hidden">
        <ImageSlider />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-transparent to-primary-900/35"></div>
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 md:pt-20 lg:pt-28 px-4 md:px-8">
          <div className="container-custom relative z-10 text-center text-white w-full max-w-5xl">
            <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-black/25 backdrop-blur-md px-5 py-7 md:px-10 md:py-12 shadow-2xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
              Your Style. Your Signature.
              <br />
              <span className="text-gold-400">Your Glam.</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover premium fashion for adults and kids.
              <br />
              Shop unique styles that elevate your wardrobe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link href="/shop" className="btn-primary shadow-xl hover:shadow-2xl transition-shadow">
                Shop Now
              </Link>
              <Link href="/shop" className="btn-outline bg-white/15 backdrop-blur-sm border-white/80 text-white hover:bg-white hover:text-primary-700">
                Explore Collections
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designers */}
      <section className="section-padding py-14 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-gold-500 font-semibold mb-2 tracking-widest uppercase text-sm">Marketplace Partners</p>
            <h2 className="heading-md mb-3">Featured Designers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover standout brands shaping modern style on TIM&apos;S GLAM.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredDesigners.map((designer) => (
              <div key={designer.name} className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-bold ring-2 ring-primary-100">
                  {designer.mark}
                </div>
                <p className="text-xs md:text-sm font-semibold text-gray-900 mb-2">{designer.name}</p>
                <Link href="/shop" className="text-xs font-semibold text-primary-600 hover:text-gold-500">View Collection</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Categories Slider */}
      <section className="section-padding py-14 md:py-20 relative overflow-hidden min-h-[460px] flex items-center">
        {trendingCategories.map((category, index) => (
          <Image
            key={category.name}
            src={category.image}
            alt={`${category.name} category background`}
            fill
            className={`object-cover transition-opacity duration-700 ${
              index === activeCategoryIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-[#120826]/90 via-[#26124f]/86 to-[#09070f]/82"></div>

        <div className="container-custom relative z-10 w-full">
          <div className="max-w-xl mx-auto w-full overflow-hidden rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl px-4 py-7 sm:px-8 sm:py-9">
            {/* Header */}
            <div className="text-center mb-5">
              <p className="!text-[#c4b5fd] font-semibold mb-1.5 tracking-widest uppercase text-xs">Quick Browse</p>
              <h2 className="heading-md !text-[#ede9fe]">Shop by Category</h2>
            </div>

            {/* Slider row: [←] [card] [→] */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <button
                type="button"
                onClick={() => scrollCategories('prev')}
                className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-lg transition-colors"
                aria-label="Previous category"
              >
                <FiChevronLeft size={18} />
              </button>

              <div
                ref={categorySliderRef}
                className="flex-1 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onScroll={handleCategoryScroll}
              >
                {trendingCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="snap-start shrink-0 w-full flex flex-col items-center justify-center py-8 px-4 text-center bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl transition-all group"
                  >
                    <span className="text-3xl md:text-4xl font-bold text-white">{category.name}</span>
                    <span className="flex items-center gap-1 text-white/55 text-sm mt-2 group-hover:text-white/80 transition-colors">
                      Shop now <FiArrowRight size={13} />
                    </span>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollCategories('next')}
                className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-lg transition-colors"
                aria-label="Next category"
              >
                <FiChevronRight size={18} />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2">
              {trendingCategories.map((category, index) => (
                <button
                  key={`dot-${category.name}`}
                  type="button"
                  onClick={() => {
                    if (!categorySliderRef.current) return
                    categorySliderRef.current.scrollTo({
                      left: index * categorySliderRef.current.clientWidth,
                      behavior: 'smooth',
                    })
                    setActiveCategoryIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === activeCategoryIndex ? 'w-7 bg-[#c4b5fd]' : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                  aria-label={`Go to ${category.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding py-14 md:py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white relative overflow-hidden">
        <Image
          src="/home/home-11.jpg"
          alt="Fashion trust background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-primary-700/90"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-10">
            <h2 className="heading-md text-white mb-3">Why Shop TIM&apos;S GLAM</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="bg-white/10 rounded-xl p-4 md:p-5 border border-white/20 backdrop-blur-sm">
              <FiShield className="mb-3 text-gold-300" size={22} />
              <p className="font-semibold">Secure Payments</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 md:p-5 border border-white/20 backdrop-blur-sm">
              <FiUsers className="mb-3 text-gold-300" size={22} />
              <p className="font-semibold">Independent Designers</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 md:p-5 border border-white/20 backdrop-blur-sm">
              <FiCheckCircle className="mb-3 text-gold-300" size={22} />
              <p className="font-semibold">Premium Quality Fashion</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 md:p-5 border border-white/20 backdrop-blur-sm">
              <FiTruck className="mb-3 text-gold-300" size={22} />
              <p className="font-semibold">Global Shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join As Seller */}
      <section className="section-padding py-14 md:py-20 bg-white relative overflow-hidden">
        <Image
          src="/home/home-10.jpg"
          alt="Fashion seller background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white/90"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gold-50/95 via-white/95 to-primary-50/95 border border-gold-200 rounded-2xl p-7 md:p-12 text-center shadow-lg backdrop-blur-sm">
            <FiBriefcase className="mx-auto text-primary-600 mb-4" size={28} />
            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">Own a Fashion Brand?</h2>
            <p className="text-gray-700 text-base md:text-lg mb-6">Join TIM&apos;S GLAM and reach customers worldwide.</p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              <span>Start Selling</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center bg-white border border-gray-200 rounded-2xl p-7 md:p-10 shadow-sm">
            <FiMail className="mx-auto text-primary-600 mb-4" size={26} />
            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-gray-900 mb-3">Stay in Style</h2>
            <p className="text-gray-600 mb-8">Get updates on new collections and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-60 shadow-md"
              >
                {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletterError && <p className="text-red-600 text-sm mt-3">{newsletterError}</p>}
            {newsletterMessage && <p className="text-green-600 text-sm mt-3">{newsletterMessage}</p>}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiTruck size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Free Shipping</h3>
              <p className="text-gray-200">On orders over ₦80K</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiShield size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Payment</h3>
              <p className="text-gray-200">100% secure transactions</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiRefreshCw size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Hassle-Free Exchanges</h3>
              <p className="text-gray-200">Designer-backed satisfaction guarantee</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiAward size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Premium Quality</h3>
              <p className="text-gray-200">Handpicked materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">About TIM&apos;S GLAM</p>
            <h2 className="heading-md mb-4">Empowering Independent Fashion Brands</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  At <span className="font-bold text-primary-600">TIM&apos;S GLAM</span>, we connect independent designers with customers seeking original, high-quality fashion. Founded in 2022, our platform is built to help emerging brands grow and be discovered globally.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  We combine fashion and technology to deliver a modern marketplace experience where creativity, identity, and entrepreneurship thrive together.
                </p>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiAward className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Independent Designers</h4>
                    <p className="text-sm text-gray-600">Focused support for creative fashion entrepreneurs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                    <FiShield className="text-gold-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Marketplace</h4>
                    <p className="text-sm text-gray-600">Connecting brands with customers worldwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiTruck className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Brand Opportunities</h4>
                    <p className="text-sm text-gray-600">Tools and visibility for emerging labels</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                    <FiRefreshCw className="text-gold-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Community & Discovery</h4>
                    <p className="text-sm text-gray-600">A fashion ecosystem built for growth and connection</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/about" className="btn-primary group">
                  <span>Meet Our Leadership</span>
                  <FiArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link href="/shop" className="btn-outline group">
                  <span>Browse Collection</span>
                  <FiArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>

            {/* Images Grid */}
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/home/home-1.jpg"
                    alt="Fashion Store"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <Image
                    src="/home/home-2.jpg"
                    alt="Fashion Collection"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg -mt-8">
                  <Image
                    src="/home/home-3.jpg"
                    alt="Premium Fashion"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/home/home-4.jpg"
                    alt="Style Collection"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">10K+</h3>
                <p className="text-primary-100 font-medium">Happy Customers</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">500+</h3>
                <p className="text-primary-100 font-medium">Premium Products</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">98%</h3>
                <p className="text-primary-100 font-medium">Satisfaction Rate</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">24/7</h3>
                <p className="text-primary-100 font-medium">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values & Brand Statement */}
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-100 opacity-60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-100 opacity-60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container-custom relative z-10">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">What We Stand For</p>
            <h2 className="heading-md mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-5"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Five principles at the heart of everything we build, create, and stand for at TIM&apos;S GLAM.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
            {[
              { icon: FiStar,       title: 'Creativity',  desc: 'Celebrating unique fashion expression',      color: 'from-amber-400 to-gold-500' },
              { icon: FiTrendingUp, title: 'Innovation',  desc: 'Combining technology with style',            color: 'from-blue-500 to-primary-600' },
              { icon: FiHeart,      title: 'Empowerment', desc: 'Supporting independent designers',           color: 'from-pink-500 to-rose-500' },
              { icon: FiAward,      title: 'Quality',     desc: 'Delivering premium experiences',             color: 'from-orange-400 to-amber-500' },
              { icon: FiGlobe,      title: 'Community',   desc: 'Connecting fashion lovers everywhere',       color: 'from-emerald-500 to-teal-600' },
            ].map((val, i) => (
              <div key={i} className="group flex flex-col items-center text-center p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <val.icon size={26} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          {/* Brand Value Statement Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-10 md:p-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400 opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-semibold tracking-widest uppercase mb-6">
                Our Brand Promise
              </span>
              <div className="text-gold-400 font-serif text-7xl leading-none opacity-30 mb-2">&ldquo;</div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white leading-snug max-w-3xl mx-auto mb-8">
                TIM&apos;S GLAM is built to empower fashion creators and connect them with a global audience through innovation, creativity, and community.
              </p>
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6"></div>
              <p className="text-white/50 text-sm tracking-widest uppercase font-medium">TIM&apos;S GLAM &mdash; Brand Statement</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="section-padding bg-gradient-to-b from-white via-purple-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Our Selection</p>
            <h2 className="heading-md mb-4">Featured Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pieces that define contemporary elegance
            </p>
          </div>
          
          {/* Product Slider */}
          <div className="mb-12">
            <FeaturedProductSlider products={featuredProducts} />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transition-shadow">
              <span>Explore Full Collection</span>
              <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold-100 rounded-full opacity-40 blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Curated Categories</p>
            <h2 className="heading-md mb-4">Shop by Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore premium collections tailored for adults and kids, designed with comfort and style in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Adults Collection */}
            <Link href="/shop?category=adults" className="group focus:outline-none">
              <article className="relative h-[420px] rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                  src="/home/home-5.jpg"
                  alt="Adults Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                <div className="absolute top-6 left-6 bg-white/90 text-primary-700 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Adults Collection
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-2">Refined Everyday Wear</h3>
                  <p className="text-sm md:text-base text-gray-200 mb-5 max-w-md">
                    Discover premium unisex fashion with timeless silhouettes and modern details.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300">
                    Shop Adults
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>

            {/* Kids Collection */}
            <Link href="/shop?category=kids" className="group focus:outline-none">
              <article className="relative h-[420px] rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                  src="/home/home-6.jpg"
                  alt="Kids Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                <div className="absolute top-6 left-6 bg-white/90 text-primary-700 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Kids Collection
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-2">Comfort for Every Adventure</h3>
                  <p className="text-sm md:text-base text-gray-200 mb-5 max-w-md">
                    Stylish and durable pieces created to keep kids comfortable and confident all day.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300">
                    Shop Kids
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">From The Blog</p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">Latest Trends & Inspiration</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Fashion tips, style guides, and inspiration to elevate your wardrobe
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {latestBlogs.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group focus:outline-none">
                <article className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 md:h-72 overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      {post.category}
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col flex-grow p-6 md:p-8">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <span className="font-medium">{post.author}</span>
                      <span className="text-gray-300">•</span>
                      <span>{post.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* CTA Button */}
                    <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group/cta">
                      <span className="group-hover/cta:text-gold-500 transition-colors">Read Article</span>
                      <FiArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center pt-4">
            <Link href="/blog" className="btn-primary inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transition-shadow">
              <span>Explore All Articles</span>
              <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-5 blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Customer Love</p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy customers who have transformed their style with TIM&apos;S GLAM
            </p>
          </div>

          {/* Testimonials Slider */}
          <TestimonialsSlider />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            {/* Left Images - Staggered Layout */}
            <div className="hidden lg:flex flex-col gap-4 justify-center">
              {/* Image 1 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-7.jpg"
                  alt="Fashion Collection 1"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white font-semibold text-xs">Premium Quality</div>
              </div>

              {/* Image 2 */}
              <div className="relative h-28 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-8.jpg"
                  alt="Fashion Collection 2"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 3 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-9.jpg"
                  alt="Fashion Collection 3"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>
            </div>

            {/* Center Content */}
            <div className="space-y-5 flex flex-col justify-center">
              {/* Label Badge */}
              <div className="inline-block self-start lg:self-center">
                <div className="px-4 py-2 bg-gradient-to-r from-gold-400/20 to-gold-500/20 backdrop-blur-md border border-gold-300/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <p className="text-xs font-bold tracking-widest uppercase text-gold-200">✨ Join Our Community</p>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold leading-tight">
                  <span className="block text-white">Welcome to</span>
                  <span className="block bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent">TIM&apos;S GLAM</span>
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-sm lg:text-base text-white/85 leading-relaxed">
                Discover your signature style with our premium, unisex fashion collections designed for everyone—adults and kids alike.
                <span className="block text-gold-300 font-semibold text-sm mt-2">
                  ✓ Free shipping on orders over ₦80K!
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Primary Button */}
                <Link href="/shop" className="group relative px-6 py-3.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-primary-900 font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center justify-center gap-3 text-base">
                  <span>Start Shopping</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </Link>

                {/* Secondary Button */}
                <Link href="/contact" className="group relative px-6 py-3.5 bg-white/10 hover:bg-white/20 border-2 border-white/60 hover:border-white text-white font-bold rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-3 text-base">
                  <span>Contact Us</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">Why choose us?</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiShield size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Secure</p>
                  </div>
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiTruck size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Fast</p>
                  </div>
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiRefreshCw size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Easy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images - Staggered Layout */}
            <div className="hidden lg:flex flex-col gap-4 justify-center">
              {/* Image 1 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-10.jpg"
                  alt="Fashion Collection 4"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 2 */}
              <div className="relative h-28 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-11.jpg"
                  alt="Fashion Collection 5"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 3 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/home/home-12.jpg"
                  alt="Fashion Collection 6"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                <div className="absolute bottom-3 right-3 text-white font-semibold text-xs">Stylish Designs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
