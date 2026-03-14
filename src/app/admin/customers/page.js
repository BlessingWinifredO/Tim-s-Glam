'use client'

import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { AdminDataContext } from '@/context/AdminDataContext'
import { 
  FiUsers, 
  FiSearch, 
  FiEye, 
  FiLoader,
  FiAlertCircle,
  FiTrash2,
  FiLock,
  FiEyeOff,
  FiX
} from 'react-icons/fi'

export default function CustomersPage() {
  const adminDataContext = useContext(AdminDataContext)
  const triggerDashboardRefresh = adminDataContext?.triggerDashboardRefresh || (() => {})
  
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingCustomer, setDeletingCustomer] = useState('')
  const [deleteModal, setDeleteModal] = useState(null) // { customer } | null
  const [deletePassword, setDeletePassword] = useState('')
  const [deletePasswordVisible, setDeletePasswordVisible] = useState(false)
  const [deleteModalError, setDeleteModalError] = useState('')

  // Fetch customers and orders data
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setLoading(true)
        const allowedAdminsRaw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'winniewizzyb@gmail.com,admin@tims-glam.com'
        const adminEmails = new Set(
          allowedAdminsRaw
            .split(',')
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean)
        )
        
        const [usersResult, ordersResult] = await Promise.allSettled([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'orders')),
        ])

        if (usersResult.status === 'rejected') {
          throw usersResult.reason
        }

        // Fetch all users from the users collection
        const allUsers = usersResult.value.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((user) => {
            const email = String(user.email || '').trim().toLowerCase()
            return /\S+@\S+\.\S+/.test(email) && !adminEmails.has(email)
          })

        // Orders are optional for stats; don't block customer list when orders query fails.
        const orders = ordersResult.status === 'fulfilled'
          ? ordersResult.value.docs.map(doc => doc.data())
          : []

        // Create a map of all registered users
        const customerMap = new Map()

        // First, add all registered users
        allUsers.forEach(user => {
          const normalizedEmail = String(user.email || '').trim().toLowerCase()
          customerMap.set(normalizedEmail, {
            id: normalizedEmail,
            uid: user.uid || user.id,
            name: user.fullName || user.displayName || 'Unknown',
            email: normalizedEmail,
            phone: user.phone || 'N/A',
            orders: 0,
            totalSpent: 0,
            joined: user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
            status: user.emailVerified ? 'Active' : 'Unverified',
            lastOrder: new Date(0),
            provider: user.provider || 'email',
            photoURL: user.photoURL || ''
          })
        })

        // Then, update order stats for registered users only.
        orders.forEach(order => {
          const email = String(order.customerEmail || '').trim().toLowerCase()
          if (!customerMap.has(email)) return

          const customer = customerMap.get(email)
          if (order.status === 'Completed') {
            customer.orders += 1
            customer.totalSpent += parseFloat(order.totalAmount || 0)
          }
          
          // Update last order date if this order is more recent
          const orderDate = order.createdAt?.toDate?.() || new Date(0)
          if (orderDate > customer.lastOrder) {
            customer.lastOrder = orderDate
          }
        })

        // Convert to array and sort by registration date (most recent first)
        const customersArray = Array.from(customerMap.values())
          .sort((a, b) => new Date(b.joined) - new Date(a.joined))

        setCustomers(customersArray)

        if (ordersResult.status === 'rejected') {
          setError('Customer list loaded, but order-based stats are unavailable due to permissions.')
        } else {
          setError('')
        }
      } catch (err) {
        if (err?.code === 'permission-denied') {
          setError('Failed to load customers: Firestore rules are not published for users read access yet.')
        } else {
          setError(`Failed to load customers: ${err.message}`)
        }
        console.error('Error fetching customers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomersData()
  }, [])

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
    return colors[email.charCodeAt(0) % colors.length]
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteCustomer = (customer) => {
    setDeleteModal({ customer })
    setDeletePassword('')
    setDeletePasswordVisible(false)
    setDeleteModalError('')
  }

  const confirmDeleteCustomer = async () => {
    if (!deleteModal) return
    const { customer } = deleteModal

    if (!deletePassword) {
      setDeleteModalError('Please enter your admin password.')
      return
    }

    const adminRaw = window.localStorage.getItem('adminUser')
    const adminData = adminRaw ? JSON.parse(adminRaw) : null
    const adminEmail = adminData?.email || ''

    if (!adminEmail) {
      setDeleteModalError('Admin session missing. Please sign in again.')
      return
    }

    setDeletingCustomer(customer.email)
    setDeleteModalError('')

    try {
      const response = await fetch('/api/admin/delete-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerUid: customer.uid || null,
          customerEmail: customer.email,
          adminEmail,
          adminPassword: deletePassword,
          deleteOrders: true,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to delete customer.')
      }

      setCustomers((prev) => prev.filter((item) => item.email !== customer.email))
      setDeleteModal(null)
      triggerDashboardRefresh()
    } catch (err) {
      setDeleteModalError(err?.message || 'Failed to delete customer.')
    } finally {
      setDeletingCustomer('')
    }
  }

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    unverified: customers.filter(c => c.status === 'Unverified').length,
    avgOrderValue: customers.length > 0
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / Math.max(customers.reduce((count, c) => count + c.orders, 0), 1)
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiUsers className="text-primary-600" />
            Customers Management
          </h1>
          <p className="text-gray-500 mt-1">View and manage your customers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-blue-600 mt-2">Registered users</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Verified</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-500 mt-2">Can login</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Unverified</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.unverified}</p>
          <p className="text-xs text-gray-500 mt-2">Need verification</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
          <p className="text-3xl font-bold text-gray-900">₦{stats.avgOrderValue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">Per completed order</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
          <p className="ml-3 text-gray-600">Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {customers.length === 0 ? 'No customers yet' : 'No matching customers'}
          </h3>
          <p className="text-gray-600 mb-6">
            {customers.length === 0 
              ? 'Customers appear here as soon as they create an account.'
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getAvatarColor(customer.email)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {customer.orders} order{customer.orders !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ₦{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {customer.joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'Unverified'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomer(customer)}
                          disabled={deletingCustomer === customer.email}
                          className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingCustomer === customer.email ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <FiEye className="h-4 w-4" />
                          <span className="text-sm font-medium">View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
              <span className="font-medium">{customers.length}</span> customers
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setDeleteModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={!!deletingCustomer}
            >
              <FiX size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FiTrash2 className="text-red-600" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Customer</h3>
                <p className="text-sm text-gray-500">{deleteModal.customer.email}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              This will permanently delete the customer&apos;s account and all associated orders from Firestore. This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiLock className="inline mr-1" size={14} />
                Confirm with your admin password
              </label>
              <div className="relative">
                <input
                  type={deletePasswordVisible ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteModalError('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') confirmDeleteCustomer() }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                  disabled={!!deletingCustomer}
                />
                <button
                  type="button"
                  onClick={() => setDeletePasswordVisible((v) => !v)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {deletePasswordVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {deleteModalError && (
                <p className="mt-2 text-sm text-red-600">{deleteModalError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                disabled={!!deletingCustomer}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCustomer}
                disabled={!!deletingCustomer || !deletePassword}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingCustomer ? (
                  <><FiLoader className="animate-spin" size={16} /> Deleting…</>
                ) : (
                  <><FiTrash2 size={16} /> Delete Customer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
