'use client'

import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-playfair font-bold mb-2">Terms of Service</h1>
          <p className="text-primary-100">Last updated: January 2025</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8 text-gray-700">

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using TIM&apos;S GLAM (&quot;the Store&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Store.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">2. Use of the Store</h2>
              <p>You agree to use the Store only for lawful purposes. You must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Store in any way that violates applicable local or international laws</li>
                <li>Attempt to gain unauthorised access to any part of the Store</li>
                <li>Submit false or misleading information during checkout or registration</li>
                <li>Use automated tools to scrape or harvest data from the Store</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">3. Orders and Payment</h2>
              <p>All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order. Payment is processed securely via PayPal. Prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">4. Intellectual Property</h2>
              <p>All content on this Store — including images, logos, text, and design — is the property of TIM&apos;S GLAM and may not be reproduced, distributed, or used without written permission.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">5. Disclaimer of Warranties</h2>
              <p>The Store is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Store will be uninterrupted or error-free. Product colours may vary slightly from what appears on screen due to monitor calibration.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">6. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, TIM&apos;S GLAM shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Store or our products.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">7. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the Store after changes constitutes acceptance of the revised terms. The date of the latest revision is shown at the top of this page.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">8. Contact</h2>
              <p>Questions about these Terms? <Link href="/contact" className="text-gold-500 hover:underline">Contact us</Link> or email <a href="mailto:contact@timsglam.com" className="text-gold-500 hover:underline">contact@timsglam.com</a>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
