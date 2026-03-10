'use client'

import Link from 'next/link'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { FiUser, FiMail, FiShield, FiSettings } from 'react-icons/fi'

export default function AdminProfilePage() {
  const { adminUser } = useAdminAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">View your admin account information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
            {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{adminUser?.name || 'Admin'}</h2>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
              <FiUser className="h-4 w-4" />
              Full Name
            </p>
            <p className="font-medium text-gray-900">{adminUser?.name || 'Admin'}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
              <FiMail className="h-4 w-4" />
              Email
            </p>
            <p className="font-medium text-gray-900">{adminUser?.email || 'Not available'}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-2">
              <FiShield className="h-4 w-4" />
              Role
            </p>
            <p className="font-medium text-gray-900">{adminUser?.role || 'admin'}</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-semibold"
          >
            <FiSettings className="h-4 w-4" />
            Open Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
