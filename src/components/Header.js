'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiUser, FiHeart, FiLogOut } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { products } from '@/data/products'
import { blogPosts } from '@/data/blog'
import Cart from './Cart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { toggleCart, getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const productResults = useMemo(() => {
    if (!normalizedQuery) return []

    return products
      .filter((product) => {
        const searchable = [
          product.name,
          product.description,
          product.category,
          product.subcategory,
          product.audience,
          ...(product.colors || [])
        ]
          .join(' ')
          .toLowerCase()

        return searchable.includes(normalizedQuery)
      })
      .slice(0, 5)
  }, [normalizedQuery])

  const blogResults = useMemo(() => {
    if (!normalizedQuery) return []

    return blogPosts
      .filter((post) => {
        const searchable = [post.title, post.excerpt, post.category, post.author]
          .join(' ')
          .toLowerCase()
        return searchable.includes(normalizedQuery)
      })
      .slice(0, 4)
  }, [normalizedQuery])

  const hasResults = productResults.length > 0 || blogResults.length > 0

  useEffect(() => {
    if (!isSearchOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSearchOpen])

  useEffect(() => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setIsProfileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  // Minimal header for all admin pages
  if (pathname.startsWith('/admin')) {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 shadow-lg">
        <div className="container-custom py-4 flex items-center justify-center">
          <Link href="/" className="group">
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full"></div>
              <span className="relative text-2xl font-playfair font-bold text-gold-300 drop-shadow-lg">TG</span>
            </div>
          </Link>
        </div>
      </header>
    )
  }

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
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center"
              >
                <FiSearch size={20} />
              </button>
              <div className="relative">
                <button
                  aria-label="Account"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center relative"
                >
                  {user ? (
                    <span className="text-sm font-bold">{(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}</span>
                  ) : (
                    <FiUser size={20} />
                  )}
                  {user && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-50">
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || 'TIM\'S GLAM Member'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors block"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            await logout()
                            setIsProfileMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors inline-flex items-center gap-2"
                        >
                          <FiLogOut size={14} />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account"
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors block"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/account"
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors block"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                <Link
                  href="/account"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    pathname === '/account'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user ? 'My Profile' : 'Sign In / Sign Up'}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm p-4 md:p-6" onClick={() => setIsSearchOpen(false)}>
          <div
            className="max-w-3xl mx-auto mt-10 md:mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-4 md:p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiSearch size={20} className="text-primary-600 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products, categories, or blog topics..."
                  className="w-full text-base md:text-lg outline-none text-gray-900 placeholder:text-gray-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center"
                  aria-label="Close search"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto">
              {!normalizedQuery && (
                <div className="p-5 md:p-6 space-y-4">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quick links</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/shop" className="px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-all">
                      Shop
                    </Link>
                    <Link href="/blog" className="px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-all">
                      Blog
                    </Link>
                    <Link href="/about" className="px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-all">
                      About
                    </Link>
                    <Link href="/contact" className="px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-all">
                      Contact
                    </Link>
                  </div>
                </div>
              )}

              {normalizedQuery && (
                <div className="p-5 md:p-6 space-y-6">
                  {!hasResults && (
                    <div className="text-center py-8">
                      <p className="text-lg font-semibold text-gray-800 mb-2">No results found</p>
                      <p className="text-gray-500">Try another keyword like hoodie, sneakers, sustainable, or style guide.</p>
                    </div>
                  )}

                  {productResults.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Products</p>
                      <div className="space-y-2">
                        {productResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/shop/${product.id}`}
                            className="block p-3 md:p-4 rounded-xl border border-gray-100 hover:border-gold-300 hover:bg-gold-50/30 transition-all"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500 capitalize">{product.category} • {product.subcategory}</p>
                              </div>
                              <p className="font-bold text-primary-600">${product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {blogResults.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Blog Posts</p>
                      <div className="space-y-2">
                        {blogResults.map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="block p-3 md:p-4 rounded-xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50/40 transition-all"
                          >
                            <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{post.category} • {post.readTime}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Cart />
    </>
  )
}
