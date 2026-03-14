'use client'

import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiClock, FiFacebook, FiInstagram, FiTwitter, FiSend, FiMessageCircle, FiHeadphones, FiPackage, FiShield, FiHeart, FiArrowRight, FiUser, FiChevronDown } from 'react-icons/fi'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save message to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'unread',
        createdAt: serverTimestamp(),
      })

      // Notify admin via email (fire-and-forget — don't block success on email)
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'customEmail',
          to: process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',')[0] || '',
          subject: `New Contact Message: ${formData.subject.trim()}`,
          message: `From: ${formData.name.trim()} <${formData.email.trim()}>\nPhone: ${formData.phone.trim() || 'N/A'}\n\n${formData.message.trim()}`,
        }),
      }).catch(() => {})

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (err) {
      console.error('Contact form error:', err)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: FiMessageCircle,
      title: 'Online Support',
      line1: 'Live Chat & Email Support',
      line2: 'Available 24/7',
      action: 'Start Chat',
      href: '/support-chat'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      line1: '+1 (555) 123-4567',
      line2: 'Mon-Fri: 9AM-6PM EST',
      action: 'Call Now'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      line1: 'winniewizzyb@gmail.com',
      line2: 'Available 24/7',
      action: 'Send Email'
    },
    {
      icon: FiClock,
      title: 'Support Hours',
      line1: 'Mon-Sat: 8AM-10PM',
      line2: 'Sunday: 10AM-6PM',
      action: 'View Schedule'
    }
  ]

  const reasons = [
    {
      icon: FiHeadphones,
      title: '24/7 Customer Support',
      description: 'Our dedicated team is always here to help with any questions or concerns.'
    },
    {
      icon: FiPackage,
      title: 'Fast & Secure Shipping',
      description: 'Reliable delivery with tracking on all orders, ensuring your items arrive safely.'
    },
    {
      icon: FiShield,
      title: 'Quality Guarantee',
      description: 'We stand behind our products with a comprehensive satisfaction guarantee.'
    },
    {
      icon: FiHeart,
      title: 'Trusted by Thousands',
      description: 'Join our community of 10,000+ satisfied customers worldwide.'
    }
  ]

  const faqs = [
    {
      question: 'What are your shipping times?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer hassle-free exchanges on all unworn items with original tags, backed by our designer satisfaction guarantee. See our Returns page for details.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 50 countries worldwide with competitive international shipping rates.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once shipped, you\'ll receive a tracking number via email to monitor your delivery status.'
    }
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Parallax Background */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/92 via-primary-800/88 to-primary-700/92"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-300/30 text-gold-300 text-sm font-semibold tracking-wide mb-6">
            <FiMessageCircle size={18} />
            We&apos;re Here to Help
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-5 px-4">Get In Touch</h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4 mb-10">
            Have a question, need support, or want to collaborate? We&apos;d love to hear from you. Our team is ready to assist with anything you need.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">&lt;24hr</p>
              <p className="text-sm md:text-base text-white/80">Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">10K+</p>
              <p className="text-sm md:text-base text-white/80">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">99%</p>
              <p className="text-sm md:text-base text-white/80">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary-600 mb-4">How Can We Help You?</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to reach us. We&apos;re committed to providing you with exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="group bg-white border-2 border-gray-100 p-6 md:p-7 rounded-2xl hover:border-gold-300 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-400 to-gold-600 text-white rounded-full mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <method.icon size={26} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-700 font-medium mb-1">{method.line1}</p>
                <p className="text-gray-500 text-sm mb-4">{method.line2}</p>
                {method.href ? (
                  <Link href={method.href} className="inline-flex items-center gap-1.5 text-gold-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                    {method.action}
                    <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-gold-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                    {method.action}
                    <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Company Showcase */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary-600 mb-4">Send Us A Message</h2>
                <p className="text-base md:text-lg text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                {submitStatus === 'success' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-800 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <FiSend size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="font-bold block mb-0.5">Message Sent!</span>
                      <span className="text-sm text-green-700">We&apos;ll respond within 24 hours.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
                        <FiUser size={16} className="text-gold-500" />
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 focus:shadow-lg focus:shadow-gold-100 transition-all bg-gray-50 focus:bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
                        <FiMail size={16} className="text-gold-500" />
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 focus:shadow-lg focus:shadow-gold-100 transition-all bg-gray-50 focus:bg-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
                        <FiPhone size={16} className="text-gold-500" />
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 focus:shadow-lg focus:shadow-gold-100 transition-all bg-gray-50 focus:bg-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
                        <FiMessageCircle size={16} className="text-gold-500" />
                        Subject *
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 focus:shadow-lg focus:shadow-gold-100 transition-all appearance-none cursor-pointer bg-gray-50 focus:bg-white"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d97706'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Question</option>
                          <option value="product">Product Information</option>
                          <option value="return">Returns & Exchanges</option>
                          <option value="wholesale">Wholesale Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
                      <FiSend size={16} className="text-gold-500" />
                      Your Message *
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 focus:shadow-lg focus:shadow-gold-100 transition-all resize-none bg-gray-50 focus:bg-white"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
                        {formData.message.length} characters
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-lg transition-all shadow-lg relative overflow-hidden group ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <FiSend size={20} className="group-hover:rotate-45 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>Send Message</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    We respect your privacy. Your information is secure and will never be shared.
                  </p>
                </form>
              </div>
            </div>

            {/* Company Showcase */}
            <div className="space-y-6">
              {/* Company Image */}
              <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80"
                  alt="TIM'S GLAM Store"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-playfair font-bold text-white mb-2">Visit TIM&apos;S GLAM</h3>
                  <p className="text-white/90">Experience fashion that celebrates you</p>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-primary-600 mb-6">Why Choose TIM&apos;S GLAM?</h3>
                <div className="space-y-5">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-md">
                        <reason.icon size={22} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">{reason.title}</h4>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 md:p-8 rounded-2xl shadow-xl text-white">
                <h3 className="text-xl md:text-2xl font-playfair font-bold mb-3">Connect With Us</h3>
                <p className="text-white/90 mb-6">Follow us on social media for the latest updates, style tips, and exclusive offers!</p>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="#"
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all border border-white/20"
                  >
                    <FiFacebook size={24} />
                    <span className="text-xs font-semibold">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/tims.glam?igsh=MWwxNXhhMGwyYWo0eg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all border border-white/20"
                  >
                    <FiInstagram size={24} />
                    <span className="text-xs font-semibold">Instagram</span>
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all border border-white/20"
                  >
                    <FiTwitter size={24} />
                    <span className="text-xs font-semibold">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary-600 mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-lg text-gray-600">
              Quick answers to common questions. Can&apos;t find what you&apos;re looking for? Contact us!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-r from-primary-50/50 to-gold-50/30 border-2 border-gray-100 hover:border-gold-300 rounded-2xl p-6 md:p-7 transition-all duration-300">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-gold-500 to-gold-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-gray-700 leading-relaxed pl-10">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center bg-gradient-to-br from-primary-600 to-primary-700 p-8 md:p-10 rounded-2xl shadow-xl text-white">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-3">Still Have Questions?</h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Our support team is here to help you find the answers you need.
            </p>
            <Link href="/support-chat" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
              Customer Support Chat
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
