'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi'
import { memo } from 'react'
import { useWishlist } from '@/context/WishlistContext'

const MobileBottomNav = memo(function MobileBottomNav() {
  const pathname = usePathname()
  const { getWishlistCount } = useWishlist()
  const wishlistCount = getWishlistCount()

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Shopping', path: '/shop', icon: FiShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: FiHeart, showBadge: true },
    { name: 'Account', path: '/account', icon: FiUser },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-2xl">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
          
          return (
            <Link
              key={item.path}
              href={item.path}
              prefetch={false}
              className={`flex flex-col items-center justify-center gap-1 touch-manipulation select-none transition-all duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 active:scale-95 active:text-primary-500'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.showBadge && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-white text-xs rounded-full min-w-[18px] h-[18px] px-0.5 flex items-center justify-center font-semibold text-[10px] pointer-events-none">
                    {wishlistCount}
                  </span>
                )}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full pointer-events-none"></div>
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 pointer-events-none ${isActive ? 'font-semibold text-primary-700' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
})

export default MobileBottomNav
