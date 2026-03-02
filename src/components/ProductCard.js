'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    // Add with default first size and color
    const defaultSize = product.sizes[0]
    const defaultColor = product.colors[0]
    addToCart(product, defaultSize, defaultColor, 1)
  }
  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToWishlist(product)
  }


  return (
    <Link href={`/shop/${product.id}`}>
      <div 
        className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-72 bg-gray-100 overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          
          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}
          
          {/* Quick Actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleQuickAdd}
              className="bg-white text-primary-500 p-3 rounded-full hover:bg-gold-500 hover:text-white transition-colors"
              title="Quick Add to Cart"
            >
              <FiShoppingCart size={20} />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full transition-colors ${
                inWishlist 
                  ? 'bg-gold-500 text-white' 
                  : 'bg-white text-primary-500 hover:bg-gold-500 hover:text-white'
              }`}
              title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            >
              <FiHeart size={20} className={inWishlist ? 'fill-current' : ''} />
            </button>
            <button
              className="bg-white text-primary-500 p-3 rounded-full hover:bg-gold-500 hover:text-white transition-colors"
              title="Quick View"
            >
              <FiEye size={20} />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 uppercase mb-1">
            {product.category === 'adults' ? 'Adults' : 'Kids'} • {product.subcategory}
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Colors */}
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <div 
                key={index}
                className="w-5 h-5 rounded-full border-2 border-gray-300"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#fff' : 
                                   color.toLowerCase() === 'black' ? '#000' :
                                   color.toLowerCase() === 'navy' ? '#001f3f' :
                                   color.toLowerCase() === 'gray' ? '#808080' :
                                   color.toLowerCase() === 'purple' ? '#4a1d75' :
                                   color.toLowerCase() === 'khaki' ? '#c3b091' :
                                   color.toLowerCase() === 'olive' ? '#556b2f' :
                                   color.toLowerCase() === 'brown' ? '#654321' :
                                   color.toLowerCase() === 'tan' ? '#d2b48c' :
                                   color.toLowerCase() === 'pink' ? '#ffc0cb' :
                                   color.toLowerCase() === 'blue' ? '#0000ff' :
                                   color.toLowerCase() === 'red' ? '#ff0000' :
                                   '#ccc'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 self-center ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gold-500">
              ${product.price.toFixed(2)}
            </span>
            {product.inStock && (
              <span className="text-xs text-green-600 font-semibold">In Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
