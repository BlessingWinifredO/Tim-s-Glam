'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCart } from '@/context/CartContext'
import { getAvailableStock, isProductPubliclyAvailable, isProductSold } from '@/lib/productAvailability'
import { FiShoppingCart, FiHeart, FiCheck, FiArrowLeft, FiTruck, FiShield, FiLoader } from 'react-icons/fi'
import ProductCard from '@/components/ProductCard'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  // Fetch product from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'products', params.id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() }
          const normalizedProduct = {
            ...productData,
            sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
            colors: Array.isArray(productData.colors) ? productData.colors : [],
            price: Number.isFinite(Number(productData.price)) ? Number(productData.price) : 0,
            inStock: typeof productData.inStock === 'boolean' ? productData.inStock : Number(productData.stock) > 0,
            image: productData.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%239ca3af" font-size="28" font-family="Arial">No Image</text></svg>'
          }
          setProduct(normalizedProduct)
          
          // Set initial size and color
          if (normalizedProduct.sizes.length > 0) {
            setSelectedSize(normalizedProduct.sizes[0])
          }
          if (normalizedProduct.colors.length > 0) {
            setSelectedColor(normalizedProduct.colors[0])
          }
          
          // Fetch related products (same category)
          if (productData.category) {
            const querySnapshot = await getDocs(
              query(collection(db, 'products'), where('status', '==', 'Active'), limit(5))
            )
            const relatedData = querySnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(p => p.id !== docSnap.id && p.category === productData.category)
              .slice(0, 4)
            setRelatedProducts(relatedData)
          }
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const availableStock = getAvailableStock(product)
  const maxQuantity = Number.isFinite(availableStock) ? Math.max(1, availableStock) : quantity

  const handleAddToCart = () => {
    if (!product || availableStock <= 0) return
    const sizeToUse = selectedSize || product.sizes[0] || 'M'
    const colorToUse = selectedColor || product.colors[0] || 'Default'
    addToCart(product, sizeToUse, colorToUse, Math.min(quantity, maxQuantity))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const getColorStyle = (color) => {
    const colorMap = {
      'white': '#fff',
      'black': '#000',
      'navy': '#001f3f',
      'gray': '#808080',
      'purple': '#4a1d75',
      'khaki': '#c3b091',
      'olive': '#556b2f',
      'brown': '#654321',
      'tan': '#d2b48c',
      'pink': '#ffc0cb',
      'blue': '#0000ff',
      'red': '#ff0000',
      'light blue': '#87ceeb',
      'dark blue': '#00008b',
      'charcoal': '#36454f'
    }
    if (!color) return '#ccc'
    return colorMap[color.toLowerCase()] || '#ccc'
  }

  const getCollectionLabel = () => {
    const category = String(product?.category || '').toLowerCase()
    const audience = String(product?.audience || '').toLowerCase()

    if (audience === 'women' || category === 'women') return 'Women Collection'
    if (audience === 'men' || category === 'men') return 'Men Collection'
    if (audience === 'girls' || category === 'girls') return 'Girls Collection'
    if (audience === 'boys' || category === 'boys') return 'Boys Collection'
    if (category === 'kids') return 'Kids Collection'
    if (category === 'unisex') return 'Unisex Collection'
    if (category === 'adults') return 'Adults Collection'

    const fallback = String(product?.category || '').trim()
    return fallback ? `${fallback} Collection` : 'Product Collection'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (!isProductPubliclyAvailable(product) && isProductSold(product)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Sold Out</h2>
          <p className="text-gray-600 mb-6">This product is no longer available in the shop.</p>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gold-500">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold-500">Shop</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="section-padding">
        <div className="container-custom">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gold-500 mb-6 transition-colors"
          >
            <FiArrowLeft size={20} />
            Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-[320px] sm:h-[420px] lg:h-[560px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="text-sm text-gray-500 uppercase mb-2">
                {getCollectionLabel()}
              </div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-gold-500">
                  ₦{product.price.toFixed(2)}
                </span>
                {product.inStock ? (
                  <span className="flex items-center gap-2 text-green-600 font-semibold">
                    <FiCheck size={20} />
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Color: <span className="text-gold-500">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-gold-500 scale-110 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: getColorStyle(color) }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <FiCheck
                            className="absolute inset-0 m-auto"
                            size={20}
                            color={String(color).toLowerCase() === 'white' ? '#000' : '#fff'}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Size: <span className="text-gold-500">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-gold-500 bg-gold-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  {Number.isFinite(availableStock) && availableStock > 0 && (
                    <p className="text-sm text-gray-500">Only {availableStock} left in stock</p>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-md font-semibold transition-all ${
                    product.inStock
                      ? 'bg-gold-500 hover:bg-gold-600 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <FiCheck size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="px-6 py-4 border-2 border-gray-300 rounded-md hover:border-gold-500 hover:text-gold-500 transition-colors">
                  <FiHeart size={24} />
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiTruck size={24} className="text-gold-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Free Shipping</p>
                    <p className="text-sm">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiHeart size={24} className="text-gold-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Dressed With Purpose</p>
                    <p className="text-sm">Fashion that celebrates every body, every story</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiShield size={24} className="text-gold-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Secure Payment</p>
                    <p className="text-sm">100% secure transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
