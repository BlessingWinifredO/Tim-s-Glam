'use client'

import { useCart } from '@/context/CartContext'
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

export default function Cart() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-playfair font-bold text-primary-500">
            Shopping Cart ({getCartCount()})
          </h2>
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-primary-500 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiShoppingBag size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 border-b pb-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.selectedColor} • {item.selectedSize}
                    </p>
                    <p className="text-gold-500 font-semibold mb-2">
                      ₦{item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, Math.min(item.quantity + 1, item.stock || 99))}
                          className="p-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= (item.stock || 99)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-gold-500">₦{getCartTotal().toFixed(2)}</span>
            </div>
            
            <Link 
              href="/checkout" 
              onClick={toggleCart}
              className="block w-full btn-primary text-center mb-3"
            >
              Proceed to Checkout
            </Link>
            
            <button 
              onClick={toggleCart}
              className="block w-full text-center py-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
