'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiUser, FiHeart } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import Cart from './Cart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { toggleCart, getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100">
        {/* Top Bar */}
        <div className="bg-primary-600 text-white">
          <div className="container-custom py-2 text-xs sm:text-sm flex items-center justify-center">
            <p className="tracking-wide">Free Shipping on Orders Over $100 | Use Code: GLAM2026</p>
          </div>
        </div>

        {/* Main Header */}
        <div className="container-custom py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
              {/* Logo Badge */}
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow"></div>
                
                {/* Inner Circle */}
                <div className="absolute inset-1 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full"></div>
                
                {/* TG Text */}
                <span className="relative text-2xl md:text-3xl font-playfair font-bold text-gold-300 drop-shadow-lg">TG</span>
              </div>
              
              {/* Company Name */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm md:text-xl font-playfair font-bold" style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f0e68c 50%, #daa520 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    TIM&apos;S
                  </span>
                  <span className="text-sm md:text-xl font-playfair font-bold text-primary-500">GLAM</span>
                </div>
                <span className="text-xs text-gold-500 -mt-0.5 md:-mt-1 font-medium hidden sm:block">YOUR STYLE • YOUR SIGNATURE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    pathname === link.path
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-white hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                aria-label="Search"
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center"
              >
                <FiSearch size={20} />
              </button>
              <Link
                href="/account"
                aria-label="Account"
                className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all items-center justify-center"
              >
                <FiUser size={20} />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all items-center justify-center relative"
              >
                <FiHeart size={20} />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-semibold">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <button 
                onClick={toggleCart}
                aria-label="Open cart"
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center relative"
              >
                <FiShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 border border-gray-100 rounded-2xl bg-white shadow-sm p-3">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      pathname === link.path
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <Cart />
    </>
  )
}
