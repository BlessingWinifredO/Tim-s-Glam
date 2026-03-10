'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiArrowLeft, 
  FiLoader,
  FiCheck,
  FiX,
  FiPackage,
  FiMapPin,
  FiMail,
  FiPhone,
  FiTruck
} from 'react-icons/fi'

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']
const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'orders', orderId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          setError('Order not found')
          return
        }

        setOrder({
          id: docSnap.id,
          ...docSnap.data()
        })
      } catch (err) {
        setError(`Failed to load order: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, { status: newStatus })
      setOrder({ ...order, status: newStatus })
      setError('')
    } catch (err) {
      setError(`Failed to update order status: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
        <p className="ml-3 text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin/orders')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium transition-colors"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Orders
        </button>
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FiX className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">{error || 'Order not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/orders')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-medium transition-colors"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Orders
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.id?.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-500 mt-1">
              {order.createdAt?.toDate?.()
                ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Date not available'}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <FiX className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Status Update Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>
        <div className="flex items-center gap-3">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              statusColors[order.status] || 'bg-gray-100 text-gray-800'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {updating && (
            <FiLoader className="h-5 w-5 text-primary-600 animate-spin flex-shrink-0" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium text-gray-900">{order.customerName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FiMail className="h-4 w-4" />
                Email
              </div>
              <a href={`mailto:${order.customerEmail}`} className="font-medium text-primary-600 hover:text-primary-700">
                {order.customerEmail}
              </a>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FiPhone className="h-4 w-4" />
                Phone
              </div>
              <p className="font-medium text-gray-900">{order.customerPhone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiMapPin className="h-5 w-5 text-primary-600" />
            Shipping Address
          </h3>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
            <p className="text-gray-600 text-sm">{order.shippingAddress?.street}</p>
            <p className="text-gray-600 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p className="text-gray-600 text-sm">{order.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">${(parseFloat(order.subtotal || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">${(parseFloat(order.shippingCost || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">${(parseFloat(order.tax || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-600">${(parseFloat(order.totalAmount || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiPackage className="h-5 w-5 text-primary-600" />
          Order Items
        </h3>
        
        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Size</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.productId?.slice(0, 8)}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-medium text-gray-700">{item.size || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-medium text-gray-700">{item.quantity}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-medium text-gray-900">${(parseFloat(item.price || 0)).toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900">${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No items in this order</p>
        )}
      </div>

      {/* Shipping Status Timeline */}
      {order.status === 'Shipped' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiTruck className="h-5 w-5 text-primary-600" />
            Tracking Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Tracking Number</p>
            <p className="font-mono font-semibold text-gray-900">{order.trackingNumber || 'Not provided'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
