'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { FiShoppingCart, FiHeart, FiCheck, FiArrowLeft, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi'
import ProductCard from '@/components/ProductCard'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  
  const product = products.find(p => p.id === parseInt(params.id))
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

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

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
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
    return colorMap[color.toLowerCase()] || '#ccc'
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
              <div className="relative h-[500px] lg:h-[600px]">
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
                {product.category === 'adults' ? 'Adults Collection' : 'Kids Collection'}
              </div>
              <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gold-500">
                  ${product.price.toFixed(2)}
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
                          color={color.toLowerCase() === 'white' ? '#000' : '#fff'}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
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
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
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
                  <FiRefreshCw size={24} className="text-gold-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Easy Returns</p>
                    <p className="text-sm">30-day return policy</p>
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
