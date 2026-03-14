'use client'

import Link from 'next/link'
import { FiPackage, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-playfair font-bold mb-2">Returns &amp; Refunds</h1>
          <p className="text-primary-100">We want you to love every purchase</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiRefreshCw size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">7-Day Returns</p>
              <p className="text-sm text-gray-500 mt-1">Return within 7 days of delivery</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiPackage size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">Original Condition</p>
              <p className="text-sm text-gray-500 mt-1">Unworn, tags attached</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <FiAlertCircle size={28} className="text-gold-500 mx-auto mb-2" />
              <p className="font-bold text-gray-800">Some Exclusions</p>
              <p className="text-sm text-gray-500 mt-1">Sale & custom items are final sale</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8 text-gray-700">

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Eligibility</h2>
              <p>We accept returns on most items within <strong>7 days of delivery</strong> provided they are:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Unworn and unwashed</li>
                <li>In original packaging with all tags attached</li>
                <li>Free from odours, stains, or damage caused after delivery</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Non-Returnable Items</h2>
              <p>The following items cannot be returned:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Sale or discounted items marked &quot;Final Sale&quot;</li>
                <li>Custom or personalised orders</li>
                <li>Underwear and swimwear (for hygiene reasons)</li>
                <li>Items damaged due to customer misuse</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">How to Return</h2>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Contact us within 7 days of receiving your order via the <Link href="/contact" className="text-gold-500 hover:underline">Contact page</Link> or email <a href="mailto:contact@timsglam.com" className="text-gold-500 hover:underline">contact@timsglam.com</a>.</li>
                <li>Include your order number and reason for return.</li>
                <li>We will confirm eligibility and provide return instructions within 2 business days.</li>
                <li>Ship the item back in its original packaging. Return shipping costs are the customer&apos;s responsibility unless the item was defective or wrong.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Refunds</h2>
              <p>Once we receive and inspect the return, we will notify you of the refund decision. Approved refunds are processed within <strong>5–10 business days</strong> back to your original payment method.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Damaged or Wrong Items</h2>
              <p>If you received a damaged, defective, or incorrect item, please contact us immediately with photos. We will arrange a replacement or full refund at no cost to you.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
