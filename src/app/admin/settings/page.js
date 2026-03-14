'use client'

import { useEffect, useState } from 'react'
import { getDoc, setDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiSettings, 
  FiSave, 
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiBell,
  FiGlobe,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi'

const DEFAULT_SETTINGS = {
  store: {
    name: "TIM'S GLAM",
    email: 'contact@timsgam.com',
    phone: '+1 (555) 123-4567',
    website: 'https://timsgam.com',
    address: '123 Fashion Street, Style City, FC 12345',
    description: 'Your one-stop fashion destination for trendy and affordable clothing.',
  },
  admin: {
    fullName: 'Admin User',
    email: 'admin@timsgam.com',
  },
  notifications: {
    newOrders: true,
    orderStatusUpdates: true,
    lowStockAlerts: true,
    newCustomers: true,
    weeklySalesReport: true,
    systemUpdates: true,
  },
  payment: {
    creditCard: true,
    paypal: true,
    cashOnDelivery: false,
    bankTransfer: false,
    currency: 'USD',
    taxRate: 10,
    shippingCost: 2000,
    freeShippingThreshold: 80000,
  },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [store, setStore] = useState(DEFAULT_SETTINGS.store)
  const [admin, setAdmin] = useState(DEFAULT_SETTINGS.admin)
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications)
  const [payment, setPayment] = useState(DEFAULT_SETTINGS.payment)

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const docSnap = await getDoc(doc(db, 'appSettings', 'main'))
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setStore(data.store || DEFAULT_SETTINGS.store)
          setAdmin(data.admin || DEFAULT_SETTINGS.admin)
          setNotifications(data.notifications || DEFAULT_SETTINGS.notifications)
          setPayment(data.payment || DEFAULT_SETTINGS.payment)
        } else {
          // Initialize with default settings if document doesn't exist
          await setDoc(doc(db, 'appSettings', 'main'), DEFAULT_SETTINGS)
        }
        setError('')
      } catch (err) {
        setError(`Failed to load settings: ${err.message}`)
        console.error('Error fetching settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Save to Firestore
      await setDoc(doc(db, 'appSettings', 'main'), {
        store,
        admin,
        notifications,
        payment,
        updatedAt: new Date(),
      })

      setSaved(true)
      setError('')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(`Failed to save settings: ${err.message}`)
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'store', name: 'Store Settings', icon: FiSettings },
    { id: 'profile', name: 'Admin Profile', icon: FiUser },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'payment', name: 'Payment', icon: FiDollarSign },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
        <p className="ml-3 text-gray-600 mt-4">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FiSettings className="text-primary-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your store and account settings</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Store Settings Tab */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={store.name}
                      onChange={(e) => setStore({ ...store, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={store.email}
                      onChange={(e) => setStore({ ...store, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={store.phone}
                      onChange={(e) => setStore({ ...store, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiGlobe className="inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={store.website}
                      onChange={(e) => setStore({ ...store, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin className="inline mr-2" />
                      Store Address
                    </label>
                    <textarea
                      rows="3"
                      value={store.address}
                      onChange={(e) => setStore({ ...store, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      rows="4"
                      value={store.description}
                      onChange={(e) => setStore({ ...store, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {admin.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" disabled>
                      Change Photo
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Coming soon</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={admin.fullName}
                      onChange={(e) => setAdmin({ ...admin, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={admin.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 gap-6 max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Password changes can be managed through the authentication system. For security, you&apos;ll need to verify your current password.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'newOrders', label: 'New Order Notifications', description: 'Receive email when a new order is placed' },
                    { key: 'orderStatusUpdates', label: 'Order Status Updates', description: 'Get notified when order status changes' },
                    { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Alert when product stock is running low' },
                    { key: 'newCustomers', label: 'New Customer Registrations', description: 'Notification for new customer sign-ups' },
                    { key: 'weeklySalesReport', label: 'Weekly Sales Report', description: 'Receive weekly summary of sales and revenue' },
                    { key: 'systemUpdates', label: 'System Updates', description: 'Important system and security updates' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  {[
                    { key: 'creditCard', name: 'Credit/Debit Card', description: 'Accept payments via credit and debit cards' },
                    { key: 'paypal', name: 'PayPal', description: 'Enable PayPal checkout' },
                    { key: 'cashOnDelivery', name: 'Cash on Delivery', description: 'Allow customers to pay upon delivery' },
                    { key: 'bankTransfer', name: 'Bank Transfer', description: 'Accept direct bank transfers' },
                  ].map((method) => (
                    <div key={method.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="text-primary-600 h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={payment[method.key]}
                          onChange={(e) => setPayment({ ...payment, [method.key]: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency & Shipping Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select 
                      value={payment.currency}
                      onChange={(e) => setPayment({ ...payment, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={payment.taxRate}
                      onChange={(e) => setPayment({ ...payment, taxRate: parseFloat(e.target.value) })}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Cost (₦)
                    </label>
                    <input
                      type="number"
                      value={payment.shippingCost}
                      onChange={(e) => setPayment({ ...payment, shippingCost: parseFloat(e.target.value) })}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Shipping Threshold (₦)
                    </label>
                    <input
                      type="number"
                      value={payment.freeShippingThreshold ?? 80000}
                      onChange={(e) => setPayment({ ...payment, freeShippingThreshold: parseFloat(e.target.value) })}
                      step="1"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
            <div>
              {saved && (
                <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <FiCheck className="h-4 w-4" />
                  Changes saved successfully!
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
