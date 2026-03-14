import Link from 'next/link'

export const metadata = {
  title: "FAQ | TIM'S GLAM",
  description: "Frequently asked questions about shopping, orders, shipping, and returns at TIM'S GLAM.",
}

const faqs = [
  {
    category: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: "Browse our shop, select your size and color, then click 'Add to Cart'. When ready, go to checkout, fill in your shipping details, and pay securely via PayPal.",
      },
      {
        q: 'What payment methods do you accept?',
        a: "We currently accept payments through PayPal, which supports debit cards, credit cards, and PayPal balance. Your payment details are never stored on our servers.",
      },
      {
        q: 'Can I cancel or change my order after placing it?',
        a: "Orders can be cancelled or changed within 2 hours of placement, before they are dispatched. Contact us immediately via the Contact page with your order ID.",
      },
      {
        q: "I didn't receive an order confirmation email — what should I do?",
        a: "Check your spam or junk folder first. If it's not there, sign in to your account and check your order history. Still having trouble? Contact our support team.",
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days within Nigeria. Express shipping (2–3 business days) is available at checkout for an additional fee.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders over ₦100,000 qualify for free standard shipping automatically at checkout.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Once your order is dispatched, you will receive a tracking number by email. You can also view order status in your account page.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently focus on deliveries within Nigeria. International shipping may be available for select destinations — contact us to enquire.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for items that are unworn, unwashed, and in their original condition with tags attached. See our full Returns Policy for details.',
      },
      {
        q: 'How do I start a return?',
        a: "Contact us through the Contact page within 7 days of receiving your order. Include your order ID and reason for return. Our team will guide you through the process.",
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect your returned item, refunds are processed within 5–7 business days back to your original payment method.',
      },
    ],
  },
  {
    category: 'Account & Security',
    items: [
      {
        q: 'How do I create an account?',
        a: "Click 'Account' in the navigation bar and choose 'Sign Up'. You can register with your email or sign in instantly with Google.",
      },
      {
        q: 'I forgot my password — how do I reset it?',
        a: "Click 'Forgot Password' on the sign-in page and enter your email address. We'll send you a secure reset code to your inbox.",
      },
      {
        q: 'How is my personal data protected?',
        a: "We use Firebase Authentication with industry-standard encryption. We never sell your data. See our Privacy Policy for full details.",
      },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      {
        q: 'How do I find the right size?',
        a: "Visit our Size Guide page for detailed measurements across all categories — women's, men's, and kids. If unsure, size up.",
      },
      {
        q: "Are the product photos accurate to the actual item's colour?",
        a: 'We work hard to represent colours accurately, but slight variations may occur due to screen settings and lighting. Contact us if you have concerns about a specific product.',
      },
      {
        q: 'How do I know if an item is in stock?',
        a: "Items show 'In Stock' on the product page. If it's out of stock, the button will be disabled. Sign up to be notified when items are restocked.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600">
              Can&apos;t find your answer here?{' '}
              <Link href="/contact" className="text-primary-600 hover:underline font-semibold">
                Contact our support team
              </Link>
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                  <h2 className="text-base font-bold text-white">{section.category}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-900">{item.q}</span>
                        <span className="text-primary-600 text-xl flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                      </summary>
                      <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center bg-primary-50 rounded-2xl border border-primary-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">Our support team is here to help, 7 days a week.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="/size-guide" className="hover:text-primary-600 transition-colors">Size Guide</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-primary-600 transition-colors">Returns Policy</Link>
            <span>·</span>
            <Link href="/shipping-info" className="hover:text-primary-600 transition-colors">Shipping Info</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
