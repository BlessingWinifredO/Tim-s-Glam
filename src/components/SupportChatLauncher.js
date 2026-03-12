'use client'

import Link from 'next/link'
import { FiMessageCircle } from 'react-icons/fi'

export default function SupportChatLauncher() {
  return (
    <Link
      href="/support-chat"
      className="fixed right-4 md:right-6 bottom-20 md:bottom-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 shadow-xl transition-colors"
      aria-label="Open AI support chat"
    >
      <FiMessageCircle size={18} />
      <span className="text-sm font-semibold">Need Help?</span>
    </Link>
  )
}
