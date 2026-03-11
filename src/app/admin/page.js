'use client'

import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { AdminDataContext } from '@/context/AdminDataContext'
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiActivity,
  FiLoader,
  FiRefreshCw
} from 'react-icons/fi'

const quickActions = [
  { 
    name: 'Add Product', 
    href: '/admin/products/add', 
    icon: FiPlus,
    color: 'from-primary-600 to-primary-700',
    description: 'Create new product listing'
  },
  { 
    name: 'All Products', 
    href: '/admin/products', 
    icon: FiEye,
    color: 'from-gold-500 to-gold-600',
    description: 'View and manage inventory'
  },
  { 
    name: 'Orders', 
    href: '/admin/orders', 
    icon: FiShoppingBag,
    color: 'from-green-500 to-green-600',
    description: 'Check recent orders'
  },
  { 
    name: 'Customers', 
    href: '/admin/customers', 
    icon: FiUsers,
    color: 'from-blue-500 to-blue-600',
    description: 'Manage customer data'
  },
]

export default function AdminDashboard() {
  const adminDataContext = useContext(AdminDataContext)
  const refreshTrigger = adminDataContext?.refreshTrigger || 0
  
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

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

      const products = productsResult.status === 'fulfilled'
        ? productsResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
        : []

      const orders = ordersResult.status === 'fulfilled'
        ? ordersResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
        : []

      const users = usersResult.status === 'fulfilled'
        ? usersResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
        : []

      const customerEmails = new Set(
        users
          .map((user) => String(user.email || '').trim().toLowerCase())
          .filter((email) => /\S+@\S+\.\S+/.test(email) && !adminEmails.has(email))
      )

      const completedRevenue = orders
        .filter((order) => order.status === 'Completed')
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)

      setDashboardData({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customerEmails.size,
        totalRevenue: completedRevenue,
        activeProducts: products.filter((product) => product.status === 'Active').length,
        pendingOrders: orders.filter((order) => order.status === 'Pending').length,
      })

      const failedSources = []
      if (productsResult.status === 'rejected') failedSources.push('products')
      if (ordersResult.status === 'rejected') failedSources.push('orders')
      if (usersResult.status === 'rejected') failedSources.push('users')

      if (failedSources.length) {
        setError(`Some dashboard data could not be loaded (${failedSources.join(', ')}). Check Firestore rules publish status.`)
      } else {
        setError('')
      }
    } catch (err) {
      setError(`Failed to load dashboard data: ${err.message}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh dashboard when data changes (e.g., customer deletion on customers page)
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchDashboardData(true)
    }
  }, [refreshTrigger])

  const stats = useMemo(
    () => [
      {
        name: 'Total Products',
        value: String(dashboardData.totalProducts),
        icon: FiPackage,
        helper: `${dashboardData.activeProducts} active`,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        href: '/admin/products',
      },
      {
        name: 'Total Orders',
        value: String(dashboardData.totalOrders),
        icon: FiShoppingBag,
        helper: `${dashboardData.pendingOrders} pending`,
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        href: '/admin/orders',
      },
      {
        name: 'Total Customers',
        value: String(dashboardData.totalCustomers),
        icon: FiUsers,
        helper: 'Registered users',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-600',
        href: '/admin/customers',
      },
      {
        name: 'Total Revenue',
        value: `₦${dashboardData.totalRevenue.toFixed(2)}`,
        icon: FiDollarSign,
        helper: 'Completed orders only',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        href: '/admin/orders',
      },
    ],
    [dashboardData]
  )

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to TIM&apos;S GLAM Dashboard</h1>
            <p className="text-primary-100 text-lg">Manage your e-commerce platform efficiently</p>
          </div>
          <div className="hidden md:block text-6xl opacity-10">
            📊
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiActivity className="text-primary-600" />
            Key Metrics
          </h2>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <FiRefreshCw className="h-4 w-4" />
                Refresh Data
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 flex items-center justify-center">
            <FiLoader className="h-6 w-6 text-primary-600 animate-spin" />
            <p className="ml-3 text-gray-600">Loading dashboard metrics...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`${stat.bgColor} px-6 py-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-sm font-semibold flex items-center gap-1 text-gray-600">
                  <FiTrendingUp className="h-4 w-4" />
                  {stat.helper}
                </p>
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiPackage className="text-primary-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} text-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <action.icon className="h-8 w-8" />
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <FiTrendingUp className="h-4 w-4 text-white opacity-70" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{action.name}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiActivity className="text-primary-600" />
          Recent Activity
        </h2>
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <div className="bg-gray-100 rounded-full p-4">
              <FiActivity className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-2">No Recent Activity</p>
          <p className="text-gray-500 text-sm mb-6">
            Start by adding products to your store or check on customer orders
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              <FiPlus className="h-4 w-4" />
              Add Your First Product
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <FiEye className="h-4 w-4" />
              View Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
