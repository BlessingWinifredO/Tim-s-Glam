'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiEdit3,
  FiUsers, 
  FiSettings,
  FiChevronRight,
  FiMail,
  FiX,
  FiBarChart2
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[18rem] transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex min-h-0 h-full flex-1 flex-col bg-slate-950 text-slate-100 border-r border-slate-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 px-4">
            {/* Logo / Brand */}
            <div className="mb-7 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-3 group" onClick={onClose}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">TG</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base leading-tight">TIM&apos;S GLAM</h2>
                  <p className="text-cyan-300 text-[11px] font-semibold tracking-wide uppercase">Admin Console</p>
                </div>
              </Link>
              <button
                type="button"
                className="lg:hidden w-8 h-8 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <FiX className="mx-auto" />
              </button>
            </div>

            {/* Section Title */}
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">
              Navigation
            </p>

            {/* Navigation */}
            <nav className="space-y-1.5 flex-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/70 to-cyan-600/70 border border-cyan-400/40 shadow-lg'
                        : 'hover:bg-slate-900/90 border border-transparent'
                    }`}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-4.5 w-4.5 transition-all ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-400 group-hover:text-slate-100'
                      }`}
                    />
                    <span className={`text-sm font-medium flex-1 text-left transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <FiChevronRight className="h-4 w-4 text-white/80" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Stats Section */}
            <div className="mt-6 p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <FiBarChart2 className="text-cyan-300" size={15} />
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Live Stats
                </p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center rounded-lg px-2.5 py-2 bg-slate-800/70">
                  <span className="text-slate-300">Products</span>
                  <span className="font-bold text-cyan-300">{quickStats.products}</span>
                </div>
                <div className="flex justify-between items-center rounded-lg px-2.5 py-2 bg-slate-800/70">
                  <span className="text-slate-300">Orders</span>
                  <span className="font-bold text-cyan-300">{quickStats.orders}</span>
                </div>
                <div className="flex justify-between items-center rounded-lg px-2.5 py-2 bg-slate-800/70">
                  <span className="text-slate-300">Customers</span>
                  <span className="font-bold text-cyan-300">{quickStats.customers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
