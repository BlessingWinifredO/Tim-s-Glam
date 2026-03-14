'use client'

import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { addDoc, collection, getDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { FiLock, FiTruck } from 'react-icons/fi'

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user, loading } = useAuth()
  const [placingOrder, setPlacingOrder] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [phone, setPhone] = useState('')

  // Dynamic tax and shipping from Firestore appSettings
  const [taxRate, setTaxRate] = useState(0.08)
  const [shippingCost, setShippingCost] = useState(2000)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100000)

  useEffect(() => {
    getDoc(doc(db, 'appSettings', 'main')).then((snap) => {
      if (snap.exists()) {
        const pay = snap.data()?.payment || {}
        if (pay.taxRate != null) setTaxRate(pay.taxRate / 100)
        if (pay.shippingCost != null) setShippingCost(pay.shippingCost)
        if (pay.freeShippingThreshold != null) setFreeShippingThreshold(pay.freeShippingThreshold)
      }
    }).catch(() => {})
  }, [])

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'
  const isSandboxMode = !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID === 'sb'

  // All calculations and hooks MUST be above any early returns (React rules of hooks)
  const subtotal = getCartTotal()
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax
  const paypalAmount = useMemo(() => total.toFixed(2), [total])

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Checking your account...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-7 text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-3">Sign in required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account before proceeding to payment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account" className="btn-primary">
              Sign In / Sign Up
            </Link>
            <Link href="/shop" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const onShippingChange = (key, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const isShippingValid = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode']
    return required.every((field) => String(shippingInfo[field] || '').trim().length > 0)
  }

  const createOrderRecord = async ({
    paymentMethod,
    paymentStatus,
    paypalOrderId = '',
    paypalCaptureId = '',
    shippingAddress = shippingInfo,
  }) => {
    const orderPayload = {
      userId: user.uid,
      customerName: `${shippingAddress.firstName.trim()} ${shippingAddress.lastName.trim()}`,
      customerEmail: shippingAddress.email.trim().toLowerCase(),
      customerAddress: shippingAddress.address.trim(),
      customerCity: shippingAddress.city.trim(),
      customerPostalCode: shippingAddress.postalCode.trim(),
      customerPhone: phone.trim() || 'Not provided',
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        selectedSize: item.selectedSize || 'Default',
        selectedColor: item.selectedColor || 'Default',
        image: item.image || '',
      })),
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      totalAmount: Number(total.toFixed(2)),
      status: 'Processing',
      paymentMethod,
      paymentStatus,
      paypalOrderId,
      paypalCaptureId,
      createdAt: serverTimestamp(),
    }

    const orderRef = await addDoc(collection(db, 'orders'), orderPayload)

    // Send customer order confirmation email (non-blocking)
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'orderPlaced',
          email: orderPayload.customerEmail,
          customerName: orderPayload.customerName,
          orderId: orderRef.id,
          totalAmount: orderPayload.totalAmount,
          status: orderPayload.status,
        }),
      })
    } catch {
      // Ignore notification failure during checkout flow.
    }

    clearCart()
    setOrderSuccess({
      id: orderRef.id,
      paypalOrderId: paypalOrderId || 'TEST-SANDBOX-CHECKOUT',
    })
  }

  const handlePayPalApprove = async (data, actions) => {
    try {
      setCheckoutError('')
      setPlacingOrder(true)

      const captured = await actions.order.capture()
      await createOrderRecord({
        paymentMethod: 'paypal',
        paymentStatus: 'Paid',
        paypalOrderId: data.orderID,
        paypalCaptureId: captured?.purchase_units?.[0]?.payments?.captures?.[0]?.id || '',
      })
    } catch (error) {
      setCheckoutError(error?.message || 'Payment succeeded, but order save failed. Please contact support.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const handleSandboxTestOrder = async () => {
    let effectiveShipping = { ...shippingInfo }

    if (!isShippingValid()) {
      // In sandbox mode, auto-fill missing shipping fields so checkout flow can be tested end-to-end.
      effectiveShipping = {
        firstName: shippingInfo.firstName?.trim() || user?.displayName?.split(' ')?.[0] || 'Test',
        lastName: shippingInfo.lastName?.trim() || user?.displayName?.split(' ')?.slice(1).join(' ') || 'User',
        email: shippingInfo.email?.trim() || user?.email || 'test@example.com',
        address: shippingInfo.address?.trim() || '123 Test Street',
        city: shippingInfo.city?.trim() || 'Lagos',
        postalCode: shippingInfo.postalCode?.trim() || '100001',
      }
      setShippingInfo(effectiveShipping)
    }

    try {
      setCheckoutError('')
      setPlacingOrder(true)

      await createOrderRecord({
        paymentMethod: 'paypal-sandbox-test',
        paymentStatus: 'Test Paid',
        paypalOrderId: `TEST-${Date.now()}`,
        paypalCaptureId: 'TEST-CAPTURE-ID',
        shippingAddress: effectiveShipping,
      })
    } catch (error) {
      setCheckoutError(error?.message || 'Test order failed. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const handlePayPalError = (error) => {
    setCheckoutError(error?.message || 'PayPal checkout failed. Please try again.')
  }

  const createPayPalOrder = (data, actions) => {
    if (!isShippingValid()) {
      setCheckoutError('Please complete all shipping fields before paying with PayPal.')
      return Promise.reject(new Error('Shipping information incomplete'))
    }

    setCheckoutError('')

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: paypalAmount,
            breakdown: {
              item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
              shipping: { currency_code: 'USD', value: shipping.toFixed(2) },
              tax_total: { currency_code: 'USD', value: tax.toFixed(2) },
            },
          },
          description: "TIM'S GLAM Order",
        },
      ],
    })
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-3">Order Placed Successfully</h2>
          <p className="text-gray-600 mb-2">Order ID: <span className="font-semibold">{orderSuccess.id}</span></p>
          <p className="text-gray-600 mb-6">PayPal Order ID: <span className="font-semibold">{orderSuccess.paypalOrderId}</span></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            <Link href="/account" className="btn-outline">Go to Account</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-playfair font-bold mb-2">Checkout</h1>
          <p className="text-lg">Complete your purchase securely</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <FiTruck size={24} className="text-gold-500" />
                  <h2 className="text-2xl font-bold text-primary-500">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => onShippingChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => onShippingChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={shippingInfo.email || user.email || ''}
                      onChange={(e) => onShippingChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => onShippingChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => onShippingChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => onShippingChange('postalCode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <FiLock size={24} className="text-gold-500" />
                  <h2 className="text-2xl font-bold text-primary-500">PayPal Payment</h2>
                </div>

                <p className="text-gray-600 mb-4">
                  Use PayPal to complete your payment securely. Card fields were removed as requested.
                </p>

                {isSandboxMode && (
                  <div className="mb-4 p-4 rounded-md border border-blue-300 bg-blue-50 text-blue-800 text-sm">
                    Sandbox mode is active for testing. Use a PayPal sandbox buyer account to test checkout and order placement.
                  </div>
                )}

                {!paypalClientId ? (
                  <div className="p-4 rounded-md border border-amber-300 bg-amber-50 text-amber-800 text-sm">
                    PayPal is not configured yet. Add <span className="font-semibold">NEXT_PUBLIC_PAYPAL_CLIENT_ID</span> to your .env.local and restart the server.
                  </div>
                ) : (
                  <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD', intent: 'capture' }}>
                    <PayPalButtons
                      disabled={placingOrder}
                      style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
                      createOrder={createPayPalOrder}
                      onApprove={handlePayPalApprove}
                      onError={handlePayPalError}
                    />
                  </PayPalScriptProvider>
                )}

                {isSandboxMode && (
                  <button
                    type="button"
                    onClick={handleSandboxTestOrder}
                    disabled={placingOrder}
                    className="mt-4 w-full py-3 rounded-md border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold disabled:opacity-60"
                  >
                    {placingOrder ? 'Placing Test Order...' : 'Place Test Order (Sandbox)'}
                  </button>
                )}

                {checkoutError && (
                  <div className="mt-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
                    {checkoutError}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                  <FiLock className="text-green-600" />
                  <span>PayPal handles your payment securely and encrypted.</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl font-bold text-primary-500 mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.selectedColor} • {item.selectedSize}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-gold-500">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {subtotal < freeShippingThreshold && (
                  <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-md text-sm text-gray-700">
                    Add ₦{(freeShippingThreshold - subtotal).toLocaleString()} more for FREE shipping!
                  </div>
                )}

                <button className="w-full btn-primary mt-6 opacity-60 cursor-not-allowed" disabled>
                  Complete payment with PayPal below
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
