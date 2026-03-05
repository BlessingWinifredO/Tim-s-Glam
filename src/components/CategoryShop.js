'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { products, subcategoryNames } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import Link from 'next/link'

const audienceMatchMap = {
  men: ['men', 'unisex'],
  women: ['women', 'unisex'],
  boys: ['boys', 'unisex'],
  girls: ['girls', 'unisex']
}

const categoryTitles = {
  men: "Men's Wears",
  women: "Women's Wears",
  boys: "Boys' Wears",
  girls: "Girls' Wears"
}

const categoryDescriptions = {
  men: 'Shop our premium collection of men\'s fashion and wear',
  women: 'Discover our exclusive women\'s fashion collection',
  boys: 'Browse our stylish boys\' clothing and accessories',
  girls: 'Explore our adorable girls\' wear collection'
}

export default function CategoryShop({ category }) {
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 250])
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false)
      }
    }
    
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [showFilters])

  const categoryProducts = useMemo(() => {
    if (!audienceMatchMap[category]) return []
    return products.filter(p => audienceMatchMap[category].includes(p.audience || 'unisex'))
  }, [category])

  const availableSubcategories = useMemo(() => {
    const uniqueSubcategories = [...new Set(categoryProducts.map(p => p.subcategory))]
    return uniqueSubcategories.sort((a, b) => {
      const first = subcategoryNames[a] || a
      const second = subcategoryNames[b] || b
      return first.localeCompare(second)
    })
  }, [categoryProducts])

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts]

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
  }, [categoryProducts, selectedSubcategory, sortBy, priceRange])

  const activeFiltersCount = [selectedSubcategory].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSelectedSubcategory('all')
    setSortBy('featured')
    setPriceRange([0, 250])
  }

  if (!audienceMatchMap[category]) {
    return <div className="min-h-screen flex items-center justify-center">Category not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-14 md:py-16">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800"
          alt={`TIM'S GLAM ${category} collection`}
          fill
          priority
          className="object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/75 to-primary-700/85"></div>
        <div className="absolute inset-0 hero-light-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="container-custom relative z-10 text-center">
          <Link href="/shop" className="inline-block text-white/70 hover:text-white mb-4 text-sm font-semibold">
            ← Back to Shop
          </Link>
          <h1 className="heading-xl text-white mb-3">{categoryTitles[category]}</h1>
          <p className="text-base md:text-lg text-white/90">{categoryDescriptions[category]}</p>
        </div>
      </section>

      <section className="section-padding py-8 md:py-10">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Mobile Filter Overlay */}
            {showFilters && (
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
            )}

            {/* Filters Sidebar */}
            <aside
              ref={filterRef}
              className={`fixed lg:static left-0 top-0 h-screen lg:h-auto w-80 lg:w-auto bg-white lg:bg-transparent rounded-none lg:rounded-2xl shadow-lg lg:shadow-sm border-none lg:border border-gray-100 z-50 lg:z-auto transition-transform duration-300 lg:transition-none ${
                showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="p-6 sticky top-0 lg:static bg-white lg:bg-transparent rounded-2xl border border-gray-100 lg:border-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary-700">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Product Type Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    <span>Product Type</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubcategory('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedSubcategory === 'all'
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {availableSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedSubcategory === sub
                            ? 'bg-primary-600 text-white shadow-md'
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
                  <h3 className="font-semibold text-gray-700 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="text-center flex-1">
                        <span className="text-xs text-gray-500 block">From</span>
                        <span className="text-lg font-bold text-primary-600">${priceRange[0]}</span>
                      </div>
                      <div className="px-2 text-gray-300">—</div>
                      <div className="text-center flex-1">
                        <span className="text-xs text-gray-500 block">Up to</span>
                        <span className="text-lg font-bold text-primary-600">${priceRange[1]}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    resetFilters()
                    setShowFilters(false)
                  }}
                  className="w-full btn-outline text-sm py-2.5 transition-all hover:bg-primary-50"
                >
                  Reset All Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3 space-y-5">
              {/* Toolbar */}
              <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiFilter size={18} />
                    Filters
                  </button>

                  <p className="text-gray-600 text-sm md:text-base order-2 sm:order-none">
                    <span className="font-semibold text-primary-600">{filteredProducts.length}</span>{' '}
                    <span className="hidden xs:inline">products</span> found
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 text-gray-400 text-xs md:text-sm">
                        • {activeFiltersCount} active filter(s)
                      </span>
                    )}
                  </p>

                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <label className="text-gray-600 text-sm hidden sm:block whitespace-nowrap">Sort:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {selectedSubcategory !== 'all' && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-semibold">Active:</span>
                    {selectedSubcategory !== 'all' && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold inline-flex items-center gap-2">
                        {subcategoryNames[selectedSubcategory]}
                        <button
                          onClick={() => setSelectedSubcategory('all')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 min-h-96 flex flex-col items-center justify-center">
                  <p className="text-xl md:text-2xl text-gray-600 mb-3 font-semibold">No products found</p>
                  <p className="text-gray-400 mb-6 text-sm md:text-base">
                    Try adjusting your product type or price filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-primary text-sm md:text-base px-6 py-2 md:py-2.5"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
