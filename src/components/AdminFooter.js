'use client'

import Link from 'next/link'
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter,
  FiMail,
  FiPhone
} from 'react-icons/fi'

export default function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-gray-200 border-t border-primary-800">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">TG</span>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-white">TIM&apos;S GLAM</h3>
                <p className="text-xs text-gray-400">Admin Control</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium online fashion brand delivering excellence in e-commerce management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/admin/customers" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Customers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Status Page
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FiMail className="text-gold-400" size={16} />
                <a href="mailto:admin@timsgam.com" className="text-gray-400 hover:text-gold-400 transition-colors">
                  admin@timsgam.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gold-400" size={16} />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <FiFacebook size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <FiInstagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                  <FiTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-800 pt-8">
          {/* Stats Row - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">100+</p>
              <p className="text-xs text-gray-400 mt-1">Active Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">50+</p>
              <p className="text-xs text-gray-400 mt-1">Daily Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">1000+</p>
              <p className="text-xs text-gray-400 mt-1">Happy Customers</p>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div>
              <p>&copy; {currentYear} TIM&apos;S GLAM. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
