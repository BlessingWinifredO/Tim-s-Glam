'use client'

import Link from 'next/link'
import { FiActivity, FiShield, FiClock } from 'react-icons/fi'

export default function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white/85 backdrop-blur-sm">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiActivity size={13} /> System Online
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              <FiShield size={13} /> Admin Secured
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
              <FiClock size={13} /> Live Dashboard
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
            <Link href="/admin" className="hover:text-slate-800">Dashboard</Link>
            <Link href="/admin/settings" className="hover:text-slate-800">Settings</Link>
            <Link href="/admin/profile" className="hover:text-slate-800">Profile</Link>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <p>&copy; {currentYear} TIM&apos;S GLAM Admin. Internal management interface.</p>
          <p className="uppercase tracking-wider">Build with care • Operate with precision</p>
        </div>
      </div>
    </footer>
  )
}
