'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase'
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiEdit3,
  FiUsers, 
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiMail
} from 'react-icons/fi'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome, color: 'text-blue-400' },
  { name: 'Products', href: '/admin/products', icon: FiPackage, color: 'text-purple-400' },
  { name: 'Blog', href: '/admin/blog', icon: FiEdit3, color: 'text-emerald-400' },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag, color: 'text-green-400' },
  { name: 'Customers', href: '/admin/customers', icon: FiUsers, color: 'text-pink-400' },
  { name: 'Notifications', href: '/admin/notifications', icon: FiMail, color: 'text-cyan-400' },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings, color: 'text-yellow-400' },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const { adminUser, adminLogout } = useAdminAuth()
  const [quickStats, setQuickStats] = useState({ products: 0, orders: 0, customers: 0 })

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const allowedAdminsRaw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'winniewizzyb@gmail.com,admin@tims-glam.com'
        const adminEmails = new Set(
          allowedAdminsRaw
            .split(',')
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean)
        )

        const [productsResult, ordersResult, usersResult] = await Promise.allSettled([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
        ])

        const productsCount = productsResult.status === 'fulfilled' ? productsResult.value.size : 0
        const ordersCount = ordersResult.status === 'fulfilled' ? ordersResult.value.size : 0
        const customerCount = usersResult.status === 'fulfilled'
          ? new Set(
            usersResult.value.docs
              .map((doc) => String(doc.data()?.email || '').trim().toLowerCase())
              .filter((email) => /\S+@\S+\.\S+/.test(email) && !adminEmails.has(email))
          ).size
          : 0

        setQuickStats({
          products: productsCount,
          orders: ordersCount,
          customers: customerCount,
        })
      } catch {
        // Keep defaults if stats fetch fails in sidebar.
      }
    }

    fetchQuickStats()
  }, [])

  const handleLogout = () => {
    adminLogout()
    router.push('/admin/signin')
    if (onClose) onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex min-h-0 h-full flex-1 flex-col bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900">
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4 px-4">
            {/* Logo / Brand */}
            <div className="mb-8">
              <Link href="/admin" className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <span className="text-white font-bold text-xl">TG</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-white font-playfair font-bold text-lg leading-tight">TIM&apos;S GLAM</h2>
                  <p className="text-gold-300 text-xs font-semibold">Admin Control</p>
                </div>
              </Link>
            </div>

            {/* Section Title */}
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-4 px-2">
              Menu
            </p>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white/10 border border-white/20 shadow-lg'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 transition-all ${
                        isActive 
                          ? `${item.color}` 
                          : 'text-primary-300 group-hover:text-white'
                      }`}
                    />
                    <span className={`text-sm font-medium flex-1 text-left transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-primary-100 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <FiChevronRight className="h-4 w-4 text-gold-400" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Stats Section */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">
                Quick Stats
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Products</span>
                  <span className="font-bold text-gold-400">{quickStats.products}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Orders</span>
                  <span className="font-bold text-gold-400">{quickStats.orders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Customers</span>
                  <span className="font-bold text-gold-400">{quickStats.customers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="border-t border-primary-700 p-4 mx-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {adminUser?.name || 'Admin'}
                </p>
                <p className="text-xs text-primary-300 truncate">Admin User</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
