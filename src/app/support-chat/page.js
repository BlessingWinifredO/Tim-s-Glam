'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FiSend, FiMessageCircle, FiArrowRight, FiUser, FiClock } from 'react-icons/fi'

const quickPrompts = [
  'How do I find women products?',
  'Where is my order status?',
  'How do I reset my password?',
  'How do I contact support?',
]

function buildReply(message) {
  const text = String(message || '').toLowerCase()

  if (text.includes('women') || text.includes('men') || text.includes('kids') || text.includes('shop')) {
    return {
      text: 'You can browse collections from the Shop page and use filters for Men, Women, Boys, or Girls.',
      links: [
        { label: 'Go to Shop', href: '/shop' },
        { label: 'Women Collection', href: '/shop/women' },
        { label: 'Men Collection', href: '/shop/men' },
      ],
    }
  }

  if (text.includes('order') || text.includes('track') || text.includes('status')) {
    return {
      text: 'To track your order, sign in to your account and open your order history.',
      links: [
        { label: 'Go to Account', href: '/account' },
      ],
    }
  }

  if (text.includes('password') || text.includes('reset') || text.includes('login') || text.includes('sign in')) {
    return {
      text: 'You can reset your password securely from the reset page.',
      links: [
        { label: 'Reset Password', href: '/reset-password' },
        { label: 'Account Sign In', href: '/account' },
      ],
    }
  }

  if (text.includes('contact') || text.includes('support') || text.includes('help')) {
    return {
      text: 'Our support team is available 24/7. You can also send a message from the Contact page.',
      links: [
        { label: 'Contact Page', href: '/contact' },
      ],
    }
  }

  return {
    text: 'I can help you navigate Shop, Account, Orders, Password Reset, and Contact Support. Ask me where you want to go.',
    links: [
      { label: 'Shop', href: '/shop' },
      { label: 'Account', href: '/account' },
      { label: 'Contact Support', href: '/contact' },
    ],
  }
}

export default function SupportChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I am TIM\'S GLAM Support Assistant. I can guide you to the right page quickly. What do you need help with?',
      links: [
        { label: 'Shop Products', href: '/shop' },
        { label: 'Track Orders', href: '/account' },
        { label: 'Contact Team', href: '/contact' },
      ],
    },
  ])

  const canSend = useMemo(() => input.trim().length > 0, [input])

  const sendMessage = (raw) => {
    const message = String(raw || '').trim()
    if (!message) return

    const userMsg = { role: 'user', text: message, links: [] }
    const botMsg = { role: 'assistant', ...buildReply(message) }

    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700">
      <section className="container-custom py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 text-white">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-300/40 text-gold-300 text-xs font-semibold tracking-widest uppercase mb-4">
              <FiMessageCircle size={14} />
              AI Support Chat
            </span>
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-3">Customer Support Assistant</h1>
            <p className="text-white/85 max-w-2xl mx-auto">
              Ask a question and get quick navigation help across TIM&apos;S GLAM.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/15 text-white/90 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 font-semibold">
                <FiClock size={16} />
                Live Guidance
              </div>
              <Link href="/contact" className="text-sm text-gold-300 hover:text-gold-200 inline-flex items-center gap-1">
                Contact Team <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="p-4 md:p-6 space-y-4 max-h-[58vh] overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={`${msg.role}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gold-500 text-white' : 'bg-white text-gray-800'}`}>
                    <div className="flex items-center gap-2 text-xs opacity-70 mb-1">
                      {msg.role === 'user' ? <FiUser size={12} /> : <FiMessageCircle size={12} />}
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                    {msg.links?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.links.map((item) => (
                          <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-5 border-t border-white/15 bg-black/10">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage(input)
                  }}
                  placeholder="Ask for help navigating the platform..."
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/95 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!canSend}
                  className="px-4 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
