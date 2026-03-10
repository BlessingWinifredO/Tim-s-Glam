'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { 
  FiMenu,
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiChevronDown,
  FiSearch
} from 'react-icons/fi'

export default function AdminHeader({ onToggleSidebar }) {
  const router = useRouter()
  const { adminUser, adminLogout } = useAdminAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const handleLogout = () => {
    adminLogout()
    router.push('/admin/signin')
  }

  return (
    <header className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 shadow-lg sticky top-0 z-40">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Welcome */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggleSidebar}
              className="p-2.5 rounded-lg bg-primary-700 bg-opacity-60 text-white hover:bg-opacity-90 transition-all"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome, {adminUser?.name || 'Admin'}! 👋
            </h1>
          </div>

          <div className="hidden md:block flex-1">
            <p className="text-sm text-primary-100 mt-1">
              Manage your TIM&apos;S GLAM e-commerce platform
            </p>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-primary-700 bg-opacity-50 rounded-lg px-3 py-2 text-primary-100">
              <FiSearch className="text-primary-200" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent ml-2 text-sm text-white placeholder-primary-200 outline-none w-32"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-primary-100 hover:text-white hover:bg-primary-700 rounded-lg transition-colors"
              >
                <FiBell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-primary-700 bg-opacity-50 hover:bg-opacity-75 rounded-lg text-white transition-all"
              >
                <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{adminUser?.name || 'Admin'}</span>
                <FiChevronDown size={16} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{adminUser?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 mt-1">admin@timsgam.com</p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiSettings size={16} />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span>Profile</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-gray-100 mt-2"
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
