'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('timsglam-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timsglam-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
      )

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevCart, { 
        ...product, 
        selectedSize, 
        selectedColor, 
        quantity 
      }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.id === productId && 
                  item.selectedSize === selectedSize && 
                  item.selectedColor === selectedColor)
      )
    )
  }

  const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const value = {
    cart,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart,
    setIsOpen
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
