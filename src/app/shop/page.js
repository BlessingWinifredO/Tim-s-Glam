'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { products, categories, subcategoryNames } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'

const audienceGroups = {
  adults: [
    { id: 'men', label: 'Men Wears' },
    { id: 'women', label: 'Women Wears' }
  ],
  kids: [
    { id: 'boys', label: 'Boys Wears' },
    { id: 'girls', label: 'Girls Wears' }
  ]
}

const allAudienceOptions = [
  { id: 'men', label: 'Men Wears' },
  { id: 'women', label: 'Women Wears' },
  { id: 'boys', label: 'Boys Wears' },
  { id: 'girls', label: 'Girls Wears' }
]

const audienceMatchMap = {
  men: ['men', 'unisex'],
  women: ['women', 'unisex'],
  boys: ['boys', 'unisex'],
  girls: ['girls', 'unisex']
}

export default function Shop() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 250])
  const [showFilters, setShowFilters] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const availableAudienceOptions = useMemo(() => {
    if (selectedCategory === 'adults') return audienceGroups.adults
    if (selectedCategory === 'kids') return audienceGroups.kids
    return allAudienceOptions
  }, [selectedCategory])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const availableSubcategories = useMemo(() => {
    let scopedProducts = products

    if (selectedCategory !== 'all') {
      scopedProducts = scopedProducts.filter(p => p.category === selectedCategory)
    }

    if (selectedAudience !== 'all') {
      scopedProducts = scopedProducts.filter(p => audienceMatchMap[selectedAudience].includes(p.audience || 'unisex'))
    }

    const uniqueSubcategories = [...new Set(scopedProducts.map(p => p.subcategory))]
    return uniqueSubcategories.sort((a, b) => {
      const first = subcategoryNames[a] || a
      const second = subcategoryNames[b] || b
      return first.localeCompare(second)
    })
  }, [selectedCategory, selectedAudience])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedAudience !== 'all') {
      filtered = filtered.filter(p => audienceMatchMap[selectedAudience].includes(p.audience || 'unisex'))
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory)
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return filtered
  }, [selectedCategory, selectedAudience, selectedSubcategory, sortBy, priceRange])

  const activeFiltersCount = [selectedCategory, selectedAudience, selectedSubcategory].filter(v => v !== 'all').length

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedAudience('all')
    setSelectedSubcategory('all')
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedAudience('all')
    setSelectedSubcategory('all')
    setSortBy('featured')
    setPriceRange([0, 250])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-14 md:py-16">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800"
          alt="TIM'S GLAM shop background"
          fill
          priority
          className="object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/75 to-primary-700/85"></div>
        <div className="absolute inset-0 hero-light-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="heading-xl text-white mb-3">Shop Collection</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto">
            Explore a professional, easy-to-browse catalog for Adults and Kids—organized by Men, Women, Boys, Girls, and product type.
          </p>
        </div>
      </section>

      {/* Category Quick Switch - Dropdown Menu */}
      <section className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="max-w-sm" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between bg-white border-2 border-primary-600 rounded-xl px-4 py-3 text-left hover:bg-primary-50 transition-colors"
            >
              <div>
                <p className="font-bold text-primary-600">
                  {selectedCategory === 'all' ? 'All Products' : selectedCategory === 'adults' ? 'Adults' : 'Kids'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedCategory === 'all' && 'Full catalog view'}
                  {selectedCategory === 'adults' && 'Men & Women wears'}
                  {selectedCategory === 'kids' && 'Boys & Girls wears'}
                </p>
              </div>
              <FiChevronDown
                size={20}
                className={`text-primary-600 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute mt-2 w-80 lg:w-[32rem] bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                {/* All Products Option */}
                <button
                  onClick={() => {
                    setShowCategoryDropdown(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                >
                  <p className="font-semibold text-gray-900">All Products</p>
                  <p className="text-sm text-gray-500">Full catalog view</p>
                </button>

                {/* Mobile Menu (unchanged) */}
                <div className="lg:hidden">
                  <div className="border-b border-gray-100">
                    <p className="w-full text-left px-4 py-2 font-semibold text-primary-600 bg-primary-50">
                      Adults
                    </p>
                    <div className="bg-gray-50 px-4 py-2 space-y-2">
                      <button
                        onClick={() => {
                          router.push('/shop/men')
                          setShowCategoryDropdown(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Men
                      </button>
                      <button
                        onClick={() => {
                          router.push('/shop/women')
                          setShowCategoryDropdown(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Women
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="w-full text-left px-4 py-2 font-semibold text-primary-600 bg-primary-50">
                      Kids
                    </p>
                    <div className="bg-gray-50 px-4 py-2 space-y-2">
                      <button
                        onClick={() => {
                          router.push('/shop/boys')
                          setShowCategoryDropdown(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Boys
                      </button>
                      <button
                        onClick={() => {
                          router.push('/shop/girls')
                          setShowCategoryDropdown(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Girls
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:block p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        router.push('/shop/men')
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      Men
                    </button>
                    <button
                      onClick={() => {
                        router.push('/shop/women')
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      Women
                    </button>
                    <button
                      onClick={() => {
                        router.push('/shop/boys')
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      Boys
                    </button>
                    <button
                      onClick={() => {
                        router.push('/shop/girls')
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      Girls
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding py-10">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} mb-8 lg:mb-0`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary-700">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-primary-500"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Audience Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Customer Group</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedAudience('all')}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedAudience === 'all'
                          ? 'bg-gold-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {availableAudienceOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedAudience(option.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedAudience === option.id
                            ? 'bg-gold-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Type Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Product Type</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubcategory('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedSubcategory === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {availableSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedSubcategory === sub
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {subcategoryNames[sub]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">From ${priceRange[0]}</span>
                      <span className="text-sm text-gray-600">Up to ${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full btn-outline text-sm py-2"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3 space-y-5">
              {/* Toolbar */}
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center gap-2 text-primary-600 font-semibold"
                  >
                    <FiFilter size={20} />
                    Filters
                  </button>

                  <p className="text-gray-600 text-sm md:text-base">
                    <span className="font-semibold text-primary-600">{filteredProducts.length}</span> products found
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 text-gray-400">• {activeFiltersCount} active filter(s)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 text-sm hidden sm:block">Filter by:</label>
                    <select
                      value={selectedAudience}
                      onChange={(e) => setSelectedAudience(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                    </select>
                  </div>
                </div>

                {(selectedCategory !== 'all' || selectedAudience !== 'all' || selectedSubcategory !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    {selectedCategory !== 'all' && (
                      <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                        {selectedCategory === 'adults' ? 'Adults' : 'Kids'}
                      </span>
                    )}
                    {selectedAudience !== 'all' && (
                      <span className="px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold capitalize">
                        {selectedAudience}
                      </span>
                    )}
                    {selectedSubcategory !== 'all' && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {subcategoryNames[selectedSubcategory]}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-xl text-gray-600 mb-3">No products found</p>
                  <p className="text-gray-400 mb-6">Try adjusting your category, customer group, or price filters.</p>
                  <button onClick={resetFilters} className="btn-primary">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6">Subscribe to get special offers, style updates, and more!</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button className="bg-gold-500 hover:bg-gold-600 px-6 py-3 rounded-md font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
