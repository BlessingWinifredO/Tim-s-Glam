import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiHeadphones } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-primary-700 to-primary-900 text-white pt-0">
      <div className="border-b border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-primary-100">Premium quality fashion for adults and kids.</p>
          <p className="text-gold-300 font-semibold tracking-wide">FAST SHIPPING • SECURE PAYMENT • EASY RETURNS</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #f0e68c 0%, #ffd700 50%, #daa520 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>TIM&apos;S GLAM</h3>
            <p className="text-primary-100 mb-5 leading-relaxed">
              Your destination for premium unisex fashion. We bring style, quality, and glamour to the whole family.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/20 hover:border-gold-400 hover:text-gold-300 transition-all flex items-center justify-center">
                <FiFacebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/20 hover:border-gold-400 hover:text-gold-300 transition-all flex items-center justify-center">
                <FiInstagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-white/20 hover:border-gold-400 hover:text-gold-300 transition-all flex items-center justify-center">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-primary-100 hover:text-gold-300 transition-colors">Shop</Link></li>
              <li><Link href="/about" className="text-primary-100 hover:text-gold-300 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-primary-100 hover:text-gold-300 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-primary-100 hover:text-gold-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">Returns</Link></li>
              <li><Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-primary-100">
                <FiHeadphones size={16} className="text-gold-300" />
                <span>Online Store</span>
              </li>
              <li className="flex items-center space-x-2 text-primary-100">
                <FiPhone size={16} className="text-gold-300" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-primary-100">
                <FiMail size={16} className="text-gold-300" />
                <span>info@timsglam.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-primary-100">
            &copy; {currentYear} TIM&apos;S GLAM. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-primary-100 hover:text-gold-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
