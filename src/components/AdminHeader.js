'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { 
  FiMenu,
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiChevronDown,
  FiSearch,
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers
} from 'react-icons/fi'

export default function AdminHeader({ onToggleSidebar }) {
  const router = useRouter()
  const pathname = usePathname()
  const { adminUser, adminLogout } = useAdminAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const titleMap = {
    '/admin': 'Dashboard',
    '/admin/products': 'Products',
    '/admin/orders': 'Orders',
    '/admin/customers': 'Customers',
    '/admin/blog': 'Blog',
    '/admin/notifications': 'Notifications',
    '/admin/settings': 'Settings',
    '/admin/profile': 'Profile',
  }

  const activeTitle =
    Object.entries(titleMap).find(([route]) => pathname === route || pathname?.startsWith(`${route}/`))?.[1]
    || 'Admin'

  const handleLogout = () => {
    adminLogout()
    router.push('/admin/signin')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="px-3 py-3 sm:px-5 lg:px-7">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{activeTitle}</h1>
              <p className="text-xs sm:text-sm text-slate-500 truncate">Manage your TIM&apos;S GLAM admin operations</p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-3 py-2 text-slate-600 border border-slate-200">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                placeholder="Search admin..."
                className="bg-transparent ml-2 text-sm text-slate-700 placeholder-slate-400 outline-none w-40"
              />
            </div>

            {/* Quick links */}
            <div className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <Link href="/admin" className="p-2 rounded-lg text-slate-600 hover:bg-white" title="Dashboard"><FiGrid size={15} /></Link>
              <Link href="/admin/products" className="p-2 rounded-lg text-slate-600 hover:bg-white" title="Products"><FiBox size={15} /></Link>
              <Link href="/admin/orders" className="p-2 rounded-lg text-slate-600 hover:bg-white" title="Orders"><FiShoppingBag size={15} /></Link>
              <Link href="/admin/customers" className="p-2 rounded-lg text-slate-600 hover:bg-white" title="Customers"><FiUsers size={15} /></Link>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-800 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{adminUser?.name || 'Admin'}</span>
                <FiChevronDown size={16} className="text-slate-500" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{adminUser?.name || 'Admin'}</p>
                    <p className="text-xs text-slate-500 mt-1">{adminUser?.email || 'admin@timsglam.com'}</p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiSettings size={16} />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span>Profile</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-sm border-t border-slate-100 mt-2"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
