'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function AdminSignIn() {
  const router = useRouter()
  const { adminSignIn, loading, error, isAdminAuthenticated } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push('/admin')
    }
  }, [isAdminAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!email || !password) {
      setSubmitError('Please enter both email and password')
      return
    }

    const result = await adminSignIn(email, password)
    if (!result.success) {
      setSubmitError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 rounded-full">
            <span className="text-white font-bold text-2xl">TG</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Sign In</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your admin credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@timsgam.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Default: admin@timsgam.com</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Default: TimsGlam@Admin2026</p>
            </div>

            {/* Error Messages */}
            {(error || submitError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  ⚠️ {error || submitError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <p className="text-sm text-gray-400">Demo Credentials</p>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">📋 Use these credentials to sign in:</p>
            <p className="font-mono text-xs mb-1">Email: <span className="font-bold">admin@timsgam.com</span></p>
            <p className="font-mono text-xs">Password: <span className="font-bold">TimsGlam@Admin2026</span></p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Not an admin?{' '}
              <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
                Go to Store
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-300 text-xs mt-8">
          Admin Panel © 2026 TIM&apos;S GLAM. All rights reserved.
        </p>
      </div>
    </div>
  )
}
