'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-playfair font-bold mb-2">Privacy Policy</h1>
          <p className="text-primary-100">Last updated: January 2025</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto prose prose-gray">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8 text-gray-700">

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">1. Information We Collect</h2>
              <p>When you use TIM&apos;S GLAM, we may collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Account information: name, email address, and password (hashed)</li>
                <li>Order information: shipping address, phone number, and purchase history</li>
                <li>Usage data: pages visited, device type, and browser information</li>
                <li>Communications: messages you send us via the contact form</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to customer service enquiries</li>
                <li>Send promotional emails (you may unsubscribe at any time)</li>
                <li>Improve our website and product offerings</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">3. Data Sharing</h2>
              <p>We do not sell your personal information. We share data only with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>PayPal</strong> — to process payments securely</li>
                <li><strong>Firebase (Google)</strong> — for authentication and data storage</li>
                <li><strong>Cloudinary</strong> — for image hosting</li>
                <li>Law enforcement when required by applicable law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">4. Data Retention</h2>
              <p>We retain your account and order data for as long as your account is active or as required to provide services and comply with legal obligations. You may request deletion of your account by contacting us.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">5. Cookies</h2>
              <p>Our website uses browser local storage and session storage to maintain your cart and authentication state. We do not use third-party tracking cookies.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:contact@timsglam.com" className="text-gold-500 hover:underline">contact@timsglam.com</a>.</p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair font-bold text-primary-600 mb-3">7. Contact</h2>
              <p>If you have questions about this Privacy Policy, please <Link href="/contact" className="text-gold-500 hover:underline">contact us</Link>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
