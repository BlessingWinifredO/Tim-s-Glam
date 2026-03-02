'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Add to wishlist
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      // Check if product already exists
      const exists = prevWishlist.some((item) => item.id === product.id)
      if (exists) {
        return prevWishlist
      }
      return [...prevWishlist, product]
    })
  }

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => 
      prevWishlist.filter((item) => item.id !== productId)
    )
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
  }

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
