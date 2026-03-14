'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/ProductCard'
import { isProductPubliclyAvailable } from '@/lib/productAvailability'
import { FiFilter, FiX, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// Keep subcategory names for display purposes
const subcategoryNames = {
  // Modern Wear
  dress: 'Dress',
  suit: 'Suit',
  blazer: 'Blazer',
  jacket: 'Jacket',
  jeans: 'Jeans',
  shirt: 'Shirt',
  tshirt: 'T-Shirt',
  hoodie: 'Hoodie',
  coat: 'Coat',
  skirt: 'Skirt',
  pants: 'Pants',
  shorts: 'Shorts',
  sweater: 'Sweater',
  cardigan: 'Cardigan',
  vest: 'Vest',
  // Traditional Wear
  saree: 'Saree',
  lehenga: 'Lehenga',
  kurta: 'Kurta',
  wrapper: 'Wrapper',
  agbada: 'Agbada',
  jumpsuit: 'Jumpsuit',
  croptop: 'Crop Top',
  gown: 'Gown'
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

const traditionalSubcategoryValues = ['saree', 'lehenga', 'kurta', 'wrapper', 'agbada']
const traditionalGroups = [
  { id: 'adults-men', label: 'Adults: Men', category: 'adults', audience: 'men' },
  { id: 'adults-women', label: 'Adults: Women', category: 'adults', audience: 'women' },
  { id: 'kids-boys', label: 'Kids: Boys', category: 'kids', audience: 'boys' },
  { id: 'kids-girls', label: 'Kids: Girls', category: 'kids', audience: 'girls' }
]

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 250])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTraditionalGroup, setSelectedTraditionalGroup] = useState('none')
  const categoryScrollRef = useRef(null)

  const maxAvailablePrice = useMemo(() => {
    const prices = products
      .map(p => Number(p.price))
      .filter(price => Number.isFinite(price) && price >= 0)

    if (prices.length === 0) return 250
    return Math.max(250, Math.ceil(Math.max(...prices)))
  }, [products])

  useEffect(() => {
    setPriceRange(prev => {
      if (prev[1] === 250) {
        return [0, maxAvailablePrice]
      }
      return [0, Math.min(prev[1], maxAvailablePrice)]
    })
  }, [maxAvailablePrice])

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
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
  }, [products, selectedCategory, selectedAudience])

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

    if (selectedTraditionalGroup !== 'none') {
      filtered = filtered.filter(product => traditionalSubcategoryValues.includes(product.subcategory))
    }

    filtered = filtered.filter(p => {
      const productPrice = Number(p.price)
      if (!Number.isFinite(productPrice)) return true
      return productPrice >= priceRange[0] && productPrice <= priceRange[1]
    })

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
  }, [products, selectedCategory, selectedAudience, selectedSubcategory, selectedTraditionalGroup, sortBy, priceRange])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedAudience('all')
    setSelectedSubcategory('all')
    setSelectedTraditionalGroup('none')
  }

  const handleTraditionalGroupChange = (groupId) => {
    setSelectedTraditionalGroup(groupId)
    setSelectedSubcategory('all')

    if (groupId === 'none') {
      return
    }

    if (groupId === 'all-traditional') {
      setSelectedCategory('all')
      setSelectedAudience('all')
      return
    }

    const selectedGroup = traditionalGroups.find(group => group.id === groupId)
    if (!selectedGroup) return

    setSelectedCategory(selectedGroup.category)
    setSelectedAudience(selectedGroup.audience)
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedAudience('all')
    setSelectedSubcategory('all')
    setSelectedTraditionalGroup('none')
    setSortBy('featured')
    setPriceRange([0, maxAvailablePrice])
  }

  const scrollCategoryMenu = (direction) => {
    if (!categoryScrollRef.current) return
    const delta = direction === 'left' ? -320 : 320
    categoryScrollRef.current.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const applyQuickCategory = (id) => {
    setSelectedSubcategory('all')
    if (id === 'all') {
      setSelectedCategory('all')
      setSelectedAudience('all')
      setSelectedTraditionalGroup('none')
      return
    }
    if (id === 'men') {
      setSelectedCategory('adults')
      setSelectedAudience('men')
      setSelectedTraditionalGroup('none')
      return
    }
    if (id === 'women') {
      setSelectedCategory('adults')
      setSelectedAudience('women')
      setSelectedTraditionalGroup('none')
      return
    }
    if (id === 'boys') {
      setSelectedCategory('kids')
      setSelectedAudience('boys')
      setSelectedTraditionalGroup('none')
      return
    }
    if (id === 'girls') {
      setSelectedCategory('kids')
      setSelectedAudience('girls')
      setSelectedTraditionalGroup('none')
      return
    }
    if (id === 'all-traditional') {
      handleTraditionalGroupChange('all-traditional')
      return
    }
    if (id === 'traditional-men') {
      handleTraditionalGroupChange('adults-men')
      return
    }
    if (id === 'traditional-women') {
      handleTraditionalGroupChange('adults-women')
      return
    }
    if (id === 'traditional-boys') {
      handleTraditionalGroupChange('kids-boys')
      return
    }
    if (id === 'traditional-girls') {
      handleTraditionalGroupChange('kids-girls')
    }
  }

  const isQuickCategoryActive = (id) => {
    if (id === 'all') return selectedCategory === 'all' && selectedAudience === 'all' && selectedTraditionalGroup === 'none'
    if (id === 'men') return selectedCategory === 'adults' && selectedAudience === 'men' && selectedTraditionalGroup === 'none'
    if (id === 'women') return selectedCategory === 'adults' && selectedAudience === 'women' && selectedTraditionalGroup === 'none'
    if (id === 'boys') return selectedCategory === 'kids' && selectedAudience === 'boys' && selectedTraditionalGroup === 'none'
    if (id === 'girls') return selectedCategory === 'kids' && selectedAudience === 'girls' && selectedTraditionalGroup === 'none'
    if (id === 'all-traditional') return selectedTraditionalGroup === 'all-traditional'
    if (id === 'traditional-men') return selectedTraditionalGroup === 'adults-men'
    if (id === 'traditional-women') return selectedTraditionalGroup === 'adults-women'
    if (id === 'traditional-boys') return selectedTraditionalGroup === 'kids-boys'
    if (id === 'traditional-girls') return selectedTraditionalGroup === 'kids-girls'
    return false
  }

  const quickCategoryItems = [
    { id: 'all', label: 'All Products' },
    { id: 'men', label: "Men's Clothing" },
    { id: 'women', label: "Women's Clothing" },
    { id: 'boys', label: "Boys' Fashion" },
    { id: 'girls', label: "Girls' Fashion" },
    { id: 'all-traditional', label: 'All Traditional Wears' },
    { id: 'traditional-men', label: 'Traditional: Men' },
    { id: 'traditional-women', label: 'Traditional: Women' },
    { id: 'traditional-boys', label: 'Traditional: Boys' },
    { id: 'traditional-girls', label: 'Traditional: Girls' },
  ]

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

      {/* Category Quick Switch - Scrollable Chip Menu */}
      <section className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollCategoryMenu('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:bg-gray-50"
              aria-label="Scroll categories left"
            >
              <FiChevronLeft size={20} />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar px-1 md:px-14 py-1"
            >
              {quickCategoryItems.map((item) => {
                const active = isQuickCategoryActive(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => applyQuickCategory(item.id)}
                    className={`shrink-0 px-5 py-3 rounded-full border text-left font-semibold transition-all ${
                      active
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-800 hover:border-primary-500'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCategoryMenu('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:bg-gray-50"
              aria-label="Scroll categories right"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold shadow-sm hover:bg-primary-700 active:scale-95 transition-all"
            >
              <FiFilter size={20} />
              Filters
            </button>

            {/* Product Count */}
            <div className="flex-1">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-primary-600">{filteredProducts.length}</span> products found
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm font-medium">Filter by:</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="adults">Adults</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Modal Backdrop */}
      {showFilters && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowFilters(false)} />
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          <div className="p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary-700">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Gender Categories Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender</h3>
                <div className="grid grid-cols-2 gap-3">
                  {allAudienceOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedAudience(option.id)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all text-center ${
                        selectedAudience === option.id
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Type Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Type</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSubcategory === 'all'
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {availableSubcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSubcategory === sub
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subcategoryNames[sub]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  resetFilters()
                  setShowFilters(false)
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="section-padding py-10">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-center">
                <FiLoader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-xl text-gray-600 mb-3">No products found</p>
              <p className="text-gray-400 mb-6">Try adjusting your category selection.</p>
              <button onClick={resetFilters} className="btn-primary">
                Reset Filters
              </button>
            </div>
          )}
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
