'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (product) => {
    const defaultSize = product.sizes[0]
    const defaultColor = product.colors[0]
    addToCart(product, defaultSize, defaultColor, 1)
    removeFromWishlist(product.id)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8 pt-4 md:pt-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
            My Wishlist
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-8 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FiShoppingCart size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Start adding products you love to your wishlist. They&apos;ll be saved here for later.
              </p>
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                <span>Continue Shopping</span>
                <FiArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                {/* Product Image */}
                <Link href={`/shop/${product.id}`} className="relative block h-48 md:h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeFromWishlist(product.id)
                    }}
                    className="absolute top-2 md:top-3 right-2 md:right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition-all"
                    title="Remove from wishlist"
                  >
                    <FiX size={18} />
                  </button>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-3 md:p-4">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    {product.category === 'adults' ? 'Adults' : 'Kids'} • {product.subcategory}
                  </div>
                  
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-semibold text-xs md:text-base text-gray-800 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-base md:text-lg font-bold text-primary-600 mb-2 md:mb-3">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Colors */}
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {product.colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 md:w-5 h-4 md:h-5 rounded-full border-2 border-gray-300"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === 'white' ? '#fff' :
                            color.toLowerCase() === 'black' ? '#000' :
                            color.toLowerCase() === 'navy' ? '#001f3f' :
                            color.toLowerCase() === 'gray' ? '#808080' :
                            color.toLowerCase() === 'purple' ? '#4a1d75' :
                            color.toLowerCase() === 'blue' ? '#0074D9' :
                            color.toLowerCase() === 'red' ? '#FF4136' :
                            '#ddd',
                        }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <div className="w-4 md:w-5 h-4 md:h-5 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{product.colors.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {product.inStock ? (
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 btn-primary text-xs md:text-sm py-2 flex items-center justify-center gap-1 md:gap-2"
                      >
                        <FiShoppingCart size={16} />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-md text-xs md:text-sm cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlist.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/shop" className="btn-outline inline-flex items-center gap-2">
              <span>Continue Shopping</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
