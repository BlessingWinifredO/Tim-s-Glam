'use client'

import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiArrowLeft, 
  FiMail,
  FiPhone,
  FiMapPin,
  FiLoader,
  FiAlertCircle,
  FiShoppingBag,
  FiCalendar
} from 'react-icons/fi'

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id // This is the customer email (URL encoded)

  // Decode and normalize the email parameter
  const decodedEmail = decodeURIComponent(customerId).toLowerCase()

  const [customerOrders, setCustomerOrders] = useState([])
  const [customerProfile, setCustomerProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch customer orders
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        setLoading(true)

        // Load profile from users collection so users are visible even before first order.
        const userQuery = query(
          collection(db, 'users'),
          where('email', '==', decodedEmail)
        )
        const userSnapshot = await getDocs(userQuery)
        const profile = userSnapshot.empty ? null : userSnapshot.docs[0].data()

        // Fetch all orders for this customer.
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', decodedEmail)
        )
        const querySnapshot = await getDocs(q)
        const orders = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.()?.getTime() || 0
            const dateB = b.createdAt?.toDate?.()?.getTime() || 0
            return dateB - dateA
          })

        setCustomerOrders(orders)
        setCustomerProfile(profile)
        setError('')
      } catch (err) {
        setError(`Failed to load customer orders: ${err.message}`)
        console.error('Error fetching customer orders:', err)
      } finally {
        setLoading(false)
      }
    }

    if (decodedEmail) fetchCustomerOrders()
  }, [decodedEmail])

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?'
  }

  const getAvatarColor = (email) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
    ]
    return colors[email?.charCodeAt(0) % colors.length]
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
        <p className="ml-3 text-gray-600 mt-4">Loading customer details...</p>
      </div>
    )
  }

  if (!loading && customerOrders.length === 0 && !customerProfile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back to Customers
          </Link>
        </div>
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FiAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Customer not found
          </h3>
          <p className="text-gray-600 mb-4">
            No customer profile found for: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{decodedEmail}</code>
          </p>
          <p className="text-gray-500 text-sm">
            The user may not have verified their email yet, or there may be a sync delay. Try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  const firstOrder = customerOrders[0]
  const customerName = firstOrder?.customerName || customerProfile?.fullName || 'Unknown Customer'
  const customerEmail = firstOrder?.customerEmail || decodedEmail
  const customerPhone = firstOrder?.customerPhone || 'N/A'

  const customerStats = {
    totalOrders: customerOrders.length,
    totalSpent: customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    completedOrders: customerOrders.filter(o => o.status === 'Completed').length,
    lastOrderDate: customerOrders[0]?.createdAt?.toDate?.()?.toLocaleDateString() || 'No orders yet'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Customers
        </Link>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start gap-6">
          <div className={`w-16 h-16 ${getAvatarColor(customerEmail)} rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
            {getInitials(customerName)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{customerName}</h1>
            <p className="text-gray-600 mt-1">Customer ID: {customerId}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <FiMail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <a 
                    href={`mailto:${customerEmail}`}
                    className="text-gray-900 font-medium hover:text-primary-600"
                  >
                    {customerEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiCalendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Last Order</p>
                  <p className="text-gray-900 font-medium">{customerStats.lastOrderDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
          <p className="text-sm text-primary-600 font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-primary-900">{customerStats.totalOrders}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <p className="text-sm text-green-600 font-medium mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-green-900">${customerStats.totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <p className="text-sm text-blue-600 font-medium mb-1">Completed Orders</p>
          <p className="text-3xl font-bold text-blue-900">{customerStats.completedOrders}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <p className="text-sm text-purple-600 font-medium mb-1">Average Order</p>
          <p className="text-3xl font-bold text-purple-900">
            ${customerStats.totalOrders > 0 ? (customerStats.totalSpent / customerStats.totalOrders).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Orders History */}
      {customerOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FiShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600">
            This customer hasn&apos;t placed any orders.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiShoppingBag className="h-5 w-5" />
              Order History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">
                        {order.id?.substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{customerOrders.length}</span> order{customerOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
