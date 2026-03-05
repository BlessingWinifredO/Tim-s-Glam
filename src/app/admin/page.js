'use client'

import Link from 'next/link'
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiActivity
} from 'react-icons/fi'

const stats = [
  {
    name: 'Total Products',
    value: '19',
    icon: FiPackage,
    change: '+4.75%',
    changeType: 'positive',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trendIcon: true,
  },
  {
    name: 'Total Orders',
    value: '0',
    icon: FiShoppingBag,
    change: '0%',
    changeType: 'neutral',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    trendIcon: false,
  },
  {
    name: 'Total Customers',
    value: '0',
    icon: FiUsers,
    change: '0%',
    changeType: 'neutral',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    trendIcon: false,
  },
  {
    name: 'Total Revenue',
    value: '$0.00',
    icon: FiDollarSign,
    change: '0%',
    changeType: 'neutral',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    trendIcon: false,
  },
]

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
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiActivity className="text-primary-600" />
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
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
                <p
                  className={`text-sm font-semibold flex items-center gap-1 ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.trendIcon && <FiTrendingUp className="h-4 w-4" />}
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
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
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Refresh
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
