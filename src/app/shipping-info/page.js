'use client'

import Link from 'next/link'
import { FiTruck, FiClock, FiMapPin } from 'react-icons/fi'

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-playfair font-bold mb-2">Shipping Information</h1>
          <p className="text-primary-100">Fast, reliable delivery right to your door</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiTruck size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">Free Shipping</p>
              <p className="text-sm text-gray-500 mt-1">On orders over ₦80,000</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiClock size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">3–7 Business Days</p>
              <p className="text-sm text-gray-500 mt-1">Nationwide delivery</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiMapPin size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">Nigeria-Wide</p>
              <p className="text-sm text-gray-500 mt-1">All 36 states + FCT</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8 text-gray-700">

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Delivery Times</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-700 border border-gray-200">Location</th>
                      <th className="text-left p-3 font-semibold text-primary-700 border border-gray-200">Estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-gray-200">Lagos</td>
                      <td className="p-3 border border-gray-200">1–3 business days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border border-gray-200">Abuja, Port Harcourt, Ibadan</td>
                      <td className="p-3 border border-gray-200">2–4 business days</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200">Other major cities</td>
                      <td className="p-3 border border-gray-200">3–5 business days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border border-gray-200">Remote areas</td>
                      <td className="p-3 border border-gray-200">5–7 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">Delivery times are estimates and may vary during peak seasons or national holidays.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Shipping Rates</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Orders over ₦80,000:</strong> FREE shipping</li>
                <li><strong>Standard shipping:</strong> ₦2,000 flat rate</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">Shipping rates are calculated and displayed at checkout before payment.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Order Processing</h2>
              <p>Orders are processed within <strong>1–2 business days</strong> of payment confirmation. You will receive an email confirmation with your order details once your order is placed.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Tracking Your Order</h2>
              <p>Once your order is dispatched, you can track its status from your <Link href="/account" className="text-gold-500 hover:underline">Account page</Link>. You will also receive email updates when your order status changes.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Questions?</h2>
              <p>If you have any questions about your delivery, <Link href="/contact" className="text-gold-500 hover:underline">contact us</Link>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
